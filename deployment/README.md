# TQD Deployment Scripts

Quick reference for deploying to your demo server.

## 🎯 Server Info
- **IP:** 46.225.69.136
- **User:** root
- **Purpose:** Client demo/preview

---

## 📁 Files Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| `quick-update.ps1` | ⚡⚡ **BEST** - Commit + Push + Deploy in one | Daily workflow after changes |
| `quick-deploy.ps1` | ⚡ Deploy to server only | When code already pushed to GitHub |
| `github-init.ps1` | 🐙 Initialize and push to GitHub | First time GitHub setup |
| `server-setup.sh` | Initial server configuration | Once only (first time setup) |
| `deploy.sh` | Deploy on server (via SSH) | If logged into server |
| `deploy-from-local.sh` | Deploy from Linux/Mac | If on Linux/Mac instead of Windows |
| `DEPLOYMENT.md` | Full documentation | Reference guide |

---

## 🚀 Quick Start

### First Time Setup (Do Once)
1. SSH to server: `ssh root@46.225.69.136`
2. Upload setup script:
   ```powershell
   scp deployment/server-setup.sh root@46.225.69.136:/tmp/
   ```
3. Run on server:
   ```bash
   chmod +x /tmp/server-setup.sh
   /tmp/server-setup.sh
   ```

### Setup GitHub Version Control (Do Once)
```powershell
.\deployment\github-init.ps1
```
This will:
- Initialize Git repository
- Configure your Git user
- Add GitHub remote
- Create initial commit
- Push to GitHub

### Daily Workflow - After Making Changes
```powershell
.\deployment\quick-update.ps1
```
This will:
1. Show your changes
2. Ask for commit message
3. Commit changes
4. Push to GitHub
5. Deploy to server

### Deploy Only (Code Already on GitHub)
```powershell
.\deployment\quick-deploy.ps1
```

That's it! 🎉

---

## 🌐 Access Demo
After deployment, client can view at:
```
http://46.225.69.136
```

---

## 📝 Common Commands

**Check if site is running:**
```bash
ssh root@46.225.69.136 "pm2 status"
```

**View logs:**
```bash
ssh root@46.225.69.136 "pm2 logs tqd-website"
```

**Restart site:**
```bash
ssh root@46.225.69.136 "pm2 restart tqd-website"
```

---

## 🆘 Problems?
See full documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)
