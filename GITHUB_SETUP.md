# 🐙 GitHub Setup Guide - Trust Quality Designs

Complete guide for setting up version control with GitHub.

---

## 📋 Repository Information

**Repository Name:** `trustqualitydesigns`  
**Owner:** `arlantaan`  
**Full URL:** https://github.com/arlantaan/trustqualitydesigns  
**Visibility:** Private (recommended) or Public

---

## 🚀 Initial Setup

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. **Owner:** arlantaan
3. **Repository name:** trustqualitydesigns
4. **Description:** Professional branding and signage construction company website built with Next.js
5. **Visibility:** Private (recommended for client work)
6. **Initialize:** 
   - ❌ Don't add README (we already have one)
   - ❌ Don't add .gitignore (we already have one)
   - ❌ Don't add license yet
7. Click **Create repository**

### Step 2: Initialize Local Git (if not done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init

# Set your identity (if not set globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 3: Connect to GitHub

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/arlantaan/trustqualitydesigns.git

# Verify remote
git remote -v
```

### Step 4: Stage All Files

```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

### Step 5: Create Initial Commit

```bash
# Commit all files
git commit -m "Initial commit: Trust Quality Designs website

- Next.js 15 with App Router
- Dark red theme with Tailwind CSS
- Mobile features (gyroscope tilt, shake-to-click)
- Responsive design
- Deployment scripts for Hetzner VPS
- Comprehensive documentation"
```

### Step 6: Push to GitHub

```bash
# Push to GitHub (main branch)
git push -u origin main

# If you're on 'master' branch, rename it first:
git branch -M main
git push -u origin main
```

---

## 🌿 Branching Strategy

### Main Branches

1. **`main`** - Production-ready code (always deployable)
2. **`develop`** - Integration branch for features
3. **`staging`** - Pre-production testing

### Feature Branches

Create for each new feature or fix:

```bash
# Format: feature/description or fix/description
git checkout -b feature/new-service-page
git checkout -b fix/mobile-menu-bug
git checkout -b enhance/performance-optimization
```

### Branch Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature: description"

# 3. Push feature branch
git push origin feature/new-feature

# 4. Create Pull Request on GitHub

# 5. After review and merge, clean up
git checkout main
git pull origin main
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

---

## 📝 Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **deploy**: Deployment-related changes

### Examples

```bash
# Feature
git commit -m "feat(mobile): add shake-to-click functionality"

# Bug fix
git commit -m "fix(header): resolve z-index issue with mobile menu"

# Documentation
git commit -m "docs(readme): add deployment instructions"

# Performance
git commit -m "perf(images): optimize Unsplash image loading"

# Deployment
git commit -m "deploy(server): update nginx configuration"
```

---

## 🔄 Daily Workflow

### Starting Work

```bash
# Pull latest changes
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature
```

### During Work

```bash
# Check status frequently
git status

# See changes
git diff

# Stage specific files
git add src/components/NewComponent.tsx

# Or stage all changes
git add .

# Commit with meaningful message
git commit -m "feat(components): add NewComponent with props"

# Push to GitHub regularly
git push origin feature/your-feature
```

### Finishing Work

```bash
# Make sure all changes are committed
git status

# Push final changes
git push origin feature/your-feature

# Create Pull Request on GitHub
# After merge, clean up:
git checkout main
git pull origin main
git branch -d feature/your-feature
```

---

## 🚀 Deployment Workflow

### Option 1: Manual Deploy After Push

```bash
# 1. Push to GitHub
git push origin main

# 2. SSH to server
ssh root@46.225.69.136

# 3. Pull latest code
cd /var/www/tqd
git pull origin main

# 4. Install and build
npm install
npm run build

# 5. Restart PM2
pm2 restart tqd-website
```

### Option 2: Deploy Script

```powershell
# On your local Windows machine
git push origin main
.\deployment\quick-deploy.ps1
```

### Option 3: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: 46.225.69.136
        username: root
        password: ${{ secrets.SERVER_PASSWORD }}
        script: |
          cd /var/www/tqd
          git pull origin main
          npm install
          npm run build
          pm2 restart tqd-website
```

Add server password as GitHub Secret:
1. Go to repository Settings
2. Secrets and variables → Actions
3. New repository secret
4. Name: `SERVER_PASSWORD`
5. Value: `mHTdiNaRtCFa`

---

## 🔒 Security Best Practices

### Secrets Management

1. **Never commit:**
   - Passwords
   - API keys
   - Private keys
   - .env files with secrets

2. **Use GitHub Secrets for:**
   - Server passwords
   - API keys
   - Database credentials

3. **Check .gitignore:**
```bash
# Verify sensitive files are ignored
cat .gitignore | grep -E '\.env|\.pem|\.key'
```

### Protect Main Branch

1. Go to repository Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

---

## 📊 Repository Structure on GitHub

```
trustqualitydesigns/
├── .github/
│   └── workflows/       # GitHub Actions
├── deployment/          # Deployment scripts
├── public/             # Static assets
├── src/                # Source code
├── .gitignore
├── README.md
├── DEPLOYMENT_SUMMARY.md
├── GITHUB_SETUP.md
├── package.json
└── ... (other config files)
```

---

## 🏷️ Tagging Releases

### Create Version Tags

```bash
# Tag current commit
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial production deployment"

# Push tag to GitHub
git push origin v1.0.0

# List all tags
git tag -l

# View tag details
git show v1.0.0
```

### Semantic Versioning

- **v1.0.0** - Major release
- **v1.1.0** - Minor features
- **v1.1.1** - Patches/fixes

---

## 👥 Collaboration

### Pull Request Workflow

```bash
# 1. Fork or clone repository
git clone https://github.com/arlantaan/trustqualitydesigns.git

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
#    - Add description
#    - Request review
#    - Link related issues

# 6. After approval, merge via GitHub interface

# 7. Pull merged changes locally
git checkout main
git pull origin main

# 8. Delete feature branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

---

## 🛠️ Useful Git Commands

### Status & Info
```bash
git status                 # Check status
git log --oneline          # View commit history
git log --graph --all      # Visual branch graph
git diff                   # View changes
git diff --staged          # View staged changes
```

### Branch Management
```bash
git branch                 # List branches
git branch -a              # List all (including remote)
git branch -d branch-name  # Delete local branch
git push origin --delete branch-name  # Delete remote
```

### Undo Changes
```bash
git reset HEAD file.txt    # Unstage file
git checkout -- file.txt   # Discard changes
git reset --soft HEAD~1    # Undo last commit (keep changes)
git reset --hard HEAD~1    # Undo last commit (discard changes)
```

### Remote Management
```bash
git remote -v              # View remotes
git remote show origin     # Remote details
git fetch origin           # Fetch without merge
git pull origin main       # Fetch and merge
```

---

## 📈 Repository Metrics

### Recommended README Badges

Add to README.md:

```markdown
![GitHub last commit](https://img.shields.io/github/last-commit/arlantaan/trustqualitydesigns)
![GitHub issues](https://img.shields.io/github/issues/arlantaan/trustqualitydesigns)
![GitHub stars](https://img.shields.io/github/stars/arlantaan/trustqualitydesigns)
![License](https://img.shields.io/badge/license-Proprietary-red)
```

---

## 🎯 Next Steps

- [ ] Create GitHub repository
- [ ] Push initial code
- [ ] Setup branch protection
- [ ] Add collaborators (if any)
- [ ] Create first tag (v1.0.0)
- [ ] Setup GitHub Actions (optional)
- [ ] Add project board for task tracking (optional)
- [ ] Enable GitHub Pages for documentation (optional)

---

## 📞 GitHub Resources

- **Documentation:** https://docs.github.com
- **Git Commands:** https://git-scm.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **SSH Setup:** https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

**Last Updated:** February 14, 2026  
**Repository:** https://github.com/arlantaan/trustqualitydesigns  
**Status:** Ready for initial push
