#!/bin/bash
# Wöchentliches zusätzliches Backup für Cloud-Variante
# (Supabase Cloud hat eigene tägliche Backups; dieses ist Off-Site-Redundanz)
set -euo pipefail

SLUG="__SLUG__"
DATE=$(date +%Y-%m-%d)
BACKUP_FILE="/tmp/${SLUG}-${DATE}.sql.gz"

echo "▶ Dumping Supabase Cloud..."
supabase db dump -f "${BACKUP_FILE%.gz}"
gzip "${BACKUP_FILE%.gz}"

echo "▶ Encrypting..."
age -r "$BACKUP_AGE_PUBLIC_KEY" -o "${BACKUP_FILE}.age" "$BACKUP_FILE"
rm "$BACKUP_FILE"

echo "▶ Uploading to ${BACKUP_TARGET}..."
# Supabase Cloud Storage als Off-Site? Oder R2/B2/S3:
b2 upload-file "$BACKUP_TARGET_BUCKET" "${BACKUP_FILE}.age" "${SLUG}/$(basename ${BACKUP_FILE}.age)"

# Cleanup
rm "${BACKUP_FILE}.age"

echo "✓ Off-site backup complete"
