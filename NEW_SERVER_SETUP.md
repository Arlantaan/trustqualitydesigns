# 🔒 New Server Security Setup

## ✅ What's Been Updated

### 1. **All Deployment Scripts Updated**
- Old IP: `46.225.69.136` → New IP: `91.98.203.172`
- New password updated in DEPLOYMENT.md
- All PowerShell and Bash scripts updated

### 2. **Security Features Added**
To prevent future abuse flags from Hetzner:

#### **Authentication Middleware** (Optional)
- File: `middleware.ts`
- Protects your demo with a password
- To enable: Set `DEMO_PASSWORD` environment variable on server
- Example: `export DEMO_PASSWORD="Demo@123"`
- Share access link with client: `http://91.98.203.172?auth=Demo@123`

#### **Rate Limiting**
- Prevents aggressive traffic patterns
- General pages: 5 requests/second
- API endpoints: 10 requests/second
- Configured in nginx

#### **Robots.txt**
- File: `public/robots.txt`
- Blocks aggressive crawlers
- Prevents security scanners from flagging site

#### **Enhanced Security Headers**
- X-Frame-Options: Prevents clickjacking
- X-Robots-Tag: Prevents indexing of demo
- Permissions-Policy: Restricts sensor access
- Rate limiting on all routes

## 🚀 Quick Deployment Steps

### Step 1: Setup New Server
```powershell
# From your local machine, run:
ssh root@91.98.203.172
# Password: jV9WtJUvjqbXEk9fhpem
```

### Step 2: Upload and Run Server Setup
```bash
# From local machine:
scp deployment/server-setup.sh root@91.98.203.172:/tmp/

# On server:
ssh root@91.98.203.172
bash /tmp/server-setup.sh
```

This will:
- Install Node.js, nginx, PM2, fail2ban
- Configure firewall (UFW)
- Setup nginx with security headers and rate limiting
- Create application directory

### Step 3: Deploy Your Application

**Option A: Quick Deploy (Recommended)**
```powershell
# From your local machine:
cd c:\xampp\htdocs\tqd
.\deployment\quick-deploy.ps1
```

**Option B: Clean Deploy**
```powershell
.\deployment\clean-and-deploy.ps1
```

### Step 4: Optional - Enable Demo Password Protection
```bash
# On server:
ssh root@91.98.203.172

# Create .env file
cd /var/www/tqd
echo "DEMO_PASSWORD=Demo@123" > .env.production.local

# Restart application
pm2 restart tqd-website
```

Then share with client: `http://91.98.203.172?auth=Demo@123`

## 🛡️ Abuse Prevention Tips

1. **Use Password Protection** - Enable DEMO_PASSWORD for limited access
2. **Share Privately** - Send credentials via email/Slack, not public
3. **Monitor Access** - Check nginx logs: `tail -f /var/log/nginx/access.log`
4. **Limited Duration** - Keep demo active only when needed
5. **Clear Purpose** - Label clearly as "Demo" or "Preview" in communications

## 📊 Monitoring Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs tqd-website

# Check nginx access logs
tail -f /var/log/nginx/access.log

# Check rate limiting
grep "limiting requests" /var/log/nginx/error.log

# Check fail2ban status
fail2ban-client status
```

## 🆘 If You Get Blocked Again

### Hetzner Response Template:
```
Subject: Abuse Report - Legitimate Business Demo

Dear Hetzner Support,

I received an abuse notification for IP 91.98.203.172.

This server hosts a legitimate business demonstration website for 
Trust Quality Designs (TQD), a branding and signage company.

Purpose: Client preview of web development project
Access: Password-protected demo (limited access)
Activity: Normal web traffic from authorized client viewers

Could you please:
1. Provide specific details of the abuse report
2. Whitelist this server for legitimate business use
3. Advise on any additional compliance requirements

I have implemented:
- Rate limiting (5 req/s)
- Password authentication
- Robots.txt blocking crawlers
- Enhanced security headers
- Fail2ban for intrusion prevention

Thank you for your assistance.

Best regards,
[Your Name]
```

## 📝 Server Credentials

**Server:** ubuntu-4gb-nbg1-1
**IPv4:** 91.98.203.172
**IPv6:** 2a01:4f8:c2c:3eb7::/64
**User:** root
**Password:** jV9WtJUvjqbXEk9fhpem

⚠️ **Security Reminder:** Change the root password after first login:
```bash
passwd
```

## 🔗 Access URLs

**Public (no password):** http://91.98.203.172
**Protected (with password):** http://91.98.203.172?auth=Demo@123

Choose the protection level based on your needs!
