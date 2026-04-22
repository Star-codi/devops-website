# 🎯 Interview Prep — DevOps & Cloud

> Module 17 — Career Prep


## How to Approach DevOps Interviews

DevOps interviews test three things: conceptual understanding (can you explain it simply?), practical knowledge (have you actually done it?), and problem-solving (can you debug a broken pipeline?). Always answer with real examples — even if they're from personal projects.


## 🔶 AWS Interview Questions

> **Q: What is the difference between EC2 and Lambda?**
> EC2 is a virtual machine that you provision and manage — you pay per hour whether the server is doing work or sitting idle. Lambda is serverless — you write a function, AWS runs it when triggered, and you pay only for the milliseconds it actually runs. Use EC2 for long-running workloads, Lambda for event-driven short-lived tasks.

> **Q: What is the difference between Security Group and NACL?**
> Security Groups are stateful firewalls at the instance level — allow inbound, and the return traffic is automatically allowed. They support ALLOW rules only. NACLs are stateless firewalls at the subnet level — you must explicitly define both inbound and outbound rules. They support both ALLOW and DENY. Use Security Groups for instance-level control and NACLs for blocking specific IPs at the subnet boundary.

> **Q: What is the difference between Public and Private Subnet?**
> A public subnet has a route to the Internet Gateway, so resources inside can be accessed from the internet (and can access it). A private subnet has no direct route to the internet — resources inside are not directly reachable from outside. Private resources use a NAT Gateway if they need to make outbound internet calls (e.g. to download packages).

> **Q: What is IAM and why is it important?**
> IAM (Identity Access Management) controls who can do what in your AWS account. It's the foundation of AWS security. You create users (individuals), groups (collections of users), roles (temporary identities for services to assume), and policies (JSON documents defining permissions). The golden rule is Principle of Least Privilege — give only the minimum permissions needed.

> **Q: What is S3 and what are its storage classes?**
> S3 is object storage for any type of data. Key classes: Standard (frequent access, highest cost), Standard-IA (infrequent access, lower cost but retrieval fee), Glacier (archival, very low cost, retrieval takes time), and Intelligent-Tiering (auto-moves data between tiers based on access patterns — good when you don't know your access patterns). All classes offer 11 nines (99.999999999%) durability.


## 🐧 Linux Interview Questions

> **Q: What is the difference between a process and a daemon?**
> A process is any running program — it has a PID, uses CPU and memory, and exits when done. A daemon is a background process that runs continuously without user interaction, usually started at boot. Examples: nginx (web server daemon), sshd (SSH daemon). Daemons typically end in 'd' by convention.

> **Q: What does chmod 755 mean?**
> chmod 755 script.sh sets permissions using the octal system: 7 (owner) = read+write+execute (4+2+1), 5 (group) = read+execute (4+1), 5 (others) = read+execute. So the owner can do everything, group and others can read and run but not modify. Always use 755 for scripts you want to be executable.

> **Q: What is the difference between > and >> in shell?**
> > redirects output and overwrites the file — use it carefully, it deletes the existing content. >> redirects output and appends to the file, preserving existing content. Example: echo "line1" > file.txt creates/overwrites; echo "line2" >> file.txt adds to the file.


## 🌿 Git Interview Questions

> **Q: What is the difference between git merge and git rebase?**
> git merge creates a new "merge commit" that combines two branches — it preserves the full history of both branches. git rebase rewrites the history by replaying your commits on top of another branch — it creates a cleaner, linear history but rewrites commit hashes. Rule: use merge for public/shared branches, rebase for local cleanup before pushing.

> **Q: What is git stash?**
> git stash temporarily saves your uncommitted changes (both staged and unstaged) so you can switch branches or work on something else without committing half-done work. Run git stash pop to restore your saved changes later. Think of it as a clipboard for your work-in-progress.

> **Q: What is the difference between git fetch and git pull?**
> git fetch downloads changes from the remote repository but does NOT merge them into your local branch — it just updates your local copy of the remote branches. git pull = git fetch + git merge — it downloads AND merges. Use fetch when you want to see what changed before merging.


## 🐳 Docker Interview Questions

> **Q: What is the difference between a Docker image and a container?**
> A Docker image is a read-only template — like a recipe or a blueprint. It contains the OS, dependencies, and your application code. A container is a running instance of an image — like a dish cooked from the recipe. You can run many containers from the same image simultaneously. Images are stored in registries (Docker Hub); containers run on your host.

> **Q: What is the difference between Docker and a VM?**
> A VM virtualizes an entire computer including its own OS — heavy, slow to start (minutes), uses gigabytes of RAM. Docker containers share the host OS kernel — lightweight, start in seconds, use megabytes. The trade-off: VMs provide stronger isolation (each has its own kernel); containers are faster and more efficient but share the kernel.


## Scenario-Based Questions

| Scenario | What They're Testing | Key Points to Cover |
| --- | --- | --- |
| "Your deployment just failed in production at 2 AM — what do you do?" | Incident response, communication | Check logs first → rollback quickly → alert team → root cause analysis after service is restored |
| "Your EC2 instance is running out of disk space — how do you fix it?" | Linux, AWS troubleshooting | df -h→ find large files withdu→ extend EBS volume or clean logs → add lifecycle policy |
| "Your Jenkins pipeline keeps failing — where do you look first?" | CI/CD debugging | Check the console output → check SCM connection → verify environment variables and credentials → check agent status |
| "How would you set up a completely new AWS environment from scratch?" | Architecture, IaC | VPC → subnets → IGW → route tables → security groups → EC2/ECS → RDS → CloudWatch alarms → Terraform for everything |


> **🎯 Interview Preparation Checklist**
> Can you explain every module in this course to a non-technical person? Have you deployed a real project end-to-end with a CI/CD pipeline? Can you write a Dockerfile and Docker Compose file from scratch? Can you create a VPC with public/private subnets in the AWS Console AND via CLI? Do you have a GitHub repo with your projects to show interviewers? Have you set up Prometheus + Grafana monitoring on at least one app? Can you explain what happens when you type a URL in the browser?
