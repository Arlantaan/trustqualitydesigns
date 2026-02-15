# ============================================
# CLEAN ONLY SCRIPT
# Clean Hetzner server without deploying
# ============================================

$SERVER = "root@46.225.69.136"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SERVER CLEANUP - Hetzner" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  WARNING: This will wipe the live website!" -ForegroundColor Yellow
Write-Host "   The server will be empty after this operation." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type 'DELETE' to confirm"

if ($confirm -ne "DELETE") {
    Write-Host ""
    Write-Host "❌ Operation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🧹 Starting cleanup..." -ForegroundColor Yellow
Write-Host ""

# Test connection
Write-Host "Testing connection..." -ForegroundColor Gray
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER "echo 'Connected'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot connect to server!" -ForegroundColor Red
    exit 1
}

# Upload and run cleanup script
Write-Host "Uploading cleanup script..." -ForegroundColor Gray
scp -o StrictHostKeyChecking=no .\deployment\clean-server.sh ${SERVER}:/tmp/clean-server.sh

Write-Host "Running cleanup..." -ForegroundColor Gray
Write-Host ""
ssh -o StrictHostKeyChecking=no $SERVER "chmod +x /tmp/clean-server.sh && /tmp/clean-server.sh"

Write-Host ""
Write-Host "✅ Server is now clean!" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy, run:" -ForegroundColor White
Write-Host "  .\deployment\clean-and-deploy.ps1" -ForegroundColor Cyan
Write-Host "  OR" -ForegroundColor Gray
Write-Host "  .\deployment\github-pull.ps1" -ForegroundColor Cyan
Write-Host ""
