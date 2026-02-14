#!/bin/bash
cat > /etc/nginx/sites-available/tqd <<'ENDCONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name 46.225.69.136;

    location / {
        proxy_pass http://[::1]:3000;
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
ENDCONFIG

nginx -t && systemctl reload nginx
echo "✅ Nginx configured for IPv6"
