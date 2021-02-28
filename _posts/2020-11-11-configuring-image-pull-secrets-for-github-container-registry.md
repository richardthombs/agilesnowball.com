---
layout: post
title:  "Configuring image pull secrets for GitHub Container Registry / GitHub Packages Docker Registry"
date:   2020-11-11 09:36:00
---

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
