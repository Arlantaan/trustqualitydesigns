#!/bin/bash
# ============================================
# Fresh Server Setup Script
# Complete setup for TQD Next.js deployment
# ============================================
#
# USAGE:
#   1. Replace SERVER_IP below with your server IP
#   2. Run: bash fresh-server-setup.sh
#
# This script will:
#   - Install Node.js 20
#   - Install PM2
#   - Install Nginx
#   - Configure firewall
#   - Set up Nginx reverse proxy
#   - Create deployment directory
# ============================================

set -e  # Exit on error

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
SERVER_IP="89.167.105.217"            # Your server IP address
APP_NAME="tqd-website"              # PM2 process name
APP_DIR="/var/www/tqd"              # Application directory
DOMAIN="demoview.space"              # Optional: your domain name (leave empty for IP only)

# ============================================
# Colors for output
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# Functions
# ============================================
print_step() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}"
}

print_info() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

# ============================================
# Step 1: Update System
# ============================================
print_step "Step 1: Updating system packages"
apt update
apt upgrade -y

# ============================================
# Step 2: Install Node.js 20
# ============================================
print_step "Step 2: Installing Node.js 20"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_info "Node.js already installed: $NODE_VERSION"
else
    print_info "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_info "Node.js: $NODE_VERSION"
print_info "npm: $NPM_VERSION"

# ============================================
# Step 3: Install PM2
# ============================================
print_step "Step 3: Installing PM2"
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_info "PM2 already installed: $PM2_VERSION"
else
    print_info "Installing PM2 globally..."
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
fi

PM2_VERSION=$(pm2 --version)
print_info "PM2: $PM2_VERSION"

# ============================================
# Step 4: Install Nginx
# ============================================
print_step "Step 4: Installing Nginx"
if systemctl is-active --quiet nginx; then
    print_info "Nginx is already installed and running"
else
    print_info "Installing Nginx..."
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

# ============================================
# Step 5: Configure Firewall
# ============================================
print_step "Step 5: Configuring firewall"
if command -v ufw &> /dev/null; then
    print_info "Configuring UFW firewall..."
    ufw --force enable
    ufw allow 22/tcp   # SSH
    ufw allow 80/tcp   # HTTP
    ufw allow 443/tcp  # HTTPS
    ufw status
else
    print_info "UFW not installed, skipping firewall setup"
fi

# ============================================
# Step 6: Create Application Directory
# ============================================
print_step "Step 6: Creating application directory"
mkdir -p $APP_DIR
chown -R $USER:$USER $APP_DIR
print_info "Directory created: $APP_DIR"

# ============================================
# Step 7: Configure Nginx
# ============================================
print_step "Step 7: Configuring Nginx reverse proxy"

# Determine server_name
if [ -z "$DOMAIN" ]; then
    SERVER_NAME="$SERVER_IP _"
else
    SERVER_NAME="$DOMAIN $SERVER_IP"
fi

cat > /etc/nginx/sites-available/$APP_NAME <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    # Main application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
print_info "Testing Nginx configuration..."
if nginx -t; then
    systemctl reload nginx
    print_info "Nginx configured successfully"
else
    print_error "Nginx configuration test failed!"
    exit 1
fi

# ============================================
# Step 8: Verify Installation
# ============================================
print_step "Step 8: Verifying installation"

echo ""
echo "=== Installation Summary ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "App Directory: $APP_DIR"
echo "Server IP: $SERVER_IP"
if [ ! -z "$DOMAIN" ]; then
    echo "Domain: $DOMAIN"
fi
echo ""

# ============================================
# Step 9: Next Steps
# ============================================
print_step "Setup Complete!"
echo ""
print_info "Next steps:"
echo "1. Upload your application files to: $APP_DIR"
echo "2. Run the deployment script from your local machine"
echo "3. Or manually deploy:"
echo "   cd $APP_DIR"
echo "   npm install"
echo "   npm run build"
echo "   pm2 start npm --name $APP_NAME -- start"
echo "   pm2 save"
echo ""
print_info "Your site will be available at:"
if [ ! -z "$DOMAIN" ]; then
    echo "   http://$DOMAIN"
fi
echo "   http://$SERVER_IP"
echo ""
print_info "Useful commands:"
echo "   pm2 status              # Check app status"
echo "   pm2 logs $APP_NAME      # View logs"
echo "   pm2 restart $APP_NAME   # Restart app"
echo "   nginx -t                # Test nginx config"
echo "   systemctl reload nginx  # Reload nginx"
echo ""
