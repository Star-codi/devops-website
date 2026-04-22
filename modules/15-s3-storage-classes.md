# 🪣 S3 Storage Classes & Features

> Module 13 — AWS Deep Dive


## S3 Recap + Key Features

Amazon S3 (Simple Storage Service) is object storage — think of it as an infinite hard drive in the cloud. It stores buckets (containers) and objects (files). Bucket names must be globally unique, and a single object can be up to 5 TB .

### 💎 11 Nines Durability
99.999999999% durability — all S3 classes offer this. AWS replicates your data across multiple devices and facilities automatically.

### 📈 Unlimited Scalability
S3 automatically scales with your usage. No capacity planning needed — store 1 file or 1 billion files with no changes to your setup.

### 🔄 Lifecycle Policies
Automatically transition data between storage classes (e.g. Standard → IA → Glacier) after N days. Saves money without manual effort.

### 🔒 Encryption & ACLs
Encrypt data at rest (SSE-S3, SSE-KMS) and in transit (HTTPS). ACLs control who can access your bucket — disable to keep ownership to bucket owner only.


## S3 Storage Classes — Visual Guide


## S3 Storage Classes — Quick Reference

| Class | Access | Retrieval | Cost | Best For |
| --- | --- | --- | --- | --- |
| Standard | Frequent | Instant, no fee | Highest | Websites, active data |
| Standard-IA | Infrequent | Instant, fee applies | Lower storage | Backups, DR |
| One Zone-IA | Infrequent | Instant, fee applies | 20% < Std-IA | Re-creatable data |
| Intelligent-Tiering | Unknown | Instant | Auto-optimized | Data lakes, ML |
| Glacier Instant | Rare | Milliseconds | Low | Medical archives |
| Glacier Flexible | Rare | 1 min – 12 hrs | Lower | Long-term backups |
| Deep Archive | Very rare | 12 – 48 hrs | Lowest | Legal/financial 7+ yrs |


> **✅ Cost-Saving Tip**
> Use S3 Lifecycle Policies to automatically move data: keep new files in Standard for 30 days → move to Standard-IA for 60 days → archive to Glacier Flexible after 90 days. This can cut storage costs by 60–90% for older data!
