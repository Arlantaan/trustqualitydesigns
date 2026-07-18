#!/bin/bash
# Setup nginx to proxy to localhost:3000

cat > /etc/nginx/sites-available/tqd <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 77.42.92.225 _;

    location / {
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
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/tqd /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t && systemctl reload nginx

echo "Nginx configured!"
