# Runbook: DB-Restore

## VPS — Restore aus age-encrypted Backup

```bash
# 1. Backup-Liste
ssh root@<vps>
ls -la /var/backups/<slug>/postgres/*.age

# 2. Aktuellen Stand sichern (vor Restore!)
./infra/scripts/backup-postgres.sh --label "pre-restore-$(date +%s)"

# 3. Service stoppen
systemctl stop <slug>-bridge

# 4. Backup entschlüsseln
age -d -i ~/.age/backup-key.txt /var/backups/<slug>/postgres/2026-05-01.sql.gz.age | \
  gunzip > /tmp/restore.sql

# 5. DB-Restore
docker exec -i matrix-supabase-db psql -U postgres -d postgres < /tmp/restore.sql

# 6. Cleanup
rm /tmp/restore.sql

# 7. Migration auf gewünschte Version (falls Backup älter als aktuelles Schema)
./infra/scripts/supabase-migrate.sh --target <version>

# 8. Service starten
systemctl start <slug>-bridge
./infra/scripts/smoketest.sh
```

## Tenant-spezifischer Restore (Multi-Tenant)

```bash
./infra/scripts/restore-tenant.sh \
  --tenant-slug <tenant> \
  --backup 2026-05-01 \
  --confirm
```

Internals: pg_dump-Subset gegen `WHERE tenant_id = ...` pro Tabelle.

## Cloud — Supabase Cloud Restore

### Daily Backup (Pro Plan, 7 Tage)
Über Supabase Dashboard → Database → Backups → "Restore"

### Point-in-Time-Recovery (Pro Plan)
Dashboard → Database → Backups → "Restore from point in time" → Datum/Uhrzeit wählen

### Aus eigenem `supabase db dump`-Backup
```bash
supabase db reset                    # WARNING: löscht prod-DB
supabase db push --include-all
psql "$SUPABASE_DB_URL" < my-backup.sql
```

⚠️ Cloud-Restore via API erfordert Konfirmation — niemals automatisch durch Claude.

## Verify-Drill (wöchentlich)

`.github/workflows/backup-verify.yml`:
1. Aktuelles Backup herunterladen
2. Ephemeren Postgres-Container starten
3. Backup einspielen
4. Smoke-Queries:
   - `SELECT count(*) FROM users` > 0
   - `SELECT count(*) FROM workspaces` > 0
   - `SELECT max(created_at) FROM audit_events` > now() - interval '2 days'
5. Container löschen
6. Bei Fehler: Notification + Issue auto-erstellen

## RTO / RPO

- **RTO (Recovery Time Objective):** <2h für Full-Restore
- **RPO (Recovery Point Objective):** max 24h Datenverlust (Daily Backup)
- **Bei Pro-Plan/PITR:** RPO <1min möglich

## Vor dem Restore IMMER

- [ ] Aktuellen Stand sichern (pre-restore-Backup)
- [ ] User informieren / Status-Page „maintenance"
- [ ] Service stoppen (verhindert neue Writes während Restore)
- [ ] Schema-Version-Kompatibilität prüfen (Backup-Schema-Version vs aktueller Code)

## Nach Restore IMMER

- [ ] Smoketest grün
- [ ] Audit-Log-Eintrag (`action: 'ops.restore'`)
- [ ] Stichproben-Verifikation: User-Login funktioniert, Test-Daten konsistent
- [ ] Status-Page-Update
- [ ] Wenn Daten-Verlust: User-Communication (DSGVO Art. 34 prüfen)
