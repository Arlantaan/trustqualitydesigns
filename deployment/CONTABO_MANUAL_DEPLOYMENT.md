# Contabo Manual Deployment Guide

## Quick Setup (Step by Step)

### Step 1: SSH into Contabo Server
Open PowerShell and connect:

```powershell
ssh root@194.163.135.177
```

Enter your Contabo password when prompted.

### Step 2: Run Server Setup Script
Once logged in, run this one command:

```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/contabo-server-setup.sh | bash
```

**OR** upload and run locally:

```bash
# From your local PowerShell (before SSH):
scp deployment/contabo-server-setup.sh root@194.163.135.177:/tmp/
```

```bash
# Then on the server (after SSH):
bash /tmp/contabo-server-setup.sh
```

⏱️ **Wait 10-15 minutes for setup to complete**

### Step 3: Upload Your Application

From your local machine (PowerShell):

```powershell
cd c:\xampp\htdocs\tqd

# Create deployment folder
mkdir _deploy

# Copy files (excluding node_modules, .git, etc)
Get-ChildItem -Path . -Recurse -Exclude node_modules, .git, .next, .env* |
  ForEach-Object { 
    $target = "_deploy\" + $_.FullName.Substring($pwd.Path.Length + 1)
    if ($_.PSIsContainer) { 
      mkdir $target -Force -EA 0 > $null
    } else { 
      Copy-Item $_.FullName $target -Force
    }
  }

# Create tar.gz archive
tar -czf tqd-deploy.tar.gz -C _deploy .

# Upload to server
scp tqd-deploy.tar.gz root@194.163.135.177:/var/www/tqd/
```

### Step 4: Deploy on Server

SSH back into the server:

```powershell
ssh root@194.163.135.177
```

Then run these commands on the server:

```bash
cd /var/www/tqd

# Stop current app
pm2 delete tqd-website 2>/dev/null || true

# Extract uploaded files
tar -xzf tqd-deploy.tar.gz

# Install verified dependencies (npm ci = clean install with lockfile)
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name tqd-website -- start
pm2 save

# Check health
sleep 3
curl http://127.0.0.1:3000/health
```

Expected output: `healthy`

### Step 5: Setup SSL Certificate

Still on the server:

```bash
certbot --nginx -d demoview.space

# When prompted:
# - Enter your email
# - Agree to terms (Y)
```

### Step 6: Verify Deployment

```bash
# Check processes
pm2 list

# Check logs
pm2 logs tqd-website --lines 20

# Check for abuse
check-abuse.sh
```

### Step 7: Access Your Site

Open browser:
- **HTTPS**: https://demoview.space ✅ SSL enabled
- **HTTP**: http://demoview.space (redirects to HTTPS)

---

## Troubleshooting

### SSH Connection Issues

**If SSH doesn't work:**

1. **Check if SSH is installed (Windows 10+):**
```powershell
ssh -V
```

2. **If not installed, use PuTTY instead:**
   - Download: https://www.putty.org/
   - Host: 194.163.135.177
   - Username: root
   - Password: (your Contabo password)

3. **Or use Contabo VNC:** Log into Contabo control panel → VNC console

### npm ci Fails

If you get npm errors during deployment:

```bash
# Clear npm cache
npm cache clean --force

# Try again
npm ci --production
```

### Certbot SSL Fails

**If DNS isn't propagated yet, wait 30 minutes and retry:**

```bash
certbot --nginx -d demoview.space
```

Or use manual SSL setup:

```bash
certbot certonly --standalone -d demoview.space
```

---

## Monitoring

After deployment, regularly check:

```bash
# Check running processes
pm2 list

# Monitor logs in real-time
pm2 logs tqd-website

# Check for suspicious network activity
check-abuse.sh

# View nginx access logs
tail -f /var/log/nginx/tqd-website_access.log

# Check firewall status
ufw status
```

---

## Quick Commands Reference

```bash
# Process management
pm2 restart tqd-website
pm2 stop tqd-website
pm2 delete tqd-website
pm2 logs tqd-website

# SSL/HTTPS
certbot renew
certbot certificates

# Firewall
ufw status
ufw allow 22
ufw allow 80
ufw allow 443

# System monitoring
free -h
df -h /
top -b -n 1 | head -20

# Network activity
netstat -tlnp
ss -tnp | grep LISTEN
```

---

## Done!

Your TQD website is now deployed on Contabo with:
- ✅ Security hardening (rate limiting, fail2ban)
- ✅ Verified npm packages (npm ci)
- ✅ SSL certificate (Let's Encrypt)
- ✅ Abuse monitoring tools
- ✅ PM2 process management

**Next: Send Hetzner proof of clean deployment** by providing:
- Server logs showing no network scanning
- npm audit results
- Description of security improvements
