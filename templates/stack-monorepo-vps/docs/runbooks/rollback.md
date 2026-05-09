# Runbook: Rollback

## VPS-Variante

### Schneller App-Rollback (kein Schema-Change)
```bash
ssh root@<vps>
cd /opt/<slug>
git log --oneline -10                       # finde letzten guten Tag
git reset --hard <previous-tag>             # z.B. v1.2.2
pnpm install --frozen-lockfile
pnpm -r build
systemctl restart <slug>-bridge
./infra/scripts/smoketest.sh
```

### Mit Schema-Change → Backup-Restore
```bash
# 1. Service stoppen
systemctl stop <slug>-bridge

# 2. DB-Restore aus Backup
./infra/scripts/restore-postgres.sh --backup <backup-id>

# 3. Code-Rollback
cd /opt/<slug>
git reset --hard <previous-tag>
pnpm install --frozen-lockfile
pnpm -r build

# 4. Services starten
systemctl start <slug>-bridge
./infra/scripts/smoketest.sh
```

### Auto-Rollback-Skript (`infra/scripts/rollback.sh`)
```bash
#!/bin/bash
set -e
TARGET_TAG=${1:?"Usage: rollback.sh <tag>"}

echo "Rolling back to $TARGET_TAG..."
git fetch --tags
git reset --hard "$TARGET_TAG"
pnpm install --frozen-lockfile
pnpm -r build
systemctl restart <slug>-bridge nginx
sleep 5
./infra/scripts/smoketest.sh
echo "✓ Rollback complete"
```

## Cloud-Variante

### Vercel-Rollback
```bash
vercel ls                       # liste recent deployments
vercel rollback <deployment-id>
```

Promotion via UI: Deployments → "Promote to Production" auf vorheriger Version.

### Supabase-Rollback
- Schema-Migration via Reverse-Migration (`down`-Script)
- Bei größerem Issue: Restore aus täglichem Backup (Point-in-Time bei Pro+)

## Wann rollback, wann fix-forward

| Situation | Aktion |
|---|---|
| Smoketest rot, Cause unklar | Rollback |
| Smoketest rot, Cause klar (5min-Fix) | Fix-Forward via Hotfix-Branch |
| Performance-Degradation klein | Monitor + Fix-Forward |
| Performance-Degradation kritisch | Rollback |
| Data-Corruption-Risk | Service stoppen, Backup-Restore |
| Security-Vuln entdeckt nach Deploy | Sofort Rollback, dann Fix-Forward |

## Audit-Log

Jeder Rollback wird automatisch geloggt:
```sql
INSERT INTO audit_events (action, actor_id, meta)
VALUES ('ops.rollback', '<user-id>',
  jsonb_build_object('from_version', 'v1.2.3', 'to_version', 'v1.2.2', 'reason', '<reason>'));
```

## Post-Rollback

- [ ] Slack/Notification an Stakeholder
- [ ] Status-Page-Update
- [ ] Incident-Ticket erstellen
- [ ] Root-Cause-Analyse innerhalb 24h
- [ ] Fix-Plan in BACKLOG
- [ ] Wenn Daten-Verlust: Subject-Notification (DSGVO Art. 34) prüfen
