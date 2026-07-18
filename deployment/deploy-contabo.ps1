param(
    [string]$ServerIP = "194.163.135.177",
    [string]$Domain = "demoview.space",
    [string]$ServerUser = "root",
    [string]$AppName = "tqd-website",
    [string]$AppDir = "/var/www/tqd",
    [switch]$SetupOnly
)

<#
.SYNOPSIS
    Secure deployment script for Contabo VPS (security-hardened)
    
.DESCRIPTION
    This script deploys the TQD Next.js application to Contabo with security hardening:
    - Uses npm ci (not npm install) to prevent malicious package downloads
    - Sets up Let's Encrypt SSL certificate
    - Configures firewall and rate limiting
    - Installs monitoring for abuse detection
    - Uses verified, locked dependencies only
    
.PARAMETER ServerIP
    IP address of your Contabo VPS (default: 194.163.135.177)
    
.PARAMETER Domain
    Domain name for SSL certificate (default: demoview.space)
    
.PARAMETER ServerUser
    SSH user (default: root)
    
.PARAMETER AppName
    PM2 app name (default: tqd-website)
    
.PARAMETER AppDir
    App directory on server (default: /var/www/tqd)
    
.PARAMETER SetupOnly
    Only run server setup, skip deployment
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Require-Command {
    param([Parameter(Mandatory = $true)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

function Replace-Line {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Replacement
    )
    return [regex]::Replace($Text, $Pattern, $Replacement, [System.Text.RegularExpressions.RegexOptions]::Multiline)
}

Require-Command -Name "ssh"
Require-Command -Name "scp"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$setupTemplate = Join-Path $scriptDir "contabo-server-setup.sh"
$deployTemplate = Join-Path $scriptDir "contabo-deploy.ps1"

if (-not (Test-Path $setupTemplate)) {
    throw "Setup template not found: $setupTemplate"
}
if (-not (Test-Path $deployTemplate)) {
    throw "Deploy template not found: $deployTemplate"
}

$tempSetup = Join-Path $scriptDir ("contabo-setup-{0}.sh" -f [guid]::NewGuid().ToString("N"))
$tempDeploy = Join-Path $scriptDir ("contabo-deploy-{0}.ps1" -f [guid]::NewGuid().ToString("N"))
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

try {
    Push-Location $projectRoot

    Write-Host ""
    Write-Host "=== Contabo Secure Deployment ===" -ForegroundColor Cyan
    Write-Host "Target: $ServerUser@$ServerIP" -ForegroundColor Cyan
    Write-Host "Domain: $Domain" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "Preparing server setup script..." -ForegroundColor Cyan

    $setupContent = Get-Content -Raw $setupTemplate
    $setupContent = Replace-Line -Text $setupContent -Pattern '^SERVER_IP=.*$' -Replacement ("SERVER_IP=""{0}""" -f $ServerIP)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^APP_NAME=.*$' -Replacement ("APP_NAME=""{0}""" -f $AppName)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^APP_DIR=.*$' -Replacement ("APP_DIR=""{0}""" -f $AppDir)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^DOMAIN=.*$' -Replacement ("DOMAIN=""{0}""" -f $Domain)

    # Write Linux shell script with LF + UTF-8 (no BOM)
    $setupContent = $setupContent -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($tempSetup, $setupContent, $utf8NoBom)

    Write-Host "Running server setup on ${ServerUser}@${ServerIP}..." -ForegroundColor Cyan
    scp -o StrictHostKeyChecking=accept-new $tempSetup "${ServerUser}@${ServerIP}:/tmp/contabo-setup.sh" 2>&1 | Write-Host
    ssh -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerIP}" "bash /tmp/contabo-setup.sh" 2>&1 | Write-Host

    if ($SetupOnly) {
        Write-Host ""
        Write-Host "Setup complete. Skipping deploy because -SetupOnly was set." -ForegroundColor Yellow
        return
    }

    Write-Host ""
    Write-Host "Preparing deployment script..." -ForegroundColor Cyan

    if (-not (Test-Path (Join-Path $projectRoot ".env.production"))) {
        Write-Warning ".env.production not found. Add this file for production environment variables."
    }

    $deployContent = Get-Content -Raw $deployTemplate
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$SERVER_IP\s*=.*$' -Replacement ("`$SERVER_IP = ""{0}""" -f $ServerIP)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$SERVER_USER\s*=.*$' -Replacement ("`$SERVER_USER = ""{0}""" -f $ServerUser)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$APP_NAME\s*=.*$' -Replacement ("`$APP_NAME = ""{0}""" -f $AppName)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$APP_DIR\s*=.*$' -Replacement ("`$APP_DIR = ""{0}""" -f $AppDir)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$DOMAIN\s*=.*$' -Replacement ("`$DOMAIN = ""{0}""" -f $Domain)

    [System.IO.File]::WriteAllText($tempDeploy, $deployContent, $utf8NoBom)

    Write-Host "Running deployment..." -ForegroundColor Cyan
    & powershell -ExecutionPolicy Bypass -File $tempDeploy
    
    Write-Host ""
    Write-Host "Deployment complete!" -ForegroundColor Green
    Write-Host "Access your site at: https://$Domain or http://$ServerIP" -ForegroundColor Green
}
finally {
    Pop-Location
    if (Test-Path -LiteralPath $tempSetup) {
        Remove-Item -LiteralPath $tempSetup -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path -LiteralPath $tempDeploy) {
        Remove-Item -LiteralPath $tempDeploy -Force -ErrorAction SilentlyContinue
    }
}
