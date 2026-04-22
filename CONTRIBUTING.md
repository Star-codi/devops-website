# Contributing to DevOps Buddy

First off — thank you for wanting to contribute! This project exists to help beginners get into DevOps, and community contributions make it better for everyone.

Please read this guide fully before submitting anything. It saves both your time and mine.

---

## 📋 Step-by-Step Process

### 1. Open an Issue First (Required)

Before writing anything, **open an Issue** to propose your contribution.

This is important because:
- Someone else might already be working on the same thing
- The topic might not fit the roadmap
- We can give you feedback before you spend hours writing

Use one of these Issue types:
- **New Module** — proposing a brand new topic
- **Improve Existing** — fixing errors, adding examples, clarifying explanations
- **Bug / Typo** — something broken or incorrect on the site

Wait for a maintainer to respond with ✅ **"Approved, go ahead"** before writing.

---

### 2. Fork the Repo

Click **Fork** on the top right of this page. This creates your own copy of the repo where you can make changes freely.

```bash
git clone https://github.com/YOUR-USERNAME/devops-website.git
cd devops-website
git checkout -b your-branch-name
```

Use a descriptive branch name like `add-ansible-module` or `fix-docker-typo`.

---

### 3. Write Your Content in Markdown

All contributions are written in **Markdown** (`.md` files), not HTML.

- New modules go in the `/modules/` folder
- File naming: `XX-topic-name.md` (e.g. `20-ansible.md`)
- Follow the **Module Template** below — structure matters

---

### 4. Submit a Pull Request

Once you're done:

```bash
git add .
git commit -m "add: ansible module (closes #ISSUE_NUMBER)"
git push origin your-branch-name
```

Then open a Pull Request on GitHub. Fill in the PR template — don't leave it blank.

---

## 📝 Module Template

Every new module must follow this structure:

```markdown
# Module Title

## Why This Matters
<!-- 2-3 sentences explaining why a DevOps engineer needs this -->

## Analogy
<!-- One real-world analogy that makes the concept click -->

## Core Concepts
<!-- Explain the key ideas clearly. Use simple language. -->

## Commands / Code Examples
<!-- Use fenced code blocks with the language specified -->

```bash
# example command
```

## Mini Project
<!-- A small hands-on task the reader can do themselves -->

## Summary
<!-- Bullet points of what was covered -->

## What's Next
<!-- One line pointing to the next logical topic -->
```

---

## ✅ Content Guidelines

**Do:**
- Write for absolute beginners — assume zero prior knowledge
- Use analogies to explain abstract concepts
- Include working code examples that can be copy-pasted
- Keep language simple, direct, and friendly
- Reference official docs where relevant

**Don't:**
- Copy-paste content from other websites or docs
- Add promotional links or tool recommendations without context
- Skip the mini project section — hands-on practice is the whole point
- Submit content that duplicates an existing module

---

## 🚫 What Will Be Rejected

- Content copied from official docs, blogs, or other sources
- Modules that weren't approved via an Issue first
- PRs with no description or context
- Content with significant factual errors
- Anything unrelated to DevOps / Cloud Engineering

---

## 💬 Questions?

Open an Issue with the label `question` and I'll get back to you.

---

Thanks again for contributing. Every improvement — big or small — helps someone learn DevOps. 🙌
