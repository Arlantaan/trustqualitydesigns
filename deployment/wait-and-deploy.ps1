# Auto-Wait and Deploy
# Tests connection every 2 minutes until server allows connection

$SERVER = "root@46.225.69.136"
$TEST_INTERVAL = 120 # seconds

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Waiting for SSH Rate Limit to Clear..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing connection every 2 minutes..." -ForegroundColor Yellow
Write-Host "Leave this running and go do something else." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel anytime." -ForegroundColor Gray
Write-Host ""

$attempt = 1

while ($true) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] Attempt #$attempt - Testing connection..." -ForegroundColor Cyan
    
    $result = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER "echo OK" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "   CONNECTION RESTORED!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Deploying now..." -ForegroundColor Yellow
        Write-Host ""
        
        # Run deployment
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
echo 'PM2 Status:'
pm2 status
"@
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "================================================" -ForegroundColor Green
            Write-Host "   DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
            Write-Host "================================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Live at: http://46.225.69.136" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Updates deployed:" -ForegroundColor Green
            Write-Host "  - Gyroscope scroll (tilt phone)" -ForegroundColor White
            Write-Host "  - Mobile cursor hidden" -ForegroundColor White
            Write-Host "  - 2-line hamburger menu" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "Deployment failed!" -ForegroundColor Red
        }
        
        exit 0
    }
    
    Write-Host "  Still blocked. Waiting $TEST_INTERVAL seconds..." -ForegroundColor Yellow
    Write-Host ""
    
    $attempt++
    Start-Sleep -Seconds $TEST_INTERVAL
}
