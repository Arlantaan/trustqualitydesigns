# ============================================
# Quick Update Script
# Commit → Push → Deploy in one command
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = ""
)

Write-Host "🚀 Quick Update - Trust Quality Designs" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check for uncommitted changes
Write-Host "📊 Checking repository status..." -ForegroundColor Yellow
$status = git status --porcelain

if (-not $status) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    $deployOnly = Read-Host "Deploy current version? (y/n)"
    
    if ($deployOnly -eq "y") {
        Write-Host ""
        Write-Host "🚀 Deploying to server..." -ForegroundColor Yellow
        & "$PSScriptRoot\quick-deploy.ps1"
    } else {
        Write-Host "❌ Aborted" -ForegroundColor Red
    }
    exit 0
}

# Show changes
Write-Host "📝 Changes detected:" -ForegroundColor Green
git status --short
Write-Host ""

# Get commit message
if ($CommitMessage -eq "") {
    Write-Host "💬 Commit message options:" -ForegroundColor Yellow
    Write-Host "   1. feat: New feature" -ForegroundColor White
    Write-Host "   2. fix: Bug fix" -ForegroundColor White
    Write-Host "   3. style: Design/style changes" -ForegroundColor White
    Write-Host "   4. docs: Documentation update" -ForegroundColor White
    Write-Host "   5. refactor: Code refactoring" -ForegroundColor White
    Write-Host "   6. perf: Performance improvement" -ForegroundColor White
    Write-Host "   7. Custom message" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Select option (1-7)"
    
    $prefix = ""
    switch ($choice) {
        "1" { $prefix = "feat" }
        "2" { $prefix = "fix" }
        "3" { $prefix = "style" }
        "4" { $prefix = "docs" }
        "5" { $prefix = "refactor" }
        "6" { $prefix = "perf" }
        "7" { $prefix = "" }
        default { 
            Write-Host "❌ Invalid choice" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    if ($prefix -ne "") {
        $description = Read-Host "Enter description"
        $scope = Read-Host "Enter scope (optional, press Enter to skip)"
        
        if ($scope -ne "") {
            $CommitMessage = "${prefix}(${scope}): ${description}"
        } else {
            $CommitMessage = "${prefix}: ${description}"
        }
    } else {
        $CommitMessage = Read-Host "Enter custom commit message"
    }
}

Write-Host ""
Write-Host "📝 Commit message: $CommitMessage" -ForegroundColor Cyan
Write-Host ""

# Confirm
$proceed = Read-Host "Proceed with commit, push and deploy? (y/n)"

if ($proceed -ne "y") {
    Write-Host "❌ Aborted" -ForegroundColor Red
    exit 0
}

Write-Host ""

# Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to stage changes" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Changes staged" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "$CommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
$branch = git branch --show-current
git push origin $branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "⚠️  Deployment skipped" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Pushed to GitHub ($branch)" -ForegroundColor Green
Write-Host ""

# Deploy to server
Write-Host "🚀 Deploying to production server..." -ForegroundColor Yellow
& "$PSScriptRoot\quick-deploy.ps1"

Write-Host ""
Write-Host "🎉 Update complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Changes committed" -ForegroundColor White
Write-Host "   ✅ Pushed to GitHub" -ForegroundColor White
Write-Host "   ✅ Deployed to server" -ForegroundColor White
Write-Host "   🌐 Live at: http://46.225.69.136" -ForegroundColor White
Write-Host ""
