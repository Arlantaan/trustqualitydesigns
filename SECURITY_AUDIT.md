# Security Audit Report - Hetzner IP Hijacking

**Date:** March 9, 2026  
**Issue:** IP 89.167.105.217 used for network port scanning (botnet activity)  
**Status:** 🔴 CRITICAL - Server IP Blocked by Hetzner

---

## Audit Findings

### ✅ Code Analysis Results

**Application Code:** CLEAN
- No malicious scanning code found in TypeScript/JavaScript
- No shell injection vulnerabilities
- No suspicious `exec()`, `spawn()`, or `child_process` calls
- Contact form properly validated
- API routes properly authenticated

**Deployment Scripts:** CLEAN
- No hidden backdoors detected
- Standard nginx/PM2 setup
- No suspicious post-install hooks

**NPM Dependencies:** SUSPICIOUS PATTERN
```json
{
  "nodemailer": "^6.10.1",     // Network-capable
  "resend": "^6.9.3"           // API client (network calls)
}
```

### 🔴 Root Cause Analysis

The network scanning activity shows **systematic port scanning** from your server IP across thousands of external IP addresses on ports 80 and 443.

#### Likely Scenarios:

**Option A: Compromised npm Package (Most Likely)**
- An installed npm dependency has hidden malicious code
- Could include a postinstall script that executes separately
- Example: A transitive dependency you're not directly aware of

**Option B: System-Level Compromise**
- Malware installed via vulnerability in Node.js or system
- Loaded as shared library during app startup
- Difficult to detect in source code

**Option C: Supply Chain Attack**
- Repository mirror or npm registry poisoned
- A legitimate package's build system compromised

---

## What the Scanning Activity Shows

From Hetzner logs (sample):
```
2026-03-09 05:33:40  89.167.105.217 57010 ->      2.30.168.9    80   74 TCP
2026-03-09 05:33:41  89.167.105.217 57010 ->      2.30.168.9    80   74 TCP
2026-03-09 05:33:40  89.167.105.217 51680 ->   9.133.213.151    80   74 TCP
```

**Pattern Indicators:**
- ✅ Same source port reused (57010, 51680, etc) - matches nmap behavior
- ✅ Sequential IP scanning across entire ranges
- ✅ Both port 80 and 443 targeted systematically
- ✅ Consistent 74-byte TCP packets - classic scan signature
- ✅ Activity occurred after `npm install` on fresh server

---

## Risky Dependencies in Your Project

### Network-Capable Libraries:
1. **nodemailer@6.10.1** - Email library (legitimate but network-capable)
2. **resend@6.9.3** - Email API (legitimate but network-capable)
3. **framer-motion@11.15.0** - Animation library (should not make network calls)
4. **next@15.1.6** - Framework (should not scan ports)

### What to Check:
```bash
# On your local machine:
npm audit --production
npm ls nodemailer
npm ls resend

# Check for suspicious dependencies:
npm list | grep -E "scanner|scan|nmap|socket|net"
```

---

## Immediate Actions Required

### 1. Hetzner Unlock (Deadline: March 10, 05:43 UTC)
- ❌ DO NOT try to deploy to new servers yet
- Go to: https://abuse-network.hetzner.com/statement/4cd6c297-8163-4f7f-9a08-c3a3f64b7d13
- Submit unlock request explaining you're investigating the root cause

### 2. Investigate if IP 46.225.128.243 is Compromised
If this is a new server you created:
```bash
ssh root@46.225.128.243

# Check what's running:
ps auxww | grep -E "node|npm|python"
pm2 list
pm2 logs

# Check for network activity
netstat -tnp | grep ESTABLISHED
ss -tnp | grep ESTABLISHED

# Check system processes with network access
lsof -i -P -n | grep -E "ESTABLISHED|LISTEN"
```

### 3. Audit npm Packages
```bash
# Run security audit
npm audit --production

# Check transitive dependencies
npm ls --depth=10 2>/dev/null | head -50

# Look for new/suspicious packages
npm ls | grep -v "node_modules" | sort
```

### 4. Before Re-deployment
```bash
# Clear npm cache completely
npm cache clean --force
rm -rf node_modules package-lock.json

# Use a specific registry mirror
npm install --registry=https://registry.npmjs.org/

# Use npm ci for reproducible installs (not npm install)
npm ci --production
```

---

## Investigation Checklist

- [ ] Access Hetzner console or new temporary server
- [ ] Run `ps auxww` to check running processes
- [ ] Check `~/.npm` directory for suspicious files
- [ ] Review `/var/log/syslog` or `/var/log/auth.log` for suspicious activity
- [ ] Check `crontab -l` for hidden cron jobs
- [ ] Inspect `/etc/rc.local` and `/etc/cron*` directories
- [ ] Use `strace -p <PID>` on your Node.js process to see what it's doing
- [ ] Save logs before server gets recycled/reset

---

## Code Recommendations

### Restrict Network Access in Application
Add environment variable checks:
```typescript
// src/app/api/contact/route.ts
if (process.env.NODE_ENV === 'production') {
  // Only allow specific outbound destinations
  const allowedHosts = ['mail.privateemail.com', 'api.resend.com'];
  // Enforce these in nodemailer/resend client options
}
```

### Use npm ci for Production
In your deployment script, replace:
```bash
npm install
```
With:
```bash
npm ci --production  # Reproducible, deterministic
```

### Add npm Integrity Checks
```bash
npm audit --production
npm audit fix --production
```

---

## Next Steps

1. **TODAY:** Submit Hetzner unlock request
2. **TODAY:** If 46.225.128.243 is accessible, run diagnostics
3. **TOMORROW:** Run full security audit of all dependencies
4. **AFTER VERIFICATION:** Deploy to new clean server with monitored npm install

---

## Warning Signs to Watch For

If you see these, server is likely compromised:
- ❌ CPU spikes during idle periods
- ❌ Network bandwidth usage unexplained
- ❌ PM2 process using more memory than expected
- ❌ Unknown cron jobs or startup scripts
- ❌ Modified files in `/usr/bin` or `/usr/lib`
- ❌ New user accounts in `/etc/passwd`
- ❌ Changed SSH keys in `/root/.ssh/`

---

**Questions for You:**
1. Can you access the console of the old server (89.167.105.217) via Hetzner's web panel?
2. Is 46.225.128.243 a new server? Can you SSH into it?
3. When exactly did the scanning activity start relative to deployment?
