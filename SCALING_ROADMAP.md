# 📊 Scaling Strategy for TQD - 1000+ Users

## Current Status
- **Single Server:** 194.163.135.177
- **Expected Capacity:** 300-500 concurrent users
- **Target:** 1000+ concurrent users

---

## Phase 1: Single Server Optimization (Immediate - Now)

### What's Included
✅ Nginx tuning (worker_connections, caching, compression)
✅ Multiple Node.js worker processes (PM2 clustering)
✅ Response caching (60s for APIs, 30d for static)
✅ Rate limiting (per-IP request throttling)
✅ Connection pooling (keepalive, reuse)

### Expected Capacity After Phase 1
- **~500-800 concurrent users**
- **~2000-3000 requests/second**

### Files to Deploy
```
nginx-optimized-1000users.conf  → Replace current nginx.conf
ecosystem.config.js             → Run with PM2
```

### Deployment Commands
```bash
# On server:
cp /var/www/tqd/nginx-optimized-1000users.conf /etc/nginx/nginx.conf
npm install pm2 -g
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
nginx -t && systemctl restart nginx
```

---

## Phase 2: Caching Layer (Week 2)

### Add Redis Cache
```bash
docker run -d \
  --name tqd-redis \
  --restart unless-stopped \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine \
  redis-server --maxmemory 4gb --maxmemory-policy allkeys-lru
```

### Update docker-compose.production.yml
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --maxmemory 4gb --maxmemory-policy allkeys-lru
```

### Use in API Routes
```typescript
import { getCachedResponse, cacheResponse } from '@/lib/redis';

export async function GET(request: Request) {
  // Try cache first
  const cached = await getCachedResponse('api:key');
  if (cached) return Response.json(cached);
  
  // Fetch data
  const data = await fetchData();
  
  // Cache for 5 minutes
  await cacheResponse('api:key', data, 300);
  
  return Response.json(data);
}
```

### Expected Improvement
- **Cache hit rate:** 60-80%
- **Response time:** 10x faster for cached responses
- **DB load:** Reduced by 70%
- **New capacity:** 1000-1500 concurrent users

---

## Phase 3: Database (Month 1)

### When Needed
Once you add dynamic content (CMS, user accounts, etc.)

### Setup
```bash
# Add PostgreSQL to docker-compose.yml
docker compose up -d postgres

# Handle migrations
npm run db:migrate
```

### Connection Pooling
Use `pg-boss` or `pgBouncer` for connection pooling:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 20,  // Connection pool size
  idleTimeoutMillis: 30000,
});
```

---

## Phase 4: Horizontal Scaling (Month 2+)

When single server reaches capacity (~80%):

### Architecture
```
┌─────────────────────────────────┐
│   Load Balancer (Nginx/HAProxy)  │
│   Round-robin / Least Conn       │
└──────────────┬──────────────────┘
       ┌───────┼────────┬────────┐
       │       │        │        │
   ┌───▼─┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
   │ App │ │ App │ │ App │ │ App │
   │ S-1 │ │ S-2 │ │ S-3 │ │ S-4 │
   └─────┘ └─────┘ └─────┘ └─────┘
       │       │        │        │
       └───────┼────────┴────────┘
               │
         ┌─────▼─────┐
         │PostgreSQL │
         │  (RDS)    │
         └───────────┘
         
    + Redis (ElastiCache)
    + S3 (Static files)
```

### Implementation
1. **Set up load balancer** (Nginx or HAProxy on separate server)
2. **Use managed database** (AWS RDS, DigitalOcean)
3. **Use managed cache** (AWS ElastiCache, Redis Cloud)
4. **Use CDN** (Cloudflare, Bunny CDN)

### DNS Configuration
```
demoview.space  →  Load Balancer IP
Load Balancer   →  Server-1, Server-2, Server-3, Server-4
```

---

## Phase 5: CDN & Global Distribution (Month 3+)

### Cloudflare Setup
```
Requests  →  Cloudflare Edge  →  Your Server
            (Cache, WAF, DDoS)
```

### Benefits
- 60-80% cache hit rate at edge
- DDoS protection
- Automatic image optimization
- Global distribution

### Cost
- Free tier supports ~1000 users
- Pro plan ($20/month) for 5000+ users

---

## Monitoring & Alerting (All Phases)

### Key Metrics
```bash
# CPU usage (watch for > 80%)
top -b -n 1 | head -15

# Memory (watch for > 85%)
free -h

# Disk I/O
iostat -x 1 5

# Network
iftop -n

# PM2 cluster status
pm2 status
pm2 logs --lines 100
```

### Set up Monitoring Stack
```yaml
# docker-compose.yml additions
prometheus:
  image: prom/prometheus:latest
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana:latest
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Alerting Rules
- **CPU > 80%:** Scale to more servers
- **Memory > 85%:** Restart process
- **Error rate > 1%:** Investigate logs
- **Response time > 2s:** Check DB/API latency

---

## Cost Estimation

| Phase | Setup | Monthly | Users |
|-------|-------|---------|-------|
| 1 (Current) | $0 | Server cost | 500 |
| 2 (Redis) | $5 | +$5 | 1,000 |
| 3 (Database) | $50 | +$50 | 1,500 |
| 4 (4 Servers) | $100 | +$200 | 3,000 |
| 5 (CDN) | $0 | +$30 | 5,000+ |

---

## Action Items

- [ ] **Phase 1** (This week)
  - [ ] Deploy nginx-optimized-1000users.conf
  - [ ] Configure PM2 clustering
  - [ ] Monitor performance
  
- [ ] **Phase 2** (Week 2)
  - [ ] Set up Redis
  - [ ] Implement caching in API routes
  - [ ] Test cache hit rates
  
- [ ] **Phase 3** (Month 1)
  - [ ] Add database if needed
  - [ ] Set up connection pooling
  - [ ] Implement DB caching
  
- [ ] **Phase 4** (Month 2)
  - [ ] Prepare for horizontal scaling
  - [ ] Test load balancing
  - [ ] Document scaling procedure
  
- [ ] **Phase 5** (Month 3)
  - [ ] Set up CDN
  - [ ] Configure global distribution
  - [ ] Monitor edge performance

---

## Performance Benchmarks

### Before Optimization
- Req/s: 50-100
- P95 latency: 500-1000ms
- Concurrent users: 100-300
- CPU: 60-80%

### After Phase 1 (Nginx + PM2)
- Req/s: 500-1000
- P95 latency: 100-200ms
- Concurrent users: 500-800
- CPU: 40-60%

### After Phase 2 (+ Redis)
- Req/s: 1000-2000
- P95 latency: 20-50ms
- Concurrent users: 1000-1500
- CPU: 30-50%

### After Phase 4 (+ Horizontal)
- Req/s: 5000-10000
- P95 latency: 10-30ms
- Concurrent users: 3000-5000+
- CPU: 20-40% per server

---

## Support & Documentation

- **Nginx tuning:** https://nginx.org/en/docs/
- **PM2 clustering:** https://pm2.keymetrics.io/docs/usage/cluster-mode/
- **Redis caching:** https://redis.io/docs/
- **Scaling strategies:** https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling

Contact me for deployment support at each phase! 🚀
