
## TQD Website Direct Server Deployment Guide

1. SSH into your server:
   ssh root@<server_ip>

2. Upload your project archive (excluding node_modules, .git, .next):
   tar -czf tqd-deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=.next .
   scp tqd-deploy.tar.gz root@<server_ip>:/var/www/tqd/

3. On the server, extract and install dependencies:
   cd /var/www/tqd
   tar -xzf tqd-deploy.tar.gz
   npm install --production
   npm run build

4. Start your app with PM2:
   pm2 delete tqd-website 2>/dev/null || true
   pm2 start npm --name tqd-website -- start
   pm2 save

5. Ensure Nginx is configured to proxy to port 3000.

6. Test your site at http://<server_ip>

---
Replace <server_ip> with your actual server IP address.
