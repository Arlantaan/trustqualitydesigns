#!/bin/bash
# Server Setup for 1000+ Users
# Run this on the server after initial deployment
# Usage: bash setup-scaling.sh

set -e

echo "================================================"
echo "   TQD Server Scaling Setup"
echo "   Optimizing for 1000+ concurrent users"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/tqd"

# ============================================
# 1. Install PM2 Globally
# ============================================
echo -e "${YELLOW}[1/6] Installing PM2...${NC}"
npm install -g pm2
pm2 completion install
echo -e "${GREEN}✓ PM2 installed${NC}\n"

# ============================================
# 2. Stop existing processes
# ============================================
echo -e "${YELLOW}[2/6] Stopping existing processes...${NC}"
pm2 delete all 2>/dev/null || true
docker compose -f $APP_DIR/docker-compose.production.yml down || true
echo -e "${GREEN}✓ Cleaned up${NC}\n"

# ============================================
# 3. Update Nginx config
# ============================================
echo -e "${YELLOW}[3/6] Updating Nginx configuration...${NC}"
cp $APP_DIR/nginx-optimized-1000users.conf /etc/nginx/nginx.conf
mkdir -p /var/cache/nginx/api /var/cache/nginx/static
chown -R www-data:www-data /var/cache/nginx
nginx -t
systemctl restart nginx
echo -e "${GREEN}✓ Nginx optimized${NC}\n"

# ============================================
# 4. Build application
# ============================================
echo -e "${YELLOW}[4/6] Building application...${NC}"
cd $APP_DIR
npm install --production
npm run build
echo -e "${GREEN}✓ Build complete${NC}\n"

# ============================================
# 5. Start with PM2 clustering
# ============================================
echo -e "${YELLOW}[5/6] Starting PM2 cluster...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root
echo -e "${GREEN}✓ PM2 cluster started${NC}\n"

# ============================================
# 6. System tuning
# ============================================
echo -e "${YELLOW}[6/6] Optimizing system limits...${NC}"

# Increase file descriptors
cat >> /etc/security/limits.conf << 'EOF'
root soft nofile 65535
root hard nofile 65535
* soft nofile 65535
* hard nofile 65535
EOF

# Kernel tuning for high concurrency
sysctl -w net.core.somaxconn=65535
sysctl -w net.ipv4.tcp_max_syn_backlog=65535
sysctl -w net.core.netdev_max_backlog=65535

# Save to /etc/sysctl.conf
cat >> /etc/sysctl.conf << 'EOF'
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535
net.core.netdev_max_backlog=65535
net.ipv4.tcp_fin_timeout=30
net.ipv4.tcp_tw_reuse=1
EOF

sysctl -p
echo -e "${GREEN}✓ System optimized${NC}\n"

# ============================================
# Status Check
# ============================================
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   ✓ Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "Cluster Info:"
pm2 info tqd-app | head -20
echo ""
echo "Monitoring:"
echo "  View logs:     pm2 logs tqd-app"
echo "  Monitor:       pm2 monit"
echo "  Status:        pm2 status"
echo ""
echo "Next Steps:"
echo "  1. Verify site loads: curl -I https://demoview.space"
echo "  2. Monitor performance: pm2 monit"
echo "  3. Load test: ab -n 1000 -c 100 https://demoview.space"
echo ""
