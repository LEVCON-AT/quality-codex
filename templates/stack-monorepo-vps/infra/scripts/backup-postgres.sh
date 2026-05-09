#!/bin/bash
# Daily Postgres Backup — age-encrypted upload to Backblaze B2 / S3
set -euo pipefail

SLUG="__SLUG__"
DATE=$(date +%Y-%m-%d)
LABEL=${1:-daily}
BACKUP_DIR=/var/backups/$SLUG/postgres
BACKUP_FILE="$BACKUP_DIR/${DATE}-${LABEL}.sql.gz.age"

mkdir -p "$BACKUP_DIR"

echo "▶ Creating Postgres dump..."
docker exec ${SLUG}-supabase-db pg_dump -U postgres postgres \
  | gzip \
  | age -r "$BACKUP_AGE_PUBLIC_KEY" -o "$BACKUP_FILE"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✓ Backup created: $BACKUP_FILE ($SIZE)"

# Upload to off-site
echo "▶ Uploading to Backblaze B2..."
b2 upload-file "$BACKUP_TARGET_BUCKET" "$BACKUP_FILE" "${SLUG}/postgres/$(basename $BACKUP_FILE)"

# GFS Rotation: 7 daily, 4 weekly, 12 monthly
find "$BACKUP_DIR" -name "*-daily.sql.gz.age" -mtime +7 -delete
find "$BACKUP_DIR" -name "*-weekly.sql.gz.age" -mtime +28 -delete
find "$BACKUP_DIR" -name "*-monthly.sql.gz.age" -mtime +365 -delete

# Audit
psql "$SUPABASE_DB_URL" <<EOF
INSERT INTO audit_events (action, meta)
VALUES ('ops.backup', jsonb_build_object('label', '$LABEL', 'size', '$SIZE', 'date', '$DATE'));
EOF

echo "✓ Backup complete"
