# deploy-pm2.ps1
# Deploys TQD site using PM2 + Nginx.  No Docker required.
# Strategy: 3 SCP uploads, then 1 SSH session for all server work.
# This avoids repeated password prompts and SSH connection rate-limiting.

param(
    [string]$ServerIP   = "194.163.135.177",
    [string]$ServerUser = "root",
    [string]$AppDir     = "/var/www/tqd"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$SshTarget   = "${ServerUser}@${ServerIP}"
# Keep-alive options prevent SSH dropping during long npm install
$SshOpts     = @("-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=20", "-o", "ConnectTimeout=30")

# ── Helpers ───────────────────────────────────────────────────────────────────

function Fail([string]$msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

function Scp-Upload([string]$local, [string]$remote) {
    $name = [System.IO.Path]::GetFileName($local)
    Write-Host "  SCP: $name" -ForegroundColor DarkGray
    & scp @SshOpts $local "${SshTarget}:${remote}"
    if ($LASTEXITCODE -ne 0) { Fail "SCP failed for $name" }
}

function Write-LF([string]$path, [string]$text) {
    $lf    = $text -replace "`r`n", "`n" -replace "`r", "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($lf)
    [System.IO.File]::WriteAllBytes($path, $bytes)
}

# ── Banner ────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TQD - PM2 Deployment to demoview.space" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Build locally ─────────────────────────────────────────────────────

Write-Host "[1/3] Building Next.js application..." -ForegroundColor Yellow
Set-Location $projectRoot
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Build failed" }
Write-Host "Build OK" -ForegroundColor Green
Write-Host ""

# ── Step 2: Create deployment archive ────────────────────────────────────────

Write-Host "[2/3] Creating deployment archive..." -ForegroundColor Yellow
$archive = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-deploy.tar.gz")
if ([System.IO.File]::Exists($archive)) { [System.IO.File]::Delete($archive) }

tar -czf $archive `
    --exclude=".git"        `
    --exclude="node_modules" `
    --exclude="_deploy"     `
    --exclude="waveclone"   `
    --exclude="*.tar.gz"    `
    -C $projectRoot .
if ($LASTEXITCODE -ne 0) { Fail "tar archiving failed" }

$sizeMB = [math]::Round((Get-Item $archive).Length / 1MB, 1)
Write-Host "Archive ready: $sizeMB MB" -ForegroundColor Green
Write-Host ""

# ── Step 3: Upload everything, then run a single SSH session ──────────────────

Write-Host "[3/3] Uploading and deploying to server..." -ForegroundColor Yellow
Write-Host "(npm install takes ~3-5 minutes - please wait)" -ForegroundColor DarkGray
Write-Host ""

# ── Compose the server-side bash script ──────────────────────────────────────
# Single-quoted @'...'@ = NO PowerShell variable expansion.
# $PATH, $?, $APPDIR etc. remain as bash variables.
# __APPDIR__ and __SERVERIP__ are replaced by PowerShell below.

$setupBash = @'
#!/bin/bash
set -e

APPDIR="__APPDIR__"

echo ""
echo "=== [0/5] Install system dependencies ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq build-essential python3 fail2ban
# Ensure fail2ban is enabled and running
systemctl enable fail2ban 2>/dev/null || true
systemctl start  fail2ban 2>/dev/null || true
echo "System dependencies OK"

echo ""
echo "=== [1/5] Cleanup old deployment ==="
pm2 delete tqd-app 2>/dev/null || true
rm -rf "$APPDIR"
mkdir -p "$APPDIR"
echo "Cleanup OK"

echo ""
echo "=== [2/5] Extract archive ==="
# Save previous .next build for rollback support
if [ -d "$APPDIR/.next" ]; then
    rm -rf "$APPDIR/.next.prev"
    cp -r "$APPDIR/.next" "$APPDIR/.next.prev"
    echo "Previous build saved to .next.prev (rollback available)"
fi
tar -xzf /tmp/tqd-deploy.tar.gz -C "$APPDIR"
rm -f /tmp/tqd-deploy.tar.gz
echo "Extract OK"

echo ""
echo "=== [3/5] Install npm packages ==="
cd "$APPDIR"
npm install --omit=dev --legacy-peer-deps
echo "npm install OK"

echo ""
echo "=== [4/5] Ensure PM2 is installed ==="
if ! command -v pm2 &>/dev/null; then
    npm install -g pm2@latest
fi
echo "PM2 version: $(pm2 --version)"

echo ""
echo "=== [5/6] Configure Nginx + SSL ==="

# Remove duplicate nginx configs for this domain
for f in /etc/nginx/sites-enabled/*; do
    [ -e "$f" ] || continue
    if grep -q "demoview.space" "$f" 2>/dev/null; then
        echo "Removing duplicate: $f"
        rm -f "$f"
    fi
done

ln -sf /etc/nginx/sites-available/tqd /etc/nginx/sites-enabled/tqd
rm -f /etc/nginx/sites-enabled/default

# Re-inject SSL certificate into the new nginx config (non-interactive)
# certbot install handles nginx -t and nginx reload internally
if certbot certificates 2>/dev/null | grep -q "demoview.space"; then
    echo "Re-applying existing SSL certificate..."
    certbot install --nginx --cert-name demoview.space --non-interactive
    echo "SSL OK"
else
    echo "No SSL cert found yet - running HTTP only (run certbot manually after DNS is set)"
    nginx -t && systemctl reload nginx
fi
echo "Nginx OK"

echo ""
echo "=== [6/6] Start PM2 ==="
# Create persistent data dir (outside app dir so it survives redeploys)
mkdir -p /var/www/tqd-data
chmod 750 /var/www/tqd-data
mkdir -p /var/log/pm2
cp "$APPDIR/.env.production" "$APPDIR/.env.local" 2>/dev/null || true
pm2 delete tqd-app 2>/dev/null || true
pm2 start "$APPDIR/ecosystem.config.js" --env production
pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || true
systemctl enable pm2-root 2>/dev/null || true

echo ""
pm2 status

echo ""
echo "============================================="
echo "  Server setup COMPLETE"
echo "  https://__SERVERIP__"
echo "============================================="
'@ -replace '__APPDIR__', $AppDir `
   -replace '__SERVERIP__', $ServerIP

$tmpSetup = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tqd-setup.sh")
Write-LF $tmpSetup $setupBash

# ── Upload 3 files (only 3 password prompts total) ────────────────────────────

Scp-Upload $archive                                        "/tmp/tqd-deploy.tar.gz"
Scp-Upload "$projectRoot\deployment\tqd-nginx.conf"        "/etc/nginx/sites-available/tqd"
Scp-Upload "$projectRoot\deployment\tqd-limits.conf"       "/etc/nginx/conf.d/tqd-limits.conf"
Scp-Upload "$projectRoot\deployment\test-production.sh"    "/root/test-production.sh"
Scp-Upload $tmpSetup                                       "/tmp/tqd-setup.sh"
[System.IO.File]::Delete($tmpSetup)

# ── Single SSH session runs all server steps ─────────────────────────────────

Write-Host ""
Write-Host "  Running setup on server..." -ForegroundColor DarkGray

# PowerShell single-quoted string is passed literally to SSH.
# On the server, bash sees:  bash /tmp/tqd-setup.sh; EXIT=$?; rm -f ...; exit $EXIT
& ssh @SshOpts $SshTarget 'bash /tmp/tqd-setup.sh; EXIT=$?; rm -f /tmp/tqd-setup.sh; exit $EXIT'
if ($LASTEXITCODE -ne 0) { Fail "Server setup failed (exit $LASTEXITCODE)" }

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Site live at:" -ForegroundColor Cyan
Write-Host "  https://demoview.space" -ForegroundColor White
Write-Host "  https://$ServerIP" -ForegroundColor White
Write-Host ""
Write-Host "Run health & security tests:" -ForegroundColor Yellow
Write-Host "  ssh root@$ServerIP 'bash /root/test-production.sh'" -ForegroundColor White
Write-Host ""

