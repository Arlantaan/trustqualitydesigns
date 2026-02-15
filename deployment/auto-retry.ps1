# Auto-retry deployment script
$SERVER = "root@46.225.69.136"
$MAX_ATTEMPTS = 20
$WAIT_SECONDS = 30

Write-Host ""
Write-Host "Auto-Retry Deployment" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Will test connection every $WAIT_SECONDS seconds until it works..." -ForegroundColor Yellow
Write-Host "Max attempts: $MAX_ATTEMPTS (total: $($MAX_ATTEMPTS * $WAIT_SECONDS / 60) minutes)" -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le $MAX_ATTEMPTS; $i++) {
    Write-Host "[$i/$MAX_ATTEMPTS] Testing connection..." -ForegroundColor Cyan
    
    $result = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER "echo OK" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "CONNECTION SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Deploying now..." -ForegroundColor Yellow
        Write-Host ""
        
        ssh $SERVER @"
cd /var/www/tqd
echo 'Pulling from GitHub...'
git pull origin main

echo ''
echo 'Installing dependencies...'
npm install --production

echo ''
echo 'Building...'
npm run build

echo ''
echo 'Restarting PM2...'
pm2 restart tqd-website

echo ''
echo 'Status:'
pm2 status
"@
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "==============================" -ForegroundColor Green
            Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
            Write-Host "==============================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Live at: http://46.225.69.136" -ForegroundColor Cyan
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "Deployment failed!" -ForegroundColor Red
        }
        exit 0
    } else {
        Write-Host "Still blocked... waiting $WAIT_SECONDS seconds" -ForegroundColor Yellow
        if ($i -lt $MAX_ATTEMPTS) {
            Start-Sleep -Seconds $WAIT_SECONDS
        }
    }
}

Write-Host ""
Write-Host "Max attempts reached. Try:" -ForegroundColor Red
Write-Host "1. Use phone hotspot" -ForegroundColor White
Write-Host "2. Use Hetzner web console: https://console.hetzner.cloud" -ForegroundColor White
