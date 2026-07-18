param(
    [string]$ServerIP = "89.167.105.217",

    [string]$Domain = "demoview.space",
    [string]$ServerUser = "root",
    [string]$AppName = "tqd-website",
    [string]$AppDir = "/var/www/tqd",
    [switch]$SetupOnly
)

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

$setupTemplate = Join-Path $scriptDir "fresh-server-setup.sh"
$deployTemplate = Join-Path $scriptDir "fresh-server-deploy.ps1"

if (-not (Test-Path $setupTemplate)) {
    throw "Setup template not found: $setupTemplate"
}
if (-not (Test-Path $deployTemplate)) {
    throw "Deploy template not found: $deployTemplate"
}

$tempSetup = Join-Path $scriptDir ("fresh-server-setup-{0}.sh" -f [guid]::NewGuid().ToString("N"))
$tempDeploy = Join-Path $scriptDir ("fresh-server-deploy-{0}.ps1" -f [guid]::NewGuid().ToString("N"))
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

try {
    Push-Location $projectRoot

    Write-Host ""
    Write-Host "=== Preparing server setup script ===" -ForegroundColor Cyan

    $setupContent = Get-Content -Raw $setupTemplate
    $setupContent = Replace-Line -Text $setupContent -Pattern '^SERVER_IP=.*$' -Replacement ("SERVER_IP=""{0}""" -f $ServerIP)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^APP_NAME=.*$' -Replacement ("APP_NAME=""{0}""" -f $AppName)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^APP_DIR=.*$' -Replacement ("APP_DIR=""{0}""" -f $AppDir)
    $setupContent = Replace-Line -Text $setupContent -Pattern '^DOMAIN=.*$' -Replacement ("DOMAIN=""{0}""" -f $Domain)

    # Write Linux shell script with LF + UTF-8 (no BOM) to avoid /bin/bash^M errors on Ubuntu.
    $setupContent = $setupContent -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($tempSetup, $setupContent, $utf8NoBom)

    Write-Host "=== Running server setup on ${ServerUser}@${ServerIP} ===" -ForegroundColor Cyan
    scp -o StrictHostKeyChecking=accept-new $tempSetup "${ServerUser}@${ServerIP}:/tmp/fresh-server-setup.sh"
    ssh -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerIP}" "bash /tmp/fresh-server-setup.sh"

    if ($SetupOnly) {
        Write-Host ""
        Write-Host "Setup complete. Skipping deploy because -SetupOnly was set." -ForegroundColor Yellow
        return
    }

    Write-Host ""
    Write-Host "=== Preparing deployment script ===" -ForegroundColor Cyan

    if (-not (Test-Path (Join-Path $projectRoot ".env.production"))) {
        Write-Warning ".env.production not found. The deploy script expects it."
    }

    $deployContent = Get-Content -Raw $deployTemplate
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$SERVER_IP\s*=.*$' -Replacement ("`$SERVER_IP = ""{0}""" -f $ServerIP)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$SERVER_USER\s*=.*$' -Replacement ("`$SERVER_USER = ""{0}""" -f $ServerUser)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$APP_NAME\s*=.*$' -Replacement ("`$APP_NAME = ""{0}""" -f $AppName)
    $deployContent = Replace-Line -Text $deployContent -Pattern '^\$APP_DIR\s*=.*$' -Replacement ("`$APP_DIR = ""{0}""" -f $AppDir)

    [System.IO.File]::WriteAllText($tempDeploy, $deployContent, $utf8NoBom)

    Write-Host "=== Running deployment ===" -ForegroundColor Cyan
    & powershell -ExecutionPolicy Bypass -File $tempDeploy
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
