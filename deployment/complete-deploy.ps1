# ============================================
# Complete Deployment Script
# One script to rule them all - Setup server AND deploy app
# ============================================
#
# USAGE:
#   1. Edit CONFIGURATION section below
#   2. Run: powershell -ExecutionPolicy Bypass -File .\deployment\complete-deploy.ps1
#
# This script will:
#   - Setup fresh server (Node.js, PM2, Nginx, Firewall)
#   - Build your app locally
#   - Deploy to server
# ============================================

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
$SERVER_IP = "46.225.213.161"         # Your server IP address
$SERVER_USER = "root"                  # SSH username
$APP_NAME = "tqd-website"              # PM2 process name
$APP_DIR = "/var/www/tqd"              # Application directory on server
$DOMAIN = ""                            # Optional: your domain name (leave empty for IP only)
$SKIP_SERVER_SETUP = $false            # Set to $true if server is already set up

# ============================================
# Script starts here - Don't edit below
# ============================================

$SERVER = "${SERVER_USER}@${SERVER_IP}"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Complete Server Setup & Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER" -ForegroundColor Yellow
Write-Host "App Directory: $APP_DIR" -ForegroundColor Yellow
Write-Host ""
Write-Host "You will be prompted for the server password multiple times." -ForegroundColor Gray
Write-Host ""

# Ensure we're in the project root directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "Working directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# ============================================
# PART 1: Server Setup (if needed)
# ============================================

if (-not $SKIP_SERVER_SETUP) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "PART 1: Setting up server..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "This will install:" -ForegroundColor Yellow
    Write-Host "  - Node.js 20" -ForegroundColor Gray
    Write-Host "  - PM2" -ForegroundColor Gray
    Write-Host "  - Nginx" -ForegroundColor Gray
    Write-Host "  - Firewall configuration" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Enter your password when prompted:" -ForegroundColor Gray
    Write-Host ""

    # Determine server_name for nginx
    if ([string]::IsNullOrWhiteSpace($DOMAIN)) {
        $SERVER_NAME = "$SERVER_IP _"
    } else {
        $SERVER_NAME = "$DOMAIN $SERVER_IP"
    }

    ssh -o StrictHostKeyChecking=accept-new $SERVER @"
set -e

echo '========================================'
echo 'Step 1: Updating system packages'
echo '========================================'
apt update
apt upgrade -y

echo ''
echo '========================================'
echo 'Step 2: Installing Node.js 20'
echo '========================================'
if command -v node &> /dev/null; then
    echo "Node.js already installed: `$(node --version)"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "Node.js: `$(node --version)"
echo "npm: `$(npm --version)"

echo ''
echo '========================================'
echo 'Step 3: Installing PM2'
echo '========================================'
if command -v pm2 &> /dev/null; then
    echo "PM2 already installed: `$(pm2 --version)"
else
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
fi
echo "PM2: `$(pm2 --version)"

echo ''
echo '========================================'
echo 'Step 4: Installing Nginx'
echo '========================================'
if systemctl is-active --quiet nginx; then
    echo "Nginx is already installed and running"
else
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

echo ''
echo '========================================'
echo 'Step 5: Configuring firewall'
echo '========================================'
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw status
else
    echo "UFW not installed, skipping firewall setup"
fi

echo ''
echo '========================================'
echo 'Step 6: Creating application directory'
echo '========================================'
mkdir -p $APP_DIR
chown -R root:root $APP_DIR
echo "Directory created: $APP_DIR"

echo ''
echo '========================================'
echo 'Step 7: Configuring Nginx'
echo '========================================'
cat > /etc/nginx/sites-available/$APP_NAME <<'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME
rm -f /etc/nginx/sites-enabled/default

if nginx -t; then
    systemctl reload nginx
    echo "Nginx configured successfully"
else
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo ''
echo '========================================'
echo 'Server Setup Complete!'
echo '========================================'
echo "Node.js: `$(node --version)"
echo "npm: `$(npm --version)"
echo "PM2: `$(pm2 --version)"
echo "Nginx: `$(nginx -v 2>&1)"
echo "App Directory: $APP_DIR"
echo "Server IP: $SERVER_IP"
"@

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Server setup failed!" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Server setup complete!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Skipping server setup (SKIP_SERVER_SETUP = true)" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================
# PART 2: Build Application Locally
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 2: Building application locally..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# ============================================
# PART 3: Create Deployment Package
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 3: Creating deployment package..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Clean up old package
if (Test-Path "tqd-deploy.tar.gz") {
    Remove-Item "tqd-deploy.tar.gz"
}

# Create archive (excluding dev files and .next since we rebuild on server)
tar -czf tqd-deploy.tar.gz `
    package.json `
    package-lock.json `
    next.config.ts `
    tsconfig.json `
    middleware.ts `
    public `
    src `
    types `
    utils `
    README.md `
    tailwind.config.js `
    postcss.config.js `
    .env.production `
    .env `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env.local' `
    --exclude='deployment' `
    --exclude='tqd-deploy.tar.gz' `
    --exclude='.next'

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create package!" -ForegroundColor Red
    exit 1
}

Write-Host "Package created!" -ForegroundColor Green
Write-Host ""

# Verify package contents
Write-Host "Verifying package contents..." -ForegroundColor Gray
tar -tzf tqd-deploy.tar.gz | Select-Object -First 10
Write-Host "... (showing first 10 files)" -ForegroundColor Gray
Write-Host ""

# ============================================
# PART 4: Stop Old Application
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 4: Stopping old application..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh -o StrictHostKeyChecking=accept-new $SERVER "pm2 delete $APP_NAME 2>/dev/null || true; pm2 save"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not stop old app (may not exist)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# PART 5: Clean Server Directory
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 5: Cleaning server directory..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh -o StrictHostKeyChecking=accept-new $SERVER "rm -rf $APP_DIR/*; mkdir -p $APP_DIR"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to clean server!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "Server cleaned!" -ForegroundColor Green
Write-Host ""

# ============================================
# PART 6: Upload Package
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 6: Uploading package..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

scp -o StrictHostKeyChecking=accept-new tqd-deploy.tar.gz "${SERVER}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "Upload complete!" -ForegroundColor Green
Write-Host ""

# ============================================
# PART 7: Extract and Deploy
# ============================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "PART 7: Installing and starting app..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "This will take 2-3 minutes. Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh -o StrictHostKeyChecking=accept-new $SERVER @"
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
if [ $? -ne 0 ]; then
    echo 'ERROR: npm install failed!'
    exit 1
fi
echo 'Dependencies installed!'

echo ''
echo 'Building application...'
npm run build
if [ $? -ne 0 ]; then
    echo 'ERROR: Build failed!'
    exit 1
fi

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
echo 'Starting with PM2...'
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name $APP_NAME -- start
if [ $? -ne 0 ]; then
    echo 'ERROR: PM2 start failed!'
    exit 1
fi
pm2 save

echo ''
echo '==================================='
echo 'Deployment Complete!'
echo '==================================='
echo ''
echo 'PM2 Status:'
pm2 status
echo ''
echo 'Recent Logs:'
sleep 3
pm2 logs $APP_NAME --lines 10 --nostream
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

# Cleanup
Remove-Item "tqd-deploy.tar.gz"

# ============================================
# Success!
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website is now live at:" -ForegroundColor White
if (-not [string]::IsNullOrWhiteSpace($DOMAIN)) {
    Write-Host "  http://$DOMAIN" -ForegroundColor Cyan
}
Write-Host "  http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SERVER" -ForegroundColor Gray
Write-Host "  pm2 logs $APP_NAME" -ForegroundColor Gray
Write-Host "  pm2 restart $APP_NAME" -ForegroundColor Gray
Write-Host "  pm2 status" -ForegroundColor Gray
Write-Host "  nginx -t" -ForegroundColor Gray
Write-Host ""
