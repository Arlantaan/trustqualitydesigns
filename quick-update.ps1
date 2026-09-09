# ============================================
# QUICK UPDATE & DEPLOY
# Rebuild locally and deploy to server in one command
# ============================================

# trustqualitydesign.com resolves here, and nginx answers on it directly.
# The previous value (91.98.203.172) is unreachable on both 22 and 443 --
# deploys pointed at it could not have been reaching the live site.
$SERVER = "root@169.58.36.209"
$SERVER_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   QUICK UPDATE & DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build locally
Write-Host "[1/5] Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Create package
Write-Host ""
Write-Host "[2/5] Creating deployment package..." -ForegroundColor Yellow
# Excludes matter here. Without them this archive picks up ~970MB of material
# the server has no use for: 322 root-level *.tar.gz snapshots (162MB), the
# stale _deploy/ duplicate tree (595MB), and .next/ (215MB) which the server
# rebuilds anyway in step 4.
tar -czf tqd-deploy.tar.gz `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='*.tar.gz' `
    --exclude='.next' `
    --exclude='_deploy' `
    --exclude='waveclone' `
    --exclude='.env.local' `
    --exclude='deployment' `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Package creation failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Upload to server
Write-Host ""
Write-Host "[3/5] Uploading to server..." -ForegroundColor Yellow
scp -o ServerAliveInterval=60 tqd-deploy.tar.gz ${SERVER}:${SERVER_DIR}/tqd-update.tar.gz

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Upload failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Extract and rebuild on server
Write-Host ""
Write-Host "[4/5] Extracting and rebuilding on server..." -ForegroundColor Yellow
# npm install before build: node_modules is excluded from the archive, so a
# dependency change would otherwise build against whatever is already on the
# server. Dev deps are needed here -- next/tailwind/typescript run at build time.
ssh -o ServerAliveInterval=60 $SERVER @"
cd $SERVER_DIR
tar -xzf tqd-update.tar.gz
npm install
npm run build
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Server build failed!" -ForegroundColor Red
    exit 1
}

# Step 5: Restart application
Write-Host ""
Write-Host "[5/5] Restarting application..." -ForegroundColor Yellow
# ecosystem.config.js names the app 'tqd-app' while this script and
# DEPLOYMENT_REFERENCE.md used 'tqd-website'. Restart by whichever exists so a
# naming mismatch cannot leave the old build serving after a "successful" deploy.
ssh $SERVER "cd $SERVER_DIR && (pm2 restart tqd-app || pm2 restart tqd-website || pm2 restart all) && pm2 save"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Live at: https://trustqualitydesign.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Verify the admin API is locked down (expect 401):" -ForegroundColor Yellow
    Write-Host "  curl -s -o /dev/null -w '%{http_code}' https://trustqualitydesign.com/api/admin/leads" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Restart failed!" -ForegroundColor Red
    exit 1
}

# Cleanup local package
Remove-Item tqd-deploy.tar.gz -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green
Write-Host ""
