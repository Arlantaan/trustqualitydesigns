# Fresh Server Deployment Guide

Complete guide for deploying TQD Next.js application to a brand new Ubuntu server.

---

## Quick Start

### For a Completely Fresh Server:

1. **Run server setup script** (on the server)
2. **Run deployment script** (from your local machine)

That's it!

---

## Step-by-Step Instructions

### Step 1: Prepare Your Server

SSH into your fresh Ubuntu server:
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Run Server Setup Script

**Option A: Upload and run the script**
```bash
# From your local machine, upload the script
scp deployment/fresh-server-setup.sh root@YOUR_SERVER_IP:/tmp/

# SSH into server
ssh root@YOUR_SERVER_IP

# Run the script
bash /tmp/fresh-server-setup.sh
```

**Option B: Edit and run directly**
1. Edit `deployment/fresh-server-setup.sh`
2. Change `SERVER_IP` to your server IP
3. Upload to server and run

**What it installs:**
- ✅ Node.js 20
- ✅ npm
- ✅ PM2 (process manager)
- ✅ Nginx (reverse proxy)
- ✅ Firewall configuration
- ✅ Application directory structure

### Step 3: Deploy Your Application

**From your local Windows machine:**

1. Edit `deployment/fresh-server-deploy.ps1`
2. Update these values:
   ```powershell
   $SERVER_IP = "YOUR_SERVER_IP"
   $SERVER_USER = "root"  # Usually root
   $APP_NAME = "tqd-website"
   $APP_DIR = "/var/www/tqd"
   ```

3. Run the deployment:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\deployment\fresh-server-deploy.ps1
   ```

**What it does:**
- ✅ Builds your app locally
- ✅ Creates deployment package
- ✅ Uploads to server
- ✅ Installs dependencies
- ✅ Builds on server
- ✅ Starts with PM2
- ✅ Configures everything

---

## Configuration Files

### `fresh-server-setup.sh` Configuration

Edit these variables at the top:
```bash
SERVER_IP="77.42.92.225"           # Your server IP
APP_NAME="tqd-website"              # PM2 process name
APP_DIR="/var/www/tqd"              # Where app lives
DOMAIN=""                            # Optional: your domain
```

### `fresh-server-deploy.ps1` Configuration

Edit these variables at the top:
```powershell
$SERVER_IP = "77.42.92.225"
$SERVER_USER = "root"
$APP_NAME = "tqd-website"
$APP_DIR = "/var/www/tqd"
```

---

## What Gets Installed

### Node.js & npm
- Node.js 20.x LTS
- Latest npm

### PM2
- Process manager for Node.js
- Auto-restart on failure
- Startup script configured

### Nginx
- Reverse proxy configured
- Proxies port 80 → port 3000
- Security headers enabled
- Health check endpoint at `/health`

### Firewall (UFW)
- Port 22 (SSH) - open
- Port 80 (HTTP) - open
- Port 443 (HTTPS) - open
- All other ports - closed

---

## Verification Checklist

After deployment, verify everything:

```bash
# 1. Check PM2 status
pm2 status
# Should show: tqd-website | online

# 2. Check build exists
ls -la /var/www/tqd/.next/BUILD_ID
# Should show the file exists

# 3. Check port 3000
netstat -tlnp | grep :3000
# Should show: tcp ... :::3000 ... LISTEN

# 4. Check nginx
systemctl status nginx
# Should show: active (running)

# 5. Check port 80
netstat -tlnp | grep :80
# Should show: tcp ... :::80 ... LISTEN

# 6. Test locally
curl http://localhost:3000
curl http://localhost
# Both should return HTML

# 7. Test externally
curl http://YOUR_SERVER_IP
# Should return HTML
```

---

## Troubleshooting

### App not starting?

```bash
# Check PM2 logs
pm2 logs tqd-website

# Check if build exists
ls -la /var/www/tqd/.next/BUILD_ID

# Rebuild manually
cd /var/www/tqd
rm -rf .next node_modules
npm install
npm run build
pm2 restart tqd-website
```

### Nginx not working?

```bash
# Check nginx status
systemctl status nginx

# Test nginx config
nginx -t

# Check nginx logs
tail -f /var/log/nginx/tqd-website_error.log

# Verify config exists
cat /etc/nginx/sites-enabled/tqd-website
```

### Port 80 not accessible?

```bash
# Check firewall
ufw status

# Check if port is listening
netstat -tlnp | grep :80

# Check nginx is running
systemctl status nginx
```

---

## Manual Deployment (Alternative)

If scripts don't work, deploy manually:

```bash
# On server
cd /var/www/tqd

# Stop old process
pm2 delete tqd-website 2>/dev/null || true

# Clean
rm -rf .next node_modules package-lock.json

# Install
npm install

# Build
npm run build

# Verify
ls -la .next/BUILD_ID

# Remove dev deps
npm prune --production

# Start
pm2 start npm --name tqd-website -- start
pm2 save

# Check
pm2 status
```

---

## Updating the Application

To update after initial deployment:

1. **Use the deployment script again** - It handles everything
2. **Or manually:**
   ```bash
   cd /var/www/tqd
   git pull  # If using git
   # OR upload new files
   npm install
   npm run build
   pm2 restart tqd-website
   ```

---

## Adding SSL/HTTPS

After deployment, add SSL:

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

---

## Useful Commands

```bash
# PM2
pm2 status                    # Check status
pm2 logs tqd-website          # View logs
pm2 restart tqd-website       # Restart app
pm2 stop tqd-website          # Stop app
pm2 delete tqd-website        # Remove from PM2

# Nginx
nginx -t                      # Test config
systemctl reload nginx        # Reload config
systemctl restart nginx       # Restart nginx
tail -f /var/log/nginx/tqd-website_error.log  # Watch errors

# Application
cd /var/www/tqd              # Go to app directory
npm run build                # Rebuild
npm run start                # Start manually (for testing)
```

---

## File Structure

After setup, your server will have:

```
/var/www/tqd/                 # Application directory
├── package.json
├── package-lock.json
├── next.config.ts
├── src/                      # Source code
├── public/                   # Static files
├── .next/                    # Build output (created after build)
└── node_modules/             # Dependencies

/etc/nginx/sites-available/tqd-website  # Nginx config
/etc/nginx/sites-enabled/tqd-website    # Enabled config (symlink)

/root/.pm2/                   # PM2 data
└── dump.pm2                  # Saved processes
```

---

## Security Notes

- ✅ Firewall configured (only ports 22, 80, 443 open)
- ✅ Nginx security headers enabled
- ✅ App runs as non-root user (PM2)
- ⚠️ Consider setting up fail2ban for SSH protection
- ⚠️ Consider using SSH keys instead of passwords
- ⚠️ Keep system updated: `apt update && apt upgrade`

---

## Support

If something goes wrong:

1. Check the troubleshooting section above
2. Review `DEPLOYMENT_TROUBLESHOOTING.md` for common issues
3. Check logs:
   - PM2: `pm2 logs tqd-website`
   - Nginx: `tail -f /var/log/nginx/tqd-website_error.log`
   - System: `journalctl -xe`

---

**Last Updated:** February 20, 2026  
**Tested on:** Ubuntu 24.04 LTS
