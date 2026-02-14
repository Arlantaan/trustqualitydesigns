# TQD Website Deployment Guide

## 🎯 Demo Server Information
- **IP Address:** 46.225.69.136
- **IPv6:** 2a01:4f8:1c19:10f0::/64
- **OS:** Ubuntu 24.04 LTS
- **Purpose:** Client preview/demo

---

## 📋 Prerequisites
- SSH access to server (root@46.225.69.136)
- Server password: `CvttApsLiTHuAi7JVsmU`
- Git installed locally (optional)
- Node.js 18+ installed locally

---

## 🚀 Initial Server Setup (One-time)

### Step 1: Connect to server
```bash
ssh root@46.225.69.136
# Password: CvttApsLiTHuAi7JVsmU
```

### Step 2: Upload and run setup script
```bash
# From your local machine:
scp deployment/server-setup.sh root@46.225.69.136:/tmp/

# On server:
chmod +x /tmp/server-setup.sh
/tmp/server-setup.sh
```

This installs:
- ✅ Node.js 20 LTS
- ✅ Nginx (reverse proxy)
- ✅ PM2 (process manager)
- ✅ Certbot (SSL certificates)
- ✅ UFW Firewall
- ✅ Fail2ban (security)

---

## 📦 Deployment Options

### Option A: Deploy from Local Windows Machine

**Using PowerShell:**
```powershell
# Build project
npm run build

# Create deployment archive
tar -czf tqd-deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=.next .

# Upload to server
scp tqd-deploy.tar.gz root@46.225.69.136:/var/www/tqd/

# SSH and deploy
ssh root@46.225.69.136

# On server:
cd /var/www/tqd
tar -xzf tqd-deploy.tar.gz
npm install --production
npm run build
pm2 delete tqd-website 2>/dev/null || true
pm2 start npm --name tqd-website -- start
pm2 save
```

### Option B: Using Git Repository

**On server:**
```bash
cd /var/www/tqd
git clone <your-repo-url> .
npm install --production
npm run build
pm2 start npm --name tqd-website -- start
pm2 save
```

**For updates:**
```bash
cd /var/www/tqd
git pull
npm install --production
npm run build
pm2 restart tqd-website
```

### Option C: Using Deployment Script (Linux/Mac)

```bash
# From your local machine (if using Linux/Mac):
chmod +x deployment/deploy-from-local.sh
./deployment/deploy-from-local.sh
```

---

## 🌐 Accessing the Site

**Direct IP Access:**
```
http://46.225.69.136
```

**With Domain (when configured):**
```
https://yourdomain.com
```

---

## 🔒 SSL Setup (Optional - for custom domain)

### Step 1: Point your domain to server IP
Update DNS A record:
```
A    @    46.225.69.136
A    www  46.225.69.136
```

### Step 2: Update Nginx config
```bash
# On server:
nano /etc/nginx/sites-available/tqd

# Replace: server_name 46.225.69.136;
# With:    server_name yourdomain.com www.yourdomain.com;

nginx -t && systemctl reload nginx
```

### Step 3: Install SSL certificate
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 Server Management

### Check application status
```bash
pm2 status
pm2 logs tqd-website
pm2 monit
```

### Restart application
```bash
pm2 restart tqd-website
```

### View Nginx logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check firewall status
```bash
ufw status
```

---

## 🛡️ Security Hardening

### 1. Change root password
```bash
passwd
```

### 2. Create non-root user
```bash
adduser deployuser
usermod -aG sudo deployuser
```

### 3. Setup SSH key authentication
```powershell
# On your local Windows machine:
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server:
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@46.225.69.136 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 4. Disable password authentication (after SSH keys work)
```bash
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
systemctl restart sshd
```

---

## 🔄 Quick Deployment Commands

### From Windows PowerShell:
```powershell
# Full redeploy
npm run build
scp -r .next package.json package-lock.json public src root@46.225.69.136:/var/www/tqd/
ssh root@46.225.69.136 "cd /var/www/tqd && npm install --production && pm2 restart tqd-website"
```

### Update only code (no dependencies):
```powershell
npm run build
scp -r .next src root@46.225.69.136:/var/www/tqd/
ssh root@46.225.69.136 "cd /var/www/tqd && npm run build && pm2 restart tqd-website"
```

---

## 📊 Monitoring

### Real-time logs
```bash
pm2 logs tqd-website --lines 100
```

### Server resources
```bash
htop  # Install: apt install htop
```

### Nginx status
```bash
systemctl status nginx
```

---

## 🆘 Troubleshooting

### Application won't start
```bash
cd /var/www/tqd
npm install --production
npm run build
pm2 describe tqd-website  # Check errors
```

### Port 3000 already in use
```bash
pm2 delete all
pm2 start npm --name tqd-website -- start
```

### Nginx errors
```bash
nginx -t  # Test configuration
systemctl restart nginx
tail -f /var/log/nginx/error.log
```

### Out of memory
```bash
free -m  # Check memory
pm2 restart tqd-website
```

---

## 📝 Notes

- **Demo Purpose:** This server is for client preview only
- **Production Deployment:** Client will get her own server after payment
- **Backup:** No automated backups on demo server (temporary deployment)
- **Updates:** Push updates anytime for client review

---

## 🎉 Post-Deployment Checklist

- [ ] Site accessible at http://46.225.69.136
- [ ] All pages load correctly
- [ ] Mobile features work (gyroscope, shake-to-click)
- [ ] Forms submit properly
- [ ] Images load from Unsplash
- [ ] No console errors
- [ ] PM2 running and saved
- [ ] Client notified with preview link

---

**For questions or issues, check logs:**
```bash
pm2 logs tqd-website
journalctl -u nginx -f
```
