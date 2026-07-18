#!/bin/bash
# Direct fix - no bullshit, just fix it

cd /var/www/tqd || exit 1

echo "=== Stopping everything ==="
pm2 delete all 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 2

echo "=== Cleaning everything ==="
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

echo "=== Fresh install ==="
npm install

echo "=== Building ==="
npm run build

echo "=== Verifying build ==="
if [ ! -f ".next/BUILD_ID" ]; then
    echo "BUILD FAILED - BUILD_ID missing!"
    exit 1
fi

echo "=== Starting PM2 ==="
pm2 delete tqd-website 2>/dev/null
pm2 start npm --name tqd-website -- start
pm2 save

echo "=== Status ==="
pm2 status
sleep 3
pm2 logs tqd-website --lines 20 --nostream
