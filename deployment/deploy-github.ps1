# ============================================
# Deploy from GitHub to Server
# ============================================

$SERVER = "root@46.225.69.136"
$APP_DIR = "/var/www/tqd"

Write-Host "Deploying from GitHub..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Pulling latest code from GitHub..." -ForegroundColor Yellow

ssh $SERVER @"
cd $APP_DIR
echo "Current directory: \$(pwd)"
echo ""

echo "Pulling from GitHub..."
git pull origin main

echo ""
echo "Installing dependencies..."
npm install --production

echo ""
echo "Building application..."
npm run build

echo ""
echo "Restarting PM2..."
pm2 restart tqd-website

echo ""
echo "PM2 Status:"
pm2 status

echo ""
echo "Deployment complete!"
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "Live at: http://46.225.69.136" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host ""
}
