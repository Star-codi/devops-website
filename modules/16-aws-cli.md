# ⌨️ AWS CLI — Command the Cloud

> Module 14 — AWS Deep Dive


## What is the AWS CLI?

The AWS Command Line Interface (CLI) lets you interact with every AWS service by typing commands instead of clicking through the web console. It helps you automate AWS tasks, manage resources, and run operations in scripts — essential for any DevOps workflow.


> **🎮 Analogy**
> The AWS Console is like using a touchscreen menu at a restaurant — intuitive but slow. The AWS CLI is like calling the kitchen directly — faster, scriptable, and you can automate the same order 1000 times with a loop.


## Setup & Configuration

```terminal — aws cli setup
# Install AWS CLI (Ubuntu/Debian)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
aws --version
aws-cli/2.x.x Python/3.x Linux/x86_64
# Configure with your IAM credentials
aws configure
AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name: ap-south-1
Default output format: json
# Test your connection
aws sts get-caller-identity
```


## EC2 Commands

```terminal — ec2 via cli
# List all EC2 instances in region
aws ec2 describe-instances
# Start / Stop / Terminate
aws ec2 start-instances --instance-ids i-1234567890abcdef0
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0
# Launch a new EC2 instance
aws ec2 run-instances \
--image-id ami-0abcdef1234567890 \
--count 1 \
--instance-type t2.micro \
--key-name my-keypair \
--security-group-ids sg-12345678
# List key pairs and security groups
aws ec2 describe-key-pairs
aws ec2 describe-security-groups
```


## S3 Commands

```terminal — s3 via cli
# List all S3 buckets
aws s3 ls
# List contents of a bucket
aws s3 ls s3://my-bucket-name
# Upload a file to S3
aws s3 cp myfile.txt s3://my-bucket-name/myfile.txt
# Download a file from S3
aws s3 cp s3://my-bucket-name/myfile.txt ./myfile.txt
# Sync entire folder to S3 (like rsync)
aws s3 sync ./my-website s3://my-bucket-name
# Delete a file from S3
aws s3 rm s3://my-bucket-name/myfile.txt
# Create and delete buckets
aws s3 mb s3://my-new-bucket
aws s3 rb s3://my-empty-bucket
aws s3 rb s3://my-bucket --force # force-delete with contents
```


## VPC Commands

```terminal — vpc via cli
# Create a VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16
# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24
# Create and attach Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx
# Route table: create → add route → associate with subnet
aws ec2 create-route-table --vpc-id vpc-xxx
aws ec2 create-route --route-table-id rtb-xxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxx
aws ec2 associate-route-table --route-table-id rtb-xxx --subnet-id subnet-xxx
# Create security group with a rule
aws ec2 create-security-group --group-name web-sg --description "Web SG" --vpc-id vpc-xxx
aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 80 --cidr 0.0.0.0/0
# Cleanup (order matters!)
aws ec2 terminate-instances --instance-ids i-xxx
aws ec2 delete-subnet --subnet-id subnet-xxx
aws ec2 detach-internet-gateway --internet-gateway-id igw-xxx --vpc-id vpc-xxx
aws ec2 delete-internet-gateway --internet-gateway-id igw-xxx
aws ec2 delete-route-table --route-table-id rtb-xxx
aws ec2 delete-security-group --group-id sg-xxx
aws ec2 delete-vpc --vpc-id vpc-xxx
```


> **🚀 Mini Project — Full CLI Workflow**
> Without touching the AWS Console: create a VPC + subnet + IGW → launch an EC2 inside it → upload a file to S3 → SSH into the EC2 → download the file from S3 → clean up everything. This is exactly the kind of automation you'd put in a bash script or CI/CD pipeline.
