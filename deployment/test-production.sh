#!/bin/bash
# ============================================================================
#  TQD Production Robustness Test
#  Run FROM the server:  bash /tmp/test-production.sh
#  Or run remotely:      ssh root@194.163.135.177 'bash -s' < deployment/test-production.sh
# ============================================================================

TARGET="https://demoview.space"
LOCAL="http://127.0.0.1:3000"
PASS=0; FAIL=0; WARN=0

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC}  $1"; ((PASS++)); }
fail() { echo -e "  ${RED}✖${NC}  $1"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}⚠${NC}  $1"; ((WARN++)); }
section() { echo -e "\n${CYAN}${BOLD}══ $1 ══${NC}"; }

# ── helpers ──────────────────────────────────────────────────────────────────

http_code()  { curl -sk -o /dev/null -w "%{http_code}" "$1"; }
headers()    { curl -skI "$1"; }
response()   { curl -sk "$1"; }
time_total() { curl -sk -o /dev/null -w "%{time_total}" "$1"; }

# ── 1. BASIC AVAILABILITY ─────────────────────────────────────────────────────
section "1. Basic Availability"

code=$(http_code "$TARGET")
[ "$code" = "200" ] && pass "HTTPS returns 200 ($TARGET)" || fail "HTTPS returned $code (expected 200)"

code=$(http_code "$LOCAL")
[ "$code" = "200" ] && pass "Local port 3000 returns 200" || fail "Local port 3000 returned $code"

t=$(time_total "$TARGET")
ok=$(echo "$t < 1.0" | bc -l)
[ "$ok" = "1" ] && pass "Response time: ${t}s (<1s)" || warn "Response time: ${t}s (slow, >1s)"

# ── 2. HTTPS / SSL ────────────────────────────────────────────────────────────
section "2. HTTPS / SSL"

# HTTP should redirect to HTTPS
code=$(curl -sk -o /dev/null -w "%{http_code}" http://demoview.space)
[ "$code" = "301" ] || [ "$code" = "302" ] \
  && pass "HTTP redirects to HTTPS ($code)" \
  || warn "HTTP does not redirect (got $code) — add redirect in nginx"

# TLS version - reject SSLv3 and TLS 1.0
if command -v openssl &>/dev/null; then
  openssl s_client -connect demoview.space:443 -ssl3 2>&1 | grep -q "handshake failure" \
    && pass "SSLv3 rejected" || warn "SSLv3 may be accepted — disable in nginx"
  openssl s_client -connect demoview.space:443 -tls1 2>&1 | grep -q "handshake failure" \
    && pass "TLS 1.0 rejected" || warn "TLS 1.0 may be accepted — consider disabling"
fi

# Certificate expiry
if command -v openssl &>/dev/null; then
  expiry=$(echo | openssl s_client -servername demoview.space -connect demoview.space:443 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  [ -n "$expiry" ] && pass "SSL certificate valid until: $expiry" || warn "Could not check SSL expiry"
fi

# ── 3. SECURITY HEADERS ───────────────────────────────────────────────────────
section "3. Security Headers"

hdrs=$(headers "$TARGET")

check_header() {
  local name="$1"; local pattern="$2"
  echo "$hdrs" | grep -qi "$pattern" \
    && pass "Header present: $name" \
    || fail "Missing header: $name"
}

check_header "Strict-Transport-Security (HSTS)"          "strict-transport-security"
check_header "X-Frame-Options"                            "x-frame-options"
check_header "X-Content-Type-Options: nosniff"            "x-content-type-options"
check_header "X-XSS-Protection"                           "x-xss-protection"
check_header "Referrer-Policy"                            "referrer-policy"
check_header "Content-Security-Policy"                    "content-security-policy"
check_header "Permissions-Policy"                         "permissions-policy"

# Server header should NOT expose version
if echo "$hdrs" | grep -qi "^server:.*nginx/[0-9]"; then
  fail "Server header exposes nginx version (should hide it)"
else
  pass "Server header does not expose nginx version"
fi

# ── 4. RATE LIMITING ──────────────────────────────────────────────────────────
section "4. Rate Limiting (API Endpoints)"

echo "  Sending 30 rapid requests to /api/contact..."
hits429=0
for i in $(seq 1 30); do
  code=$(curl -sk -o /dev/null -w "%{http_code}" -X POST "$TARGET/api/contact" \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"t@t.com","message":"hi"}')
  [ "$code" = "429" ] && ((hits429++))
done
[ "$hits429" -gt 0 ] \
  && pass "Rate limiting active: got 429 after $((30 - hits429)) requests" \
  || fail "No rate limiting on /api/contact — all 30 requests went through"

echo "  Sending 50 rapid requests to homepage..."
hits429=0
for i in $(seq 1 50); do
  code=$(http_code "$TARGET")
  [ "$code" = "429" ] && ((hits429++))
done
[ "$hits429" -gt 0 ] \
  && pass "General rate limiting active on homepage" \
  || warn "No general rate limiting detected (consider adding)"

# ── 5. LARGE PAYLOAD REJECTION ────────────────────────────────────────────────
section "5. Large Payload Rejection"

# 2MB payload to /api/contact
big_payload=$(python3 -c "import json; print(json.dumps({'name':'x','email':'t@t.com','message':'A'*2000000}))" 2>/dev/null || echo '{"name":"x","email":"t@t.com","message":"'"$(printf 'A%.0s' {1..2000000})"'"}')
code=$(echo "$big_payload" | curl -sk -o /dev/null -w "%{http_code}" -X POST "$TARGET/api/contact" \
  -H "Content-Type: application/json" --data-binary @-)
[ "$code" = "413" ] \
  && pass "2MB payload rejected with 413" \
  || warn "2MB payload returned $code (add client_max_body_size in nginx)"

# ── 6. COMMON ATTACK VECTORS ──────────────────────────────────────────────────
section "6. Common Attack Vectors"

# Path traversal
code=$(http_code "$TARGET/../../../../etc/passwd")
[ "$code" = "404" ] || [ "$code" = "400" ] \
  && pass "Path traversal blocked ($code)" \
  || fail "Path traversal returned $code"

# Null byte injection
code=$(http_code "$TARGET/index.php%00.html")
[ "$code" = "404" ] || [ "$code" = "400" ] \
  && pass "Null byte injection blocked ($code)" \
  || warn "Null byte injection returned $code"

# Hidden files (.env, .git)
for path in "/.env" "/.git/config" "/.env.production" "/.env.local"; do
  code=$(http_code "$TARGET$path")
  [ "$code" = "404" ] || [ "$code" = "403" ] \
    && pass "Sensitive file blocked: $path ($code)" \
    || fail "EXPOSED: $TARGET$path returned $code"
done

# ── 7. CONCURRENT LOAD TEST ───────────────────────────────────────────────────
section "7. Concurrent Load (50 simultaneous connections)"

if command -v ab &>/dev/null; then
  echo "  Using Apache Bench (ab)..."
  ab -n 200 -c 50 -q "$TARGET/" 2>&1 | grep -E "Requests per second|Failed requests|Time per request" \
    | while read line; do echo "  $line"; done
  pass "ab load test completed (check numbers above)"
else
  echo "  ab not found — using curl parallel (install apache2-utils for ab)"
  success=0; failed=0
  run_req() {
    code=$(http_code "$TARGET")
    [ "$code" = "200" ] && echo "ok" || echo "fail"
  }
  export TARGET
  export -f run_req http_code
  results=$(seq 1 50 | xargs -P 50 -I{} bash -c 'run_req')
  success=$(echo "$results" | grep -c "ok")
  failed=$(echo "$results" | grep -c "fail")
  [ "$failed" -eq 0 ] \
    && pass "50 concurrent requests: $success/50 succeeded" \
    || warn "50 concurrent requests: $success ok, $failed failed"
fi

# ── 8. PM2 PROCESS HEALTH ─────────────────────────────────────────────────────
section "8. PM2 Process Health"

if command -v pm2 &>/dev/null; then
  online=$(pm2 jlist 2>/dev/null | python3 -c "
import json,sys
procs=json.load(sys.stdin)
app=[p for p in procs if p['name']=='tqd-app']
print(f'{sum(1 for p in app if p[\"pm2_env\"][\"status\"]==\"online\")}/{len(app)} online')
" 2>/dev/null)
  mem=$(pm2 jlist 2>/dev/null | python3 -c "
import json,sys
procs=json.load(sys.stdin)
app=[p for p in procs if p['name']=='tqd-app']
mems=[p['monit']['memory']//1024//1024 for p in app if p.get('monit')]
print(f'avg {sum(mems)//len(mems) if mems else 0}MB, max {max(mems) if mems else 0}MB')
" 2>/dev/null)
  restarts=$(pm2 jlist 2>/dev/null | python3 -c "
import json,sys
procs=json.load(sys.stdin)
app=[p for p in procs if p['name']=='tqd-app']
r=[p['pm2_env']['restart_time'] for p in app]
print(f'total {sum(r)} across {len(r)} instances')
" 2>/dev/null)

  [ -n "$online" ]   && pass "Instances: $online"    || warn "Could not read PM2 status"
  [ -n "$mem" ]      && pass "Memory: $mem"           || true
  [ -n "$restarts" ] && pass "Restarts: $restarts"    || true

  # Warn on high restarts
  total_restarts=$(pm2 jlist 2>/dev/null | python3 -c "
import json,sys
procs=json.load(sys.stdin)
print(sum(p['pm2_env']['restart_time'] for p in procs if p['name']=='tqd-app'))
" 2>/dev/null)
  [ -n "$total_restarts" ] && [ "$total_restarts" -gt 10 ] \
    && warn "High restart count ($total_restarts) — check pm2 logs tqd-app" || true
else
  warn "PM2 not found in PATH"
fi

# ── 9. SERVER RESOURCES ───────────────────────────────────────────────────────
section "9. Server Resources"

# Disk
disk_pct=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
[ "$disk_pct" -lt 80 ] && pass "Disk usage: ${disk_pct}%" || fail "Disk usage HIGH: ${disk_pct}%"

# Memory
mem_free=$(free | awk '/^Mem:/{printf "%.0f", $4/$2*100}')
[ "$mem_free" -gt 20 ] && pass "Free memory: ${mem_free}%" || warn "Low free memory: ${mem_free}%"

# Load average vs CPU count
cpus=$(nproc)
load=$(cat /proc/loadavg | awk '{print $1}')
load_ok=$(echo "$load < $cpus" | bc -l)
[ "$load_ok" = "1" ] && pass "Load avg ${load} (${cpus} CPUs)" || warn "Load avg ${load} is high (${cpus} CPUs)"

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}══════════════════════════════════════════${NC}"
echo -e "${BOLD}  TEST SUMMARY${NC}"
echo -e "${BOLD}══════════════════════════════════════════${NC}"
echo -e "  ${GREEN}✔ PASS${NC}  $PASS"
echo -e "  ${RED}✖ FAIL${NC}  $FAIL"
echo -e "  ${YELLOW}⚠ WARN${NC}  $WARN"
echo ""
if [ "$FAIL" -eq 0 ] && [ "$WARN" -le 2 ]; then
  echo -e "  ${GREEN}${BOLD}Production is healthy ✔${NC}"
elif [ "$FAIL" -eq 0 ]; then
  echo -e "  ${YELLOW}${BOLD}Production OK but review warnings above${NC}"
else
  echo -e "  ${RED}${BOLD}$FAIL critical issue(s) found — fix before going live${NC}"
fi
echo ""
