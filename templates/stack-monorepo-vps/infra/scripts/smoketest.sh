#!/bin/bash
# Smoketest — nach jedem Deploy
set -e

ENV=${1:-staging}
case $ENV in
  staging) DOMAIN="__STAGING_DOMAIN__" ;;
  prod) DOMAIN="__DOMAIN__" ;;
  *) echo "Unknown env: $ENV"; exit 1 ;;
esac

echo "Smoketesting $DOMAIN..."

# Healthcheck
curl -sf "https://$DOMAIN/healthz" | grep -q '"ok":true' || { echo "FAIL: /healthz"; exit 1; }
echo "✓ /healthz"

# App reachable
curl -sf "https://$DOMAIN/" -o /dev/null -w "%{http_code}\n" | grep -q "200" || { echo "FAIL: /"; exit 1; }
echo "✓ /"

# Docs reachable
curl -sf "https://docs.$DOMAIN/" -o /dev/null -w "%{http_code}\n" | grep -q "200" || { echo "WARN: docs not reachable"; }

# Security headers
curl -sI "https://$DOMAIN" | grep -q "Strict-Transport-Security" || { echo "FAIL: HSTS missing"; exit 1; }
curl -sI "https://$DOMAIN" | grep -q "X-Frame-Options: DENY" || { echo "FAIL: X-Frame-Options missing"; exit 1; }
echo "✓ Security headers"

echo "✓ Smoketest passed"
