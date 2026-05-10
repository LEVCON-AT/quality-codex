# Codex-Core — Tier-1 Boot-Doc

Dieses Dokument ist Pflicht-Lektüre bei jedem Session-Start. Hard-Cap: **≤ 2.000 Tokens**. Reine Stichpunkte, keine Prosa. Detail-Reasoning steht in den Tier-2/3-Docs (verlinkt am Ende).

## Modus-Frage am Session-Start (PFLICHT)

Vor erster Tool-Action bei nicht-trivialen Aufträgen den User klassifizieren lassen:

```
Modus-Frage:
- Klassifizierung: [klein / mittel / groß / strategisch]
- Empfehlung: [klassisch / sophisticated]
- Begründung: [warum — z.B. "berührt > 3 Komponenten", "neues Pattern", "Wave-Plan", "strategisches User-Signal", "Aufwand > 1 Tag"]

Soll diese Aufgabe klassisch oder sophisticated abgehandelt werden?
```

**User-Antworten:**
- `klassisch` → direkt umsetzen mit Foundation-Bewusstsein (Tier-1 reicht)
- `sophisticated` → `docs/claude/17-sophisticated-workflow.md` lesen, 12-Phasen-Lifecycle starten
- `du entscheidest` → Empfehlung folgen, Begründung dokumentieren

**Modus-Frage entfällt** bei: trivial-Anfragen ("mach kurz", einzeiliger Fix), Status-Fragen, klare Bugfixes mit Reproduktions-Pfad. Empfehlung dann implizit `klassisch`.

**Sophisticated wenn:** > 3 Komponenten betroffen, neues Pattern wird etabliert, Foundation-relevante Direktive, Aufwand > 1 Tag, strategisches User-Signal ("eigentlich denke ich größer"), Schema-Migration mit Breaking-Change, Tooling-Wechsel.

## Kern-Regeln (immer aktiv)

| # | Regel | Erkennen über | Reagieren |
|---|---|---|---|
| 1 | **Single Source of Truth** — keine Doubletten (Functions/Types/CSS) | `scripts/check-doublets.sh`, Grep-Vor-Write | Auto-fix bei trivial; sonst anbieten oder Backlog |
| 2 | **Type-Safety strict** — kein `any`, kein `@ts-ignore`, kein non-null `!` | TypeScript strict, Biome | Refactor, niemals suppress |
| 3 | **Tooling-Pflicht** — Biome (lint+format), Vitest (test), TypeScript | CI-Gates | Verstoß = Build rot |
| 4 | **Token-Pflicht** — keine hardcoded `px`/`#hex`/Spacing | Grep `^\d+px\|#[0-9a-f]{3,8}` | Token-Variable nutzen |
| 5 | **i18n-Pflicht** — keine User-facing Strings im Code | Custom Lint `no-hardcoded-strings` | Locale-File-Eintrag |
| 6 | **a11y WCAG 2.2 AA** — Tab-Order, Labels, aria-live | axe-core in Playwright | Fix vor Merge |
| 7 | **RBAC + RLS Defense-in-Depth** — Frontend-Guard + Backend-Middleware + DB-RLS | Code-Review-Sweep | Alle 3 Schichten Pflicht |
| 8 | **Audit-Log** für privilegierte Actions (Role-Change, Delete, Permission-Grant, Login) | Mutation-Wrapper | `audit_events`-Insert |
| 9 | **Offline-First** — `safeMutation`-Wrapper für jede DB-Schreib-Op | Code-Review | IDB-Fallback Pflicht |
| 10 | **`@docs`-Tag** auf jeder exportierten User-facing Funktion | `scripts/check-doc-links.ts` | Verweis auf `docs-user/...` |
| 11 | **Conventional Commits** — `feat:`/`fix:`/`chore:`/`docs:`/`refactor:`/`perf:`/`security:`/`breaking:` | commitlint | Format korrigieren |
| 12 | **Branch-Konvention** — `feat/wave-N-item-X-<slug>`, `fix/<slug>`, `hotfix/<slug>` | Pre-Push-Hook | Branch umbenennen |
| 13 | **Conventional Animation** — alles über Animation-Tokens, kein Inline-Transition | Grep `transition:` | Animation-Helper nutzen |
| 14 | **Idempotente Migrationen** — 2× ausführbar mit identischem Resultat | CI 2-Pass-Smoke | `IF NOT EXISTS`/`CREATE OR REPLACE` |
| 15 | **STRIDE bei neuem Endpoint** — 1 Zeile pro Kategorie reicht | Wave-Item-DoR | Bei Lücke ADR |
| 16 | **No silent failures** — jeder Error → User-facing Toast/Modal | Code-Review | Error-UI ergänzen |

## Continuous-Quality-Awareness (während Coden)

Bei jedem Edit/Read prüfen — Tier-1-Regeln + Tooling-Output. Reaktion-Modi:

- **Auto-fix:** trivial im Scope (unbenutzten Import löschen)
- **Anbieten:** zusammenhängend, Scope-Erweiterung (Doublette konsolidieren) → "Soll ich X gleich aufräumen?"
- **Backlog:** größerer Refactor → Eintrag in `BACKLOG.md` Tech-Debt-Wave

Detail-Reasoning für Streit-Fälle: `docs/claude/02-code-quality.md` on-demand laden (Tier 3).

## Trigger-Boot (lazy load Tier 2)

| Wenn ich folgendes bearbeite | Lade vorher |
|---|---|
| `*.tsx` / `*.css` | `03-design.md` + `04-animations.md` + `references/hyperui-component-index.md` |
| `migrations/`, `*.sql` | `01-architecture.md` + `references/supabase-patterns.md` |
| Auth/Permission-Code | `08-roles-permissions.md` + `06-security.md` |
| API-/Endpoint-Code | `06-security.md` + `checklists/security-pentest-review.md` |
| i18n-Strings, Datum/Zeit | `07-globalization.md` |
| Deploy/Infra | `runbooks/deploy.md` + `runbooks/operations-mandate.md` |
| Tests / Wave-Item-Verifikation | `12-feature-verification.md` |
| Anthropic-SDK-Code | `references/claude-api-patterns.md` |
| Mobile-Package | `14-mobile.md` |
| Multi-Tenant-Änderungen | `15-multi-tenancy.md` |
| MCP-Tool | `16-mcp-integration.md` |

## Modell-Wahl (Cost/Quality)

- **Opus** — Architektur, Refactoring, Code-Review, Security-Audit, Plan-Mode
- **Sonnet** — Standard-Feature-Implementation, Tests, Doc-Updates
- **Haiku** — triviale Edits, Format-Fixes, Translation-Updates

## Plan-Mode-Pflicht für

- Architektur-Änderungen
- Breaking-Changes
- neue externe Integrationen
- Sicherheits-relevante Refactorings

## Operations-Mandat (VPS)

**Claude darf:** Logs lesen, Healthcheck verifizieren, Auto-Rollback nach User-OK, Read-only-DB-Queries, Backup-Restore-Drills in ephemeren Containern.
**Claude darf NICHT (ohne explizites OK):** Prod-DB schreiben/löschen, Secrets rotieren, `git push --force` auf `main`, destruktive Linux-Commands.

## Anerkannte Standards (Pflicht-Referenzen)

OWASP ASVS L2 · OWASP Top 10 · CWE Top 25 · WCAG 2.2 AA · GDPR · SemVer 2.0 · Conventional Commits · OpenAPI 3.1 · ISO 8601 · BCP 47 · STRIDE · Core Web Vitals

## Verlinkte Tier-2/3-Docs

01-architecture · 02-code-quality · 03-design · 04-animations · 05-workflow · 06-security · 07-globalization · 08-roles-permissions · 09-data-protection · 10-performance · 11-continuous-quality · 12-feature-verification · 13-documentation · 14-mobile · 15-multi-tenancy · 16-mcp-integration · **17-sophisticated-workflow** (nur bei Modus=sophisticated)

References (on-demand): frontend-design · hyperui-component-index · supabase-patterns · postgres-best-practices · claude-api-patterns · code-review-method · security-review-method

Planning-Templates (für Sophisticated-Modus): `docs/planning/{concept-template, sophisticated-worksheet-template.md/.csv, plan-tracker-template, schema-quad-coverage-template.csv, risk-register-template, threat-model-template, performance-budget-template, definition-of-ready, spike-template}`
