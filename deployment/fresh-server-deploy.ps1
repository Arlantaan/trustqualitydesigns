# ============================================
# Fresh Server Deployment Script
# Deploys TQD Next.js app to a fresh server
# ============================================
#
# USAGE:
#   1. Edit CONFIGURATION section below
#   2. Run: powershell -ExecutionPolicy Bypass -File .\fresh-server-deploy.ps1
#
# PREREQUISITES:
#   - Server must have fresh-server-setup.sh already run
#   - You must have SSH access to the server
# ============================================

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
$SERVER_IP = "194.163.135.177"         # Your server IP address
$SERVER_USER = "root"                  # SSH username
$APP_NAME = "tqd-app"                  # PM2 process name (matches ecosystem.config.js)
$APP_DIR = "/var/www/tqd"              # Application directory on server
$DOMAIN = "demoview.space"             # Primary domain for nginx server_name
$CERTBOT_EMAIL = "info@trustqualitydesign.com"

# ============================================
# Script starts here - Don't edit below
# ============================================

$SERVER = "${SERVER_USER}@${SERVER_IP}"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fresh Server Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER" -ForegroundColor Yellow
Write-Host "App Directory: $APP_DIR" -ForegroundColor Yellow
Write-Host ""
Write-Host "You will be prompted for the server password." -ForegroundColor Gray
Write-Host ""

# Ensure we're in the project root directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "Working directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# ============================================
# Step 0: Bootstrap server (idempotent)
# ============================================
Write-Host "[0/7] Bootstrapping server dependencies..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

$bootstrapScript = @'
set -e
export DEBIAN_FRONTEND=noninteractive

apt update

# Core tools and nginx
apt install -y curl ca-certificates gnupg apt-transport-https nginx ufw

# Node.js 20
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

# PM2
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
  pm2 startup systemd -u root --hp /root || true
fi

# Ensure app directory exists
mkdir -p __APP_DIR__

# Minimal nginx reverse proxy config
cat > /etc/nginx/sites-available/__APP_NAME__ <<'EOF'
limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;
server {
    listen 80;
    listen [::]:80;
    server_name __DOMAIN__ www.__DOMAIN__;

    access_log /var/log/nginx/__APP_NAME___access.log;
    error_log /var/log/nginx/__APP_NAME___error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req zone=perip burst=20 nodelay;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1024;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Nginx logrotate
cat > /etc/logrotate.d/__APP_NAME__ <<'EOF'
/var/log/nginx/__APP_NAME___access.log /var/log/nginx/__APP_NAME___error.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx >/dev/null 2>&1 || true
    endscript
}
EOF

# Wipe any stale enabled sites, then activate only ours
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/__APP_NAME__ /etc/nginx/sites-enabled/__APP_NAME__
nginx -t
systemctl enable nginx
systemctl restart nginx

# Firewall (safe if already enabled)
ufw --force enable || true
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw status || true
'@
$bootstrapScript = $bootstrapScript.
    Replace("__APP_DIR__", $APP_DIR).
    Replace("__APP_NAME__", $APP_NAME).
    Replace("__DOMAIN__", $DOMAIN).
    Replace("__SERVER_IP__", $SERVER_IP)

$bootstrapScript = $bootstrapScript -replace "`r", ""

# Write to temp file with LF endings (piping via PowerShell re-introduces CRLF)
$bootstrapTmp = [System.IO.Path]::GetTempFileName() + ".sh"
[System.IO.File]::WriteAllText($bootstrapTmp, $bootstrapScript, $utf8NoBom)
try {
    scp $bootstrapTmp "${SERVER}:/tmp/tqd-bootstrap.sh"
    ssh $SERVER "bash /tmp/tqd-bootstrap.sh && rm -f /tmp/tqd-bootstrap.sh"
} finally {
    Remove-Item $bootstrapTmp -ErrorAction SilentlyContinue
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Server bootstrap failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Server bootstrap complete!" -ForegroundColor Green
Write-Host ""

# ============================================
# Step 1: Build locally
# ============================================
Write-Host "[1/7] Building application locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# ============================================
# Step 2: Create deployment package
# ============================================
Write-Host "[2/7] Creating deployment package..." -ForegroundColor Yellow

# Clean up old package
if (Test-Path "tqd-deploy.tar.gz") {
    Remove-Item "tqd-deploy.tar.gz"
}

# Create archive (excluding dev files and .next since we rebuild on server)
$packageItems = @(
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "middleware.ts",
    "public",
    "src",
    "README.md",
    "tailwind.config.js",
    "postcss.config.js"
)

# Include env files only if they exist
if (Test-Path ".env.production") { $packageItems += ".env.production" }
if (Test-Path ".env") { $packageItems += ".env" }

$tarArgs = @(
    "-czf", "tqd-deploy.tar.gz",
    "--exclude=node_modules",
    "--exclude=.git",
    "--exclude=*.log",
    "--exclude=.env.local",
    "--exclude=deployment",
    "--exclude=tqd-deploy.tar.gz",
    "--exclude=.next"
) + $packageItems

& tar @tarArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create package!" -ForegroundColor Red
    exit 1
}

Write-Host "Package created!" -ForegroundColor Green
Write-Host ""

# ============================================
# Step 3: Verify package contents
# ============================================
Write-Host "[3/7] Verifying package contents..." -ForegroundColor Yellow
tar -tzf tqd-deploy.tar.gz | Select-Object -First 10
Write-Host "... (showing first 10 files)" -ForegroundColor Gray
Write-Host ""

# ============================================
# Step 4: Stop old application
# ============================================
Write-Host "[4/7] Stopping old application on server..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER "pm2 delete $APP_NAME 2>/dev/null || true; pm2 save"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not stop old app (may not exist)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# Step 5: Clean server directory
# ============================================
Write-Host "[5/7] Cleaning server directory..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
set -e
mkdir -p /var/backups/tqd
if [ -d "$APP_DIR" ] && [ -n "\$(ls -A $APP_DIR 2>/dev/null)" ]; then
  ts=\$(date +%Y%m%d-%H%M%S)
  tar -czf /var/backups/tqd/${APP_NAME}-\${ts}.tar.gz -C $APP_DIR .
  ls -1t /var/backups/tqd/${APP_NAME}-*.tar.gz | tail -n +6 | xargs -r rm -f
fi
rm -rf $APP_DIR/*
mkdir -p $APP_DIR
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to clean server!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "Server cleaned!" -ForegroundColor Green
Write-Host ""

# ============================================
# Step 6: Upload package
# ============================================
Write-Host "[6/7] Uploading package to server..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

scp tqd-deploy.tar.gz "${SERVER}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "Upload complete!" -ForegroundColor Green
Write-Host ""

# ============================================
# Step 7: Extract and deploy
# ============================================
Write-Host "[7/7] Installing and starting application..." -ForegroundColor Yellow
Write-Host "This will take 2-3 minutes. Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

$remoteDeployScript = @"
set -e
cd $APP_DIR

echo 'Extracting files...'
tar -xzf /tmp/tqd-deploy.tar.gz
rm /tmp/tqd-deploy.tar.gz
echo 'Files extracted!'

echo ''
echo 'Cleaning old build...'
rm -rf .next
echo 'Old build cleaned!'

echo ''
echo 'Installing dependencies (including dev dependencies for build)...'
npm install
echo 'Dependencies installed!'

echo ''
echo 'Building application...'
npm run build

# Verify build exists
if [ ! -d '.next' ] || [ ! -f '.next/BUILD_ID' ]; then
    echo 'ERROR: Build verification failed! .next directory or BUILD_ID missing!'
    exit 1
fi
echo 'Build complete and verified!'

echo ''
echo 'Removing dev dependencies to save space...'
npm prune --production
echo 'Dev dependencies removed!'

echo ''
echo 'Starting with PM2 (ecosystem config)...'
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js --env production

echo 'Configuring PM2 startup and log rotation...'
pm2 startup systemd -u root --hp /root || true
pm2 save
pm2 install pm2-logrotate || true
pm2 set pm2-logrotate:max_size 10M || true
pm2 set pm2-logrotate:retain 10 || true
pm2 set pm2-logrotate:compress true || true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss || true

echo 'Installing health check watchdog...'
cat > /usr/local/bin/tqd-healthcheck.sh <<'HC'
#!/usr/bin/env bash
set -e
if ! curl -fsS http://127.0.0.1:3000/api/health >/dev/null; then
  pm2 restart __APP_NAME__ || true
  systemctl reload nginx || true
fi
HC
sed -i "s/__APP_NAME__/$APP_NAME/g" /usr/local/bin/tqd-healthcheck.sh
chmod +x /usr/local/bin/tqd-healthcheck.sh
(crontab -l 2>/dev/null | grep -v tqd-healthcheck || true; echo "*/5 * * * * /usr/local/bin/tqd-healthcheck.sh >/var/log/tqd-healthcheck.log 2>&1") | crontab -

echo ''
echo '==================================='
echo 'Deployment Complete!'
echo '==================================='
echo ''
echo 'PM2 Status:'
pm2 list
"@

# Write to temp file with LF endings (piping via PowerShell re-introduces CRLF)
$remoteDeployScript = $remoteDeployScript -replace "`r", ""
$deployTmp = [System.IO.Path]::GetTempFileName() + ".sh"
[System.IO.File]::WriteAllText($deployTmp, $remoteDeployScript, $utf8NoBom)
try {
    scp $deployTmp "${SERVER}:/tmp/tqd-deploy-run.sh"
    ssh $SERVER "bash /tmp/tqd-deploy-run.sh && rm -f /tmp/tqd-deploy-run.sh"
} finally {
    Remove-Item $deployTmp -ErrorAction SilentlyContinue
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

# Cleanup
Remove-Item "tqd-deploy.tar.gz"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website is now live at:" -ForegroundColor White
Write-Host "  http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Step 8: SSL certificate via Let's Encrypt
# ============================================
if ($DOMAIN -ne "") {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   SSL Setup (Let's Encrypt)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Checking if DNS for '$DOMAIN' points to this server ($SERVER_IP)..." -ForegroundColor Yellow

    try {
        $resolvedIP = (Resolve-DnsName $DOMAIN -Type A -Server 8.8.8.8 -ErrorAction Stop |
                       Where-Object { $_.IPAddress } |
                       Select-Object -First 1).IPAddress
    } catch {
        $resolvedIP = ""
    }

    Write-Host "  $DOMAIN resolves to: $resolvedIP" -ForegroundColor Gray

    if ($resolvedIP -eq $SERVER_IP) {
        Write-Host "  DNS is correct - requesting certificate..." -ForegroundColor Green
        Write-Host ""

        $certbotScript = @'
set -e
EMAIL="__EMAIL__"
DOMAIN="__DOMAIN__"

# Install certbot + nginx plugin
if ! command -v certbot >/dev/null 2>&1; then
  apt install -y certbot python3-certbot-nginx
fi

# Issue certificate (certbot --nginx modifies nginx config automatically)
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --redirect

# Auto-renewal cron (runs twice daily as recommended by Let's Encrypt)
(crontab -l 2>/dev/null | grep -v certbot; echo "0 3,15 * * * certbot renew --quiet --nginx") | crontab -

echo ""
echo "SSL certificate installed!"
echo "Site is now live at: https://$DOMAIN"
'@
        $certbotScript = $certbotScript.
            Replace("__EMAIL__", $CERTBOT_EMAIL).
            Replace("__DOMAIN__", $DOMAIN)

        $certbotScript = $certbotScript -replace "`r", ""
        $sslTmp = [System.IO.Path]::GetTempFileName() + ".sh"
        [System.IO.File]::WriteAllText($sslTmp, $certbotScript, $utf8NoBom)
        try {
            scp $sslTmp "${SERVER}:/tmp/tqd-ssl.sh"
            ssh $SERVER "bash /tmp/tqd-ssl.sh && rm -f /tmp/tqd-ssl.sh"
        } finally {
            Remove-Item $sslTmp -ErrorAction SilentlyContinue
        }

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "  HTTPS is live at: https://$DOMAIN" -ForegroundColor Green
        } else {
            Write-Host "  SSL setup failed - site still works over HTTP." -ForegroundColor Yellow
            Write-Host "  Re-run SSL manually after fixing DNS:" -ForegroundColor Yellow
            Write-Host "    ssh $SERVER" -ForegroundColor Gray
            Write-Host "    certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "  DNS not pointing here yet (got: $resolvedIP, need: $SERVER_IP)" -ForegroundColor Yellow
        Write-Host "  Skipping SSL - run this after DNS propagates:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "    ssh $SERVER" -ForegroundColor Gray
        Write-Host "    certbot --nginx --non-interactive --agree-tos --email $CERTBOT_EMAIL -d $DOMAIN -d www.$DOMAIN --redirect" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SERVER" -ForegroundColor Gray
Write-Host "  pm2 logs $APP_NAME" -ForegroundColor Gray
Write-Host "  pm2 restart $APP_NAME" -ForegroundColor Gray
Write-Host "  pm2 list" -ForegroundColor Gray
Write-Host "  certbot renew --dry-run  (test auto-renewal)" -ForegroundColor Gray
Write-Host ""
