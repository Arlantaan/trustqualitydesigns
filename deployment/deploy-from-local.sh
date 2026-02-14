#!/bin/bash

# ============================================
# LOCAL TO SERVER DEPLOYMENT SCRIPT
# Upload and deploy from your local machine
# ============================================

set -e

SERVER_IP="46.225.69.136"
SERVER_USER="root"
SERVER_DIR="/var/www/tqd"

echo "🚀 Deploying to demo server..."

# Build locally first
echo "🔨 Building application locally..."
npm run build

# Create deployment package (exclude unnecessary files)
echo "📦 Creating deployment package..."
tar -czf tqd-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='.env.local' \
    .

# Upload to server
echo "📤 Uploading to server..."
scp tqd-deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# SSH and deploy
echo "🔄 Deploying on server..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    # Navigate to app directory
    mkdir -p /var/www/tqd
    cd /var/www/tqd
    
    # Extract uploaded files
    tar -xzf /tmp/tqd-deploy.tar.gz
    rm /tmp/tqd-deploy.tar.gz
    
    # Install dependencies
    npm install --production
    
    # Build on server
    npm run build
    
    # Restart with PM2
    pm2 delete tqd-website 2>/dev/null || true
    pm2 start npm --name tqd-website -- start
    pm2 save
    
    echo "✅ Deployment complete!"
    pm2 status
ENDSSH

# Cleanup local package
rm tqd-deploy.tar.gz

echo ""
echo "✅ Deployment successful!"
echo "🌐 Visit: http://$SERVER_IP"
