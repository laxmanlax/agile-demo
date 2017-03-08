# k8s-demo-app

Demo application for deployment to Agile Stacks Kubernetes cluster.

The app UI introspects pods in its own namespace, including itself.

## Running Locally

```
npm install
npm start
```

This starts the app outside Kubernetes and expects Kubernetes API to be available at [http://127.0.0.1:8001](http://127.0.0.1:8001).
