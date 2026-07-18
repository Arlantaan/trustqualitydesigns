# ============================================
# Fresh Deployment Script
# Clean and redeploy from local build
# ============================================

$SERVER = "root@91.98.203.172"
$SERVER_IP = "91.98.203.172"

# Ensure we're in the project root directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "Fresh Deployment - TQD Website" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Step 1: Build locally
Write-Host "Step 1: Building application locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment package
Write-Host "Step 2: Creating deployment package..." -ForegroundColor Yellow

# Clean up old package
if (Test-Path "tqd-deploy.tar.gz") {
    Remove-Item "tqd-deploy.tar.gz"
}

# Create archive (excluding dev files)
tar -czf tqd-deploy.tar.gz `
    package.json `
    package-lock.json `
    next.config.* `
    tsconfig.json `
    public `
    src `
    .next `
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

if ($LASTEXITCODE -ne 0) {
    exit 1
}
Write-Host "Package created!" -ForegroundColor Green
Write-Host ""

# Step 3: Clean server directory
ssh $SERVER "pm2 delete tqd-website 2>/dev/null; rm -rf /var/www/tqd; mkdir -p /var/www/tqd"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not clean server directory" -ForegroundColor Yellow

}

Write-Host ""

# Step 4: Upload package
Write-Host "Step 4: Uploading to server..." -ForegroundColor Yellow
scp tqd-deploy.tar.gz "${SERVER}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "Upload complete!" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy on server
Write-Host "Step 5: Deploying on server..." -ForegroundColor Yellow

ssh $SERVER @"
cd /var/www/tqd
tar -xzf /tmp/tqd-deploy.tar.gz
rm /tmp/tqd-deploy.tar.gz

echo "Installing dependencies..."
npm install --production

echo "Building on server..."
npm run build

echo "Starting with PM2..."
pm2 delete tqd-website 2>/dev/null || true
pm2 start npm --name tqd-website -- start
pm2 save

echo ""
echo "Deployment Status:"
pm2 status
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

# Cleanup
Remove-Item "tqd-deploy.tar.gz"

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website: http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SERVER" -ForegroundColor Gray
Write-Host "  pm2 logs tqd-website" -ForegroundColor Gray
Write-Host "  pm2 restart tqd-website" -ForegroundColor Gray
Write-Host "  pm2 status" -ForegroundColor Gray
Write-Host ""
