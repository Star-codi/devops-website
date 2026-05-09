# 🔒 VPC & Networking in AWS

> Module 12 — AWS Deep Dive


## What is a VPC?

A Virtual Private Cloud (VPC) in AWS is a logically isolated virtual network in the cloud where you can run your own resources securely. It gives you complete control over your networking environment — similar to having your own private data centre, but hosted on AWS infrastructure.

VPC ensures isolation from other users. You control how resources communicate internally and externally.


> **🏘️ Analogy — Gated Housing Society**
> Think of a VPC like a gated housing society. The entire society is your VPC. Inside, there are different blocks (subnets) — some blocks face the main road and are accessible to visitors (public subnet), while other blocks are deep inside the society and only residents can access them (private subnet). The main gate is your Internet Gateway, and the security guards are your Security Groups and NACLs.


## VPC Architecture


## Key VPC Components Explained

### 🔲 Subnet
A segment of VPC IP address ranges where you place resources like EC2 and RDS. Each subnet lives in one Availability Zone. Public subnets face the internet; private subnets don't.

### 📋 Route Table
A set of rules that decide where network traffic goes. Each subnet must have a route table. To reach the internet, add a route:0.0.0.0/0 → IGW.

### 🚪 Internet Gateway (IGW)
The bridge between your VPC and the internet. Attach it to your VPC and reference it in the route table to enable inbound + outbound traffic for public subnets.

### 🔄 NAT Gateway
Allows private subnet resources to reach the internet (e.g. to download packages) WITHOUT exposing them. Outbound only — internet can't initiate connections back in.

### 🛡️ Security Group
Acts as a virtual firewall at theinstance level. Stateful — allow traffic in, and the response is automatically allowed out. ALLOW rules only.

### 🔐 NACL (Network ACL)
Firewall at thesubnet level. Stateless — you must explicitly allow both inbound AND outbound. Supports both ALLOW and DENY rules. Evaluated by rule number (lowest first).


## Security Group vs NACL — Side by Side

| Feature | 🛡️ Security Group | 🔐 NACL |
| --- | --- | --- |
| Applied at | Instance level | Subnet level |
| State | Stateful — auto-allow responses | Stateless — must define both directions |
| Rules | ALLOW only | ALLOW and DENY |
| Rule evaluation | All rules evaluated together | Rules evaluated by number (lowest first) |
| Default | Deny all inbound, allow all outbound | Allow all inbound and outbound |
| Use case | Control access to individual EC2s | Block IPs at subnet boundary |


## IP Addressing in AWS

### 🔢 IPv4 Address Classes

Class A: 0.0.0.0 – 126.x.x.x (large networks) Class B: 128.0.0.0 – 191.x.x.x (medium) Class C: 192.0.0.0 – 223.x.x.x (small) Class D: 224–239.x.x.x (multicast) Class E: 240–255.x.x.x (experimental)

### 📐 CIDR Notation

CIDR (Classless Inter-Domain Routing) defines a network using IP + prefix. 10.0.0.0/16 = 65,536 IPs 10.0.1.0/24 = 256 IPs 10.0.1.0/28 = 16 IPs Formula: 2^(32 - prefix) = total IPs

### 🔒 Private IP Ranges

These ranges are for private/internal use only — not routable on the public internet: 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16 AWS uses these for your VPC.

### ⚡ Elastic IP (Static Public IP)

By default, EC2 public IPs change every restart. An Elastic IP is a static public IP you reserve — it stays the same even after stop/start. Charged if not attached to a running instance.


## Hybrid Cloud: VPN vs Direct Connect

| Feature | 🔒 AWS VPN | ⚡ AWS Direct Connect |
| --- | --- | --- |
| Connection | Over public internet (encrypted) | Private dedicated line |
| Speed | Variable (depends on internet) | Consistent, high speed |
| Latency | Higher | Lower |
| Cost | Lower | Higher (physical line) |
| Setup time | Minutes | Weeks |
| Best for | Small/dev workloads, quick setup | Production, high throughput, compliance |


> **🚀 Mini Project — Build a 2-Tier VPC**
> Create a VPC with CIDR 10.0.0.0/16 → Add a public subnet 10.0.1.0/24 and private subnet 10.0.2.0/24 → Attach an Internet Gateway → Create a route table for the public subnet → Launch an EC2 in the public subnet → Launch an RDS in the private subnet → Verify the EC2 can reach the internet but the RDS cannot be accessed directly from outside.
