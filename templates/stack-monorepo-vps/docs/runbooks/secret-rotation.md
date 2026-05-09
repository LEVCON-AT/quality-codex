# Runbook: Secret Rotation

90-Tage-Zyklus, automatisierter Workflow.

## Zu rotierende Secrets

| Secret | Frequenz | Skript | Auswirkung |
|---|---|---|---|
| `SUPABASE_DB_PASSWORD` | 90d | `rotate-secrets.sh --target db` | Bridge-Restart |
| `SUPABASE_SERVICE_ROLE_KEY` | 90d | `rotate-secrets.sh --target supabase` | Bridge-Restart |
| `SUPABASE_JWT_SECRET` | 180d | s.o. | All-User-Logout |
| `OPENAI_API_KEY` | 90d | s.o. | AI-Proxy-Restart |
| `ANTHROPIC_API_KEY` | 90d | s.o. | s.o. |
| `BACKUP_AGE_KEY` | nie (Schlüssel-Rotation = neuer Backup-Pfad) | manual | n/a |
| `SSH-Deploy-Key` | 180d | `ssh-deploy-rotate.sh` | GitHub-Secret-Update |
| `SMTP/IMAP-Password` | 180d | manuell | Mail-Bridge-Restart |

## Standard-Workflow (`rotate-secrets.sh --target <name>`)

```bash
#!/bin/bash
set -e
TARGET=${1:?"Usage: rotate-secrets.sh --target <db|supabase|openai|anthropic>"}

# 1. Neues Secret generieren
NEW_SECRET=$(openssl rand -hex 32)

# 2. In Provider-System aktualisieren (z.B. Supabase Dashboard via API)
case $TARGET in
  db) supabase db update-password "$NEW_SECRET" ;;
  openai) echo "Manual: rotate at platform.openai.com, then update .env" ;;
  *) echo "Unknown target"; exit 1 ;;
esac

# 3. Lokal in .env ersetzen (auf VPS)
ssh root@<vps> "sed -i.bak 's|^SUPABASE_DB_PASSWORD=.*|SUPABASE_DB_PASSWORD=$NEW_SECRET|' /opt/<slug>/.env"

# 4. Service neu starten
ssh root@<vps> "systemctl restart <slug>-bridge"

# 5. Audit-Log
psql ... -c "INSERT INTO audit_events (action, meta) VALUES ('ops.secret_rotated', '{\"target\": \"$TARGET\", \"date\": \"$(date)\"}')"

# 6. Smoketest
./infra/scripts/smoketest.sh

# 7. Cleanup .env.bak nach 24h (manuell, falls Rollback nötig)
echo "✓ Rotated $TARGET. Verify: ./infra/scripts/smoketest.sh"
```

## SSH-Deploy-Key-Rotation

```bash
# 1. Neuer Key
ssh-keygen -t ed25519 -f ~/.ssh/<slug>_deploy_new -C "deploy-$(date +%Y%m)"

# 2. Public-Key auf VPS hinzufügen
ssh-copy-id -i ~/.ssh/<slug>_deploy_new root@<vps>

# 3. GitHub-Secret aktualisieren
gh secret set DEPLOY_SSH_KEY < ~/.ssh/<slug>_deploy_new

# 4. Test-Deploy auf Staging
gh workflow run deploy-staging.yml

# 5. Wenn grün: alten Key entfernen
ssh root@<vps> "sed -i '/deploy-2026-02/d' ~/.ssh/authorized_keys"

# 6. Lokalen Old-Key löschen
mv ~/.ssh/<slug>_deploy_new ~/.ssh/<slug>_deploy
```

## Rotation-Fail-Handling

Wenn Rotation Smoketest fehlschlägt:
1. **Sofort** alten Secret restoren (`.env.bak`)
2. Service-Neustart
3. Verifizieren via Smoketest
4. Root-Cause analysieren bevor erneut rotiert wird
5. Audit-Log: `action: 'ops.secret_rotation_failed'`

## Provider-spezifische Hinweise

### Supabase Cloud
- DB-Password-Rotation via Dashboard → Settings → Database
- Service-Role-Key-Rotation via Dashboard → Settings → API → "Reroll"
- JWT-Secret-Rotation invalidates ALLE existierenden JWTs → Logout-Welle

### OpenAI / Anthropic
- Multiple keys parallel halten (alt+neu) während Migration
- Nach Verify: alten Key revoken
- Usage-Limits checken nach Rotation

## Schedule

`infra/cron.d/rotate-secrets`:
```cron
# Reminder am 1. jeden 3. Monats
0 9 1 1,4,7,10 * /opt/<slug>/infra/scripts/rotate-secrets-reminder.sh
```

Reminder schickt Mail an User mit Liste der fälligen Rotationen — User triggert manuell.

## NICHT automatisieren

- DSGVO-Subject-Request-Token (manueller Audit-Pfad)
- Production-Encryption-Master-Keys (gefährliche Auto-Rotation)
- Anthropic-API-Key wenn Rate-Limit-relevant (Provider-API hat Cooldown)
