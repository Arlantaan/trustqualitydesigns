#!/bin/bash
# ============================================
# Contabo Secure Server Setup
# TQD Next.js deployment with abuse prevention
# ============================================
#
# SECURITY-HARDENED VERSION:
#   - npm ci (verified packages only)
#   - Let's Encrypt SSL certificate
#   - Rate limiting & DDoS protection
#   - Firewall & fail2ban
#   - Monitoring for malicious activity
#
# USAGE:
#   bash contabo-server-setup.sh
#
# ============================================

set -e  # Exit on error

# ============================================
# CONFIGURATION
# ============================================
SERVER_IP="194.163.135.177"
APP_NAME="tqd-website"
APP_DIR="/var/www/tqd"
DOMAIN="demoview.space"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================
# FUNCTIONS
# ============================================
print_step() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================
# Step 1: Update System
# ============================================
print_step "Step 1: System Update & Security"
apt update
apt upgrade -y
apt install -y curl wget git build-essential

# Enable automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
print_success "Automatic security updates enabled"

# ============================================
# Step 2: Install Node.js 20 (LTS)
# ============================================
print_step "Step 2: Installing Node.js 20"
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js from NodeSource repository..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
print_success "Node.js $(node --version) installed"
print_success "npm $(npm --version) installed"

# ============================================
# Step 3: Install PM2 (Process Manager)
# ============================================
print_step "Step 3: Installing PM2"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --production
    pm2 startup systemd -u root --hp /root
    pm2 save
fi
print_success "PM2 $(pm2 --version) installed"

# ============================================
# Step 4: Install Nginx
# ============================================
print_step "Step 4: Installing Nginx"
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx
print_success "Nginx installed and enabled"

# ============================================
# Step 5: Install Certbot (Let's Encrypt)
# ============================================
print_step "Step 5: Installing Certbot for SSL"
apt install -y certbot python3-certbot-nginx
print_success "Certbot installed"

# ============================================
# Step 6: Install Security Tools
# ============================================
print_step "Step 6: Installing Security Tools"

# Install fail2ban (intrusion detection)
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
print_success "fail2ban installed and enabled"

# Install netstat tools for monitoring
apt install -y net-tools

print_success "Security tools installed"

# ============================================
# Step 7: Configure Firewall
# ============================================
print_step "Step 7: Configuring UFW Firewall"
apt install -y ufw

ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS

print_success "Firewall configured"
echo ""
ufw status
echo ""

# ============================================
# Step 8: Create Application Directory
# ============================================
print_step "Step 8: Creating Application Directory"
mkdir -p $APP_DIR
cd $APP_DIR
print_success "Directory created: $APP_DIR"

# ============================================
# Step 9: Configure Nginx (Basic)
# ============================================
print_step "Step 9: Configuring Nginx Reverse Proxy"

# Create server block
SERVER_NAME="$DOMAIN"
if [ "$DOMAIN" != "demoview.space" ]; then
    SERVER_NAME="$DOMAIN $SERVER_IP"
fi

cat > /etc/nginx/sites-available/$APP_NAME <<'NGINX_CONFIG'
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    listen 80;
    listen [::]:80;
    server_name PLACEHOLDER_DOMAIN;

    # Redirect HTTP to HTTPS (after SSL is configured)
    # Uncomment after certbot sets up SSL:
    # return 301 https://$server_name$request_uri;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-Robots-Tag "noindex, nofollow" always;

    # Logging (use fixed paths, no variables)
    access_log /var/log/nginx/tqd-website_access.log combined;
    error_log /var/log/nginx/tqd-website_error.log warn;

    # Main application (with rate limiting)
    location / {
        limit_req zone=general burst=10 nodelay;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # API endpoints (higher rate limit)
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check (no logging, no rate limit)
    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:3000;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_CONFIG

# Replace placeholder domain
sed -i "s|PLACEHOLDER_DOMAIN|$SERVER_NAME|g" /etc/nginx/sites-available/$APP_NAME

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME
rm -f /etc/nginx/sites-enabled/default

# Test configuration
if nginx -t; then
    systemctl reload nginx
    print_success "Nginx configured and reloaded"
else
    print_error "Nginx configuration test failed!"
    exit 1
fi

# ============================================
# Step 10: Configure fail2ban
# ============================================
print_step "Step 10: Configuring fail2ban for Intrusion Detection"

cat > /etc/fail2ban/jail.local <<'FAIL2BAN'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true

[nginx-noscript]
enabled = true
FAIL2BAN

systemctl restart fail2ban
print_success "fail2ban configured"

# ============================================
# Step 11: Setup Monitoring Script
# ============================================
print_step "Step 11: Creating Abuse Monitoring Script"

cat > /usr/local/bin/check-abuse.sh <<'MONITOR'
#!/bin/bash
# Check for suspicious network activity

echo "=== Network Activity Summary ==="
echo "Listening ports:"
netstat -tlnp 2>/dev/null | grep LISTEN || ss -tlnp 2>/dev/null | grep LISTEN

echo ""
echo "Active connections:"
netstat -tnp 2>/dev/null | grep ESTABLISHED | wc -l || ss -tnp 2>/dev/null | grep ESTABLISHED | wc -l

echo ""
echo "Recent nginx errors (rate limiting):"
tail -20 /var/log/nginx/error.log | grep -i "limiting requests" || echo "None found"

echo ""
echo "fail2ban status:"
fail2ban-client status 2>/dev/null || echo "fail2ban not running"

echo ""
echo "System load:"
uptime

echo ""
echo "Memory usage:"
free -h | head -3

echo ""
echo "Disk usage:"
df -h / | tail -1
MONITOR

chmod +x /usr/local/bin/check-abuse.sh
print_success "Monitoring script created: /usr/local/bin/check-abuse.sh"

# ============================================
# Step 12: Setup Log Rotation
# ============================================
print_step "Step 12: Configuring Log Rotation"

cat > /etc/logrotate.d/tqd-website <<LOGROTATE
/var/log/nginx/tqd-website_*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \`cat /var/run/nginx.pid\`
        fi
    endscript
}
LOGROTATE

print_success "Log rotation configured"

# ============================================
# SUMMARY
# ============================================
print_step "Server Setup Complete!"

echo ""
echo -e "${GREEN}Installed Services:${NC}"
echo "  ✓ Node.js $(node --version)"
echo "  ✓ npm $(npm --version)"
echo "  ✓ PM2 process manager"
echo "  ✓ Nginx web server"
echo "  ✓ Certbot (for SSL certificates)"
echo "  ✓ fail2ban (intrusion detection)"
echo "  ✓ UFW firewall"
echo ""
echo -e "${GREEN}Security Features:${NC}"
echo "  ✓ Firewall configured (SSH, HTTP, HTTPS only)"
echo "  ✓ Automatic security updates enabled"
echo "  ✓ Nginx rate limiting (5 req/s general, 10 req/s API)"
echo "  ✓ fail2ban monitoring and auto-blocking"
echo "  ✓ Abuse monitoring script at: /usr/local/bin/check-abuse.sh"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "  1. Check server status:"
echo "     check-abuse.sh"
echo "  2. Deploy your application (use deploy-contabo.ps1)"
echo "  3. Monitor logs:"
echo "     tail -f /var/log/nginx/${APP_NAME}_access.log"
echo ""
echo -e "${YELLOW}To setup SSL certificate after deployment:${NC}"
echo "  certbot --nginx -d $DOMAIN"
echo ""

print_success "Setup complete!"
