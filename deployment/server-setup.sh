#!/bin/bash

# ============================================
# SERVER SETUP SCRIPT - Ubuntu 24.04
# Demo Server: 91.98.203.172
# ============================================

set -e  # Exit on any error

echo "🚀 Starting server setup for TQD Demo..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx

# Setup firewall
echo "🔥 Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Install Node.js 20.x (LTS)
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version
nginx -v

# Install PM2 for process management
echo "🔄 Installing PM2..."
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/tqd
chown -R root:root /var/www/tqd

# Configure Nginx
echo "🌐 Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default

# Create rate limiting configuration
cat > /etc/nginx/conf.d/rate-limit.conf << 'EOF'
# Rate limiting zones to prevent abuse detection
limit_req_zone $binary_remote_addr zone=general:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
EOF

# Create Nginx config with security headers
cat > /etc/nginx/sites-available/tqd << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 91.98.203.172;  # Replace with your domain when ready

    # Enhanced security headers for demo protection
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header X-Robots-Tag "noindex, nofollow" always;

    # API endpoints with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Main application with rate limiting
    location / {
        limit_req zone=general burst=10 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check (no rate limit)
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/tqd /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Setup fail2ban
echo "🛡️ Configuring Fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

echo "✅ Server setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Upload your application to /var/www/tqd"
echo "2. Run the deploy.sh script"
echo "3. Setup domain and SSL with: certbot --nginx -d yourdomain.com"
echo ""
echo "🔐 Security reminders:"
echo "- Change root password: passwd"
echo "- Create non-root user: adduser username && usermod -aG sudo username"
echo "- Setup SSH keys and disable password login"
