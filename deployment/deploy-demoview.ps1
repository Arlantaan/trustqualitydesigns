# deploy-demoview.ps1
# Pushes the latest code + nginx config to the server and sets up SSL for demoview.space
# Usage (from workspace root):
#   .\deployment\deploy-demoview.ps1
#
# Prerequisites:
#   - SSH key auth to root@194.163.135.177 is working
#   - DNS A-records for demoview.space → 194.163.135.177 are live

param(
    [string]$ServerIP   = "194.163.135.177",
    [string]$ServerUser = "root",
    [string]$AppDir     = "/var/www/tqd"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "=== [1/4] Uploading nginx.conf ===" -ForegroundColor Cyan
scp "$projectRoot\nginx.conf" "${ServerUser}@${ServerIP}:${AppDir}/nginx.conf"

Write-Host ""
Write-Host "=== [2/4] Uploading next.config.ts ===" -ForegroundColor Cyan
scp "$projectRoot\next.config.ts" "${ServerUser}@${ServerIP}:${AppDir}/next.config.ts"

Write-Host ""
Write-Host "=== [3/4] Uploading .env.production ===" -ForegroundColor Cyan
if (Test-Path "$projectRoot\.env.production") {
    scp "$projectRoot\.env.production" "${ServerUser}@${ServerIP}:${AppDir}/.env.production"
} else {
    Write-Warning ".env.production not found"
}

Write-Host ""
Write-Host "=== [4/4] Starting containers ===" -ForegroundColor Cyan
ssh "${ServerUser}@${ServerIP}" "cd ${AppDir}; docker compose -f docker-compose.production.yml pull"
ssh "${ServerUser}@${ServerIP}" "cd ${AppDir}; docker compose -f docker-compose.production.yml up -d --build"

Write-Host ""
Write-Host "=== Setting up SSL ===" -ForegroundColor Yellow
scp "$PSScriptRoot\setup-domain-ssl.sh" "${ServerUser}@${ServerIP}:/tmp/setup-domain-ssl.sh"
ssh "${ServerUser}@${ServerIP}" "chmod +x /tmp/setup-domain-ssl.sh; bash /tmp/setup-domain-ssl.sh"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Site: https://demoview.space" -ForegroundColor Cyan
Write-Host "Also: https://www.demoview.space" -ForegroundColor Cyan
