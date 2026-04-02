# ⚡ QUICK GITHUB COMMANDS

## Connect Your Project to GitHub in 5 Minutes

**Date:** March 22, 2026

---

## 🚀 OPTION 1: FASTEST METHOD (GitHub CLI)

### Prerequisites
```bash
# Install GitHub CLI
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux - see https://github.com/cli/cli/blob/trunk/docs/install_linux.md
```

### One-Command Setup
```bash
# Navigate to project
cd /path/to/grow-compliance-os

# Login and create repo in one go
gh auth login
gh repo create grow-compliance-os \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --description "Complete Regulatory Operating System for Financial Services Compliance"
```

**That's it! Your project is now on GitHub!** ✅

---

## 🔧 OPTION 2: MANUAL METHOD (Traditional Git)

### Step 1: Initialize Git (if not done)
```bash
cd /path/to/grow-compliance-os
git init
git add .
git commit -m "Initial commit: Grow Compliance OS v1.0.0"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `grow-compliance-os`
3. Description: `Complete Regulatory Operating System for Financial Services Compliance`
4. Choose: **Private** or **Public**
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### Step 3: Connect and Push
```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/grow-compliance-os.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Done!** ✅

---

## 📋 DAILY WORKFLOW COMMANDS

### Get Latest Changes
```bash
git pull
```

### Create New Feature
```bash
git checkout -b feature/my-new-feature
# Make your changes
git add .
git commit -m "Add: My new feature"
git push origin feature/my-new-feature
```

### Update Existing Code
```bash
# Make changes
git add .
git commit -m "Fix: Bug description" 
# or "Update: Feature description"
# or "Add: New functionality"
git push
```

### Sync with Main Branch
```bash
git checkout main
git pull
git checkout feature/my-feature
git merge main
```

---

## 🏷️ COMMIT MESSAGE CONVENTIONS

Use clear prefixes:

```bash
git commit -m "Add: New integration for XYZ"
git commit -m "Fix: Resolve navigation bug"
git commit -m "Update: Improve performance"
git commit -m "Docs: Add API documentation"
git commit -m "Refactor: Simplify component structure"
git commit -m "Test: Add unit tests for bot"
git commit -m "Style: Format code with Prettier"
```

---

## 🔍 USEFUL COMMANDS

### Check Status
```bash
git status                 # See what's changed
git log --oneline -10      # See last 10 commits
git diff                   # See changes
```

### Undo Changes
```bash
git checkout -- file.txt   # Discard changes to file
git reset HEAD file.txt    # Unstage file
git reset --soft HEAD~1    # Undo last commit (keep changes)
git reset --hard HEAD~1    # Undo last commit (discard changes)
```

### Branches
```bash
git branch                 # List branches
git branch -a              # List all branches (including remote)
git checkout -b new-branch # Create and switch to branch
git branch -d branch-name  # Delete branch
git push origin --delete branch-name  # Delete remote branch
```

### Remote
```bash
git remote -v              # Show remote URLs
git remote add origin URL  # Add remote
git remote set-url origin NEW_URL  # Change remote URL
```

---

## 🎯 QUICK SETUP CHECKLIST

- [ ] Git initialized (`git init`)
- [ ] All files added (`git add .`)
- [ ] Initial commit made
- [ ] GitHub repository created
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] `.gitignore` file present
- [ ] `README.md` created
- [ ] Environment variables secured (`.env` in `.gitignore`)

---

## 🆘 TROUBLESHOOTING

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

### "Repository not found"
```bash
# Check remote URL
git remote -v

# Fix URL
git remote set-url origin https://github.com/YOUR_USERNAME/grow-compliance-os.git
```

### "Failed to push some refs"
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### "Merge conflict"
```bash
# Open conflicted files
# Edit to resolve conflicts
# Look for <<<<<<, =======, >>>>>> markers
# Keep the code you want, delete markers

git add .
git commit -m "Resolve merge conflict"
git push
```

---

## 🔗 USEFUL LINKS

- **GitHub Desktop:** https://desktop.github.com (Visual Git client)
- **GitHub CLI:** https://cli.github.com
- **Git Documentation:** https://git-scm.com/doc
- **GitHub Docs:** https://docs.github.com

---

## ✅ VERIFICATION

After setup, verify everything works:

```bash
# Check remote connection
git remote -v
# Should show: origin  https://github.com/YOUR_USERNAME/grow-compliance-os.git

# Check branch
git branch
# Should show: * main

# Check status
git status
# Should show: "nothing to commit, working tree clean"

# Visit GitHub
# Go to: https://github.com/YOUR_USERNAME/grow-compliance-os
# You should see your code!
```

---

## 🎉 YOU'RE DONE!

Your Grow Compliance OS is now on GitHub!

**Next Steps:**
1. ✅ Invite team members (Settings → Collaborators)
2. ✅ Set up branch protection (Settings → Branches)
3. ✅ Add GitHub Actions (optional)
4. ✅ Create first release (v1.0.0)

---

**Need detailed instructions?** See [GITHUB_SETUP.md](./GITHUB_SETUP.md)

**Questions?** dev-support@growkyc.com

---

**Last Updated:** March 22, 2026  
**Version:** Quick Reference Guide v1.0
