# ============================================
# Complete Redeployment Script
# Deletes old site and deploys fresh
# ============================================

$SERVER = "root@46.225.69.136"
$SERVER_IP = "46.225.69.136"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Complete Redeployment - TQD Website" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build locally
Write-Host "[1/6] Building application locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Build complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment package
Write-Host "[2/6] Creating deployment package..." -ForegroundColor Yellow

# Clean up old package
if (Test-Path "tqd-deploy.tar.gz") {
    Remove-Item "tqd-deploy.tar.gz" -Force
}

# Create archive
tar -czf tqd-deploy.tar.gz `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env.local' `
    --exclude='deployment' `
    --exclude='tqd-deploy.tar.gz' `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create package!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Package created!" -ForegroundColor Green
Write-Host ""

# Step 3: Stop old application and clean directory
Write-Host "[3/6] Stopping old application on server..." -ForegroundColor Yellow
Write-Host "You may be prompted for server password..." -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
echo 'Stopping PM2 application...'
pm2 stop tqd-website 2>/dev/null || echo 'No running application found'
pm2 delete tqd-website 2>/dev/null || echo 'No PM2 process to delete'

echo 'Removing old files...'
rm -rf $APP_DIR
mkdir -p $APP_DIR

echo 'Server cleaned successfully!'
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to clean server!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz" -Force
    exit 1
}

Write-Host "SUCCESS: Server cleaned!" -ForegroundColor Green
Write-Host ""

# Step 4: Upload package
Write-Host "[4/6] Uploading to server..." -ForegroundColor Yellow
Write-Host "You may be prompted for server password..." -ForegroundColor Gray
Write-Host ""

scp tqd-deploy.tar.gz "${SERVER}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz" -Force
    exit 1
}

Write-Host "SUCCESS: Upload complete!" -ForegroundColor Green
Write-Host ""

# Step 5: Extract and install
Write-Host "[5/6] Installing on server..." -ForegroundColor Yellow
Write-Host "This will take a few minutes..." -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
echo '==================================='
echo 'Extracting files...'
cd $APP_DIR
tar -xzf /tmp/tqd-deploy.tar.gz
rm /tmp/tqd-deploy.tar.gz

echo ''
echo 'Installing dependencies...'
npm install --production

echo ''
echo 'Building application...'
npm run build

echo ''
echo '==================================='
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Installation failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz" -Force
    exit 1
}

Write-Host "SUCCESS: Application installed!" -ForegroundColor Green
Write-Host ""

# Step 6: Start application
Write-Host "[6/6] Starting application with PM2..." -ForegroundColor Yellow

ssh $SERVER @"
cd $APP_DIR
pm2 start npm --name tqd-website -- start
pm2 save

echo ''
echo '==================================='
echo 'PM2 Status:'
pm2 status
echo '==================================='
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start application!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz" -Force
    exit 1
}

# Cleanup local package
Remove-Item "tqd-deploy.tar.gz" -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website is now live at:" -ForegroundColor White
Write-Host "  http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SERVER" -ForegroundColor Gray
Write-Host "  pm2 logs tqd-website" -ForegroundColor Gray
Write-Host "  pm2 restart tqd-website" -ForegroundColor Gray
Write-Host "  pm2 status" -ForegroundColor Gray
Write-Host ""
