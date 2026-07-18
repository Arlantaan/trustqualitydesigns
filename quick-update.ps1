# ============================================
# QUICK UPDATE & DEPLOY
# Rebuild locally and deploy to server in one command
# ============================================

$SERVER = "root@91.98.203.172"
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
tar -czf tqd-deploy.tar.gz `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env.local' `
    --exclude='deployment' `
    --exclude='tqd-deploy.tar.gz' `
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
ssh -o ServerAliveInterval=60 $SERVER @"
cd $SERVER_DIR
tar -xzf tqd-update.tar.gz
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
ssh $SERVER "cd $SERVER_DIR && pm2 restart tqd-website && pm2 save"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Live at: http://91.98.203.172" -ForegroundColor Cyan
    Write-Host "Protected: http://91.98.203.172?auth=Demo@123" -ForegroundColor Cyan
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
