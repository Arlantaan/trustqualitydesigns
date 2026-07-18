# ============================================
# Quick Fix: Rebuild on Server
# Fixes the broken build issue
# ============================================

$SERVER = "root@77.42.92.225"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fixing Server Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER" -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
set -e
echo '==================================='
echo '1. Stopping PM2 process...'
echo '==================================='
pm2 delete tqd-website 2>/dev/null || true
pm2 save
echo 'PM2 stopped!'

echo ''
echo '==================================='
echo '2. Cleaning old build...'
echo '==================================='
cd $APP_DIR
rm -rf .next
echo 'Old build cleaned!'

echo ''
echo '==================================='
echo '3. Installing dependencies...'
echo '==================================='
npm install
if [ $? -ne 0 ]; then
    echo 'ERROR: npm install failed!'
    exit 1
fi
echo 'Dependencies installed!'

echo ''
echo '==================================='
echo '4. Building application...'
echo '==================================='
npm run build
if [ $? -ne 0 ]; then
    echo 'ERROR: Build failed!'
    exit 1
fi

# Verify build
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo 'ERROR: Build verification failed!'
    exit 1
fi
echo 'Build complete and verified!'

echo ''
echo '==================================='
echo '5. Removing dev dependencies...'
echo '==================================='
npm prune --production
echo 'Dev dependencies removed!'

echo ''
echo '==================================='
echo '6. Starting with PM2...'
echo '==================================='
pm2 start npm --name tqd-website -- start
if [ $? -ne 0 ]; then
    echo 'ERROR: PM2 start failed!'
    exit 1
fi
pm2 save

echo ''
echo '==================================='
echo '7. PM2 Status:'
echo '==================================='
pm2 status

echo ''
echo '==================================='
echo '8. Recent Logs:'
echo '==================================='
pm2 logs tqd-website --lines 10 --nostream

echo ''
echo '==================================='
echo 'Fix Complete!'
echo '==================================='
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Fix failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Server Build Fixed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Website should now be working at:" -ForegroundColor White
Write-Host "  http://77.42.92.225" -ForegroundColor Cyan
Write-Host ""
