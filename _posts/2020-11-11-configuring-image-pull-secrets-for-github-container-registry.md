---
layout: post
title:  "Configuring image pull secrets for GitHub Container Registry / GitHub Packages Docker Registry"
date:   2020-11-11 09:36:00
categories: kubernetes docker github
---

## Step 1 - Generate a GitHub Personal Access Token
https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token

> Make sure you give it "read:packages" permission and remove all other permissions

## Step 2 - Create a Kubernetes secret
https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line  

```
kubectl create secret docker-registry <SECRET NAME> \
	-n <NAMESPACE>
	--docker-server=docker.pkg.github.com \
	--docker-username=<GITHUB USERNAME> \
	--docker-password=<GITHUB TOKEN>
	--docker-email=<GITHUB EMAIL>
```

## Step 3 - Add "ImagePullSecret" to your pod specification

```
    spec:
      containers:
      - name: <CONTAINER NAME>
        image: docker.pkg.github.com/<CONTAINER PATH>
      imagePullSecrets:
        - name: <SECRET NAME>
```



545b27971b8be96e950b41ff999469d14497b661