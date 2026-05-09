#!/bin/bash
# Secret Rotation — 90-Tage-Zyklus
set -euo pipefail

TARGET=${1:?"Usage: rotate-secrets.sh <db|supabase-anon|supabase-service|jwt>"}

case $TARGET in
  db)
    NEW=$(openssl rand -hex 32)
    echo "▶ Rotating SUPABASE_DB_PASSWORD..."
    # TODO: Update via Supabase Studio or psql ALTER USER
    echo "  New password generated. Update via Studio + .env + restart bridge."
    ;;
  jwt)
    NEW=$(openssl rand -hex 64)
    echo "▶ Rotating SUPABASE_JWT_SECRET..."
    echo "  ⚠ Will invalidate all sessions. Confirm before proceeding."
    ;;
  *)
    echo "Unknown target: $TARGET"
    exit 1
    ;;
esac

echo "  New secret length: ${#NEW}"
echo "  Don't forget: update .env, GitHub Secrets, restart services."

# Audit
psql "$SUPABASE_DB_URL" <<EOF
INSERT INTO audit_events (action, meta)
VALUES ('ops.secret_rotated', jsonb_build_object('target', '$TARGET', 'date', NOW()::text));
EOF
