#!/bin/bash
# Apply migrations idempotently — 2-Pass-Test included
set -euo pipefail

SLUG="__SLUG__"
DB_CONTAINER="${SLUG}-supabase-db"
MIGRATIONS_DIR="$(dirname "$0")/../supabase/migrations"

echo "▶ Applying migrations from $MIGRATIONS_DIR..."

for migration in "$MIGRATIONS_DIR"/*.sql; do
  name=$(basename "$migration")
  echo "  → $name"
  docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres < "$migration"
done

echo "✓ Migrations applied"

# Optional 2nd pass for idempotency-verify
if [ "${VERIFY_IDEMPOTENT:-}" = "1" ]; then
  echo "▶ 2nd pass for idempotency check..."
  for migration in "$MIGRATIONS_DIR"/*.sql; do
    name=$(basename "$migration")
    echo "  → $name (2nd pass)"
    docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres < "$migration" \
      || { echo "✗ Migration $name failed on 2nd pass — NOT idempotent"; exit 1; }
  done
  echo "✓ All migrations idempotent"
fi
