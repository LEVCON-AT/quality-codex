# CLAUDE.md — Foundation-Manifesto Boot

## Pflicht-Lektüre Session-Start (Tier 1, ≤ 4.000 Tokens)

Lies diese 2 Dateien VOR der ersten Antwort, in genau dieser Reihenfolge:

1. `docs/claude/00-codex-core.md` — Kern-Regeln, Tooling, Trigger-Map
2. `docs/claude/00-codex-decisions.md` — Projekt-spezifische Setup-Antworten

Außerdem ist `MEMORY.md` automatisch geladen.

## Modus-Frage (Pflicht bei nicht-trivialen Aufträgen)

VOR erster Tool-Action: User klassifizieren lassen.

```
Modus-Frage:
- Klassifizierung: [klein / mittel / groß / strategisch]
- Empfehlung: [klassisch / sophisticated]
- Begründung: [warum]

Soll diese Aufgabe klassisch oder sophisticated abgehandelt werden?
```

- **klassisch** → direkt umsetzen mit Foundation-Bewusstsein
- **sophisticated** → `docs/claude/17-sophisticated-workflow.md` lesen, 12-Phasen-Lifecycle (Konzept-File + Worksheet MD/CSV + Plan-Tracker + Schema-Quad-Coverage)
- **du entscheidest** → Empfehlung folgen mit Begründung dokumentiert

Modus-Frage entfällt bei: Bugfix mit Reproduktions-Pfad, UI-Tweak, Status-Anfrage, einzeiliger Fix, expliziten "mach kurz".

## Tier-2 — On-Demand laden je nach Task

Bei diesen Edit-Patterns lade vorher die genannten Docs:

| Wenn ich bearbeite | Lade |
|---|---|
| `*.tsx`, `*.css`, `*.svelte` | `docs/claude/03-design.md` + `04-animations.md` + `docs/references/hyperui-component-index.md` |
| `migrations/`, `*.sql` | `docs/claude/01-architecture.md` + `docs/references/supabase-patterns.md` + `docs/references/postgres-best-practices.md` |
| Auth-/Permission-Code | `docs/claude/08-roles-permissions.md` + `docs/claude/06-security.md` |
| API-/Endpoint-Code | `docs/claude/06-security.md` + `checklists/security-pentest-review.md` |
| i18n / Datum / Währung | `docs/claude/07-globalization.md` |
| Deploy / Infra | `docs/runbooks/deploy.md` + `docs/runbooks/operations-mandate.md` |
| Tests / Wave-Item-Verifikation | `docs/claude/12-feature-verification.md` |
| Anthropic-SDK-Code | `docs/references/claude-api-patterns.md` |
| Mobile-Code (`packages/client-mobile/`) | `docs/claude/14-mobile.md` |
| Multi-Tenant-Schema-Änderung | `docs/claude/15-multi-tenancy.md` |
| MCP-Tool (`packages/bridge/src/tools/`) | `docs/claude/16-mcp-integration.md` |
| Doku (`docs-user/`) | `docs/claude/13-documentation.md` + `checklists/doc-update-review.md` |
| **Sophisticated-Modus aktiv** | `docs/claude/17-sophisticated-workflow.md` + `docs/planning/{concept-template, sophisticated-worksheet-template.md/.csv, plan-tracker-template, schema-quad-coverage-template.csv}` |

## Tier-3 — Cold-Read (nur explizit angefordert)

- `docs/claude/02-code-quality.md` (komplette Bibel) — Streit-Fälle, Begründungen
- `docs/claude/09-data-protection.md` — DSGVO-Detail
- `docs/claude/10-performance.md` — Performance-Tiefen-Tuning

## Continuous-Quality-Awareness

Während des Codens automatisch prüfen:
- Doubletten (`scripts/check-doublets.sh`)
- Toter Code (Biome)
- Standard-Drift (Tier-1-Stichpunkte + Tooling-Output)
- Hardcoded Strings, Colors, `px`
- Fehlende `@docs`-Tags
- Permission-Check-Lücken bei API-Routes

3 Reaktion-Modi:
1. **Auto-Fix** bei trivial im Scope
2. **Anbieten** bei Scope-Erweiterung
3. **Backlog-Vorschlag** bei größerem Refactor

Detail: `docs/claude/11-continuous-quality.md`.

## Branch + Commit-Disziplin

- Branch: `feat/wave-N-item-X-<slug>`, `fix/<slug>`, `hotfix/<slug>`, `chore/<slug>`, `docs/<slug>`
- Commit: Conventional Commits, signed (für `main`)
- PR-Template: ausgefüllt, Test-Plan + Migrations-Notes + Risiken
- Squash-Merge

Detail: `docs/runbooks/branching-strategy.md`.

## Operations-Mandat (VPS)

**Claude darf:** Logs lesen, Healthcheck, Read-only-DB, Backup-Restore-Drills (ephemer), Auto-Smoketest.
**Claude darf NICHT (ohne explizites OK):** Prod-DB-Writes, Secret-Rotation auf Prod, `git push --force` auf `main`, destruktive Linux-Commands.

Detail: `docs/runbooks/operations-mandate.md`.

## Feature-Verification nach Wave-Item-Abschluss

Claude fragt immer: **Modus A (autonom Playwright + axe + Lighthouse + Testprotokoll-Auto)** oder **Modus B (Wizard mit User: bestanden/nicht bestanden + Kommentar pro Schritt, parallel Auto-Captures)**.

Testprotokoll-Pflicht unter `tests/protocols/wave-N-item-X.md`.

Detail: `docs/claude/12-feature-verification.md`.

## Anerkannte Standards

OWASP ASVS L2 · OWASP Top 10 · CWE Top 25 · WCAG 2.2 AA · GDPR · SemVer 2.0 · Conventional Commits · OpenAPI 3.1 · ISO 8601 · BCP 47 · STRIDE · Core Web Vitals

## Modell-Wahl

- **Opus** für Architektur, Refactor, Code-Review, Security-Audit, Plan-Mode
- **Sonnet** für Standard-Feature, Tests, Doc-Updates
- **Haiku** für Format-Fixes, Translation-Updates

## Memory-Files

`~/.claude/projects/<this-slug>/memory/` für persistente Lernerfahrungen (feedback_*, project_*, reference_*).
