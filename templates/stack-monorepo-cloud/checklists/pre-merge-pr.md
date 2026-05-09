# Pre-Merge PR Checklist

Vor jedem Merge zu `develop` oder `main`. Reviewer (Claude oder User) hakt durch.

## Code-Quality
- [ ] `pnpm typecheck` grün
- [ ] `pnpm lint` grün
- [ ] `pnpm test` grün lokal + CI
- [ ] Coverage nicht degradiert (für kritische Pfade)
- [ ] Doublet-Sweep: keine neuen Duplikate (`scripts/check-doublets.sh`)
- [ ] Dead-Code: Biome-noUnused-Verstöße = 0
- [ ] `any`-Types: 0 oder mit ADR begründet
- [ ] `@ts-ignore` / `@ts-expect-error`: 0 oder mit Issue-Link

## Token-System / Design
- [ ] Keine hardcoded `px` in spacing/font (außer border/shadow/icon)
- [ ] Keine hardcoded Hex-Farben (alle via `--color-*`)
- [ ] Keine Inline-Styles ohne CSS-Custom-Property-Pattern

## Security
- [ ] Kein hardcoded Secret (`gitleaks` grün)
- [ ] Input-Validation (Zod) an System-Grenzen
- [ ] RLS-Policy für neue Tabellen
- [ ] Permission-Check in neuen Endpoints
- [ ] Output-Encoding (kein `dangerouslySetInnerHTML` ohne Allowlist)
- [ ] STRIDE-Quick-Walk dokumentiert wenn neue Surface
- [ ] Pentest-Checkliste durchgegangen bei sensitivem Change

## i18n / Globalisierung
- [ ] Keine hardcoded User-facing Strings
- [ ] Datum/Zahl/Währung via `Intl.*`
- [ ] Neue Locale-Keys in allen aktiven Locale-Files
- [ ] CSS Logical Properties bei UI-Änderungen (RTL-ready)

## Accessibility
- [ ] axe-core 0 violations
- [ ] Keyboard-Navigation getestet
- [ ] Labels für alle Inputs
- [ ] aria-live für dynamische Inhalte
- [ ] prefers-reduced-motion respektiert
- [ ] Touch-Targets ≥ 44×44

## Performance
- [ ] Bundle-Size-Budget nicht überschritten
- [ ] DB-Queries < Budget pro Route
- [ ] Keine N+1-Queries
- [ ] Lighthouse Performance ≥ 90

## Permissions / RBAC
- [ ] Permission-Matrix-Update bei neuen Actions
- [ ] Defense-in-Depth: Frontend-Guard + Backend-Middleware + RLS
- [ ] Audit-Log für privilegierte Actions

## Doku
- [ ] `@docs`-Tag auf neuen User-facing Funktionen
- [ ] `docs-user/features/<feature>.md` aktualisiert
- [ ] `pnpm docs:check` grün
- [ ] BACKLOG.md Item gehakt + Lessons-Learned wenn nicht-trivial

## Tests
- [ ] Neue Logic hat Test-Coverage
- [ ] Edge-Cases getestet (Empty, Boundary, Error)
- [ ] Tests sinnvoll (nicht nur "läuft durch")

## Migration
- [ ] Migration idempotent (2-Pass-Test grün)
- [ ] Rollback-Pfad dokumentiert
- [ ] Schema-Quad-Konsistenz (Schema, Mutations, Tools, Export)

## Git-Disziplin
- [ ] Conventional-Commit-Format
- [ ] Signed Commits (für `main`)
- [ ] Branch-Konvention `feat/wave-N-item-X-<slug>`
- [ ] PR-Template ausgefüllt

## Feature-Verification (vor Merge zu main)
- [ ] Playwright-Soll/Ist-Replay durchgeführt
- [ ] Testprotokoll unter `tests/protocols/wave-N-item-X.md`
- [ ] Screenshots an Schlüsselzuständen
- [ ] Console/Network-Errors-Capture sauber

## CI-Gates
- [ ] PR-Workflow grün (lint+typecheck+test+build+migration-2pass+doc-link-check+SAST+SCA+gitleaks+SBOM)
- [ ] DAST-Scan grün (oder Findings triaged)
- [ ] Deploy-Staging grün + Smoketest
