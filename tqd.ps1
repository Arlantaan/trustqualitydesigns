# tqd.ps1 - TQD Operations Toolkit
# Usage:  .\tqd.ps1 <command> [-ServerIP x] [-ServerUser x] [-BanIP x] [-Instances n]
#
# Deploy & Release:   deploy, update-env, restart, rollback, open
# Monitoring & Logs:  status, health, watch, top, logs, tail-errors, logs-nginx, clean-logs
# Security:           test, fail2ban, firewall, ban-ip, unban-ip, nginx-reload, ssl-renew, ssl-status
# Database:           db-query, db-export, db-shell, db-vacuum, backup-db
# Diagnostics:        smtp, env-diff, node-version, disk-cleanup, setup-ssh-key, ssh

param(
    [Parameter(Position = 0)]
    [ValidateSet(
        'deploy','update-env','restart','rollback','open',
        'status','health','watch','top','logs','tail-errors','logs-nginx','clean-logs',
        'test','fail2ban','firewall','ban-ip','unban-ip','nginx-reload','ssl-renew','ssl-status',
        'db-query','db-export','db-shell','db-vacuum','backup-db',
        'smtp','env-diff','node-version','disk-cleanup','setup-ssh-key','ssh',
        'help'
    )]
    [string]$Command = 'help',

    [string]$ServerIP   = "194.163.135.177",
    [string]$ServerUser = "root",
    [string]$AppDir     = "/var/www/tqd",
    [string]$BanIP      = "",
    [int]$Instances     = 4
)

$SshTarget = "${ServerUser}@${ServerIP}"
$SshOpts   = @("-o","ServerAliveInterval=30","-o","ServerAliveCountMax=20","-o","ConnectTimeout=30")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Fail([string]$msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

function Banner([string]$title) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Ssh([string]$cmd) {
    & ssh.exe @SshOpts $SshTarget $cmd
    return $LASTEXITCODE
}

function SshHere {
    param([string]$script)
    & ssh.exe @SshOpts $SshTarget $script
    return $LASTEXITCODE
}

function Scp-Upload([string]$local, [string]$remote) {
    & scp.exe @SshOpts $local "${SshTarget}:${remote}"
    if ($LASTEXITCODE -ne 0) { Fail "SCP upload failed: $local" }
}

function Scp-Download([string]$remote, [string]$local) {
    & scp.exe @SshOpts "${SshTarget}:${remote}" $local
    if ($LASTEXITCODE -ne 0) { Fail "SCP download failed: $remote" }
}

function Write-LF([string]$path, [string]$text) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes(($text -replace "`r`n","`n" -replace "`r","`n"))
    [System.IO.File]::WriteAllBytes($path, $bytes)
}

function Load-Env {
    $envFile = Join-Path $PSScriptRoot ".env.production"
    if (-not (Test-Path $envFile)) { Fail ".env.production not found at project root" }
    $cfg = @{}
    Get-Content $envFile | Where-Object { $_ -match '^\s*([^#=\s]+)\s*=\s*(.+)' } | ForEach-Object {
        $cfg[$Matches[1]] = $Matches[2].Trim()
    }
    return $cfg
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

switch ($Command) {

    #-- DEPLOY -----------------------------------------------------------------
    'deploy' {
        Banner "TQD Deploy -> demoview.space"
        & "$PSScriptRoot\deployment\deploy-pm2.ps1" -ServerIP $ServerIP -ServerUser $ServerUser -AppDir $AppDir
    }

    #-- UPDATE-ENV -------------------------------------------------------------
    'update-env' {
        Banner "TQD Update Env Vars (no rebuild)"
        $envFile = Join-Path $PSScriptRoot ".env.production"
        if (-not (Test-Path $envFile)) { Fail ".env.production not found" }
        Write-Host "Uploading .env.production..." -ForegroundColor DarkGray
        Scp-Upload $envFile "${AppDir}/.env.production"
        $exitCode = Ssh "cp ${AppDir}/.env.production ${AppDir}/.env.local && pm2 reload tqd-app --update-env && pm2 status"
        if ($exitCode -ne 0) { Fail "PM2 reload failed" }
        Write-Host ""
        Write-Host "Env vars updated and app reloaded." -ForegroundColor Green
    }

    #-- RESTART ----------------------------------------------------------------
    'restart' {
        Banner "TQD Restart (zero-downtime reload)"
        $exitCode = Ssh "pm2 reload tqd-app --update-env && pm2 status"
        if ($exitCode -ne 0) { Fail "Restart failed" }
        Write-Host ""
        Write-Host "Reload complete." -ForegroundColor Green
    }

    #-- ROLLBACK ---------------------------------------------------------------
    'rollback' {
        Banner "TQD Rollback to Previous Build"
        Write-Host "Checking for previous build on server..." -ForegroundColor DarkGray
        $bash = @'
#!/bin/bash
if [ ! -d /var/www/tqd/.next.prev ]; then
  echo "ERROR: No previous build at /var/www/tqd/.next.prev"
  echo "Deploy at least twice before rollback is available."
  exit 1
fi
pm2 stop tqd-app 2>/dev/null || true
cd /var/www/tqd
rm -rf .next.bak
mv .next .next.bak
mv .next.prev .next
pm2 reload tqd-app --update-env
pm2 status
echo ""
echo "Rollback complete."
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-rollback.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-rollback.sh"
        Remove-Item $tmp -Force
        $exitCode = Ssh "bash /tmp/tqd-rollback.sh; rm -f /tmp/tqd-rollback.sh"
        if ($exitCode -ne 0) { Fail "Rollback failed" }
    }

    #-- OPEN -------------------------------------------------------------------
    'open' {
        Write-Host "Opening https://demoview.space ..." -ForegroundColor Cyan
        Start-Process "https://demoview.space"
    }

    #-- STATUS -----------------------------------------------------------------
    'status' {
        Banner "TQD Server Status"
        $bash = @'
#!/bin/bash
echo "--- PM2 ---"
pm2 status 2>/dev/null || echo "PM2 not running"
echo ""
echo "--- Nginx ---"
systemctl is-active nginx 2>/dev/null || echo "inactive"
nginx -t 2>&1 | tail -2
echo ""
echo "--- SSL ---"
certbot certificates 2>/dev/null | grep -E "Domains|Expiry" || echo "No certs"
echo ""
echo "--- Disk ---"
df -h / | awk 'NR==1||NR==2'
echo ""
echo "--- Memory ---"
free -h | awk 'NR==1||NR==2'
echo ""
echo "--- Load ---"
uptime
echo ""
echo "--- Leads DB ---"
if [ -f /var/www/tqd-data/leads.db ]; then
  command -v sqlite3 &>/dev/null && {
    c=$(sqlite3 /var/www/tqd-data/leads.db "SELECT COUNT(*) FROM contact_leads;" 2>/dev/null || echo "?")
    s=$(sqlite3 /var/www/tqd-data/leads.db "SELECT COUNT(*) FROM newsletter_subscribers;" 2>/dev/null || echo "?")
    echo "Contacts: $c  | Subscribers: $s"
  } || echo "sqlite3 not installed"
else
  echo "leads.db not found"
fi
echo ""
echo "--- HTTP ---"
code=$(curl -sk -o /dev/null -w "%{http_code}" https://demoview.space 2>/dev/null)
time=$(curl -sk -o /dev/null -w "%{time_total}" https://demoview.space 2>/dev/null)
echo "https://demoview.space -> HTTP $code in ${time}s"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-status.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-status.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-status.sh; rm -f /tmp/tqd-status.sh"
    }

    #-- HEALTH -----------------------------------------------------------------
    'health' {
        Banner "TQD Health Check"
        $bash = @'
#!/bin/bash
GREEN="\033[0;32m"; RED="\033[0;31m"; NC="\033[0m"
check() {
  local label="$1" url="$2"
  code=$(curl -sk -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  time=$(curl -sk -o /dev/null -w "%{time_total}" "$url" 2>/dev/null)
  if [ "$code" = "200" ] || [ "$code" = "301" ] || [ "$code" = "302" ]; then
    echo -e "  ${GREEN}OK${NC}  $label -> HTTP $code in ${time}s"
  else
    echo -e "  ${RED}FAIL${NC}  $label -> HTTP $code in ${time}s"
  fi
}
check "HTTPS public"        "https://demoview.space"
check "HTTP (redirect)"     "http://demoview.space"
check "Health API"          "https://demoview.space/api/health"
check "Admin login page"    "https://demoview.space/admin/login"
check "Local port 3000"     "http://127.0.0.1:3000"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-health.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-health.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-health.sh; rm -f /tmp/tqd-health.sh"
    }

    #-- WATCH ------------------------------------------------------------------
    'watch' {
        Banner "TQD Watch (auto-refresh every 5s, Ctrl+C to stop)"
        Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
        Write-Host ""
        while ($true) {
            Clear-Host
            Write-Host "TQD Watch  $(Get-Date -Format 'HH:mm:ss')  (Ctrl+C to stop)" -ForegroundColor Cyan
            Write-Host ""
            & ssh.exe @SshOpts $SshTarget "pm2 status; echo ''; uptime; free -h | awk 'NR==2'; echo ''; code=\$(curl -sk -o /dev/null -w '%{http_code}' https://demoview.space 2>/dev/null); echo \"Web: HTTP \$code\""
            Start-Sleep 5
        }
    }

    #-- TOP --------------------------------------------------------------------
    'top' {
        Banner "TQD PM2 Live Monitor (Ctrl+C to stop)"
        & ssh.exe @SshOpts $SshTarget "pm2 monit"
    }

    #-- LOGS -------------------------------------------------------------------
    'logs' {
        Banner "TQD Live Logs (Ctrl+C to stop)"
        Write-Host "Streaming PM2 logs from server..." -ForegroundColor DarkGray
        Write-Host ""
        & ssh.exe @SshOpts $SshTarget "pm2 logs tqd-app --lines 50"
    }

    #-- TAIL-ERRORS ------------------------------------------------------------
    'tail-errors' {
        Banner "TQD Error Logs (Ctrl+C to stop)"
        Write-Host "Filtering for ERROR/WARN/Exception..." -ForegroundColor DarkGray
        Write-Host ""
        & ssh.exe @SshOpts $SshTarget "pm2 logs tqd-app --lines 200 --nostream 2>&1 | grep -iE 'error|warn|exception|unhandled|fatal|crash'; echo '--- streaming errors ---'; pm2 logs tqd-app --err --lines 0"
    }

    #-- LOGS-NGINX -------------------------------------------------------------
    'logs-nginx' {
        Banner "TQD Nginx Logs (Ctrl+C to stop)"
        Write-Host "Tailing /var/log/nginx/error.log and access.log..." -ForegroundColor DarkGray
        Write-Host ""
        & ssh.exe @SshOpts $SshTarget "tail -f /var/log/nginx/error.log /var/log/nginx/access.log"
    }

    #-- CLEAN-LOGS -------------------------------------------------------------
    'clean-logs' {
        Banner "TQD Flush PM2 Logs"
        $exitCode = Ssh "pm2 flush && echo 'PM2 logs cleared'"
        if ($exitCode -ne 0) { Fail "pm2 flush failed" }
    }

    #-- TEST -------------------------------------------------------------------
    'test' {
        Banner "TQD Production Robustness Test (9 categories)"
        Write-Host "Running test script on server..." -ForegroundColor DarkGray
        Write-Host ""
        $bash = @'
#!/bin/bash
DOMAIN="https://demoview.space"
PASS=0; FAIL=0; WARN=0
ok()   { echo "  [PASS] $1"; PASS=$(( PASS + 1 )); }
fail() { echo "  [FAIL] $1"; FAIL=$(( FAIL + 1 )); }
warn() { echo "  [WARN] $1"; WARN=$(( WARN + 1 )); }
check_http() {
  local code; code=$(curl -sk -o /dev/null -w '%{http_code}' "$1" --max-time 10 2>/dev/null)
  echo "$code"
}

echo ""
echo "=== 1. Process & PM2 ==="
pm2 list 2>/dev/null | grep -q "tqd-app" && ok "PM2 tqd-app running" || fail "PM2 tqd-app NOT running"
pm2 list 2>/dev/null | grep tqd-app | grep -q "online" && ok "PM2 status: online" || warn "PM2 status not online"
node_count=$(pm2 list 2>/dev/null | grep tqd-app | grep -c online || true)
[ "$node_count" -ge 1 ] && ok "PM2 instances: $node_count online" || warn "PM2 instance count low: $node_count"

echo ""
echo "=== 2. Nginx ==="
systemctl is-active nginx --quiet && ok "Nginx running" || fail "Nginx NOT running"
nginx -t 2>&1 | grep -q "successful" && ok "Nginx config valid" || fail "Nginx config invalid"

echo ""
echo "=== 3. HTTP Endpoints ==="
code=$(check_http "$DOMAIN")
[ "$code" = "200" ] && ok "Homepage HTTP $code" || fail "Homepage HTTP $code"
code=$(check_http "$DOMAIN/api/health")
[ "$code" = "200" ] && ok "Health API HTTP $code" || warn "Health API HTTP $code"
code=$(check_http "$DOMAIN/contact")
[ "$code" = "200" ] && ok "Contact page HTTP $code" || fail "Contact page HTTP $code"
code=$(check_http "$DOMAIN/admin/login")
[ "$code" = "200" ] && ok "Admin login page HTTP $code" || warn "Admin login page HTTP $code"

echo ""
echo "=== 4. HTTPS / SSL ==="
expiry=$(echo | openssl s_client -connect demoview.space:443 -servername demoview.space 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$expiry" ]; then
  ok "SSL cert valid, expires: $expiry"
  exp_epoch=$(date -d "$expiry" +%s 2>/dev/null || echo 0)
  now_epoch=$(date +%s)
  days_left=$(( (exp_epoch - now_epoch) / 86400 ))
  [ "$days_left" -gt 14 ] && ok "SSL days remaining: $days_left" || warn "SSL expires in $days_left days"
else
  fail "SSL cert check failed"
fi
code=$(check_http "http://demoview.space")
[ "$code" = "301" ] || [ "$code" = "302" ] && ok "HTTP->HTTPS redirect ($code)" || warn "HTTP->HTTPS redirect not detected (got $code)"

echo ""
echo "=== 5. Security Headers ==="
headers=$(curl -sk -I "$DOMAIN" --max-time 10 2>/dev/null)
echo "$headers" | grep -qi "x-frame-options" && ok "X-Frame-Options header present" || warn "X-Frame-Options header missing"
echo "$headers" | grep -qi "x-content-type-options" && ok "X-Content-Type-Options header present" || warn "X-Content-Type-Options header missing"
echo "$headers" | grep -qi "strict-transport-security" && ok "HSTS header present" || warn "HSTS header missing"
echo "$headers" | grep -qi "content-security-policy" && ok "CSP header present" || warn "CSP header missing"
echo "$headers" | grep -qi "x-powered-by" && warn "X-Powered-By header exposed" || ok "X-Powered-By header suppressed"

echo ""
echo "=== 6. Firewall ==="
if command -v ufw &>/dev/null; then
  ufw status | grep -q "Status: active" && ok "UFW firewall active" || warn "UFW firewall inactive"
  ufw status | grep -q "22\|OpenSSH" && ok "SSH port allowed" || warn "SSH port rule not found"
  ufw status | grep -q "80" && ok "HTTP port 80 allowed" || warn "HTTP port 80 rule not found"
  ufw status | grep -q "443" && ok "HTTPS port 443 allowed" || warn "HTTPS port 443 rule not found"
else
  warn "UFW not installed"
fi

echo ""
echo "=== 7. Fail2ban ==="
if command -v fail2ban-client &>/dev/null; then
  systemctl is-active fail2ban --quiet && ok "Fail2ban running" || warn "Fail2ban NOT running"
  fail2ban-client status 2>/dev/null | grep -q "sshd\|ssh" && ok "SSH jail active" || warn "SSH jail not found"
else
  warn "Fail2ban not installed"
fi

echo ""
echo "=== 8. Disk & Memory ==="
disk_use=$(df / --output=pcent | tail -1 | tr -d ' %')
[ "$disk_use" -lt 85 ] && ok "Disk usage: ${disk_use}%" || warn "Disk usage high: ${disk_use}%"
mem_free=$(free -m | awk 'NR==2{print $7}')
[ "$mem_free" -gt 100 ] && ok "Free memory: ${mem_free}MB" || warn "Low free memory: ${mem_free}MB"

echo ""
echo "=== 9. Application Logs (last 50 lines) ==="
errors=$(pm2 logs tqd-app --nostream --lines 50 2>/dev/null | grep -ciE 'error|exception|unhandled|fatal' || true)
[ "$errors" -eq 0 ] && ok "No errors in last 50 PM2 log lines" || warn "Found $errors error lines in PM2 logs"
nginx_errors=$(tail -20 /var/log/nginx/error.log 2>/dev/null | grep -c "\[error\]" || true)
[ "$nginx_errors" -eq 0 ] && ok "No [error] lines in nginx error log (last 20)" || warn "Found $nginx_errors nginx error lines"

echo ""
echo "=========================================="
echo "  RESULTS: $PASS passed  |  $WARN warnings  |  $FAIL failed"
echo "=========================================="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-test.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-test.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-test.sh; rm -f /tmp/tqd-test.sh"
    }

    #-- FAIL2BAN ---------------------------------------------------------------
    'fail2ban' {
        Banner "TQD Fail2ban Status"
        $bash = @'
#!/bin/bash
if ! command -v fail2ban-client &>/dev/null; then
  echo "fail2ban is not installed."
  exit 0
fi
echo "--- Service ---"
systemctl is-active fail2ban
echo ""
echo "--- Jails ---"
fail2ban-client status
echo ""
echo "--- SSH jail ---"
fail2ban-client status sshd 2>/dev/null || fail2ban-client status ssh 2>/dev/null || echo "No SSH jail active"
echo ""
echo "--- Nginx limit jail ---"
fail2ban-client status nginx-req-limit 2>/dev/null || echo "No nginx-req-limit jail active"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-f2b.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-f2b.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-f2b.sh; rm -f /tmp/tqd-f2b.sh"
    }

    #-- FIREWALL ---------------------------------------------------------------
    'firewall' {
        Banner "TQD Firewall (UFW)"
        $bash = @'
#!/bin/bash
if ! command -v ufw &>/dev/null; then
  echo "UFW not installed."
  exit 0
fi
ufw status verbose
echo ""
echo "--- Recent UFW blocks ---"
grep -i "UFW BLOCK" /var/log/kern.log 2>/dev/null | tail -20 || echo "No recent blocks in kern.log"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-fw.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-fw.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-fw.sh; rm -f /tmp/tqd-fw.sh"
    }

    #-- BAN-IP -----------------------------------------------------------------
    'ban-ip' {
        Banner "TQD Ban IP"
        if (-not $BanIP) { Fail "Usage: .\tqd.ps1 ban-ip -BanIP 1.2.3.4" }
        Write-Host "Banning $BanIP via UFW..." -ForegroundColor Yellow
        $exitCode = Ssh "ufw deny from $BanIP to any comment 'tqd-manual-ban' && ufw status | grep $BanIP && echo 'BANNED: $BanIP'"
        if ($exitCode -ne 0) { Fail "UFW ban failed (is UFW installed and enabled?)" }
        Write-Host ""
        Write-Host "IP banned: $BanIP" -ForegroundColor Red
    }

    #-- UNBAN-IP ---------------------------------------------------------------
    'unban-ip' {
        Banner "TQD Unban IP"
        if (-not $BanIP) { Fail "Usage: .\tqd.ps1 unban-ip -BanIP 1.2.3.4" }
        Write-Host "Removing UFW block for $BanIP ..." -ForegroundColor DarkGray
        Ssh "ufw delete deny from $BanIP to any && echo 'Unbanned: $BanIP' || echo 'Rule not found for $BanIP'"
    }

    #-- NGINX-RELOAD -----------------------------------------------------------
    'nginx-reload' {
        Banner "TQD Nginx Reload"
        $confSrc = Join-Path $PSScriptRoot "deployment\tqd-nginx.conf"
        if (Test-Path $confSrc) {
            Write-Host "Uploading tqd-nginx.conf to server..." -ForegroundColor DarkGray
            Scp-Upload $confSrc "/etc/nginx/sites-available/tqd-website"
            Ssh "ln -sf /etc/nginx/sites-available/tqd-website /etc/nginx/sites-enabled/tqd-website 2>/dev/null; true"
        } else {
            Write-Host "[SKIP] deployment/tqd-nginx.conf not found, skipping upload" -ForegroundColor Yellow
        }
        $exitCode = Ssh "nginx -t && systemctl reload nginx && echo 'nginx reloaded OK'"
        if ($exitCode -ne 0) { Fail "nginx -t failed - config has errors" }
    }

    #-- SSL-RENEW --------------------------------------------------------------
    'ssl-renew' {
        Banner "TQD SSL Certificate Renewal"
        Write-Host "Forcing certbot renewal..." -ForegroundColor DarkGray
        $exitCode = Ssh "certbot renew --force-renewal --nginx --non-interactive 2>&1 && systemctl reload nginx && echo 'SSL renewed OK'"
        if ($exitCode -ne 0) { Fail "certbot renewal failed" }
    }

    #-- SSL-STATUS -------------------------------------------------------------
    'ssl-status' {
        Banner "TQD SSL Certificate Status"
        $bash = @'
#!/bin/bash
DOMAIN="demoview.space"
echo "--- certbot certificates ---"
certbot certificates 2>/dev/null || echo "certbot not found"
echo ""
echo "--- Live cert from $DOMAIN ---"
expiry=$(echo | openssl s_client -servername $DOMAIN -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$expiry" ]; then
  expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
  now_epoch=$(date +%s)
  days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
  echo "Expires  : $expiry"
  echo "Days left: $days_left"
  [ "$days_left" -lt 14 ] && echo "WARNING: less than 14 days - run ssl-renew!"
  [ "$days_left" -ge 14 ] && echo "Status: OK"
else
  echo "Could not read certificate from ${DOMAIN}:443"
fi
echo ""
echo "--- Auto-renewal timer ---"
systemctl status snap.certbot.renew.timer 2>/dev/null | grep -E "Active|Next" || \
systemctl status certbot.timer 2>/dev/null | grep -E "Active|Next" || \
echo "Check /etc/cron.d/certbot"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-ssl.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-ssl.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-ssl.sh; rm -f /tmp/tqd-ssl.sh"
    }

    #-- DB-QUERY ---------------------------------------------------------------
    'db-query' {
        Banner "TQD Leads DB Quick View"
        $bash = @'
#!/bin/bash
DB="/var/www/tqd-data/leads.db"
command -v sqlite3 &>/dev/null || apt-get install -y -qq sqlite3
[ -f "$DB" ] || { echo "DB not found: $DB"; exit 1; }
echo "--- Contacts (last 10) ---"
sqlite3 -column -header "$DB" \
  "SELECT id, first_name||' '||COALESCE(last_name,'') AS name, email, COALESCE(company,'') AS company, substr(created_at,1,16) AS date FROM contact_leads ORDER BY id DESC LIMIT 10;"
echo ""
echo "--- Subscribers (last 10) ---"
sqlite3 -column -header "$DB" \
  "SELECT id, email, COALESCE(source,'') AS source, substr(created_at,1,16) AS date FROM newsletter_subscribers ORDER BY id DESC LIMIT 10;"
echo ""
echo "--- Totals ---"
sqlite3 "$DB" "SELECT 'Contacts: '||COUNT(*) FROM contact_leads;"
sqlite3 "$DB" "SELECT 'Subscribers: '||COUNT(*) FROM newsletter_subscribers;"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-dbq.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-dbq.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-dbq.sh; rm -f /tmp/tqd-dbq.sh"
    }

    #-- DB-EXPORT --------------------------------------------------------------
    'db-export' {
        Banner "TQD Export Leads as CSV"
        $exportDir = Join-Path $PSScriptRoot "exports"
        if (-not (Test-Path $exportDir)) { New-Item -ItemType Directory -Path $exportDir | Out-Null }
        $stamp = Get-Date -Format "yyyyMMdd-HHmmss"

        Write-Host "Exporting contacts..." -ForegroundColor DarkGray
        $cFile = Join-Path $exportDir "contacts-$stamp.csv"
        & ssh.exe @SshOpts $SshTarget "command -v sqlite3 &>/dev/null || apt-get install -y -qq sqlite3; sqlite3 -csv -header /var/www/tqd-data/leads.db 'SELECT * FROM contact_leads ORDER BY id DESC;'" | Set-Content $cFile -Encoding UTF8

        Write-Host "Exporting subscribers..." -ForegroundColor DarkGray
        $sFile = Join-Path $exportDir "subscribers-$stamp.csv"
        & ssh.exe @SshOpts $SshTarget "sqlite3 -csv -header /var/www/tqd-data/leads.db 'SELECT * FROM newsletter_subscribers ORDER BY id DESC;'" | Set-Content $sFile -Encoding UTF8

        Write-Host ""
        Write-Host "Exported:" -ForegroundColor Green
        Write-Host "  exports\contacts-$stamp.csv"
        Write-Host "  exports\subscribers-$stamp.csv"
    }

    #-- DB-SHELL ---------------------------------------------------------------
    'db-shell' {
        Banner "TQD SQLite Shell (type .quit to exit)"
        Write-Host "Connecting to /var/www/tqd-data/leads.db on server" -ForegroundColor DarkGray
        Write-Host "Tip: .headers on  |  .mode column  |  .tables" -ForegroundColor DarkGray
        Write-Host ""
        & ssh.exe @SshOpts $SshTarget "command -v sqlite3 &>/dev/null || apt-get install -y -qq sqlite3; sqlite3 /var/www/tqd-data/leads.db"
    }

    #-- DB-VACUUM --------------------------------------------------------------
    'db-vacuum' {
        Banner "TQD SQLite VACUUM + ANALYZE"
        $bash = @'
#!/bin/bash
DB="/var/www/tqd-data/leads.db"
command -v sqlite3 &>/dev/null || apt-get install -y -qq sqlite3
[ -f "$DB" ] || { echo "DB not found: $DB"; exit 1; }
before=$(du -sh "$DB" | cut -f1)
sqlite3 "$DB" "PRAGMA integrity_check;"
sqlite3 "$DB" "VACUUM;"
sqlite3 "$DB" "ANALYZE;"
after=$(du -sh "$DB" | cut -f1)
echo ""
echo "DB size: $before -> $after"
echo "VACUUM and ANALYZE complete."
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-vacuum.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-vacuum.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-vacuum.sh; rm -f /tmp/tqd-vacuum.sh"
    }

    #-- BACKUP-DB --------------------------------------------------------------
    'backup-db' {
        Banner "TQD Leads DB Backup"
        $backupDir = Join-Path $PSScriptRoot "backups"
        if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
        $stamp    = Get-Date -Format "yyyyMMdd-HHmmss"
        $destFile = Join-Path $backupDir "leads-$stamp.db"
        Write-Host "Downloading /var/www/tqd-data/leads.db..." -ForegroundColor DarkGray
        Scp-Download "/var/www/tqd-data/leads.db" $destFile
        $sizeKB = [math]::Round((Get-Item $destFile).Length / 1KB, 1)
        Write-Host ""
        Write-Host "Saved: backups\leads-$stamp.db ($sizeKB KB)" -ForegroundColor Green
    }

    #-- SMTP -------------------------------------------------------------------
    'smtp' {
        Banner "TQD SMTP Test"
        $cfg = Load-Env
        $smtpHost = $cfg['SMTP_HOST']
        $smtpPort = if ($cfg['SMTP_PORT']) { [int]$cfg['SMTP_PORT'] } else { 587 }
        $smtpUser = $cfg['SMTP_USER']
        $smtpPass = $cfg['SMTP_PASS']
        if (-not $smtpHost -or -not $smtpUser -or -not $smtpPass) {
            Fail "SMTP_HOST / SMTP_USER / SMTP_PASS missing in .env.production"
        }
        Write-Host "Testing $smtpUser @ ${smtpHost}:${smtpPort} ..." -ForegroundColor DarkGray
        Write-Host ""
        $py = @"
import smtplib, sys
h, p, u, pw = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
try:
    s = smtplib.SMTP(h, p, timeout=10)
    s.ehlo(); s.starttls(); s.ehlo()
    s.login(u, pw); s.quit()
    print('SUCCESS - SMTP credentials valid')
    sys.exit(0)
except smtplib.SMTPAuthenticationError as e:
    print('FAIL - authentication error:', e)
    sys.exit(1)
except Exception as e:
    print('FAIL -', type(e).__name__, e)
    sys.exit(1)
"@
        $tmpPy = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-smtp.py")
        Set-Content -Path $tmpPy -Value $py -Encoding UTF8
        python $tmpPy $smtpHost $smtpPort $smtpUser $smtpPass
        Remove-Item $tmpPy -Force
    }

    #-- ENV-DIFF ---------------------------------------------------------------
    'env-diff' {
        Banner "TQD Env Diff (local vs server)"
        $envFile = Join-Path $PSScriptRoot ".env.production"
        if (-not (Test-Path $envFile)) { Fail ".env.production not found" }
        Write-Host "Fetching server .env.production..." -ForegroundColor DarkGray
        $serverRaw = & ssh.exe @SshOpts $SshTarget "cat ${AppDir}/.env.production 2>/dev/null || echo '__NOT_FOUND__'"
        if ($serverRaw -contains '__NOT_FOUND__') {
            Write-Host "Server .env.production not found at ${AppDir}." -ForegroundColor Yellow
            return
        }
        $localLines  = Get-Content $envFile | Where-Object { $_ -match '=' -and $_ -notmatch '^\s*#' } | Sort-Object
        $serverLines = $serverRaw           | Where-Object { $_ -match '=' -and $_ -notmatch '^\s*#' } | Sort-Object
        $localKeys   = $localLines  | ForEach-Object { ($_ -split '=', 2)[0].Trim() }
        $serverKeys  = $serverLines | ForEach-Object { ($_ -split '=', 2)[0].Trim() }
        Write-Host ""
        Write-Host "Only in local:" -ForegroundColor Yellow
        $localKeys | Where-Object { $serverKeys -notcontains $_ } | ForEach-Object { Write-Host "  + $_" -ForegroundColor Green }
        Write-Host "Only on server:" -ForegroundColor Yellow
        $serverKeys | Where-Object { $localKeys -notcontains $_ } | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        Write-Host "Value differs:" -ForegroundColor Yellow
        foreach ($line in $localLines) {
            $key = ($line -split '=', 2)[0].Trim()
            $lv  = ($line -split '=', 2)[1].Trim()
            $sl  = $serverLines | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
            if ($sl) {
                $sv = ($sl -split '=', 2)[1].Trim()
                if ($lv -ne $sv) { Write-Host "  ~ $key" -ForegroundColor Magenta }
            }
        }
        Write-Host ""
        Write-Host "Run: .\tqd.ps1 update-env   to push local .env to server." -ForegroundColor DarkGray
    }

    #-- NODE-VERSION -----------------------------------------------------------
    'node-version' {
        Banner "TQD Runtime Versions on Server"
        $bash = @'
#!/bin/bash
echo "Node.js  : $(node  --version 2>/dev/null || echo 'not found')"
echo "npm      : $(npm   --version 2>/dev/null || echo 'not found')"
echo "PM2      : $(pm2   --version 2>/dev/null || echo 'not found')"
echo "nginx    : $(nginx -v 2>&1 | head -1)"
echo "certbot  : $(certbot --version 2>/dev/null || echo 'not found')"
echo "sqlite3  : $(sqlite3 --version 2>/dev/null || echo 'not found')"
echo "openssl  : $(openssl version 2>/dev/null || echo 'not found')"
echo "Python   : $(python3 --version 2>/dev/null || echo 'not found')"
echo "OS       : $(lsb_release -ds 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)"
echo "Kernel   : $(uname -r)"
echo "Uptime   : $(uptime -p)"
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-ver.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-ver.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-ver.sh; rm -f /tmp/tqd-ver.sh"
    }

    #-- DISK-CLEANUP -----------------------------------------------------------
    'disk-cleanup' {
        Banner "TQD Disk Cleanup"
        $bash = @'
#!/bin/bash
echo "--- Before ---"
df -h / | awk 'NR==2'
echo ""
echo "Cleaning npm cache..."
npm cache clean --force 2>/dev/null && echo "done" || echo "skipped"
echo "Cleaning apt cache..."
apt-get clean 2>/dev/null && echo "done" || echo "skipped"
echo "Removing old /tmp tarballs..."
find /tmp -name "*.tar.gz" -mtime +1 -delete 2>/dev/null && echo "done"
echo "Removing PM2 logs over 50MB..."
find /root/.pm2/logs -name "*.log" -size +50M -delete 2>/dev/null && echo "done"
echo "Removing .next.bak..."
rm -rf /var/www/tqd/.next.bak 2>/dev/null && echo "done"
echo ""
echo "--- After ---"
df -h / | awk 'NR==2'
'@
        $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-clean.sh")
        Write-LF $tmp $bash
        Scp-Upload $tmp "/tmp/tqd-clean.sh"
        Remove-Item $tmp -Force
        Ssh "bash /tmp/tqd-clean.sh; rm -f /tmp/tqd-clean.sh"
    }

    #-- SETUP-SSH-KEY ----------------------------------------------------------
    'setup-ssh-key' {
        Banner "TQD Setup SSH Key Authentication"
        $keyPath = Join-Path $env:USERPROFILE ".ssh\tqd_server"
        $pubPath = "${keyPath}.pub"
        if (-not (Test-Path $pubPath)) {
            Write-Host "Generating SSH key at $keyPath ..." -ForegroundColor DarkGray
            ssh-keygen -t ed25519 -C "tqd-server" -f $keyPath -N ""
            if ($LASTEXITCODE -ne 0) { Fail "ssh-keygen failed" }
        } else {
            Write-Host "Key already exists: $pubPath" -ForegroundColor DarkGray
        }
        Write-Host "Copying public key to server (password required one last time)..." -ForegroundColor Yellow
        $pub = (Get-Content $pubPath -Raw).Trim()
        $exitCode = Ssh "mkdir -p ~/.ssh && echo '$pub' >> ~/.ssh/authorized_keys && sort -u ~/.ssh/authorized_keys -o ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh && echo 'SSH key installed'"
        if ($exitCode -ne 0) { Fail "Key upload failed" }
        Write-Host ""
        Write-Host "Testing key login..." -ForegroundColor DarkGray
        & ssh.exe @SshOpts -i $keyPath $SshTarget "echo 'Key login SUCCESS'"
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "SSH key setup complete!" -ForegroundColor Green
            Write-Host "Key file: $keyPath" -ForegroundColor Gray
            Write-Host "Add -i '$keyPath' to SshOpts in tqd.ps1 to skip passwords." -ForegroundColor Yellow
        } else {
            Write-Host "Key test failed - check ~/.ssh/ permissions on server." -ForegroundColor Red
        }
    }

    #-- SSH --------------------------------------------------------------------
    'ssh' {
        Banner "TQD SSH Shell"
        Write-Host "Connecting to $SshTarget ..." -ForegroundColor DarkGray
        Write-Host ""
        & ssh.exe @SshOpts $SshTarget
    }

    #-- HELP -------------------------------------------------------------------
    'help' {
        Write-Host ""
        Write-Host "  TQD Operations Toolkit  -  demoview.space" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  -- Deploy & Release -----------------------------------------" -ForegroundColor DarkGray
        Write-Host "  .\tqd.ps1 deploy          Build + full deploy to server"
        Write-Host "  .\tqd.ps1 update-env      Push .env.production + reload (no rebuild)"
        Write-Host "  .\tqd.ps1 restart         Zero-downtime pm2 reload"
        Write-Host "  .\tqd.ps1 rollback        Restore previous .next build"
        Write-Host "  .\tqd.ps1 open            Open https://demoview.space in browser"
        Write-Host ""
        Write-Host "  -- Monitoring & Logs ----------------------------------------" -ForegroundColor DarkGray
        Write-Host "  .\tqd.ps1 status          PM2, nginx, SSL, disk, memory, DB stats"
        Write-Host "  .\tqd.ps1 health          Quick HTTP check on all endpoints"
        Write-Host "  .\tqd.ps1 watch           Auto-refresh status every 5s"
        Write-Host "  .\tqd.ps1 top             Live PM2 CPU/memory monitor"
        Write-Host "  .\tqd.ps1 logs            Stream live PM2 logs"
        Write-Host "  .\tqd.ps1 tail-errors     PM2 logs filtered to errors/warnings"
        Write-Host "  .\tqd.ps1 logs-nginx      Tail nginx error + access logs"
        Write-Host "  .\tqd.ps1 clean-logs      Flush PM2 log files on server"
        Write-Host ""
        Write-Host "  -- Security -------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "  .\tqd.ps1 test            9-category production security test"
        Write-Host "  .\tqd.ps1 fail2ban        Fail2ban jails + banned IP counts"
        Write-Host "  .\tqd.ps1 firewall        UFW firewall rules + recent blocks"
        Write-Host "  .\tqd.ps1 ban-ip          Block an IP via UFW  (-BanIP 1.2.3.4)"
        Write-Host "  .\tqd.ps1 unban-ip        Unblock an IP        (-BanIP 1.2.3.4)"
        Write-Host "  .\tqd.ps1 nginx-reload    Validate nginx config + reload"
        Write-Host "  .\tqd.ps1 ssl-renew       Force certbot SSL renewal"
        Write-Host "  .\tqd.ps1 ssl-status      Cert expiry + days remaining"
        Write-Host ""
        Write-Host "  -- Database -------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "  .\tqd.ps1 db-query        Latest 10 contacts + subscribers"
        Write-Host "  .\tqd.ps1 db-export       Download contacts + subscribers as CSV"
        Write-Host "  .\tqd.ps1 db-shell        Interactive sqlite3 shell on server"
        Write-Host "  .\tqd.ps1 db-vacuum       VACUUM + ANALYZE leads.db"
        Write-Host "  .\tqd.ps1 backup-db       Download leads.db to .\backups\"
        Write-Host ""
        Write-Host "  -- Diagnostics & Maintenance --------------------------------" -ForegroundColor DarkGray
        Write-Host "  .\tqd.ps1 smtp            Test SMTP from .env.production"
        Write-Host "  .\tqd.ps1 env-diff        Compare local .env vs server .env"
        Write-Host "  .\tqd.ps1 node-version    Node/npm/PM2/nginx/OS versions"
        Write-Host "  .\tqd.ps1 disk-cleanup    Clear npm cache, tmp, logs, .next.bak"
        Write-Host "  .\tqd.ps1 setup-ssh-key   Generate + install SSH key on server"
        Write-Host "  .\tqd.ps1 ssh             Open interactive SSH shell"
        Write-Host ""
        Write-Host "  -- Options --------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "  -ServerIP 1.2.3.4    Override server IP  (default: $ServerIP)"
        Write-Host "  -ServerUser root      Override SSH user   (default: $ServerUser)"
        Write-Host "  -BanIP 1.2.3.4       IP to ban/unban"
        Write-Host "  -Instances 4         PM2 instance count  (future: scale command)"
        Write-Host ""
    }

}
