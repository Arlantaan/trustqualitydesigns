# ============================================
# Fresh Deployment Script
# Clean and redeploy from local build
# ============================================

$SERVER = "root@46.225.69.136"
$SERVER_IP = "46.225.69.136"

Write-Host "Fresh Deployment - TQD Website" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
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
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env.local' `
    --exclude='deployment' `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create package!" -ForegroundColor Red
    exit 1
}

Write-Host "Package created!" -ForegroundColor Green
Write-Host ""

# Step 3: Clean server directory
Write-Host "Step 3: Cleaning server directory..." -ForegroundColor Yellow
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
