# BACKLOG

## Wave 1 — Bootstrap (DoD: Staging-Smoketest grün, Backup-Verify grün)

- [ ] Repo + GitHub-Repo initialisiert
- [ ] CI-Workflows grün auf Initial-Commit
- [ ] VPS provisioniert + SSH-Hardening
- [ ] Docker-Compose + Postgres + nginx hochgefahren
- [ ] Let's Encrypt Cert + Auto-Renewal
- [ ] DNS-Records (A/AAAA, CNAME für staging+docs)
- [ ] Initial-Migration deployed (000_init.sql)
- [ ] RLS auf allen Tabellen aktiv
- [ ] `audit_events`-Tabelle vorhanden
- [ ] Healthcheck-Endpoint live
- [ ] Backup-Cron eingerichtet + erstes Backup
- [ ] Restore-Drill durchgeführt
- [ ] Sentry empfängt Test-Error
- [ ] Uptime-Monitor pings /healthz
- [ ] Status-Page erreichbar
- [ ] CLAUDE.md verweist auf alle Manifesto-Docs
- [ ] Boot-Self-Test grün (<4k Tokens)

**Lessons Learned (Wave 1):**
- (wird hier eingetragen wenn nicht-trivial)

## Wave 2 — Auth + Schema (DoD: User kann sich registrieren+löschen, RLS aktiv, RBAC funktioniert)

- [ ] Supabase-Auth-Flow (Magic-Link oder Password)
- [ ] `workspace_members`-Tabelle mit Roles
- [ ] Permission-Matrix in `packages/shared/src/permissions.ts`
- [ ] `requireRole`-Middleware in Bridge
- [ ] `<RequireRole>`-Component in Client
- [ ] Audit-Log für Login/Logout/Role-Change
- [ ] DSGVO-Subject-Request-Workflow (Art. 15, 17, 20)

## Wave 3 — Erstes Feature (Beispiel: Tasks)

- [ ] `tasks`-Tabelle mit RLS + Tenant-ID
- [ ] CRUD-Endpoints in Bridge
- [ ] Task-List + Task-Detail in Client
- [ ] HyperUI-Pattern für UI
- [ ] i18n-Strings für alle UI-Texte
- [ ] Testprotokoll in `tests/protocols/wave-3-item-*.md`
- [ ] User-Doku in `docs-user/features/tasks.md`

## Tech-Debt-Wave (rolling)

(Hier landen Vorschläge aus Continuous-Quality-Awareness — Doubletten, Standard-Drifts, etc.)

## Pre-1.0 — Production-Readiness

- [ ] `docs/onboarding/production-readiness-review.md` komplett grün
- [ ] Pentest-Suite alle 7 Files grün
- [ ] DAST-Scan triaged
- [ ] Wiki vollständig
- [ ] Legal/Compliance-Pflichtbausteine
- [ ] Status-Page mit Initial-History
- [ ] DR-Drill durchgeführt

## Lessons Learned (übergreifend)

- (Sammlung non-trivialer Erfahrungen über Waves hinweg)
