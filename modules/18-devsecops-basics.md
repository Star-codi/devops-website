# 🔐 DevSecOps Basics

> Module 12 — Security & Next Steps


## What is DevSecOps?

DevSecOps = Development + Security + Operations. It's the practice of baking security into every stage of the DevOps pipeline — not bolting it on at the end as an afterthought.

The old approach: developers build the app, security team scans it at the end, finds 500 vulnerabilities, everyone panics. The DevSecOps approach: security checks run automatically at every commit, every build, every deployment. Problems are caught when they're cheap to fix — not after you're in production.


> **🏗️ Analogy — Building Safety**
> Imagine building a skyscraper and only checking if it's structurally sound after it's finished. That would be insane — you'd build safety into every floor as you go. DevSecOps does the same for software: safety at every layer, from the start.


## Security at Every Stage


## Essential Security Practices

### 🔑 Never Hardcode Secrets
Never put passwords, API keys, or tokens directly in your code or YAML files. Use environment variables or secret managers (AWS Secrets Manager, Vault).

### 🏷️ Least Privilege (IAM)
Give every user, service, and app only the permissions theyneed— nothing more. A compromised app with minimal permissions does minimal damage.

### 🔍 Scan Dependencies
Your code uses 100s of open-source libraries. Tools likeSnykorTrivycheck them for known vulnerabilities automatically on every build.

### 🔐 HTTPS Everywhere
All traffic to and from your app must be encrypted. Use SSL/TLS certificates. Let's Encrypt provides free certificates. Never serve production over plain HTTP.

### 📋 Audit Logs
Keep logs of who did what and when. AWS CloudTrail records every API call. You need this for compliance, debugging, and catching attackers.

### 🛡️ Network Segmentation
Don't put your database on the public internet. Use private subnets (VPC). Only your app servers should be able to reach the database — nothing else.


## Secrets Management — The Right Way

```bad vs good — secrets handling
# ❌ NEVER DO THIS — hardcoded secrets in code
DB_PASSWORD="mypassword123" # visible to everyone with repo access!
API_KEY="sk-abc123xyz" # gets committed to Git history forever
# ✅ Use environment variables
export DB_PASSWORD="$(cat /run/secrets/db_pass)"
# ✅ In Docker Compose — use env files
env_file:
  - .env                     # .env is in .gitignore — never committed
# ✅ In Kubernetes — use Secrets
kubectl create secret generic db-secret \
  --from-literal=password=mypassword
# ✅ In AWS — use Secrets Manager
aws secretsmanager get-secret-value --secret-id prod/db/password
```


> **⚠️ Real-World Warning**
> Every week, developers accidentally commit API keys to public GitHub repos. Attackers have bots that scan GitHub 24/7 for leaked credentials. A leaked AWS key can result in a ₹10 lakh bill within hours from crypto miners. Always add .env to your .gitignore !
