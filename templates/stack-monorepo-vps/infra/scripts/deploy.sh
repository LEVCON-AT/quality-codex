#!/bin/bash
# Deploy script — wird via CI oder manuell auf VPS ausgeführt.
set -euo pipefail

ENV=${1:?"Usage: deploy.sh <staging|prod>"}
SLUG="__SLUG__"

case $ENV in
  staging) BASE_PATH="/opt/${SLUG}-staging"; SERVICE="${SLUG}-staging-bridge" ;;
  prod) BASE_PATH="/opt/${SLUG}"; SERVICE="${SLUG}-bridge" ;;
  *) echo "Unknown env: $ENV"; exit 1 ;;
esac

echo "▶ Deploying $ENV..."

cd "$BASE_PATH"

# Pull latest
git fetch origin
[ "$ENV" = "prod" ] && git reset --hard origin/main || git reset --hard origin/develop

# Install deps
pnpm install --frozen-lockfile

# Build
pnpm -r build

# Migrate DB
./infra/scripts/supabase-migrate.sh

# Sync built artifacts
rsync -av --delete packages/client-web/dist/ /var/www/$SLUG${ENV:+-$ENV}/client-web/
rsync -av --delete packages/docs-wiki/.vitepress/dist/ /var/www/$SLUG${ENV:+-$ENV}/docs-wiki/

# Restart
systemctl restart "$SERVICE"
nginx -t && systemctl reload nginx

# Smoketest
sleep 3
./infra/scripts/smoketest.sh "$ENV"

echo "✓ Deploy $ENV complete"
