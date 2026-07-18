param(
    [string]$ProjectDir = "C:\xampp\htdocs\tqd",
    [int]$RestartDelaySeconds = 2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Starting dev server in $ProjectDir" -ForegroundColor Cyan
Write-Host "If the dev server exits, it will restart after $RestartDelaySeconds seconds." -ForegroundColor Cyan

while ($true) {
    if (-not (Test-Path $ProjectDir)) {
        Write-Host "Project directory not found: $ProjectDir" -ForegroundColor Red
        exit 1
    }

    Push-Location $ProjectDir
    try {
        npm run dev
    } finally {
        Pop-Location
    }

    Write-Host "Dev server stopped. Restarting in $RestartDelaySeconds seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds $RestartDelaySeconds
}
