---
layout: post
title:  "Configuring Kubernetes with an image pull secret for GitHub Container Registry"
description: "In order to pull from a secure container registry, it is necessary to configure Kubernetes with an image pull secret."
date:   2020-11-11 09:36:00
---

If you've got your containers hosted in the GitHub Container Registry or the GitHub
Packages Docker Registry, then you'll need to configure Kubernetes with an "image pull
secret" in order to authorise your cluster to access the registry.

> If your GitHub repo is public then this isn't necessary for images in the GitHub
> Container Registry, but it is necessary if your images are in the GitHub Packages Docker
> Registry.

You can easily tell which registry you are using from the URL you've posted the images to:

`docker.pkg.github.com` is the GitHub Packages Docker Registry and `ghcr.io` is the GitHub Container Registry.

## 1. Generate a GitHub Personal Access Token

Read the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) on how to create a personal access token.

> Make sure you give it "read:packages" permission and remove all other permissions

## 2. Create a Kubernetes secret
[Kubernetes docs](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line)  

```powershell
kubectl create secret docker-registry <SECRET NAME>
  -n <NAMESPACE>
  --docker-server=docker.pkg.github.com
  --docker-username=<GITHUB USERNAME>
  --docker-password=<GITHUB TOKEN>
  --docker-email=<GITHUB EMAIL>
```

## 3. Add "ImagePullSecret" to your pod specification

```yaml
spec:
  containers:
  - name: <CONTAINER NAME>
    image: docker.pkg.github.com/<CONTAINER PATH>
  imagePullSecrets:
    - name: <SECRET NAME>
```
