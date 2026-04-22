# 🐧 Linux Basics

> Module 03 — Foundation


## What is an Operating System?

Before diving into Linux, let's understand what an OS actually does. An Operating System is the software that manages all hardware and software resources on your computer. Without it, your applications have no way to talk to the CPU, memory, or disk.

### ⚙️ Process Management
Decides which processes run, for how long, and allocates CPU time. Without this, every program would fight for the processor.

### 💾 Memory Management
Tracks how much RAM each process uses, decides how much to allocate, and keeps record of free memory.

### 📁 File Management
Organises files and directories, tracks file information (size, permissions, location), and manages reads/writes.

### 🔒 Security & User Management
Manages authorised users, restricts access to unauthorised users, and prevents harmful activities on the system.


## Linux Architecture


## What is Linux & Why Does It Matter?

Linux is a free, open-source operating system founded by Linus Torvalds in 1991. About 96% of the world's servers run Linux — including all major cloud providers (AWS, GCP, Azure). If you're doing DevOps, you're doing Linux.

### 🐧 Popular Linux Flavours
Ubuntu / Debian— beginner-friendly, great for serversRed Hat (RHEL)— enterprise standardCentOS / Fedora— RHEL-based, freeKali Linux— security & penetration testingAmazon Linux— AWS-optimised

### 🪟 Linux vs Windows
Free & open sourcevs paid closed sourceMore secure, no antivirus neededCLI-firstvs GUI-firstNo rebootneeded for most updatesEnterprise-designed— multi-user, better multitasking


> **🎮 Analogy — Cheat Codes**
> Using a GUI (graphical interface) is like playing a game normally. Using the Linux terminal is like knowing the cheat codes — you can do in 1 second what takes 5 minutes with a mouse.


## Essential Commands — Navigation

```terminal — file navigation
# Print current directory (where am I?)
pwd
/home/arjun
# List files in current directory
ls
Documents  Downloads  projects  script.sh
# List with details (permissions, size, date)
ls -la
# Change directory
cd projects
cd .. # go one level up
cd ~ # go to home directory
# Create a new directory
mkdir my-app
# Create a file
touch hello.txt
```


## Essential Commands — Files

```terminal — file operations
# View file contents
cat hello.txt
less hello.txt # scrollable view
# Write to a file
echo "Hello World" > hello.txt
echo "Line 2" >> hello.txt # append (don't overwrite)
# Copy, Move, Delete
cp hello.txt backup.txt
mv hello.txt greetings.txt # also used for renaming
rm greetings.txt
rm -rf old-folder/ # delete folder (careful!)
# Search inside files
grep "error" app.log
grep -r "TODO" ./src # search in all files
```


## Permissions (chmod)

Linux controls who can read, write, or execute a file. Think of it as setting access rules.

```terminal — permissions
# Make a script executable
chmod +x deploy.sh
./deploy.sh # now you can run it
# Change file owner
chown arjun:developers myfile.txt
# Run as superuser (admin)
sudo apt update # sudo = "do as super user"
```


## Process & System Commands

```terminal — system management
# See running processes
ps aux
top # live view (like task manager)
# Kill a process
kill 1234 # 1234 = process ID
kill -9 1234 # force kill
# Disk and memory
df -h # disk usage
free -h # memory usage
# Install software (Ubuntu/Debian)
sudo apt update && sudo apt install nginx -y
# Manage services
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```


## User Management

Linux allows multiple users on one machine. Every user has a type, a UID, and specific permissions.

| User Type | UID | Description |
| --- | --- | --- |
| 🔴 Root User | 0 | Superuser — full control over everything. Access viasudo. Direct login disabled by default. |
| ⚙️ System Users | 1–999 | Created by OS for background services (daemons). No password, no login. E.g.www-datafor nginx. |
| 👤 Normal Users | 1000+ | Created by admins for real people. Limited permissions — can only affect their own files. |

```terminal — user management
# Create a new user
sudo useradd -m arjun # -m creates home directory
sudo passwd arjun # set password
# Modify a user (add to sudo group)
sudo usermod -aG sudo arjun
# Delete a user
sudo userdel -r arjun # -r removes home dir too
# Switch to another user
su - arjun
# See current user
whoami
# See all users on the system
cat /etc/passwd
# See which groups a user belongs to
groups arjun
```


## File Test Operators — Check Before You Act

In shell scripts, you often need to check if a file or directory exists before doing something with it. These are called file test operators :

```shell — file test operators
# Check if a file exists
if [ -e config.yaml ]; then
    echo "Config file exists"
fi
# Common file test operators:
# -e  → path exists (file or directory)
# -f  → is a regular file
# -d  → is a directory
# -r  → file is readable
# -w  → file is writable
# -x  → file is executable
# -s  → file is NOT empty (has content)
# Practical example in a deploy script
if [ ! -d "/var/log/myapp" ]; then
    mkdir -p /var/log/myapp
    echo "Created log directory"
fi
if [ -x "./deploy.sh" ]; then
    ./deploy.sh
else
    echo "Error: deploy.sh is not executable"
    chmod +x deploy.sh
fi
```


> **🚀 Mini Project — Set Up a Web Server**
> Commands sudo apt update sudo apt install nginx -y sudo systemctl start nginx && sudo systemctl enable nginx echo "<h1>Hello from my EC2 server!</h1>" | sudo tee /var/www/html/index.html # Visit http://your-ec2-ip in a browser 🎉


> **✅ Module Summary**
> Linux OS manages processes, memory, files, network, and security Architecture: Applications → Shell → Kernel → Hardware 96% of servers run Linux — Ubuntu, RHEL, Amazon Linux are most common Navigation: pwd, ls, cd, mkdir, touch Files: cat, cp, mv, rm, grep Permissions: chmod (755 = rwxr-xr-x), chown, sudo Users: root (UID 0), system (1-999), normal (1000+) File tests: -e -f -d -r -w -x -s in shell scripts
