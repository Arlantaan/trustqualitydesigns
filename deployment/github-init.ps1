# ============================================
# GitHub Initial Setup Script
# Trust Quality Designs
# ============================================

Write-Host "🐙 GitHub Setup - Trust Quality Designs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
$gitVersion = git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
Write-Host ""

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already initialized" -ForegroundColor Yellow
    $reinit = Read-Host "Do you want to continue anyway? (y/n)"
    if ($reinit -ne "y") {
        Write-Host "Aborted." -ForegroundColor Red
        exit 0
    }
} else {
    # Initialize git
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository initialized" -ForegroundColor Green
}
Write-Host ""

# Set git config
Write-Host "👤 Setting up Git user information..." -ForegroundColor Yellow
$userName = Read-Host "Enter your name (for commits)"
$userEmail = Read-Host "Enter your email (for commits)"

git config user.name "$userName"
git config user.email "$userEmail"

Write-Host "✅ User configured: $userName <$userEmail>" -ForegroundColor Green
Write-Host ""

# Add remote
Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update to arlantaan/trustqualitydesigns? (y/n)"
    if ($updateRemote -eq "y") {
        git remote set-url origin https://github.com/arlantaan/trustqualitydesigns.git
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin https://github.com/arlantaan/trustqualitydesigns.git
    Write-Host "✅ Remote added: arlantaan/trustqualitydesigns" -ForegroundColor Green
}
Write-Host ""

# Show status
Write-Host "📊 Repository status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Stage files
Write-Host "📝 Staging all files..." -ForegroundColor Yellow
git add .
Write-Host "✅ All files staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "📋 Files ready to commit:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Commit
$proceed = Read-Host "Create initial commit? (y/n)"
if ($proceed -eq "y") {
    Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
    
    $commitMessage = @"
Initial commit: Trust Quality Designs website

- Next.js 15 with App Router
- Dark red theme with Tailwind CSS
- Mobile features (gyroscope tilt, shake-to-click)
- Responsive design
- Deployment scripts for Hetzner VPS
- Comprehensive documentation
"@
    
    git commit -m $commitMessage
    
    Write-Host "✅ Initial commit created" -ForegroundColor Green
    Write-Host ""
    
    # Push to GitHub
    Write-Host "⚠️  Make sure you've created the repository on GitHub:" -ForegroundColor Yellow
    Write-Host "   https://github.com/arlantaan/trustqualitydesigns" -ForegroundColor Cyan
    Write-Host ""
    
    $push = Read-Host "Push to GitHub now? (y/n)"
    if ($push -eq "y") {
        Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
        
        # Check if main branch exists, rename if needed
        $currentBranch = git branch --show-current
        if ($currentBranch -ne "main") {
            Write-Host "📌 Renaming branch to 'main'..." -ForegroundColor Yellow
            git branch -M main
        }
        
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📝 Next steps:" -ForegroundColor Cyan
            Write-Host "   1. Visit: https://github.com/arlantaan/trustqualitydesigns" -ForegroundColor White
            Write-Host "   2. Review your repository" -ForegroundColor White
            Write-Host "   3. Setup branch protection (Settings → Branches)" -ForegroundColor White
            Write-Host "   4. Add collaborators if needed (Settings → Collaborators)" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "❌ Push failed!" -ForegroundColor Red
            Write-Host "Please check:" -ForegroundColor Yellow
            Write-Host "   1. Repository exists on GitHub" -ForegroundColor White
            Write-Host "   2. You have access to arlantaan/trustqualitydesigns" -ForegroundColor White
            Write-Host "   3. GitHub credentials are configured" -ForegroundColor White
            Write-Host ""
            Write-Host "Try pushing manually: git push -u origin main" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "⏸️  Push skipped" -ForegroundColor Yellow
        Write-Host "To push later, run: git push -u origin main" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Commit skipped" -ForegroundColor Yellow
    Write-Host "To commit later, run:" -ForegroundColor Cyan
    Write-Host '   git commit -m "Initial commit"' -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md              (Project overview)" -ForegroundColor White
Write-Host "   - GITHUB_SETUP.md        (GitHub workflow guide)" -ForegroundColor White
Write-Host "   - DEPLOYMENT_SUMMARY.md  (Deployment details)" -ForegroundColor White
Write-Host "   - CHANGELOG.md           (Version history)" -ForegroundColor White
Write-Host ""
