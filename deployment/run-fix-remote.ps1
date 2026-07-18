# ============================================
# Run Fix Remotely - No SSH needed
# ============================================

$SERVER = "root@77.42.92.225"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Running Direct Fix on Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your password when prompted:" -ForegroundColor Yellow
Write-Host ""

$fixCommand = "cd /var/www/tqd; pm2 delete all 2>/dev/null || true; pkill -f next-server 2>/dev/null || true; sleep 2; rm -rf .next node_modules package-lock.json; npm install; npm run build; test -f .next/BUILD_ID || exit 1; pm2 delete tqd-website 2>/dev/null || true; pm2 start npm --name tqd-website -- start; pm2 save; pm2 status; sleep 3; pm2 logs tqd-website --lines 20 --nostream"

ssh $SERVER $fixCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Fix Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Website: http://77.42.92.225" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Fix failed!" -ForegroundColor Red
    Write-Host ""
}
