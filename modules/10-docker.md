# 🐳 Docker — Containerization

> Module 08 — Containers


## The "Works on My Machine" Problem

Developer A writes an app on Windows with Python 3.9. Developer B pulls the code on Mac with Python 3.11. The production server runs Linux with Python 3.7. Everyone is confused when things break at each step. This is one of the most frustrating problems in software engineering.


> **🚢 Analogy — Shipping Containers**
> Before shipping containers, loading cargo onto ships was chaotic. Different sizes, different methods, things breaking. Then someone invented the standard shipping container — one size, works on any ship, any truck, any train, any port in the world. Docker containers are the shipping containers of software. You pack your app, its dependencies, its runtime — everything — into a single container. It runs identically on your laptop, your colleague's laptop, Jenkins, and production. No surprises.


## VM vs Container — What's the Difference?


## Core Docker Concepts

### 📄 Dockerfile
A recipe/blueprint that describes how to build your container image.

### 💿 Image
A snapshot built from a Dockerfile. Like a frozen template you can deploy anywhere.

### 📦 Container
A running instance of an image. Like a live restaurant vs a recipe book.

### 🗄️ Registry
Docker Hub — a store of images. Pull official images or push your own.


## Dockerize a Node.js App

```dockerfile
# Start from an official Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run when container starts
CMD ["node", "app.js"]
```

```terminal — build & run
# Build the image
docker build -t my-node-app:1.0 .
Successfully built a1b2c3d4e5f6
Successfully tagged my-node-app:1.0
# Run the container
docker run -d -p 3000:3000 --name my-app my-node-app:1.0
# Check running containers
docker ps
CONTAINER ID  IMAGE          STATUS    PORTS
a1b2c3d4e5f6  my-node-app:1  Up 2min   0.0.0.0:3000->3000
# View logs
docker logs my-app
# Stop and remove
docker stop my-app && docker rm my-app
# Push to Docker Hub
docker tag my-node-app:1.0 arjun/my-node-app:1.0
docker push arjun/my-node-app:1.0
```


## Docker Compose — Multi-Container Apps

Real apps have multiple pieces: a web server, a database, maybe a cache. Docker Compose lets you define and run them all together.

```docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
    environment:
      - DB_HOST=db

  db:
    image: postgres:15
environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

```bash
docker compose up -d # start everything
docker compose down # stop everything
```


## Why Kubernetes After Docker?

> **⚠️ Problem Docker Reveals at Scale**
> Docker is great for running containers. But what happens when your app needs 100 containers running across 10 servers ? Who decides which server runs which container? What if a container crashes — who restarts it? What if traffic spikes — who adds more containers? Docker alone can't answer these questions. You need an orchestrator . That's Kubernetes.


> **🚀 Mini Project — Dockerize a Python Flask App**
> Write a simple Flask web app → Create a Dockerfile → Build the image → Run it locally → Push to Docker Hub → Pull it on your EC2 and run it there. Your app is now portable!


> **✅ Module Summary**
> Docker packages apps into portable containers that run anywhere Dockerfile = recipe, Image = packaged product, Container = running instance Containers are lighter and faster than virtual machines Docker Compose manages multi-container applications Docker Hub is the public registry for sharing images
