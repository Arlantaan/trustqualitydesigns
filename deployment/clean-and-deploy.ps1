# ============================================
# CLEAN AND DEPLOY SCRIPT
# Clean Hetzner server and deploy fresh website
# ============================================

$SERVER = "root@46.225.69.136"
$APP_DIR = "/var/www/tqd"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CLEAN & DEPLOY - Hetzner Server" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  WARNING: This will completely wipe the live website!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host ""
    Write-Host "❌ Operation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 1: Testing connection to server..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER "echo 'Connection successful'"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Cannot connect to server!" -ForegroundColor Red
    Write-Host "   Try: .\deployment\reset-and-deploy.ps1 to fix connection" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Connected successfully" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 2: Uploading cleanup script..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

scp -o StrictHostKeyChecking=no .\deployment\clean-server.sh ${SERVER}:/tmp/clean-server.sh

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upload cleanup script" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Script uploaded" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 3: Cleaning server..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

ssh -o StrictHostKeyChecking=no $SERVER "chmod +x /tmp/clean-server.sh && /tmp/clean-server.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Cleanup failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Server cleaned successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 4: Deploying fresh website..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Now run your existing deployment script
$deploy = Read-Host "Which deployment method? (github/local)"

if ($deploy -eq "github") {
    Write-Host ""
    Write-Host "Running GitHub deployment..." -ForegroundColor Cyan
    & .\deployment\github-pull.ps1
}
elseif ($deploy -eq "local") {
    Write-Host ""
    Write-Host "Running local deployment..." -ForegroundColor Cyan
    & .\deployment\deploy-from-local.sh
}
else {
    Write-Host ""
    Write-Host "Manual deployment selected." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To deploy manually, run one of:" -ForegroundColor White
    Write-Host "  .\deployment\github-pull.ps1" -ForegroundColor Gray
    Write-Host "  .\deployment\deploy-from-local.sh" -ForegroundColor Gray
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🎉 Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
