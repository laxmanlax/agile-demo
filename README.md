# agile-demo

Demo application for deployment to Agile Stacks Kubernetes cluster.

The provided UI inspects pods in its own namespace, including itself.
If pod layout corresponds to [official update-demo images](https://github.com/kubernetes/kubernetes.github.io/tree/master/docs/user-guide/update-demo/images), the picture file found inside the image will be shown on UI.

## Environment variables

* `KUBERNETES_SERVICE_HOST`: used when running in a cluster.
* `KUBERNETES_SERVICE_PORT`: used when running in a cluster.
* `KUBERNETES_PROXY_URL`: full URL to Kubernetes proxy (HTTP). Should be set if no host and port is specified.
* `KUBERNETES_NAMESPACE`: namespace to work with, default is `default`.

## Running Locally

```
npm install
npm run local
```

This starts the app outside Kubernetes and expects Kubernetes API to be available at [http://127.0.0.1:8001](http://127.0.0.1:8001).
