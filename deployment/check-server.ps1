# ============================================
# Server Diagnostic Script
# Check what's wrong with the server
# ============================================

$SERVER = "root@77.42.92.225"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Server Diagnostic Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking server: $SERVER" -ForegroundColor Yellow
Write-Host "Enter your password when prompted:" -ForegroundColor Gray
Write-Host ""

ssh $SERVER @"
echo '==================================='
echo '1. PM2 Status:'
echo '==================================='
pm2 status
echo ''

echo '==================================='
echo '2. PM2 Logs (last 30 lines):'
echo '==================================='
pm2 logs tqd-website --lines 30 --nostream 2>/dev/null || echo 'No logs found'
echo ''

echo '==================================='
echo '3. Application Directory Contents:'
echo '==================================='
ls -la $APP_DIR 2>/dev/null || echo 'Directory does not exist'
echo ''

echo '==================================='
echo '4. Port 3000 Status:'
echo '==================================='
netstat -tlnp | grep :3000 || echo 'Port 3000 not in use'
echo ''

echo '==================================='
echo '5. Node.js Process:'
echo '==================================='
ps aux | grep node | grep -v grep || echo 'No Node.js processes found'
echo ''

echo '==================================='
echo '6. Application Files Check:'
echo '==================================='
if [ -d "$APP_DIR" ]; then
    echo "Directory exists: YES"
    if [ -f "$APP_DIR/package.json" ]; then echo "package.json: YES"; else echo "package.json: NO"; fi
    if [ -d "$APP_DIR/.next" ]; then echo ".next folder: YES"; else echo ".next folder: NO"; fi
    if [ -d "$APP_DIR/node_modules" ]; then echo "node_modules: YES"; else echo "node_modules: NO"; fi
    if [ -d "$APP_DIR/public" ]; then echo "public folder: YES"; else echo "public folder: NO"; fi
    if [ -d "$APP_DIR/src" ]; then echo "src folder: YES"; else echo "src folder: NO"; fi
else
    echo "Directory does not exist!"
fi
echo ''

echo '==================================='
echo '7. Nginx Status:'
echo '==================================='
systemctl status nginx --no-pager -l 2>/dev/null | head -20 || echo 'Nginx not installed or not running'
echo ''

echo '==================================='
echo '8. Disk Space:'
echo '==================================='
df -h | head -5
echo ''

echo '==================================='
echo '9. Memory Usage:'
echo '==================================='
free -h
echo ''

echo '==================================='
echo '10. Recent Errors (if any):'
echo '==================================='
journalctl -u nginx -n 10 --no-pager 2>/dev/null | tail -5 || echo 'No Nginx errors'
echo ''

echo '==================================='
echo 'Diagnostic Complete!'
echo '==================================='
"@

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Diagnostic Check Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
