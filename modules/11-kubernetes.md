# ☸️ Kubernetes

> Module 09 — Orchestration


## What is Kubernetes?

Kubernetes (K8s) is an open-source system that automatically manages containerized applications at scale. It handles starting, stopping, distributing, scaling, and healing containers — so you don't have to do it manually.


> **🍽️ Analogy — Restaurant Manager**
> You have 50 waiters (containers) serving 500 customers across 5 floors (servers). The restaurant manager (Kubernetes) : decides which floor each waiter goes to, replaces waiters who go sick automatically, adds more waiters when the restaurant gets busy, ensures every customer gets served. You just tell the manager "I want 50 waiters" — the rest is handled automatically.


## Kubernetes Architecture


## Key Kubernetes Objects

### 📦 Pod
Smallest deployable unit. Wraps one or more containers. Has its own IP address.

### 🔄 Deployment
Manages Pods — ensures X replicas always run. Handles rolling updates.

### 🌐 Service
Stable network endpoint for Pods. Load balances traffic across all replicas.

### ⚙️ ConfigMap
Store configuration (env variables) separately from your container image.


## Deploy an App on Kubernetes

```deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-node-app
spec:
  replicas: 3        # run 3 copies at all times
selector:
    matchLabels:
      app: my-node-app
  template:
    metadata:
      labels:
        app: my-node-app
    spec:
      containers:
      - name: my-node-app
        image: arjun/my-node-app:1.0
ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: my-node-app-svc
spec:
  type: LoadBalancer
  selector:
    app: my-node-app
  ports:
  - port: 80
    targetPort: 3000
```

```terminal — kubectl commands
# Deploy the app
kubectl apply -f deployment.yaml
deployment.apps/my-node-app created
service/my-node-app-svc created
# Check pods are running
kubectl get pods
NAME                          READY   STATUS    RESTARTS
my-node-app-7d6b8c-abc12      1/1     Running   0
my-node-app-7d6b8c-def34      1/1     Running   0
my-node-app-7d6b8c-ghi56      1/1     Running   0
# Scale up to 10 replicas
kubectl scale deployment my-node-app --replicas=10
# Rolling update (zero downtime)
kubectl set image deployment/my-node-app my-node-app=arjun/my-node-app:2.0
# If something goes wrong, roll back instantly
kubectl rollout undo deployment/my-node-app
```


## Self-Healing — Kubernetes' Superpower

> **🔄 Watch This Happen**
> You told Kubernetes: "I want 3 replicas." If one Pod crashes at 3am, Kubernetes automatically starts a new one — within seconds — without anyone waking up. This is called self-healing and it's what makes Kubernetes so powerful for production systems.


> **🚀 Mini Project — Deploy a Full App on K8s**
> Use Minikube (local K8s) → Deploy your Dockerized Node.js app → Expose it via a Service → Scale it to 5 replicas → Simulate a pod crash and watch K8s heal itself.


> **✅ Module Summary**
> Kubernetes orchestrates containers across multiple servers Pods = containers, Deployments = desired state, Services = networking Self-healing: K8s restarts crashed containers automatically Auto-scaling: handles traffic spikes by adding/removing pods Rolling updates: deploy new versions with zero downtime
