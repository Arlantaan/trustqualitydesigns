# ============================================
# Simple GitHub Pull and Rebuild
# Use this when SSH access is restored
# ============================================

$SERVER = "root@46.225.69.136"

Write-Host ""
Write-Host "GitHub Pull and Rebuild" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will pull the latest code from GitHub and rebuild." -ForegroundColor Yellow
Write-Host "Enter your password when prompted." -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue? (y/n)"
if ($continue -ne "y") {
    exit 0
}

Write-Host ""
Write-Host "Connecting to server..." -ForegroundColor Yellow
Write-Host ""

ssh $SERVER @"
echo 'Current directory:'
cd /var/www/tqd && pwd

echo ''
echo 'Pulling latest code from GitHub...'
git pull origin main

echo ''
echo 'Installing dependencies...'
npm install --production

echo ''
echo 'Building application...'
npm run build

echo ''
echo 'Restarting PM2...'
pm2 restart tqd-website

echo ''
echo 'PM2 Status:'
pm2 status

echo ''
echo 'Recent Logs:'
pm2 logs tqd-website --lines 20 --nostream
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   UPDATE SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Website: http://46.225.69.136" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Update failed!" -ForegroundColor Red
}
