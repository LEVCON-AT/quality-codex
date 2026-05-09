# Setup Hardening Verify

Nach Initial-Deployment + nach jeder Infra-Änderung. Muss komplett A+ liefern.

## TLS / SSL
- [ ] `testssl.sh https://<domain>` Grade A+
- [ ] TLS 1.3 only (TLS 1.0/1.1/1.2 verboten — außer 1.2 für Legacy-Clients)
- [ ] Strong Cipher Suites
- [ ] OCSP-Stapling aktiv
- [ ] Let's Encrypt Auto-Renewal funktioniert (Cert >30 Tage gültig)

## HTTP-Headers
- [ ] `securityheaders.com/<domain>` Grade A+
- [ ] HSTS: `max-age=63072000; includeSubDomains; preload`
- [ ] CSP: restriktiv, kein `unsafe-inline` ohne ADR
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: geolocation=(), microphone=(), camera=() (außer benötigt)
- [ ] X-XSS-Protection NICHT gesetzt (deprecated)

## SSH (VPS)
- [ ] Key-only Auth (`PasswordAuthentication no`)
- [ ] Root-Login disabled (`PermitRootLogin no` — außer dokumentierter Deploy-Flow)
- [ ] Custom-Port (nicht 22)
- [ ] fail2ban aktiv
- [ ] ufw nur 443 + SSH-Port + 80 (für Let's Encrypt) offen

## Postgres
- [ ] `password_encryption = scram-sha-256`
- [ ] App-User ohne `SUPERUSER`-Privileg
- [ ] RLS auf allen Tabellen aktiv (`SELECT relrowsecurity FROM pg_class WHERE relkind = 'r'`)
- [ ] RLS FORCE auf Tabellen mit `tenant_id`
- [ ] SSL-Connection Pflicht (`hostssl` in pg_hba.conf)
- [ ] Backup-User (read-only) separat

## Docker
- [ ] Container `read_only: true` wo möglich
- [ ] `no-new-privileges: true`
- [ ] `cap_drop: [ALL]`
- [ ] Secrets via Docker secrets, nicht ENV
- [ ] Image-Pinning auf Hash (nicht `:latest`)
- [ ] Rootless wo möglich

## Backup
- [ ] Daily-Backup-Cron läuft
- [ ] Backup-Verschlüsselung (age) verifiziert
- [ ] Schlüssel separat im 1Password/Bitwarden
- [ ] Off-Site-Storage (Backblaze B2 / S3 / R2)
- [ ] Backup-Verify-Workflow letzte 4× grün
- [ ] Restore-Drill innerhalb 6 Monate durchgeführt

## Secrets
- [ ] Keine Secrets in Git
- [ ] `.env` chmod 600 auf VPS
- [ ] GitHub-Secrets für CI
- [ ] Secret-Scan (gitleaks/trufflehog) im pre-push + CI
- [ ] Secret-Rotation alle 90 Tage geplant

## DNS
- [ ] CAA-Records gesetzt (nur Let's Encrypt darf Cert ausstellen)
- [ ] DNSSEC aktiv (wenn Provider unterstützt)
- [ ] DKIM/SPF/DMARC für Mail-Domain (`mail-tester.com` ≥ 9/10)

## Monitoring
- [ ] Sentry empfängt Events
- [ ] Uptime-Monitor pings `/healthz`
- [ ] Disk-Space-Alarm bei <20% free
- [ ] Memory-Alarm bei >80% used
- [ ] CPU-Alarm bei >80% sustained

## Rate-Limits
- [ ] Login: 5/min/IP
- [ ] PW-Reset: 3/h/email
- [ ] API: 100 req/min/user, 30 req/min/IP-anon
- [ ] File-Upload: 10/h/user

## Verification-Skript

`infra/scripts/verify-security-baseline.sh`:
```bash
#!/bin/bash
set -e
DOMAIN=${1:?"Usage: verify-security-baseline.sh <domain>"}

# TLS
SCORE=$(curl -s "https://api.ssllabs.com/api/v3/analyze?host=$DOMAIN" | jq -r '.endpoints[0].grade // "T"')
[ "$SCORE" = "A+" ] || { echo "TLS Grade: $SCORE — fail"; exit 1; }

# Headers
HEADERS_SCORE=$(curl -s "https://securityheaders.com/?q=$DOMAIN&followRedirects=on" -o /dev/null -w '%{redirect_url}' | grep -oP 'grade=\K[A-F][+-]?')
[ "$HEADERS_SCORE" = "A+" ] || { echo "Headers Grade: $HEADERS_SCORE — fail"; exit 1; }

# UFW (VPS only)
if [ -n "$VPS_HOST" ]; then
  ssh "$VPS_HOST" "ufw status" | grep -q "Status: active" || { echo "UFW not active"; exit 1; }
fi

echo "✓ Security baseline verified"
```

## Bei Fail

- **Critical** (z.B. TLS unter A): Deploy blockieren bis fixed
- **High** (z.B. Headers nicht A+): innerhalb 7 Tage fixen
- **Medium** (z.B. CAA fehlt): Backlog
