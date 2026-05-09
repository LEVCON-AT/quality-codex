# Changelog

Alle nennenswerten Änderungen am Quality-Coding-Codex. Folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) und [SemVer 2.0](https://semver.org/lang/de/).

## [1.0.0] — 2026-05-09

### Hinzugefügt
- Initial-Release des Codex
- 16 Foundation-Manifesto-Docs (Tier-1/2/3-Boot-System)
- 7 Skill-Substanz-Referenz-Docs (frontend-design, supabase, postgres-best-practices, claude-api, code-review, security-review)
- 5 Planning-Templates (Risk-Register, STRIDE-Threat-Model, Performance-Budget, Definition-of-Ready, Spike)
- 9 Runbooks (Deploy, Rollback, DB-Restore, Secret-Rotation, Incident-Response, GDPR-Subject-Request, Operations-Mandate, Branching-Strategy, Codex-Sync)
- 4 Onboarding-Docs (New-Project-Checkliste, Stack-Decision-Tree, Production-Readiness-Review, Globalization-Decision)
- 9 Checklists (Pre-Merge-PR, Pre-Release, Incident, Security-Pentest, A11y-Review, I18n-Review, Permission-Change, Doc-Update, Setup-Hardening)
- VPS-Template (Hetzner+Docker+Supabase, Full-Stack-Monorepo) — komplett mit `docs/`, `checklists/`, Manifesto-Docs in-place
- Cloud-Template (Supabase-Cloud+Vercel) — vollständige Kopie der VPS-Struktur ohne VPS-spezifische Infra-Skripte
- Skill `/onboard-project` mit Bootstrap/Secrets/Verify-Skripten
- Skill `/feature-verify` mit Wizard-Modus für User-Verification
- LICENSE (MIT) für Codex-Repo + Templates
- CLAUDE.md im Codex-Root (für Codex-Self-Maintenance)
- `scripts/sync-templates.ps1` für Codex-Quelle ↔ Template-Sync
- Lefthook + commitlint Pre-Commit-Konfiguration
- CookieConsent-Komponente (DSGVO-konform, granular, easy-withdrawal)
- Beispiel-ADR (`ADR-0001-stack-choice.md`) als Referenz
- Beispiel-Testprotokoll (`EXAMPLE-wave-1-item-3.md`) als Referenz
- Pentest-Tests via `test.skip()` markiert (nicht fake-grün) — explizit "vor Production implementieren"
- Anerkannte Standards: OWASP ASVS L2, WCAG 2.2 AA, GDPR, SemVer, Conventional Commits, OpenAPI 3.1, ISO 8601, BCP 47, STRIDE, Core Web Vitals

### Quelle
Patterns abgeleitet aus dem Matrix-Projekt nach 2 Jahren produktiver Nutzung.

## [Unreleased]

### Geplant für v1.1
- Yjs/CRDT-Collab-Pattern (sobald Matrix Phase 7 stabilisiert)
- Auto-Sync-Skript zwischen Codex-Repo und Bestandsprojekten
- Erweiterte Mobile-E2E-Suite (Detox + Maestro Vergleichsmatrix)
