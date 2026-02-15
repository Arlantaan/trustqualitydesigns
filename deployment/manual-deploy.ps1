# ============================================
# Manual Deployment Script
# Interactive - Enter password when prompted
# ============================================

$SERVER = "root@46.225.69.136"
$SERVER_IP = "46.225.69.136"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Manual Deployment - TQD Website" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You will be prompted for the server password multiple times." -ForegroundColor Yellow
Write-Host "Please enter it each time it's requested." -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue? (y/n)"
if ($continue -ne "y") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 0
}

Write-Host ""

# Check if package exists
if (-not (Test-Path "tqd-deploy.tar.gz")) {
    Write-Host "[1/6] Building application..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "[2/6] Creating deployment package..." -ForegroundColor Yellow
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
} else {
    Write-Host "Using existing deployment package: tqd-deploy.tar.gz" -ForegroundColor Green
    Write-Host ""
}

# Step 1: Stop old application
Write-Host "[3/6] Stopping old application on server..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER "pm2 stop tqd-website 2>/dev/null || echo 'No running app'; pm2 delete tqd-website 2>/dev/null || echo 'No PM2 process'; echo 'Old app stopped'"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "WARNING: Could not stop old app (may not exist)" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Clean server directory
Write-Host "[4/6] Cleaning server directory..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER "rm -rf $APP_DIR; mkdir -p $APP_DIR; echo 'Directory cleaned and created'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to clean server!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Server cleaned!" -ForegroundColor Green
Write-Host ""

# Step 3: Upload package
Write-Host "[5/6] Uploading package to server..." -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

scp tqd-deploy.tar.gz "${SERVER}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Upload complete!" -ForegroundColor Green
Write-Host ""

# Step 4: Extract and deploy
Write-Host "[6/6] Installing and starting application..." -ForegroundColor Yellow
Write-Host "This will take 2-3 minutes. Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
echo '==================================='
echo 'Extracting files...'
cd $APP_DIR
tar -xzf /tmp/tqd-deploy.tar.gz
rm /tmp/tqd-deploy.tar.gz
echo 'Files extracted!'

echo ''
echo 'Installing dependencies...'
npm install --production
echo 'Dependencies installed!'

echo ''
echo 'Building application...'
npm run build
echo 'Build complete!'

echo ''
echo 'Starting with PM2...'
pm2 start npm --name tqd-website -- start
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
pm2 logs tqd-website --lines 10 --nostream
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website is now live at:" -ForegroundColor White
Write-Host "  http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "New Features Deployed:" -ForegroundColor Green
Write-Host "  - Gyroscope scroll (tilt phone to scroll page)" -ForegroundColor White
Write-Host "  - Custom cursor hidden on mobile" -ForegroundColor White
Write-Host "  - Improved touch interactions" -ForegroundColor White
Write-Host ""
Write-Host "Test gyroscope on mobile:" -ForegroundColor Yellow
Write-Host "  1. Open site on your phone" -ForegroundColor Gray
Write-Host "  2. Tap screen to activate (iOS only)" -ForegroundColor Gray
Write-Host "  3. Tilt phone forward to scroll down" -ForegroundColor Gray
Write-Host "  4. Tilt phone backward to scroll up" -ForegroundColor Gray
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SERVER" -ForegroundColor Gray
Write-Host "  pm2 logs tqd-website" -ForegroundColor Gray
Write-Host "  pm2 restart tqd-website" -ForegroundColor Gray
Write-Host ""
