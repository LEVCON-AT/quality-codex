# New Project Onboarding Checklist

Pflicht-Checkliste — vor "v0.1"-Stempel muss alles grün sein. Wird vom `/onboard-project`-Skill durchlaufen, manuell verifizierbar.

## Phase 1 — Discovery

- [ ] Projekt-Name + Slug festgelegt
- [ ] Stack gewählt (Frontend / Backend / Mobile / MCP)
- [ ] Tenancy-Modell (Single / Multi-Subdomain / Multi-Path)
- [ ] Default-Locale + RTL-Support entschieden
- [ ] Infra-Variante: VPS oder Cloud
- [ ] Domain registriert + DNS-Zugriff bestätigt
- [ ] Backup-Target eingerichtet (Backblaze B2 / S3 / R2 — Bucket vorhanden)
- [ ] GitHub-Org + Repo-Plan
- [ ] Observability-Variante: Self-hosted Sentry / Cloud Sentry

## Phase 2 — Bootstrap

- [ ] Template kopiert nach `C:\node\<slug>\`
- [ ] `git init` + Initial-Commit
- [ ] GitHub-Repo erstellt + initial push
- [ ] `pnpm install` läuft fehlerfrei
- [ ] `.env.local` mit Platzhaltern angelegt (gitignored)
- [ ] `00-codex-decisions.md` ausgefüllt mit allen Discovery-Antworten

## Phase 3 — Secrets

- [ ] GitHub-Secrets gesetzt (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DEPLOY_SSH_KEY` etc.)
- [ ] SSH-Deploy-Keys generiert (VPS-Variante)
- [ ] age-Backup-Encryption-Key generiert + im Vault gesichert
- [ ] Sentry DSN eingetragen
- [ ] Mail-Provider-Credentials (DKIM/SPF/DMARC konfiguriert)
- [ ] OAuth-Provider-Credentials (Google/GitHub Login wenn aktiv)

## Phase 4 — Infrastruktur

### VPS
- [ ] VPS provisioniert (Hetzner CX21 oder größer)
- [ ] SSH-Hardening durchgeführt (`infra/scripts/ssh-hardening.sh`)
- [ ] Docker installiert + Compose-Setup läuft
- [ ] Postgres-Container hochgefahren
- [ ] nginx-Container mit Security-Headers konfiguriert
- [ ] Let's Encrypt-Certs ausgestellt + Auto-Renewal funktioniert
- [ ] DNS-Records gesetzt (A/AAAA, CNAME für Subdomains)

### Cloud
- [ ] Supabase-Cloud-Projekte für Staging + Prod erstellt
- [ ] Vercel-Projekt mit Staging + Prod-Environments
- [ ] Domain in Vercel verknüpft (Custom-Domains)
- [ ] Edge-Config für Headers gesetzt

## Phase 5 — Schema + Auth

- [ ] Initial-Migration deployed (000_init.sql)
- [ ] `tenants`-Tabelle inkl. Default-Tenant erstellt (Multi-Tenant)
- [ ] RLS aktiv auf allen Tabellen (`FORCE ROW LEVEL SECURITY`)
- [ ] `audit_events`-Tabelle vorhanden
- [ ] Roles-Skelett (`workspace_members`) vorhanden
- [ ] Test-User registriert + Login funktioniert end-to-end

## Phase 6 — CI/CD

- [ ] PR-Workflow grün auf Initial-Commit (typecheck + lint + test + build)
- [ ] Staging-Deploy-Workflow funktioniert (manueller Trigger)
- [ ] Smoketest gegen Staging grün
- [ ] DAST-Scan gegen Staging einmal durchgeführt
- [ ] Prod-Deploy-Workflow konfiguriert (mit Manual-Approval)

## Phase 7 — Backup + Restore

- [ ] Daily-Backup-Cron eingerichtet
- [ ] Erstes Backup erstellt + verschlüsselt hochgeladen
- [ ] **Restore-Drill durchgeführt** (Backup eingespielt in ephemerem Container)
- [ ] `backup-verify.yml`-Workflow grün
- [ ] RTO/RPO dokumentiert in `00-codex-decisions.md`

## Phase 8 — Observability

- [ ] Sentry empfängt Test-Error
- [ ] Source-Maps deployed (Sentry erkennt Original-Code-Position)
- [ ] Uptime-Monitor pings `/healthz` alle 5min
- [ ] Status-Page erreichbar (Initial-Incident-History leer)
- [ ] Grafana-Dashboard läuft (oder Cloud-Dashboard verlinkt)
- [ ] Alert-Channel funktioniert (Test-Alert empfangen)

## Phase 9 — Legal/Compliance (vor erstem realen User)

- [ ] Impressum unter `/imprint` (DACH-Anforderung)
- [ ] Privacy-Policy unter `/privacy` (DSGVO-konform)
- [ ] Terms-of-Service unter `/terms`
- [ ] Cookie-Consent-Banner aktiv
- [ ] Privacy-Mail (`privacy@<domain>`) eingerichtet
- [ ] Sub-Prozessoren-Liste in Privacy-Policy
- [ ] DPAs mit Anbietern (Supabase, Sentry, Postmark, …)

## Phase 10 — Foundation-Manifesto

- [ ] CLAUDE.md im Projekt verweist auf alle 10+ Manifesto-Docs
- [ ] BACKLOG.md mit Wave-1 (alle obigen Punkte) gehakt
- [ ] Erste fresh Claude-Session: Foundation-Boot dauert <4k Tokens (Self-Test)

## Phase 11 — Initial-BACKLOG

- [ ] Wave 1 (Bootstrap) komplett gehakt
- [ ] Wave 2 (erstes Feature) DoR-validiert + bereit zum Start
- [ ] ADR-0001 (Stack-Wahl) dokumentiert
- [ ] ADR-0002 (Datastore-Wahl) dokumentiert
- [ ] ADR-0003 (Auth-Strategie) dokumentiert

## Phase 12 — Verifikation

`scripts/verify-setup.ps1` läuft komplett grün:
- [ ] `pnpm dev` startet alle Workspaces
- [ ] `pnpm test` grün
- [ ] `pnpm typecheck` grün
- [ ] `pnpm lint` grün
- [ ] `pnpm docs:check` grün
- [ ] `scripts/verify-claude-boot.ts` zeigt Boot-Tokens <4000
- [ ] `infra/scripts/verify-security-baseline.sh` grün (A+ headers + tls)

## Stempel "v0.1 ready"

Wenn alle 12 Phasen grün → Initial-Tag setzen:
```bash
git tag v0.1.0
git push origin v0.1.0
```

→ Triggert Initial-Release-Workflow + Wiki-Deploy.

## Memory

`~/.claude/projects/<slug>/memory/project_setup.md` wird durch Onboarding-Skill auto-generiert mit Initial-Kontext.
