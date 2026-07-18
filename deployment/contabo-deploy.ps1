param()

<#
.SYNOPSIS
    Deploys TQD application to Contabo with security hardening
    
.DESCRIPTION
    - Uses npm ci (not npm install) for verified, locked dependencies
    - Runs npm audit to check for vulnerabilities
    - Deploys verified codebase
    - Sets up PM2 process management
    - Configures SSL certificate
#>

$ServerIP = "194.163.135.177"
$ServerUser = "root"
$AppName = "tqd-website"
$AppDir = "/var/www/tqd"
$Domain = "demoview.space"

$ErrorActionPreference = "Stop"

function Write-Status {
    param([string]$Message, [string]$Status = "INFO")
    $color = @{
        "INFO"    = "Cyan"
        "SUCCESS" = "Green"
        "WARNING" = "Yellow"
        "ERROR"   = "Red"
    }
    Write-Host "[$Status] $Message" -ForegroundColor $color[$Status]
}

# ============================================
# Step 1: Verify package-lock.json exists
# ============================================
Write-Status "Verifying npm package lock file..." "INFO"

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$packageLock = Join-Path $projectRoot "package-lock.json"

if (-not (Test-Path $packageLock)) {
    Write-Status "ERROR: package-lock.json not found at $projectRoot" "ERROR"
    Write-Status "This file is REQUIRED for secure deployment (npm ci)" "ERROR"
    exit 1
}

Write-Status "✓ package-lock.json found" "SUCCESS"

# ============================================
# Step 2: Run local npm audit
# ============================================
Write-Status "Running npm security audit..." "INFO"

Push-Location $projectRoot

# Run npm audit
$auditOutput = npm audit --production 2>&1
Write-Host $auditOutput

# Check for critical vulnerabilities
if ($auditOutput -match "critical") {
    Write-Status "CRITICAL vulnerabilities found! Review above." "ERROR"
    Write-Status "Remove affected packages before deploying." "ERROR"
    exit 1
}

Pop-Location

Write-Status "✓ Security audit passed" "SUCCESS"

# ============================================
# Step 3: Prepare deployment package
# ============================================
Write-Status "Preparing deployment package..." "INFO"

$deployDir = Join-Path $projectRoot "_deployment"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy application files (excluding node_modules, .git, .next, etc)
Write-Status "Copying application files..." "INFO"

$excludePatterns = @(
    "node_modules",
    ".git",
    ".next",
    "build",
    ".env",
    ".env.local",
    ".env.*.local",
    "dist",
    "coverage",
    ".DS_Store",
    "*.log",
    "deployment/_deployment"
)

$files = Get-ChildItem -Path $projectRoot -Recurse -File | 
    Where-Object {
        $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
        -not ($excludePatterns | Where-Object { $relativePath -match $_ })
    }

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($projectRoot.Length + 1)
    $targetPath = Join-Path $deployDir $relativePath
    $targetDir = Split-Path -Parent $targetPath
    
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    Copy-Item -Path $file.FullName -Destination $targetPath
}

Write-Status "Application files prepared" "SUCCESS"

# ============================================
# Step 4: Create archive for upload
# ============================================
Write-Status "Creating deployment archive..." "INFO"

$archivePath = Join-Path $projectRoot "tqd-deploy.tar.gz"
if (Test-Path $archivePath) {
    Remove-Item $archivePath
}

# Use tar command (PowerShell 7+) or WSL
$tarAvailable = $false
try {
    tar --version | Out-Null
    $tarAvailable = $true
}
catch {
    Write-Status "tar command not found, trying alternative method..." "WARNING"
}

if ($tarAvailable) {
    tar -czf $archivePath -C $deployDir .
    Write-Status "Archive created: $archivePath" "SUCCESS"
}
else {
    Write-Status "ERROR: tar command required for deployment" "ERROR"
    Write-Status "Install Windows Subsystem for Linux (WSL) or use native tar (Win 10+)" "ERROR"
    exit 1
}

# ============================================
# Step 5: Upload to server
# ============================================
Write-Status "Uploading to $ServerUser@$ServerIP..." "INFO"
scp -o StrictHostKeyChecking=accept-new $archivePath "${ServerUser}@${ServerIP}:${AppDir}/app-latest.tar.gz"
Write-Status "Upload complete" "SUCCESS"

# ============================================
# Step 6: Deploy on server
# ============================================
Write-Status "Deploying on remote server..." "INFO"

$deployScript = @"
#!/bin/bash
set -e

APP_NAME="$AppName"
APP_DIR="$AppDir"
DOMAIN="$Domain"

echo "[DEPLOY] Starting deployment to \$APP_DIR"

# Stop current application
pm2 delete \$APP_NAME 2>/dev/null || true

# Backup current version if exists
if [ -d "\$APP_DIR/current" ]; then
    echo "[DEPLOY] Backing up current version..."
    rm -rf "\$APP_DIR/backups/\$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
    mkdir -p "\$APP_DIR/backups"
    mv "\$APP_DIR/current" "\$APP_DIR/backups/\$(date +%Y%m%d-%H%M%S)"
fi

# Extract new version
echo "[DEPLOY] Extracting application..."
mkdir -p "\$APP_DIR/current"
cd "\$APP_DIR/current"
tar -xzf "\$APP_DIR/app-latest.tar.gz"

# Install dependencies using npm ci (verified lockfile)
echo "[DEPLOY] Installing verified dependencies..."
npm ci --production

# Build application
echo "[DEPLOY] Building application..."
npm run build

# Set environment
if [ ! -f ".env.production.local" ] && [ -f "\$APP_DIR/.env.production.local" ]; then
    cp "\$APP_DIR/.env.production.local" .env.production.local
fi

# Start PM2 process
echo "[DEPLOY] Starting PM2 process..."
pm2 start npm --name "\$APP_NAME" --exp-backoff-restart-delay=100 -- start
pm2 save
pm2 restart \$APP_NAME

# Wait for startup
sleep 3

# Check health
echo "[DEPLOY] Checking application health..."
if curl -s http://127.0.0.1:3000/health | grep -q "healthy"; then
    echo "[DEPLOY] ✓ Application is healthy"
else
    echo "[DEPLOY] ✗ Application health check failed"
    pm2 logs \$APP_NAME --lines 20
    exit 1
fi

# Setup SSL if needed
if [ ! -f "/etc/letsencrypt/live/\$DOMAIN/fullchain.pem" ]; then
    echo "[DEPLOY] Setting up Let's Encrypt SSL..."
    certbot --nginx -d "\$DOMAIN" --non-interactive --agree-tos -m support@example.com 2>/dev/null || true
fi

echo "[DEPLOY] ✓ Deployment complete!"
echo "[DEPLOY] Application: http://\$DOMAIN or http://127.0.0.1:3000"
echo "[DEPLOY] Logs: pm2 logs \$APP_NAME"
echo "[DEPLOY] Monitor: check-abuse.sh"
"@

# Write script to file and execute
ssh -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerIP}" "cat > /tmp/deploy.sh << 'EOF'
$deployScript
EOF
bash /tmp/deploy.sh"

Write-Status "Deployment complete" "SUCCESS"

# ============================================
# Step 7: Verify deployment
# ============================================
Write-Status "Verifying deployment..." "INFO"

ssh -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerIP}" @"
pm2 list
echo ""
echo "Latest logs (last 10 lines):"
pm2 logs $AppName --lines 10 --nostream
"@

# ============================================
# Cleanup
# ============================================
Write-Status "Cleaning up local files..." "INFO"
Remove-Item -Recurse -Force $deployDir
Remove-Item $archivePath

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Status "========================================" "SUCCESS"
Write-Status "Deployment Summary" "SUCCESS"
Write-Status "========================================" "SUCCESS"
Write-Host ""
Write-Host "Server: $ServerUser@$ServerIP"
Write-Host "App: $AppName"
Write-Host "Directory: $AppDir"
Write-Host "Domain: $Domain"
Write-Host ""
Write-Host "Access your site:"
Write-Host "  HTTP:  http://$ServerIP"
Write-Host "  HTTPS: https://$Domain (after SSL setup)"
Write-Host ""
Write-Host "Check status:"
Write-Host "  ssh root@$ServerIP"
Write-Host "  pm2 list"
Write-Host "  check-abuse.sh"
Write-Host ""
Write-Host "Monitor logs:"
Write-Host "  pm2 logs $AppName"
Write-Host ""
