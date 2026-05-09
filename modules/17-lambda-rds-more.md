# ⚡ Lambda, RDS, DynamoDB & More

> Module 15 — AWS Deep Dive


## AWS Lambda — Serverless Computing

AWS Lambda lets you run code without provisioning or managing servers. You upload your function, define when it triggers, and AWS handles everything else. You pay only for the compute time you use — down to the millisecond.

> **💡 Analogy — Electricity**
> Running a traditional server is like buying a generator and running it 24/7. Lambda is like using the electrical grid — you only pay for the watts you actually use. When no one's using your function, it costs nothing.

### 🔔 Push-Based (Sync)
Event source triggers Lambda andwaitsfor a response. Used when the caller needs an instant result. Example: API Gateway calling a Lambda function to return a response to a user.

### 📤 Push-Based (Async)
Event source fires anddoesn't wait. Events are queued and retried on failure. Useful for background processing. Example: S3 upload triggers a Lambda to resize an image.

### 🔄 Pull-Based (Streams)
Lambdapollsthe event source for new data. Processes in batches. AWS manages the polling and scaling. Example: Lambda reading from a DynamoDB stream or SQS queue.

### 🕐 Canary Functions
A scheduled Lambda that monitors a website by visiting it — like a synthetic health check. Can alert you if a page is down or returns unexpected content.


## Amazon SNS — Simple Notification Service

SNS is a messaging service under the Application Integration category. It's used to send notifications to many subscribers at once. The key components are topics (a channel) and subscriptions (who receives from that channel).

### 📢 Topics

A topic is a communication channel. Publishers send messages to the topic. Think of it like a broadcast announcement system — one message sent to the topic reaches all subscribers.

### 📬 Subscriptions

Subscribers choose how to receive notifications: via email, SMS, HTTP endpoint, Lambda, SQS , or mobile push. One topic can have millions of subscribers.


## CloudWatch — AWS Monitoring

Amazon CloudWatch is used to monitor AWS resources and applications. It falls under the Management & Governance category.

### 📊 Metrics
Every AWS resource publishes metrics automatically. EC2 gives you CPU usage, network I/O, disk I/O. You can also create custom metrics from your application code.

### 📈 Dashboards
View multiple metrics in one place. AWS provides automated dashboards for common services, and you can build your own custom dashboards combining any metrics.

### 🔔 Alarms
Set thresholds and get notified. Three states:OK,ALARM, andINSUFFICIENT_DATA. An alarm triggers actions: send SNS notification, scale EC2, or stop an instance.

### ⚡ Events / EventBridge
Captures changes in your AWS environment (e.g., EC2 state changes) and triggers targets like Lambda, SNS, or SQS based on rules. Great for automated responses to events.


## RDS vs DynamoDB — Which Database to Use?

| Feature | 🗄️ Amazon RDS | ⚡ Amazon DynamoDB |
| --- | --- | --- |
| Type | Relational (SQL) — tables with rows and columns | NoSQL — key-value and document-based |
| Engines | MySQL, PostgreSQL, Oracle, MariaDB, SQL Server, Aurora | DynamoDB only (proprietary) |
| Schema | Fixed schema — define columns upfront | Schema-less — each item can have different attributes |
| Scaling | Vertical (bigger instance) + read replicas | Automatic, horizontal, to millions of req/sec |
| Latency | Low (milliseconds) | Ultra-low (single-digit milliseconds) |
| Best for | Complex queries, relationships, financial data | Real-time apps, gaming, IoT, mobile backends |
| Multi-region | Multi-AZ for HA | Global Tables — multi-region replication built-in |


> **✅ Rule of Thumb**
> If your data has complex relationships and you need SQL queries (JOINs, transactions) → use RDS . If you need massive scale, flexible schema, and single-digit ms latency with simple access patterns → use DynamoDB .
