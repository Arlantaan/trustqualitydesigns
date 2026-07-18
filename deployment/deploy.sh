#!/bin/bash

# ============================================
# APPLICATION DEPLOYMENT SCRIPT
# Deploy TQD Next.js Application
# ============================================

set -e  # Exit on any error

APP_DIR="/var/www/tqd"
APP_NAME="tqd-website"

echo "🚀 Starting deployment..."

# Navigate to app directory
cd $APP_DIR

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest code..."
    git pull origin main
else
    echo "⚠️  No git repository found. Make sure code is uploaded."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Stop existing PM2 process
echo "🔄 Restarting application..."
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
pm2 start npm --name $APP_NAME -- start
pm2 save

# Show status
pm2 status

echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is running at:"
echo "   http://91.98.203.172"
echo ""
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs: pm2 logs $APP_NAME"
