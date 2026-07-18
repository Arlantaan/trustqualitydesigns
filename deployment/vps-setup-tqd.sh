#!/bin/bash
# ============================================
# TQD Production Server Setup  (Contabo Cloud VPS 4 2026)
# Server : 169.58.36.209
# Domain : trustqualitydesign.com (+ www)
# ============================================
# Run ONCE on a fresh server, as root:
#   bash /tmp/vps-setup-tqd.sh
# ============================================

set -e

SERVER_IP="169.58.36.209"
APP_NAME="tqd-website"
APP_DIR="/var/www/tqd"
DOMAIN="trustqualitydesign.com"

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; NC='\033[0m'
step() { echo -e "\n${BLUE}==== $1 ====${NC}"; }
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }

# ---- 1. System update + build tools (python3 needed for better-sqlite3) ----
step "1. System update & build tools"
apt update && apt upgrade -y
apt install -y curl wget git build-essential python3 net-tools
apt install -y unattended-upgrades
ok "System updated"

# ---- 2. Node.js 20 LTS ----
step "2. Node.js 20"
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
ok "Node $(node -v), npm $(npm -v)"

# ---- 3. PM2 ----
step "3. PM2 process manager"
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
  pm2 startup systemd -u root --hp /root
fi
ok "PM2 $(pm2 -v)"

# ---- 4. Nginx + Certbot ----
step "4. Nginx + Certbot"
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx && systemctl start nginx
ok "Nginx + Certbot installed"

# ---- 5. Security: fail2ban + UFW firewall ----
step "5. Firewall + fail2ban"
apt install -y fail2ban ufw
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
cat > /etc/fail2ban/jail.local <<'F2B'
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
F2B
systemctl enable fail2ban && systemctl restart fail2ban
ok "Firewall (22/80/443) + fail2ban active"

# ---- 6. App directory ----
step "6. App directory"
mkdir -p "$APP_DIR"
ok "$APP_DIR ready"

# ---- 7. Nginx reverse proxy (apex + www, NO noindex — real site) ----
step "7. Nginx reverse proxy"
cat > /etc/nginx/sites-available/$APP_NAME <<'NGINX'
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=15r/s;

server {
    listen 80;
    listen [::]:80;
    server_name trustqualitydesign.com www.trustqualitydesign.com;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    access_log /var/log/nginx/tqd_access.log;
    error_log  /var/log/nginx/tqd_error.log warn;

    location ~* ^/(_next/static|images|favicon) {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        limit_req zone=api burst=30 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location / {
        limit_req zone=general burst=20 nodelay;
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
    }
}
NGINX

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ok "Nginx proxy live for $DOMAIN"

step "Server setup complete"
echo -e "${YELLOW}Next:${NC} upload the app + .env.production, then npm ci && npm run build && pm2 start."
echo -e "${YELLOW}SSL later:${NC} certbot --nginx -d $DOMAIN -d www.$DOMAIN"
