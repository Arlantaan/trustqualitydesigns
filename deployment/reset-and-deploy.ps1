# Quick IP Change and Deploy
Write-Host "Resetting WiFi to get new IP..." -ForegroundColor Yellow

# Get WiFi interface name
$wifi = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.Name -like "*Wi-Fi*"} | Select-Object -First 1

if ($wifi) {
    Write-Host "Disabling $($wifi.Name)..." -ForegroundColor Gray
    Disable-NetAdapter -Name $wifi.Name -Confirm:$false
    
    Write-Host "Waiting 5 seconds..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    Write-Host "Enabling $($wifi.Name)..." -ForegroundColor Gray
    Enable-NetAdapter -Name $wifi.Name -Confirm:$false
    
    Write-Host "Waiting for connection..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    
    Write-Host ""
    Write-Host "Testing connection..." -ForegroundColor Yellow
    ssh -o ConnectTimeout=5 root@46.225.69.136 "echo Connected successfully!"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! You can now deploy!" -ForegroundColor Green
        Write-Host ""
        $deploy = Read-Host "Run deployment now? (y/n)"
        if ($deploy -eq "y") {
            .\deployment\github-pull.ps1
        }
    } else {
        Write-Host ""
        Write-Host "Still blocked. Try:" -ForegroundColor Yellow
        Write-Host "1. Use mobile hotspot" -ForegroundColor White
        Write-Host "2. Use VPN" -ForegroundColor White
        Write-Host "3. Use Hetzner web console" -ForegroundColor White
    }
} else {
    Write-Host "Could not find WiFi adapter." -ForegroundColor Red
    Write-Host "Try connecting to mobile hotspot or VPN instead." -ForegroundColor Yellow
}
