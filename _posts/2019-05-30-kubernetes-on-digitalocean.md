---
layout: post
title:  "Building a Kubernetes cluster on DigitalOcean to host websites and backend services"
date:   2019-05-30 14:00:00
---

# Introduction
Last year Zeit changed direction on their `now` service, deprecating their excellent Docker support in favour of serverless. I'd been using `now` since their early days, but it was obviously time to move on...

The obvious choice seemed to be a Kubernetes cluster and after a bit of hunting around, I found that DigitalOcean now offer reasonably priced Kubernetes support. Getting the cluster deployed was the easy bit, getting it configured to provide the same platform I was used to with `now` was the hard part...

# How it works
A nginx instance is configured to act as a frontend for all incoming HTTP and HTTPS requests. This is provided by a Kubernetes ClusterRole called `nginx-ingress` which also monitors the cluster waiting for new or changed Ingress resources.

Ingress resources are a standard Kubernetes resource type which define how a web request should be forwarded to a backend service. For example you might specify that requests to "mysite.com" are routed to a "mysite-website" service but anything to "mysite.com/api" should go to a "mysite-webapi" service in a different container.

Typically each website hosted in your cluster will have an Ingress definition, so you might end up with 100s of Ingress resources. Watching over them will be a single instance of nginx-ingress which takes care of ensuring that the routing rules they specify are implemented correctly.

nginx-ingress also takes care of HTTPS termination so your individual websites don't have to worry about HTTPS at all - they just serve everything over HTTP and the nginx-ingress proxy takes care of turning it into HTTPS. A plugin for nginx-ingress called cert-manager can also take care of requesting HTTPS certificates from Let's Encrypt when a new Ingress resource is created and will automatically renew them too.

There are of course many other ways to configure Kubernetes to obtain the same result, but this is quite cost effective as it only requires a single DigitalOcean load balancer no matter how many services I deploy.

Speaking of costs, this cluster can be configured for as little as $30 a month - $10 for each node in the cluster and $10 for a load balancer. That is twice what I was paying for with `now`, but has several upsides:

1. Not limited by the number of instances I can run. With `now` I could only run 10 containers.
1. I can add persistent volumes for in-cluster database support. `now` made me connect to external services which added noticeable latency to my APIs.
1. In control of my own destiny, nobody can decide to drop Docker support on me again, and I can pick up and move my cluster to any Kubernetes service with little disruption.

You could probably save $10 by only having a single node in the cluster too if you don't mind a little downtime.

# Configuring the cluster

## Software to install
1. `nginx-ingress` - This sits in front of all incoming HTTP & HTTPS requests to your cluster and takes care of routing them to the right containers. You can have multiple containers hosting completely unrelated websites and have them all routed by a single installation of nginx-ingress.
1. `cert-manager` - This integrates with nginx-ingress to automatically provision and renew HTTPS certificates.

### Installing nginx-ingress
There are helm packages to help with the installation of nginx-ingress. I had problems getting the 'tiller' portion of helm installed on my cluster and so I opted to use the alpha of Helm 3 which does away with tiller entirely. I downloaded the alpha onto my local PC and then ran the following command to install nginx-ingress:
```sh
helm install nginx-ingress stable/nginx-ingress
```
As part of the installation, a DigitalOcean load balancer is automatically created. The IP address of this load balancer is where the DNS records for all of your websites should point. It might take a minute or two for DigitalOcean to complete the deployment of the load balancer, you can check on progress through the DigitalOcean website or by running:
```sh
kubectl get services nginx-ingress-controller
```
Once this shows that an External-IP has been allocated, your ingress controller is available publically. Check that it is working:
```
curl -http://<endpoint-ip-address>
```
You will get a response from the `nginx-ingress-default-backend` service saying `default backend - 404` which means that the ingress controller couldn't figure out which website to route your request to, which isn't suprising seeing as nothing has been configured yet.

### Installing cert-manager
There are helm packages for cert-manager too, but I couldn't get them to work, maybe because I was using the helm 3 alpha. Instead I followed the instructions on installation using [regular manifests](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html#installing-with-regular-manifests):

```
kubectl create namespace cert-manager
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.8.0/cert-manager.yaml
```

cert-manager must be told how to issue certificates. There are many ways to obtain and issue certificates, I opted to have a single `ClusterIssuer` which will issue certificates for any Kubernetes Ingress resource created on my cluster, regardless of the namespace it is in. This is because I've chosen to separate my websites into different Kubernetes namespaces.

To configure cert-manager we have to create a `ClusterIssuer` resource which tells it how to obtain a certificate from Let's Encrypt and what kind of issuing policy to use.

```yaml
   apiVersion: certmanager.k8s.io/v1alpha1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: user@example.com # <-- CHANGE THIS!
       privateKeySecretRef:
         name: letsencrypt-prod
       http01: {}
```

Save this as `production-issuer.yaml` and then apply it:

```
kubectl apply -n cert-manager -f production-issuer.yaml
```

## Testing
At this point, the cluster should be ready to host websites and automatically provision an HTTPS certificate for them.

To test it, we are going to provision a test website and point a domain name at it. Firstly make sure your domain name is pointing at the External-IP of your nginx-ingress service. Obtain the IP address as follows:

```
kubectl get services nginx-ingress-controller
```

Wait until your DNS changes have propagated before continuing, because certificate provisioning will not work until the Let's Encrypt website can reach our cluster via the domain name we have requested the certificate for.

Now we can create the yaml that defines the website:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: kuard
spec:
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  selector:
    app: kuard
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: kuard
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: kuard
    spec:
      containers:
      - image: gcr.io/kuar-demo/kuard-amd64:1
        imagePullPolicy: Always
        name: kuard
        ports:
        - containerPort: 8080
```

This creates a deployment of `kuard` and a service that exposes it within the cluster. Save this as `kuard.yaml`.

Now we can create the Ingress resource which tells nginx-ingress how to reach the service we just created.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: kuard
  annotations:
    kubernetes.io/ingress.class: "nginx"
    certmanager.k8s.io/cluster-issuer: "letsencrypt-prod"
    certmanager.k8s.io/acme-challenge-type: http01

spec:
  tls:
  - hosts:
    - www.mysite.com        # <-- CHANGE THIS!
    secretName: mysite-tls
  rules:
  - host: www.mysite.com    # <-- CHANGE THIS!
    http:
      paths:
      - path: /
        backend:
          serviceName: kuard
          servicePort: 80
```

This creates an ingress for the website. Make sure to update it to reflect the domain name you are using and save it as `ingress.yaml`.

In order to keep things tidy, we will put this all into a namespace so that we can delete everything easily later.

```
kubectl create namespace kuard
kubectl -n kuard apply -f kuard.yaml -f ingress.yaml
```

Open your browser and check to see if the website is working. Initially you might get an invalid certificate warning because provisioning the certificate sometimes takes a minute or two. You can check on the progress of the provisioning like this:

```
kubectl -n kuard get certificates
```
When the "Ready" column shows as "Yes", then the certificate has been provisioned successfully. If your browser still shows the certificate as invalid, even though `kubectl` shows it as ready, close your browser and re-open it. I had problems with Chrome not updating the warning icons even though the dummy certificate had been replaced with a valid one.

At this point you should have a working instance of `kuard` which you can reach via HTTPS using a Let's Encrypt certificate.

To tidy up:

```
kubectl delete namespace kuard
```

# Conclusion
It is easy and cost-effective to configure a DigitalOcean Kubernetes cluster to host multiple websites and backend services.