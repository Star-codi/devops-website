# 📝 YAML & Config Files

> Module 0.3 — Before You Begin


## What is YAML and Why Does It Matter?

YAML (YAML Ain't Markup Language) is a human-readable format for writing configuration files. If JSON is for machines, YAML is for humans — it's clean, readable, and used everywhere in DevOps.

You'll write YAML for Docker Compose , Kubernetes manifests, GitHub Actions pipelines, Ansible playbooks, and more. Getting comfortable with YAML will save you hours of debugging.


> **📋 Analogy — Form Filling**
> YAML is like filling out a structured form. Instead of checkboxes and dropdown menus, you write key-value pairs with indentation showing which items belong together. The indentation (spaces — never tabs! ) is everything in YAML.


## YAML Basics — Syntax

```config.yaml — yaml syntax examples
# --- KEY: VALUE PAIRS ---
name: my-app
version: "1.0"
port: 8080
debug: true
# --- LISTS (use - for each item) ---
languages:
  - Python
  - Java
  - Go

# --- NESTED (indentation = hierarchy) ---
database:
  host: localhost
port: 5432
name: mydb
credentials:
    user: admin
password: secret123
# --- LIST OF OBJECTS ---
servers:
  - name: web-1
ip: 10.0.0.1
role: frontend
  - name: db-1
ip: 10.0.0.2
role: database
# --- MULTI-LINE STRINGS ---
description: |
  This is a multi-line
  string. The pipe | keeps
  newlines.

# ⚠️  NEVER use TABS. Always use 2-space indentation.
```


## YAML in Action — GitHub Actions Pipeline

Here's a real GitHub Actions CI/CD pipeline written in YAML. Don't worry about understanding every detail — just notice the structure:

```.github/workflows/deploy.yml
name: Deploy My App
# When to run this pipeline
on:
  push:
    branches: [main]

# What to do
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
steps:
      - name: Checkout code
uses: actions/checkout@v3

      - name: Run tests
run: npm test

      - name: Build Docker image
run: docker build -t myapp:latest .

      - name: Push to Docker Hub
run: docker push myusername/myapp:latest
```


## Common YAML Mistakes to Avoid

| ❌ Wrong | ✅ Right | Why |
| --- | --- | --- |
| name:myapp | name: myapp | Space after colon is required |
| Tab indentation | 2-space indentation | YAML doesn't allow tabs |
| port: "8080"when a number is needed | port: 8080 | Numbers shouldn't be quoted |
| Inconsistent indentation | Always consistent 2 spaces | Inconsistency causes parse errors |


> **🚀 Mini Project — Write Your First YAML**
> Create a file called app-config.yaml describing a fictional app: give it a name, version, a list of 3 features, and a nested database section with host, port, and name. Validate it at yamllint.com .
