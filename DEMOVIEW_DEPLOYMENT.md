# 🚀 Demoview.space Deployment Checklist

## Pre-Deployment Verification

- [ ] **DNS is pointing to 194.163.135.177**
  - Verify: `nslookup demoview.space` (should resolve to 194.163.135.177)
  - Check both `demoview.space` and `www.demoview.space`

- [ ] **Server is running & accessible**
  - Test SSH: `ssh root@194.163.135.177`
  - Confirm Docker is installed: `docker --version`
  - Confirm Docker Compose is installed: `docker compose version`

- [ ] **Environment files created locally**
  - ✅ `.env.production` — Created with Namecheap SMTP config
  - ✅ `docker-compose.production.yml` — Created (no PostgreSQL)
  - ✅ `deployment/deploy-demoview.ps1` — Updated with correct IP

## Deployment Steps

### Step 1: Create server directory
```powershell
# SSH to server and create app directory
ssh root@194.163.135.177
mkdir -p /var/www/tqd
exit
```

### Step 2: Run the deployment script
```powershell
# From your workspace root
cd c:\xampp\htdocs\tqd
.\deployment\deploy-demoview.ps1
```

This will:
1. Upload nginx.conf
2. Upload next.config.ts
3. Upload .env.production
4. Build and start Docker containers
5. Set up Let's Encrypt SSL certificate

### Step 3: Monitor the deployment

The SSL setup script will:
- Install certbot
- Request SSL certificate for demoview.space and www.demoview.space
- Configure auto-renewal cron job
- Restart nginx with SSL enabled

### Step 4: Test the site

```powershell
# Wait ~5 minutes for DNS propagation and SSL setup
# Then test:
curl https://demoview.space
curl https://www.demoview.space
```

## Post-Deployment

- [ ] **Test contact form**
  - Visit https://demoview.space/contact
  - Send a test message
  - Verify email received at `info@trustqualitydesign.com`

- [ ] **Monitor logs**
  ```bash
  ssh root@194.163.135.177
  docker compose -f /var/www/tqd/docker-compose.production.yml logs -f
  ```

- [ ] **Check SSL certificate**
  ```bash
  # Should be valid for 90 days
  curl -I https://demoview.space
  ```

## Troubleshooting

### Port 80/443 already in use
```bash
ssh root@194.163.135.177
sudo lsof -i :80
sudo lsof -i :443
```

### Docker containers not starting
```bash
ssh root@194.163.135.177
cd /var/www/tqd
docker compose -f docker-compose.production.yml logs
```

### SSL certificate fails
```bash
ssh root@194.163.135.177
bash /tmp/setup-domain-ssl.sh
```

### Contact form not sending emails
Check container logs for SMTP errors:
```bash
docker logs tqd-nginx
docker logs tqd-app
```

## Important Files

- `c:\xampp\htdocs\tqd\.env.production` — SMTP credentials (DO NOT commit to git)
- `c:\xampp\htdocs\tqd\docker-compose.production.yml` — Simplified setup (no database)
- `c:\xampp\htdocs\tqd\nginx.conf` — Reverse proxy & SSL config
- `c:\xampp\htdocs\tqd\deployment\deploy-demoview.ps1` — Main deployment script

## Git Note
**Don't commit `.env.production` to GitHub!** It contains sensitive credentials.

Add to `.gitignore`:
```
.env.production
.env.local
```
