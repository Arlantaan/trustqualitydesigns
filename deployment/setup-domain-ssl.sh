#!/bin/bash
# setup-domain-ssl.sh
# Run this ON the server after DNS A-records are pointing to the server IP.
# Usage: bash /tmp/setup-domain-ssl.sh
#
# What it does:
#   1. Installs certbot (Let's Encrypt)
#   2. Issues a certificate for demoview.space and www.demoview.space
#   3. Copies /etc/letsencrypt into the nginx container mount (if using Docker)
#   4. Restarts nginx so the new SSL server block activates
#   5. Sets up auto-renewal via cron

set -e

DOMAIN="demoview.space"
EMAIL="abdullaalami1@gmail.com"
APP_DIR="/var/www/tqd"

echo "=== Installing certbot ==="
apt-get update -qq
apt-get install -y certbot

echo "=== Stopping nginx temporarily for standalone challenge ==="
docker compose -f "${APP_DIR}/docker-compose.yml" stop nginx 2>/dev/null || true

echo "=== Requesting Let's Encrypt certificate ==="
certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email "${EMAIL}" \
  -d "${DOMAIN}" \
  -d "www.${DOMAIN}"

echo "=== Certificate issued at /etc/letsencrypt/live/${DOMAIN}/ ==="

echo "=== Restarting full stack ==="
docker compose -f "${APP_DIR}/docker-compose.yml" up -d

echo "=== Setting up auto-renewal cron (runs at 2:30 AM daily) ==="
(crontab -l 2>/dev/null; echo "30 2 * * * certbot renew --quiet --pre-hook 'docker compose -f ${APP_DIR}/docker-compose.yml stop nginx' --post-hook 'docker compose -f ${APP_DIR}/docker-compose.yml up -d nginx'") | crontab -

echo ""
echo "=== Done! Visit https://${DOMAIN} ==="
