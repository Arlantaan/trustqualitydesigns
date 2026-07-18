#!/bin/bash
# TQD Deployment Audit Script
# Checks deployment progress and key files/processes

set -e

PROJECT_DIR="/var/www/tqd"
NODE_MODULES="$PROJECT_DIR/node_modules"
NEXT_DIR="$PROJECT_DIR/.next"
PM2_NAME="tqd-website"
NGINX_LOG="/var/log/nginx/error.log"

# 1. Check project directory
if [ -d "$PROJECT_DIR" ]; then
  echo "[✓] Project directory exists: $PROJECT_DIR"
else
  echo "[✗] Project directory missing: $PROJECT_DIR"
fi

# 2. Check node_modules
if [ -d "$NODE_MODULES" ]; then
  echo "[✓] node_modules exists"
else
  echo "[✗] node_modules missing"
fi

# 3. Check .next build
if [ -d "$NEXT_DIR" ]; then
  echo "[✓] .next build exists"
else
  echo "[✗] .next build missing"
fi

# 4. Check PM2 process
pm2 status $PM2_NAME | grep -q online && echo "[✓] PM2 process '$PM2_NAME' is online" || echo "[✗] PM2 process '$PM2_NAME' is not online"

# 5. Check Nginx status
systemctl is-active nginx >/dev/null && echo "[✓] Nginx is running" || echo "[✗] Nginx is not running"

# 6. Check Nginx error log for recent errors
if [ -f "$NGINX_LOG" ]; then
  echo "--- Last 10 Nginx errors ---"
  tail -n 10 "$NGINX_LOG"
else
  echo "[!] Nginx error log not found"
fi

# 7. Check site accessibility
curl -I http://localhost:3000 2>/dev/null | grep HTTP || echo "[!] Site not responding on port 3000"

# 8. Check free memory
free -m | grep Mem

# 9. List uploaded archives
ls -lh $PROJECT_DIR/node_modules_*.tar.gz $PROJECT_DIR/.next.tar.gz $PROJECT_DIR/public.tar.gz $PROJECT_DIR/src.tar.gz 2>/dev/null || echo "[!] No deployment archives found"

# 10. List extracted folders
ls -l $NODE_MODULES | head -20

exit 0
