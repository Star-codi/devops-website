# 📊 Prometheus & Grafana

> Module 11 — Monitoring


## Why Monitoring? The Final Piece

You've built your app, containerized it, deployed it on Kubernetes, automated your pipeline with Jenkins, and provisioned infrastructure with Terraform. But your work isn't done — you need to watch what's happening in production.

Without monitoring: servers could be running at 99% CPU right now and you wouldn't know until users complain. Memory could be slowly leaking. A database could be about to run out of space. Monitoring catches these before they become disasters.


> **✈️ Analogy — Airplane Cockpit**
> A pilot doesn't fly blind. The cockpit has hundreds of gauges showing altitude, speed, fuel, engine temperature, wind direction. If anything goes wrong, an alarm sounds immediately. Prometheus is the system collecting all those gauge readings. Grafana is the cockpit dashboard displaying them beautifully.


## Prometheus — Metrics Collector

Prometheus is an open-source monitoring system. It "scrapes" (collects) metrics from your applications and servers every few seconds and stores them in a time-series database.

```prometheus.yml — configuration
global:
  scrape_interval: 15s    # collect metrics every 15 seconds
scrape_configs:
  - job_name: 'my-node-app'
static_configs:
      - targets: ['localhost:3000']

  - job_name: 'kubernetes-nodes'
kubernetes_sd_configs:
      - role: node
```


## PromQL — Querying Your Metrics

Prometheus has its own query language called PromQL . It looks complex but starts simply:

```promql — example queries
# CPU usage % (human-readable)
100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
# Available memory in GB
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024
# HTTP requests per second
rate(http_requests_total[5m])
# Alert: disk almost full
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.85
# p99 response time
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```


## Grafana — Beautiful Dashboards

Grafana connects to Prometheus and turns raw metrics into stunning, real-time visual dashboards. You can build dashboards with graphs, gauges, heatmaps, and tables — and share them with your whole team.

### 📈 Time Series Graphs
See how CPU, memory, and request rates change over time.

### 🔴 Alerts
Get Slack/email notifications when CPU > 80% or error rate spikes.

### 🗂️ Pre-built Dashboards
Import ready-made dashboards for Kubernetes, Node.js, and more from grafana.com.

### 👥 Team Sharing
Share dashboards with your entire team. Everyone has visibility.


## Deploy the Full Stack with Docker Compose

```docker-compose.monitoring.yml
version: '3.8'
services:

  prometheus:
    image: prom/prometheus:latest
ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
ports: ["3000:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on: [prometheus]

  node-exporter:
    image: prom/node-exporter:latest
ports: ["9100:9100"]

  alertmanager:
    image: prom/alertmanager:latest
ports: ["9093:9093"]

volumes:
  grafana-data:
```

```bash
docker compose -f docker-compose.monitoring.yml up -d
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
# Import dashboard ID 1860 from grafana.com for Node Exporter Full 🎉
```


> **🚀 Final Mini Project — Full Monitoring Stack**
> Deploy Prometheus + Grafana + Node Exporter on your EC2 server → Import the "Node Exporter Full" dashboard from Grafana.com → Set up an alert that fires on Slack when CPU usage exceeds 70% for 5 minutes.


## 🎓 You've Completed the DevOps Journey!

> **✅ Core DevOps Stack — Modules 01–11 Complete!**
> ☁️ Cloud Computing + AWS — On-demand infrastructure, EC2, S3, IAM, VPC 🐧 Linux — Architecture, command line, permissions, user management 🌿 Git & GitHub — DVCS, branching strategy, collaboration ⚡ Shell Scripting — Automation, functions, I/O redirection 🔨 Maven — Build, test, and package Java applications 🤖 Jenkins — CI/CD pipelines, automated testing and deployment 🐳 Docker — Containerization, Dockerfiles, Docker Compose ☸️ Kubernetes — Orchestration, scaling, self-healing, rolling updates 🏗️ Terraform — Infrastructure as Code, reproducible environments 📊 Prometheus & Grafana — Metrics, dashboards, alerting Continue to Module 5 — AWS Deep Dive to master VPC, S3 storage classes, AWS CLI, Lambda, RDS & DynamoDB →
