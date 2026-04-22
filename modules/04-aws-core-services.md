# 🔶 AWS Core Services

> Module 02 — Foundation


## What is AWS?

Amazon Web Services (AWS) is the world's most popular cloud platform, used by Netflix, Airbnb, NASA, and millions of companies. AWS has 200+ services, but as a DevOps beginner, you only need to master the core 6.


## Core Service #1 — EC2 (Virtual Servers)

> **💻 Analogy — Renting a Laptop**
> EC2 (Elastic Compute Cloud) is like renting a computer in Amazon's data center. You choose the size (1 CPU or 64 CPUs), the operating system (Linux or Windows), and you pay by the hour. It's just a computer you control via the internet.

```aws cli — launch ec2 instance
# Launch a free-tier EC2 instance (Amazon Linux 2)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name MyKeyPair

# SSH into your new server
ssh -i "MyKeyPair.pem" ec2-user@your-public-ip
# You're now inside a cloud server! 🎉
```


## Core Service #2 — S3 (Object Storage)

> **📦 Analogy — Google Drive for Your App**
> S3 (Simple Storage Service) is like Google Drive but for developers. Store images, videos, backups, website files — anything. Files are stored in "buckets" and accessed via URLs. You can even host a full website from S3!

```aws cli — s3 operations
# Create a bucket
aws s3 mb s3://my-awesome-website
# Upload a file
aws s3 cp index.html s3://my-awesome-website/
# Enable static website hosting
aws s3 website s3://my-awesome-website --index-document index.html
# Your site is now live at:
# http://my-awesome-website.s3-website-us-east-1.amazonaws.com
```


## Core Service #3 — IAM (Access Control)

> **🔑 Analogy — Office ID Cards**
> IAM (Identity and Access Management) is like an office building with different access cards. The security guard can enter the lobby. The developer can enter the server room. The manager can access everything. IAM lets you control WHO can do WHAT in your AWS account.

```iam policy — allow s3 read only
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": "arn:aws:s3:::my-bucket/*"
  }]
}
```


## Core Service #4 — VPC (Your Private Network)

> **🏘️ Analogy — Gated Community**
> VPC (Virtual Private Cloud) is like a gated community for your servers. You define the roads (subnets), the gates (security groups), and who can come in or go out. Your database lives in the private area (no internet access), while your web server lives in a public area (accessible to users).


## Other Key Services

### 🗄️ RDS
Managed relational databases (MySQL, PostgreSQL). No server management needed.

### λ Lambda
Run code without any server. Pay only when your code actually runs.

### 👀 CloudWatch
Monitor your AWS resources. Get alerts when something goes wrong.

### ⚖️ ELB
Load Balancer — distributes traffic across multiple servers.


> **🚀 Mini Project — Deploy a Static Website**
> Goal: Host your personal portfolio site on S3 with HTTPS via CloudFront. 1 Create an S3 bucket with a unique name 2 Upload your HTML/CSS files 3 Enable "Static Website Hosting" in bucket settings 4 Set bucket policy to allow public read 5 Your site is live! Share the URL 🎉


> **✅ Module Summary**
> EC2 = Virtual servers you rent in the cloud S3 = Unlimited file/object storage with web hosting capability IAM = Control who can access what in your account VPC = Your private, isolated network in the cloud RDS, Lambda, CloudWatch = Managed database, serverless compute, monitoring
