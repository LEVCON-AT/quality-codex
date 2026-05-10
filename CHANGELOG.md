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

## [1.1.0] — 2026-05-10

### Hinzugefügt — Sophisticated-Workflow (Pfeiler #17)
- `docs/claude/17-sophisticated-workflow.md` — 12-Phasen-Lifecycle für strategische Umbauten, adaptiert aus Matrix's Konzept-Sprint-Methodik
- **Modus-Frage am Session-Start** in `00-codex-core.md` und Template-`CLAUDE.md` (klassisch/sophisticated/du-entscheidest mit Klassifizierungs-Heuristik)
- `docs/planning/concept-template.md` — Konzept-Hauptfile-Template mit Foundation-Direktive, Inventur, Implikationen, Risiken, BACKLOG-Auswirkung, Plan-Tracker
- `docs/planning/sophisticated-worksheet-template.md` + `.csv` — Worksheet MD+CSV synchron für Excel-Offline-Arbeit (Spalten: # / Item / Form / Annahme-oder-Frage / Status / Kommentar; Status-Werte: offen/bestätigt/geändert/verworfen/vorschlag-claude)
- `docs/planning/plan-tracker-template.md` — Persistente Diskussions-Spur über `/clear` hinaus
- `docs/planning/schema-quad-coverage-template.csv` — Schema × Architektur-Slots Coverage-Matrix
- README Pfeiler #17 hinzugefügt
- `.codex-version` → 1.1.0

### Behoben (in v1.1)
- CookieConsent-Banner: `role="dialog"` → `role="region"`
- Bridge `tsconfig.json`: rootDir-Konflikt mit `test/`-Include über separate `tsconfig.build.json` gelöst
- `staging.__DOMAIN__`-Hardcoding → eigener `__STAGING_DOMAIN__`-Platzhalter mit Smart-Default
- `vitest run --passWithNoTests` in shared/, client-web/, bridge/
- `bootstrap.ps1` UTF-8-BOM-less-Encoding (verhindert Mojibake)
- Code-Quality-Doc: Umlaute-Konvention (ä/ö/ü/ß/€ Pflicht) + Workspace-Hygiene (Vue gehört in docs-wiki)
- README + START-HERE: hardcoded Pfade durch `<DEIN-CODEX-PFAD>` ersetzt
- `docs/runbooks/github-setup.md` (PAT/SSH/Branch-Protection/Secrets)
- `START-HERE.md` als Single-Source-of-Truth + Auto-Archivierung der Snippet-Kopie

## [1.1.1] — 2026-05-10

### Behoben — Worksheet-Format User-Story-tauglich
- `docs/planning/sophisticated-worksheet-template.md` + `.csv`: 8 Spalten statt 6 (`# / Sektion / Item / Beschreibung / Frage / Optionen mit Trade-offs / Status / Kommentar`)
  - **Beschreibung:** 2-3 Sätze in Alltagssprache (was, warum, Einfluss) — kein technisches Kürzel mehr
  - **Frage:** EINE konkrete entscheidbare Frage statt "X klären"
  - **Optionen mit Trade-offs:** 2-3 Wahlmöglichkeiten je mit Vor/Nachteil + Empfehlung
  - **Anti-Pattern dokumentiert:** technische Kürzel ohne Beschreibung → User schreibt überall "müssen wir besprechen"
- `docs/claude/17-sophisticated-workflow.md` Phase 5 reflektiert neues Format mit Pflicht-Format-Block + Anti-Pattern-Hinweis
- Templates `stack-monorepo-vps` + `stack-monorepo-cloud` synchron aktualisiert
- `.codex-version` → 1.1.1

### Grund
User-Feedback nach erstem Sophisticated-Sprint: knappe technische Beschreibungen führten zu Antworten "müssen wir besprechen" überall. User-Story-artige Formulierung mit Beschreibung + konkreter Frage + Trade-offs ermöglicht Excel-Offline-Arbeit ohne Tech-Vorbildung.

## [Unreleased]

### Geplant für v1.2
- Yjs/CRDT-Collab-Pattern (sobald Matrix Phase 7 stabilisiert)
- Auto-Sync-Skript zwischen Codex-Repo und Bestandsprojekten (`scripts/sync-skill-references.sh`)
- Erweiterte Mobile-E2E-Suite (Detox + Maestro Vergleichsmatrix)
- `scripts/check-encoding.ps1` (Mojibake-Detection für CI)
- Pre-Commit-Check: verbietet bestimmte deps im Root-`package.json` (vue/react/solid-js)
