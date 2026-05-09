#!/bin/bash
# Restore Postgres from age-encrypted backup
set -euo pipefail

SLUG="__SLUG__"
BACKUP=${1:?"Usage: restore-postgres.sh <backup-file-path>"}
CONFIRM=${2:-""}

if [ "$CONFIRM" != "--confirm" ]; then
  echo "⚠ This will OVERWRITE the current Postgres database!"
  echo "  Backup file: $BACKUP"
  echo "  To proceed, re-run with --confirm flag."
  exit 1
fi

# Pre-restore safety backup
./infra/scripts/backup-postgres.sh "pre-restore-$(date +%s)"

echo "▶ Stopping bridge service..."
systemctl stop ${SLUG}-bridge

echo "▶ Decrypting backup..."
age -d -i ~/.age/backup-key.txt "$BACKUP" | gunzip > /tmp/restore.sql

echo "▶ Restoring..."
docker exec -i ${SLUG}-supabase-db psql -U postgres -d postgres < /tmp/restore.sql
rm /tmp/restore.sql

echo "▶ Starting bridge service..."
systemctl start ${SLUG}-bridge

sleep 3
./infra/scripts/smoketest.sh prod

# Audit
psql "$SUPABASE_DB_URL" <<EOF
INSERT INTO audit_events (action, meta)
VALUES ('ops.restore', jsonb_build_object('source', '$BACKUP', 'date', NOW()::text));
EOF

echo "✓ Restore complete"
