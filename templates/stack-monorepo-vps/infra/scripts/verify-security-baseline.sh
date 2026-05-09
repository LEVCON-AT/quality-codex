#!/bin/bash
# Verifies security baseline after Initial-Setup or after Infra-Change
set -euo pipefail

DOMAIN=${1:?"Usage: verify-security-baseline.sh <domain>"}

echo "▶ Verifying security baseline for $DOMAIN..."

# 1. Headers
echo "  Checking headers..."
HEADERS=$(curl -sI "https://$DOMAIN")
echo "$HEADERS" | grep -q "Strict-Transport-Security" || { echo "✗ HSTS missing"; exit 1; }
echo "$HEADERS" | grep -q "X-Frame-Options: DENY" || { echo "✗ X-Frame-Options missing"; exit 1; }
echo "$HEADERS" | grep -q "X-Content-Type-Options: nosniff" || { echo "✗ nosniff missing"; exit 1; }
echo "$HEADERS" | grep -q "Content-Security-Policy" || { echo "✗ CSP missing"; exit 1; }
echo "  ✓ Headers OK"

# 2. TLS Grade (via testssl.sh if available)
if command -v testssl.sh >/dev/null; then
  echo "  Running testssl.sh..."
  testssl.sh --quiet --severity HIGH "https://$DOMAIN" || { echo "✗ TLS issues"; exit 1; }
  echo "  ✓ TLS OK"
else
  echo "  ⚠ testssl.sh not installed, skipping TLS deep-check"
fi

# 3. UFW status (if running on the same host)
if command -v ufw >/dev/null; then
  ufw status | grep -q "Status: active" || { echo "✗ UFW not active"; exit 1; }
  echo "  ✓ UFW active"
fi

# 4. fail2ban (if running on the same host)
if command -v fail2ban-client >/dev/null; then
  fail2ban-client status sshd >/dev/null 2>&1 || { echo "✗ fail2ban sshd jail not active"; exit 1; }
  echo "  ✓ fail2ban OK"
fi

echo "✓ Security baseline verified"
