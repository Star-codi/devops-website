# 🏗️ Terraform

> Module 10 — Infrastructure as Code


## The Problem: ClickOps

Imagine you manually click through the AWS console to create 5 EC2 instances, 3 S3 buckets, 2 VPCs, security groups, and IAM roles. Three months later, you need to recreate this entire setup for a new client. Or worse — something breaks and you have no idea what the original settings were.

Manual infrastructure = inconsistent, undocumented, irreproducible. This is called "ClickOps" — and it's a DevOps anti-pattern.


> **🏠 Analogy — Architectural Blueprint**
> When a builder constructs a house, they work from a blueprint . The blueprint describes exactly every room, door, pipe, and wire. You can build the same house in Mumbai or Delhi from the same blueprint. Terraform is the blueprint for your cloud infrastructure — write it once, deploy anywhere, recreate identically anytime.


## How Terraform Works


## Create an EC2 Instance with Terraform

```main.tf — terraform configuration
# Tell Terraform which cloud provider to use
provider "aws" {
  region = "ap-south-1" # Mumbai region
}

# Create a VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "my-vpc" }
}

# Create an EC2 instance
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  key_name      = "my-key"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}

# Output the public IP address
output "server_ip" {
  value = aws_instance.web_server.public_ip
}
```

```terminal — terraform commands
# Download the AWS provider plugin
terraform init
Terraform has been successfully initialized!
# Preview what will be created (no changes yet)
terraform plan
Plan: 2 to add, 0 to change, 0 to destroy.
  + aws_vpc.main
  + aws_instance.web_server
# Actually create the infrastructure
terraform apply
Apply complete! Resources: 2 added.
server_ip = "13.233.45.67"
# Destroy everything when no longer needed
terraform destroy
Destroy complete! Resources: 2 destroyed.
```


## Key Benefits of Terraform

### 📋 Documented
Your infrastructure is described in code. New team members can read exactly what was built.

### ♻️ Reproducible
Recreate identical environments (dev, staging, prod) from the same code.

### 🔄 Version Controlled
Store Terraform files in Git. See who changed what and when.

### 🌍 Multi-Cloud
Same tool works for AWS, Azure, GCP, and 1000+ other providers.


> **🚀 Mini Project — Infrastructure Setup with Terraform**
> Write Terraform code to create: 1 VPC, 2 subnets (public + private), 1 EC2 web server in public subnet, 1 RDS database in private subnet, security groups with proper rules. Then destroy it all with one command.


> **✅ Module Summary**
> Terraform manages cloud infrastructure as code — no manual clicking Write .tf files → terraform plan (preview) → terraform apply (create) Infrastructure is version-controlled, documented, and reproducible Works with AWS, Azure, GCP, and 1000+ providers terraform destroy removes everything cleanly
