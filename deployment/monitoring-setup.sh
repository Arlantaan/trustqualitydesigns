#!/bin/bash
# Monitoring Setup for TQD
# Provides real-time metrics and alerting
# Usage: bash monitoring-setup.sh

set -e

APP_DIR="/var/www/tqd"
MONITORING_DIR="$APP_DIR/monitoring"

echo "================================================"
echo "   TQD Monitoring Setup"
echo "================================================"
echo ""

# Create monitoring directory
mkdir -p $MONITORING_DIR

# ============================================
# 1. Create Prometheus config
# ============================================
cat > $MONITORING_DIR/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: []

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
EOF

# ============================================
# 2. Create Alert Rules
# ============================================
cat > $MONITORING_DIR/alerts.yml << 'EOF'
groups:
  - name: tqd_alerts
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: node_cpu_usage_percent > 80
        for: 5m
        annotations:
          summary: "High CPU usage ({{ $value }}%)"

      - alert: HighMemoryUsage
        expr: node_memory_usage_percent > 85
        for: 5m
        annotations:
          summary: "High memory usage ({{ $value }}%)"

      - alert: HighDiskUsage
        expr: node_filesystem_usage_percent > 85
        for: 5m
        annotations:
          summary: "High disk usage ({{ $value }}%)"

      - alert: NginxDown
        expr: up{job="nginx"} == 0
        for: 1m
        annotations:
          summary: "Nginx is down"

      - alert: HighErrorRate
        expr: rate(nginx_http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: SlowResponse
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        annotations:
          summary: "P95 response time > 2s"
EOF

# ============================================
# 3. Create docker-compose for monitoring
# ============================================
cat > $MONITORING_DIR/docker-compose.monitoring.yml << 'EOF'
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: tqd-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alerts.yml:/etc/prometheus/alerts.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    restart: unless-stopped
    networks:
      - tqd-network

  grafana:
    image: grafana/grafana:latest
    container_name: tqd-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SERVER_ROOT_URL=http://localhost:3001
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana-provisioning:/etc/grafana/provisioning:ro
    depends_on:
      - prometheus
    restart: unless-stopped
    networks:
      - tqd-network

  node_exporter:
    image: prom/node-exporter:latest
    container_name: tqd-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    networks:
      - tqd-network

  nginx_exporter:
    image: nginx/nginx-prometheus-exporter:latest
    container_name: tqd-nginx-exporter
    ports:
      - "9113:9113"
    environment:
      - SCRAPE_URI=http://localhost/nginx_status
    restart: unless-stopped
    networks:
      - tqd-network

  redis_exporter:
    image: oliver006/redis_exporter:latest
    container_name: tqd-redis-exporter
    ports:
      - "9121:9121"
    environment:
      - REDIS_ADDR=redis://localhost:6379
    restart: unless-stopped
    networks:
      - tqd-network

volumes:
  prometheus_data:
  grafana_data:

networks:
  tqd-network:
    external: true
EOF

# ============================================
# 4. Create Grafana provisioning
# ============================================
mkdir -p $MONITORING_DIR/grafana-provisioning/dashboards
mkdir -p $MONITORING_DIR/grafana-provisioning/datasources

cat > $MONITORING_DIR/grafana-provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# ============================================
# 5. Create monitoring dashboard
# ============================================
cat > $MONITORING_DIR/grafana-provisioning/dashboards/tqd-dashboard.json << 'EOF'
{
  "dashboard": {
    "title": "TQD Performance Dashboard",
    "tags": ["tqd", "production"],
    "timezone": "browser",
    "panels": [
      {
        "title": "CPU Usage (%)",
        "targets": [{"expr": "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"}],
        "type": "graph"
      },
      {
        "title": "Memory Usage (%)",
        "targets": [{"expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"}],
        "type": "graph"
      },
      {
        "title": "Disk Usage (%)",
        "targets": [{"expr": "(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100"}],
        "type": "graph"
      },
      {
        "title": "HTTP Requests/sec",
        "targets": [{"expr": "rate(nginx_http_requests_total[1m])"}],
        "type": "graph"
      },
      {
        "title": "Response Time (P95)",
        "targets": [{"expr": "histogram_quantile(0.95, nginx_http_request_duration_seconds_bucket)"}],
        "type": "graph"
      },
      {
        "title": "Error Rate (%)",
        "targets": [{"expr": "rate(nginx_http_requests_total{status=~\"5..\"}[5m]) * 100"}],
        "type": "graph"
      }
    ]
  }
}
EOF

# ============================================
# 6. Start monitoring stack
# ============================================
echo "Starting monitoring stack..."
cd $MONITORING_DIR
docker compose -f docker-compose.monitoring.yml up -d

echo ""
echo "================================================"
echo "   ✓ Monitoring Setup Complete!"
echo "================================================"
echo ""
echo "Dashboards:"
echo "  Prometheus: http://localhost:9090"
echo "  Grafana:    http://localhost:3001 (admin/admin)"
echo ""
echo "Metrics:"
echo "  Node:      http://localhost:9100/metrics"
echo "  Nginx:     http://localhost:9113/metrics"
echo "  Redis:     http://localhost:9121/metrics"
echo ""
echo "Useful Queries:"
echo "  CPU:       100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"
echo "  Memory:    (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
echo "  Requests:  rate(nginx_http_requests_total[1m])"
echo "  P95:       histogram_quantile(0.95, nginx_http_request_duration_seconds_bucket)"
echo ""
