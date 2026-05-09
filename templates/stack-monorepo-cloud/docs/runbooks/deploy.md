# Runbook: Deploy

## Auto-Deploy (Standard)

### Staging (auto on merge to develop)
```
push/merge to develop
  → .github/workflows/deploy-staging.yml triggert
  → Build+Test+Lint
  → SSH Deploy (VPS) oder Vercel-Deploy (Cloud)
  → Migration läuft
  → Smoketest
  → Slack/Notification
```

### Prod (manual approval on merge to main)
```
PR develop → main mit Pre-Release-Checkliste
  → Manual Approval (User klickt "Run Workflow")
  → .github/workflows/deploy-prod.yml triggert
  → Pre-Deploy: security-baseline-verify (testssl + headers)
  → Build+Test+Lint+Pentest-Suite
  → Backup-Snapshot vor Migration
  → SSH Deploy / Vercel Prod
  → Migration mit Rollback-Bereitschaft
  → Smoketest
  → Wenn grün: Tag setzen
  → Slack/Notification
```

## Manual-Deploy (Notfall, VPS)

```bash
# Auf User-Maschine:
ssh root@<vps>
cd /opt/<slug>
git fetch origin main
git reset --hard origin/main      # NICHT git clean -fd (bind-mounts!)
pnpm install --frozen-lockfile
pnpm -r build

# Migration
./infra/scripts/supabase-migrate.sh

# Service neu starten
systemctl restart <slug>-bridge
systemctl restart nginx

# Smoketest
curl -sf https://<domain>/healthz
curl -sf https://<domain>/app/
```

## Deploy-Smoketest (`infra/scripts/smoketest.sh`)

```bash
#!/bin/bash
set -e

DOMAIN=${DEPLOY_DOMAIN:-staging.example.com}

# Healthchecks
curl -sf "https://$DOMAIN/healthz" | grep -q '"ok":true' || exit 1
curl -sf "https://$DOMAIN/app/" -o /dev/null -w "%{http_code}" | grep -q "200" || exit 1
curl -sf "https://$DOMAIN/api/healthz" | grep -q '"ok":true' || exit 1

# Wiki erreichbar
curl -sf "https://docs.$DOMAIN" -o /dev/null -w "%{http_code}" | grep -q "200" || exit 1

# Security headers
curl -sI "https://$DOMAIN" | grep -q "Strict-Transport-Security" || exit 1
curl -sI "https://$DOMAIN" | grep -q "X-Frame-Options: DENY" || exit 1

# DB connectivity (über App)
curl -sf "https://$DOMAIN/api/db-ping" | grep -q '"ok":true' || exit 1

echo "✓ Smoketest passed"
```

## Bei Deploy-Fehlschlag

→ siehe `runbooks/rollback.md`

## Cloud-Variante (Vercel + Supabase Cloud)

```bash
# Vercel
vercel deploy --prod          # Cloud-Deploy
vercel logs <deployment-url>  # Logs prüfen

# Supabase Migration
supabase db push              # Cloud-Migration
supabase db diff              # Diff Local vs Remote
```

GitHub-Workflow für Auto-Deploy: `.github/workflows/deploy-staging.yml` mit Vercel-CLI + Supabase-CLI.

## Pre-Deploy-Checkliste

Vor jedem Prod-Deploy in der GitHub-Actions-Approval-Page:
- [ ] Alle CI-Jobs grün (PR + Pentest-Suite + DAST)
- [ ] Pre-Release-Checkliste durchgegangen
- [ ] Backup vor 24h verifiziert
- [ ] Letzter Successful Prod-Deploy <30 Tage her
- [ ] Migration-2-Pass-Test grün

## Post-Deploy-Verifikation

Nach jedem Prod-Deploy:
- [ ] Smoketest grün
- [ ] Sentry: keine neuen Errors in den ersten 15min
- [ ] Performance: Core Web Vitals nicht degradiert (Vergleich Vorher/Nachher)
- [ ] Status-Page auf "operational"
- [ ] User-Notification bei Breaking-Changes

## Rollback-Trigger

Sofortiges Rollback wenn:
- Smoketest rot
- Sentry-Error-Spike (>10× Baseline)
- LCP-Increase >50%
- DB-Connection-Errors

→ siehe `runbooks/rollback.md`
