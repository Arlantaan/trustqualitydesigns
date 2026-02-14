# ============================================
# QUICK DEPLOYMENT SCRIPT - PowerShell
# Deploy TQD to Demo Server from Windows
# ============================================

$SERVER_IP = "46.225.69.136"
$SERVER_USER = "root"
$SERVER_DIR = "/var/www/tqd"

Write-Host "🚀 Starting deployment to demo server..." -ForegroundColor Green

# Build the application
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Create deployment archive
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

# Clean up old archive if exists
if (Test-Path "tqd-deploy.tar.gz") {
    Remove-Item "tqd-deploy.tar.gz"
}

# Create tar archive (requires tar in Windows 10+)
tar -czf tqd-deploy.tar.gz `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env.local' `
    --exclude='deployment' `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create archive!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Package created!" -ForegroundColor Green

# Upload to server
Write-Host "📤 Uploading to server..." -ForegroundColor Yellow
scp tqd-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

Write-Host "✅ Upload complete!" -ForegroundColor Green

# Deploy on server
Write-Host "🔄 Deploying on server..." -ForegroundColor Yellow

ssh ${SERVER_USER}@${SERVER_IP} @"
    mkdir -p /var/www/tqd
    cd /var/www/tqd
    tar -xzf /tmp/tqd-deploy.tar.gz
    rm /tmp/tqd-deploy.tar.gz
    npm install --production
    npm run build
    pm2 delete tqd-website 2>/dev/null; pm2 start npm --name tqd-website -- start
    pm2 save
    pm2 status
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Remove-Item "tqd-deploy.tar.gz"
    exit 1
}

# Cleanup
Remove-Item "tqd-deploy.tar.gz"

Write-Host ""
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "🌐 Visit: http://$SERVER_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Yellow
Write-Host "   ssh ${SERVER_USER}@${SERVER_IP}" -ForegroundColor Gray
Write-Host "   pm2 logs tqd-website" -ForegroundColor Gray
Write-Host "   pm2 restart tqd-website" -ForegroundColor Gray
