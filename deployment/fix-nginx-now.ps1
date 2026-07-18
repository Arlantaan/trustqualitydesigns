$SERVER = "root@89.167.105.217"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$confFile = Join-Path $scriptDir "tqd-nginx.conf"

Write-Host ""
Write-Host "=== Step 1: Upload clean nginx config ===" -ForegroundColor Cyan
scp $confFile "${SERVER}:/etc/nginx/sites-available/tqd-website"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: SCP failed" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== Step 2: Activate and test nginx ===" -ForegroundColor Cyan
ssh $SERVER "ln -sf /etc/nginx/sites-available/tqd-website /etc/nginx/sites-enabled/tqd-website && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx && echo 'Nginx OK'"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Nginx reload failed" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== Step 3: Run certbot ===" -ForegroundColor Cyan

try {
    $resolvedIP = (Resolve-DnsName demoview.space -Type A -Server 8.8.8.8 -ErrorAction Stop |
                   Where-Object { $_.IPAddress } | Select-Object -First 1).IPAddress
} catch { $resolvedIP = "unknown" }

Write-Host "demoview.space resolves to: $resolvedIP" -ForegroundColor Gray

if ($resolvedIP -ne "89.167.105.217") {
    Write-Host ""
    Write-Host "WARNING: DNS not pointed here yet (need 89.167.105.217, got $resolvedIP)" -ForegroundColor Yellow
    Write-Host "Nginx is now fixed. Run certbot after DNS propagates:" -ForegroundColor Yellow
    Write-Host "  ssh $SERVER" -ForegroundColor Gray
    Write-Host "  certbot --nginx --non-interactive --agree-tos --email abdullaalami1@gmail.com -d demoview.space -d www.demoview.space --redirect" -ForegroundColor Gray
    exit 0
}

ssh $SERVER "certbot --nginx --non-interactive --agree-tos --email abdullaalami1@gmail.com -d demoview.space -d www.demoview.space --redirect"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Certbot failed." -ForegroundColor Yellow; exit 1
}

Write-Host ""
Write-Host "=== Step 4: Auto-renewal cron ===" -ForegroundColor Cyan
ssh $SERVER "(crontab -l 2>/dev/null | grep -v certbot; echo '0 3,15 * * * certbot renew --quiet --nginx') | crontab -"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  HTTPS live at https://demoview.space" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
