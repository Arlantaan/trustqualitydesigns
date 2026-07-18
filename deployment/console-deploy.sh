#!/bin/bash

# ============================================
# ONE-LINE SERVER CLEANUP + REDEPLOY
# Run this directly in Hetzner web console
# ============================================

# Copy and paste this entire script into Hetzner console

echo "🧹 Cleaning server..."
pm2 delete tqd-website 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 flush
pm2 save --force
rm -rf /var/www/tqd
mkdir -p /var/www/tqd
systemctl reload nginx

echo "✅ Server cleaned!"
echo ""
echo "📥 Deploying from GitHub..."
cd /var/www/tqd
git clone https://github.com/arlantaan/trustqualitydesigns.git .

echo ""
echo "📦 Installing dependencies..."
npm install --production

echo ""
echo "🔨 Building..."
npm run build

echo ""
echo "🚀 Starting application..."
pm2 start npm --name tqd-website -- start
pm2 save

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
pm2 status
echo ""
echo "🌐 Website: http://91.98.203.172"
