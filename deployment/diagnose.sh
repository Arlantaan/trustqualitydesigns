#!/bin/bash
# Find out what's actually wrong

cd /var/www/tqd

echo "=== Current directory ==="
pwd
ls -la

echo ""
echo "=== .next folder contents ==="
if [ -d ".next" ]; then
    ls -la .next/ | head -20
    echo ""
    echo "BUILD_ID exists?"
    ls -la .next/BUILD_ID 2>/dev/null || echo "NO BUILD_ID!"
    echo ""
    echo ".next/standalone exists?"
    ls -la .next/standalone 2>/dev/null || echo "NO standalone!"
else
    echo ".next folder DOES NOT EXIST!"
fi

echo ""
echo "=== package.json ==="
cat package.json | head -30

echo ""
echo "=== Node version ==="
node --version
npm --version

echo ""
echo "=== PM2 status ==="
pm2 status

echo ""
echo "=== PM2 logs (errors) ==="
pm2 logs tqd-website --err --lines 5 --nostream 2>/dev/null || echo "No logs"

echo ""
echo "=== Port 3000 ==="
netstat -tlnp | grep :3000 || echo "Port 3000 not in use"

echo ""
echo "=== Try manual build test ==="
echo "Running: npm run build"
npm run build 2>&1 | tail -20
