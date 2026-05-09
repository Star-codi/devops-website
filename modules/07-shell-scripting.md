# ⚡ Shell Scripting

> Module 05 — Code & Build


## What is a Shell?

A shell is a user interface that provides access to operating system services. It acts as a translator between the user and the kernel — you type a command, the shell interprets it, and the kernel executes it.

### 🖼️ GUI Shell

Graphical interface — icons, windows, menus. Examples: Windows Explorer, Linux GNOME, KDE. Easy to learn but slow and not scriptable.

### ⌨️ CLI Shell

Text-based — you type commands. Examples: Windows CMD, PowerShell, Linux Terminal. Faster, automatable, used in all DevOps work.

Types of CLI shells in Linux: sh (original Bourne Shell), bash (Bourne Again Shell — default on most Linux), zsh (Z Shell — macOS default, advanced features), fish (user-friendly, auto-suggestions), ksh (Korn Shell — enterprise), csh (C Shell — C-like syntax).

```terminal — discover your shell
# Which shell are you using right now?
echo $0
-bash
# List all available shells on the system
cat /etc/shells
/bin/sh
/bin/bash
/usr/bin/zsh
/usr/bin/fish
```


## What is Shell Scripting?

A shell script is an executable file containing multiple shell commands that run sequentially — like a recipe. Instead of typing 20 commands every morning, you write them once in a script and run them with a single command.


> **🤖 Analogy — Teaching a Robot**
> Imagine training a robot to clean your house. Instead of telling it what to do step by step every day, you write instructions once and hand it the list. Shell scripting is exactly that — you write instructions for your computer to follow automatically, every time.


## Variables, Input & Operators

```shell script — variables & operators
#!/bin/bash
# Declare a variable (no spaces around =)
APP_NAME="myapp"
PORT=8080
# Access variable value with $
echo "Starting $APP_NAME on port $PORT"
# Take input from user
read USERNAME
echo "Hello, $USERNAME!"
# Arithmetic operators (use $(( )) for math)
TOTAL=$(( 10 + 5 ))        # addition
DIFF=$(( 10 - 3 ))         # subtraction
PROD=$(( 4 * 5 ))          # multiplication
MOD=$(( 10 % 3 ))          # modulus (remainder)
# Relational operators (for comparisons)
# -eq  equal          -ne  not equal
# -gt  greater than   -lt  less than
# -ge  >= (or equal)  -le  <= (or equal)
# Logical operators
# &&  AND    ||  OR    !  NOT
```


## Conditions & Loops

```shell script — if / for / while / until
#!/bin/bash
# IF / ELIF / ELSE
if [ -f "package.json" ]; then
    echo "Node project" && npm install
elif [ -f "pom.xml" ]; then
    echo "Java project" && mvn package
else
    echo "Unknown project" && exit 1
fi
# FOR LOOP — iterate over a list
for server in web1 web2 web3; do
    echo "Deploying to $server"
    ssh $server "sudo systemctl restart app"
done
# WHILE LOOP — runs while condition is true
COUNT=1
while [ $COUNT -le 5 ]; do
    echo "Attempt $COUNT"
    COUNT=$(( COUNT + 1 ))
done
# UNTIL LOOP — runs UNTIL condition becomes true
until [ $COUNT -gt 10 ]; do
    echo "Waiting... $COUNT"
    COUNT=$(( COUNT + 1 ))
done
```


## Functions & I/O Redirection

```shell script — functions
#!/bin/bash
# Define a function
deploy_app() {
    local APP=$1               # $1 = first argument
    local ENV=$2               # $2 = second argument
    echo "Deploying $APP to $ENV..."
    docker pull $APP:latest
    docker run -d --name $APP $APP:latest
    echo "✅ $APP deployed to $ENV"
}

# Call the function
deploy_app "myapp" "production"
deploy_app "api" "staging"
```

```shell script — i/o redirection
# Linux has 3 standard streams:
# 0 = stdin  (Standard Input)
# 1 = stdout (Standard Output)
# 2 = stderr (Standard Error)
# Output redirection
echo "Hello" > output.txt # OVERWRITE (careful!)
echo "World" >> output.txt # APPEND (safe)
# Input redirection
mysql -u root -p mydb < backup.sql # feed SQL file as input
# Error redirection
./deploy.sh 2> errors.log # send errors to file
./deploy.sh &> all.log # send BOTH stdout and stderr
# Discard output entirely (send to /dev/null)
./noisy-script.sh > /dev/null 2>&1
# Pipe — send output of one command as input to another
cat app.log | grep "ERROR" | tail -20
ps aux | grep nginx
```


> **🚀 Mini Project — Automated Backup Script**
> backup.sh #!/bin/bash DATE=$(date +%Y-%m-%d)
BACKUP_DIR= "/backups/$DATE" SOURCE_DIR= "/var/www/html" mkdir -p $BACKUP_DIR
cp -r $SOURCE_DIR $BACKUP_DIR
echo "Backup completed: $BACKUP_DIR" # Upload to S3 aws s3 cp $BACKUP_DIR s3://my-backups/$DATE --recursive
echo "✅ Backup uploaded to S3"


> **✅ Module Summary**
> A shell translates your commands to the kernel — bash is the most common Shell scripts automate repetitive Linux commands — start with #!/bin/bash Variables: NAME=value , access with $NAME , read input with read Conditions: if/elif/else; Loops: for, while, until Functions: group reusable commands, pass arguments with $1, $2... Redirection: > overwrites, >> appends, 2> errors, &> both Pipe | chains commands — the backbone of all DevOps automation
