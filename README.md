# 🚀 DevOps Buddy — Zero to Hero

A free, structured DevOps learning platform covering the full engineering stack — from Linux fundamentals to GitOps, container security, and cloud-native deployments on AWS.

🌐 **Live site:** [devopsbuddy.in](https://devopsbuddy.in)

---

## 📚 Curriculum

| # | Module | Topics |
|---|--------|--------|
| 0.1 | DevOps Lifecycle | Culture, practices, toolchain overview |
| 0.2 | Networking Basics | TCP/IP, DNS, HTTP, ports, subnets |
| 0.3 | YAML & Config Files | Syntax, anchors, multi-doc, Kubernetes YAML |
| 01 | Linux Basics | File system, permissions, processes, package managers |
| 02 | Shell Scripting | Bash scripts, variables, loops, cron jobs |
| 03 | Git & GitHub | Branching, merging, PRs, workflows |
| 04 | Maven | Build lifecycle, POM, dependencies, plugins |
| 05 | Why Cloud Computing | Cloud models, regions, AZs, cost model |
| 06 | AWS Fundamentals | EC2, S3, IAM, VPC, RDS, Lambda basics |
| 07 | AWS Deep Dive | ECS, EKS, CloudWatch, CloudFormation, Cost Explorer |
| 08 | Docker | Images, containers, volumes, Compose, registry |
| 09 | Kubernetes | Pods, Deployments, Services, Ingress, RBAC |
| 10 | Amazon EKS | Managed K8s, node groups, IRSA, ALB controller |
| 11 | Helm | Charts, releases, values, templating, Artifact Hub |
| 12 | Jenkins | Pipelines, Jenkinsfile, plugins, agents |
| 13 | GitHub Actions | Workflows, triggers, runners, reusable actions |
| 14 | ArgoCD | GitOps, sync policies, App of Apps, rollbacks |
| 15 | Terraform | HCL, providers, state, modules, workspaces |
| 16 | Ansible | Playbooks, inventory, roles, idempotency |
| 17 | VPC & Networking | Subnets, route tables, security groups, peering |
| 18 | Nginx | Reverse proxy, load balancing, SSL termination |
| 19 | ELK Stack | Elasticsearch, Logstash, Kibana, log pipelines |
| 20 | Prometheus & Grafana | Metrics, alerting, dashboards, exporters |
| 21 | SonarQube | Static analysis, quality gates, SAST in CI/CD |
| 22 | OWASP & ZAP | Top 10, ZAP scanning, DAST in CI/CD pipelines |
| 23 | DevSecOps Basics | Shift-left security, secrets management, CVE scanning |
| 24 | Interview Prep | Common questions, system design, resume tips |
| 25 | What's Next | Certifications, career paths, project ideas |

---

## 🗂️ Repository Structure

```
devops-website/
├── index.html          # Main shell — sidebar nav, hero section
├── main.js             # Module loader, routing, progress tracking
├── style.css           # Global styles (cyberpunk theme)
├── modules/            # One HTML file per module
│   ├── home.html
│   ├── linux.html
│   ├── docker.html
│   ├── kubernetes.html
│   ├── eks.html
│   ├── argocd.html
│   ├── sonarqube.html
│   ├── owasp.html
│   └── ...
├── 404.html            # Custom 404 page
├── MODULE_TEMPLATE.md  # Template for contributing new modules
└── CONTRIBUTING.md     # Contribution guidelines
```

---

## 🛠️ Tech Stack

- **Vanilla HTML / CSS / JavaScript** — no framework, no build step
- **GitHub Pages** — zero-cost static hosting
- **JetBrains Mono + Orbitron** — cyberpunk typography
- Single-page app with hash-based routing (`#module-id`)

---

## 🤝 Contributing

Contributions are welcome — fixing typos, improving explanations, or adding a new module all help the community.

👉 Read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting anything.

**Quick steps:**
1. Open an Issue to propose your change
2. Wait for approval
3. Fork the repo and make your changes following [MODULE_TEMPLATE.md](./MODULE_TEMPLATE.md)
4. Submit a Pull Request against `main`

> **Note:** The `main` branch is protected. All changes go through a reviewed Pull Request — no direct pushes.

---

## 📄 License

MIT License — free to use, share, and learn from.

---

*Built with ❤️ by [Arjun](https://github.com/Star-codi)*
