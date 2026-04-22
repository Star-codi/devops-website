# 🌐 Networking Basics for DevOps

> Module 0.2 — Before You Begin


## Why Do DevOps Engineers Need to Know Networking?

Every app you deploy runs on servers that communicate over a network. When your app is slow or unreachable, it's often a network issue . Understanding how data travels between machines is essential for debugging, securing, and scaling applications.


> **📮 Analogy — The Postal System**
> Think of the internet like a postal system. Every house (computer) has an address ( IP address ). Letters have a "to" and "from" address. The postal system figures out the best route to deliver it (this is called routing ). The type of delivery service (standard vs express) is like different protocols (HTTP vs HTTPS). And the post office that sorts the mail is like a router .


## Key Networking Concepts

### 🏠 IP Address
A unique address for every device on a network. Like your home address but for computers. Example:192.168.1.10(private) or54.210.1.45(public).

### 🚪 Port
A "door" on a server for a specific service. Port 80 = HTTP websites. Port 443 = HTTPS. Port 22 = SSH login. Port 3306 = MySQL database.

### 📋 DNS
Domain Name System — translates human-readable names likegoogle.cominto IP addresses. It's the internet's phone book.

### 🔒 HTTP vs HTTPS
HTTP sends data in plain text (anyone can read it). HTTPS encrypts it with SSL/TLS — essential for any production site.

### ⚖️ Load Balancer
Distributes traffic across multiple servers so no single server gets overwhelmed. Like a receptionist directing customers to available staff.

### 🔥 Firewall
Controls which traffic is allowed in and out. AWS calls them "Security Groups". You decide: "allow port 80 from everyone, but port 22 only from my IP."


## How a Web Request Works — Step by Step


## Useful Networking Commands

```terminal — networking
# Check your IP address
ip addr show # Linux
ifconfig # older Linux / macOS
# Test if a host is reachable
ping google.com
ping 192.168.1.1
# DNS lookup — what IP does this domain map to?
nslookup github.com
dig github.com
# Check if a port is open on a server
telnet 192.168.1.10 80
nc -zv 192.168.1.10 443
# Trace the route packets take
traceroute google.com
# See what's listening on which ports
netstat -tulpn
ss -tulpn # modern alternative
# Download a file / test an HTTP endpoint
curl http://localhost:8080/health
wget https://example.com/file.zip
```


> **✅ Remember These Port Numbers**
> 22 = SSH (terminal access to servers) · 80 = HTTP · 443 = HTTPS · 3306 = MySQL · 5432 = PostgreSQL · 6379 = Redis · 8080 = common dev server port · 9090 = Prometheus · 3000 = Grafana
