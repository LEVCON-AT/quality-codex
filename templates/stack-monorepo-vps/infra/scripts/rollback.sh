#!/bin/bash
# Rollback to previous tag
set -euo pipefail

TARGET_TAG=${1:?"Usage: rollback.sh <tag>"}
SLUG="__SLUG__"

cd /opt/$SLUG
git fetch --tags

# Verify tag exists
git rev-parse "$TARGET_TAG" >/dev/null 2>&1 || { echo "Tag $TARGET_TAG not found"; exit 1; }

echo "▶ Rolling back to $TARGET_TAG..."
git reset --hard "$TARGET_TAG"
pnpm install --frozen-lockfile
pnpm -r build

# Sync to nginx-served paths
rsync -av --delete packages/client-web/dist/ /var/www/$SLUG/client-web/
rsync -av --delete packages/docs-wiki/.vitepress/dist/ /var/www/$SLUG/docs-wiki/

systemctl restart ${SLUG}-bridge nginx

sleep 3
./infra/scripts/smoketest.sh prod

# Audit
psql "$SUPABASE_DB_URL" <<EOF
INSERT INTO audit_events (action, meta)
VALUES ('ops.rollback', jsonb_build_object('to_tag', '$TARGET_TAG', 'date', NOW()::text));
EOF

echo "✓ Rollback complete"
