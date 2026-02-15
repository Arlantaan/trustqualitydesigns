#!/bin/bash

# ============================================
# SERVER CLEANUP SCRIPT
# Completely remove deployed website from Hetzner
# ============================================

set -e  # Exit on any error

APP_DIR="/var/www/tqd"
APP_NAME="tqd-website"

echo "🧹 Starting server cleanup..."
echo "⚠️  This will completely remove the deployed website!"
echo ""

# Stop and delete PM2 process
echo "🛑 Stopping PM2 processes..."
pm2 delete $APP_NAME 2>/dev/null || echo "   No PM2 process found"
pm2 delete all 2>/dev/null || echo "   No other PM2 processes"
pm2 save --force

# Clear PM2 logs and cache
echo "🗑️  Clearing PM2 logs and cache..."
pm2 flush
rm -rf ~/.pm2/logs/* 2>/dev/null || true

# Remove application directory completely
echo "📁 Removing application directory..."
if [ -d "$APP_DIR" ]; then
    rm -rf $APP_DIR
    echo "   ✅ Removed $APP_DIR"
else
    echo "   ℹ️  Directory $APP_DIR doesn't exist"
fi

# Recreate empty application directory
echo "📁 Creating fresh application directory..."
mkdir -p $APP_DIR
chown -R root:root $APP_DIR
chmod 755 $APP_DIR

# Clear Next.js cache if it exists elsewhere
echo "🗑️  Clearing any Next.js cache..."
rm -rf /tmp/.next* 2>/dev/null || true
rm -rf /root/.npm 2>/dev/null || true

# Clean nginx cache
echo "🌐 Clearing nginx cache..."
rm -rf /var/cache/nginx/* 2>/dev/null || true
systemctl reload nginx

# Clean system cache
echo "🧹 Cleaning system cache..."
apt clean
apt autoclean

echo ""
echo "✅ Server cleanup complete!"
echo ""
echo "📊 Current status:"
pm2 status
echo ""
echo "📁 Application directory:"
ls -lah $APP_DIR
echo ""
echo "🚀 Server is now clean and ready for fresh deployment!"
echo "   Run your deployment script to deploy the website."
