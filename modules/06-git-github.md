# 🌿 Git & GitHub

> Module 04 — Code & Build


## The Problem Without Version Control

Imagine you and your friend are both editing the same Word document. You each make changes and email it back and forth. After 5 rounds, nobody knows which version is the latest. Someone accidentally overwrites the other's changes. The file is now a mess called final_final_v3_ACTUAL_FINAL.docx .

In software, this is catastrophic. A team of 10 developers could be working on the same codebase. Without coordination, everything breaks. This is why we use a Version Control System (VCS) .


## Types of Version Control Systems

| Type | How it works | Tools | Problem |
| --- | --- | --- | --- |
| 📂 Local VCS (LVCS) | Saves versions only on your local machine | RCS, SCCS | No backup, no collaboration |
| 🌐 Centralized VCS (CVCS) | One central server stores all code; everyone connects to it | SVN, Perforce | No internet = can't save; server failure = all lost |
| ✅ Distributed VCS (DVCS) | Every developer has afull copyof the entire repo | Git, Mercurial | None — best of both worlds |

Git is a DVCS — it combines Local VCS (work offline, full local history) with Central VCS (push to shared remote, full collaboration). This is why Git is the industry standard.


> **⏰ Analogy — Google Docs + Time Machine**
> Git is like Google Docs for code — everyone can work on it, every change is tracked, and you can go back to any previous version instantly. GIT stands for Global Information Tracker . Created in 2005 by Linus Torvalds (same person who created Linux!) to manage the Linux kernel source code.


## Git vs GitHub — They're Different!

|  | Git | GitHub |
| --- | --- | --- |
| What it is | Version control tool (software on your computer) | Website that hosts Git repositories in the cloud |
| Where it runs | On your local machine | In the cloud (github.com) |
| Analogy | The camera taking photos | The photo album stored online |
| Can work offline? | Yes | No |
| Alternatives | — | GitLab, Bitbucket, Azure DevOps |


## Git's Three Working Areas


## The Core Git Workflow

```terminal — complete git workflow
# 1. Configure Git (one time only)
git config user.name "Arjun"
git config user.email "arjun@email.com"
git config --edit # open config to edit manually
# 2. Initialize project
git init
# 3. Check status and add files
git status
git add app.py # add single file
git add . # add ALL files
git add *.js # add all .js files
# 4. Commit with a message
git commit -m "feat: add login page"
# 5. Connect to GitHub remote
git remote add origin https://github.com/user/repo.git
git remote -v # verify connection
# 6. Push to GitHub
git push origin main
# 7. Pull latest changes from team
git pull origin main
# Useful extras
git log # see commit history
git ls-files # list tracked files
git remote remove origin # remove connection
```


## Branching — Types & Commands

A branch is a separate line of development — a safe sandbox to work in without touching the main codebase.

### 🌿 Main / Master Branch

The default branch created when you init a repo. This is your production code — always stable and working. Never push broken code directly here.

### ✨ Feature Branch

Created to develop a new feature . Isolated from main — you experiment freely. Once done, raise a Pull Request to merge back into main.

### 🚀 Release Branch

Created when preparing a release . Only bug fixes go here — no new features. When ready, merged into main and tagged with a version number.

### 🔥 Hotfix Branch

Created for critical production bugs that need immediate fixing. Branched directly from main, fixed fast, merged back to main and also back to any in-progress release branch.

```terminal — branching commands
# List all branches
git branch # local branches
git branch -a # local + remote branches
git branch -r # remote branches only
# Create and switch to new branch
git checkout -b feature/login-page
# Or using newer syntax:
git switch -c feature/login-page
# Switch between branches
git checkout main
git switch main
# Push branch to GitHub
git push origin feature/login-page
# Merge feature into main
git checkout main
git merge feature/login-page
# Delete branch after merge
git branch -d feature/login-page # safe delete (merged)
git branch -D feature/login-page # force delete
git push origin --delete feature/login-page # delete remote
```


> **✅ Module Summary**
> VCS types: Local (LVCS) → Centralized (CVCS) → Distributed (DVCS — Git) Git was created by Linus Torvalds in 2005 for the Linux kernel Three areas: Working Directory → Staging Area → Local Repository → GitHub Core workflow: git init → add → commit → remote add → push Branch types: main, feature, release, hotfix — each has a purpose git fetch downloads but doesn't merge; git pull = fetch + merge
