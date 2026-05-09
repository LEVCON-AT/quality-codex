## Was

<1-2 Sätze>

## Warum

<Wave-Item-Verweis oder Bug-Report>

## Test-Plan

- [ ] Local: `pnpm typecheck && pnpm lint && pnpm test` grün
- [ ] Staging: Smoketest grün
- [ ] Feature-Verification (Modus A oder B): Testprotokoll unter `tests/protocols/wave-N-item-X.md`

## Migrations

- [ ] Idempotent (2-Pass-Test grün)
- [ ] RLS für neue Tabellen
- [ ] Rollback-Pfad dokumentiert

## Risiken

<STRIDE-Quick-Walk wenn neue Surface, sonst "keine">

## Doku

- [ ] `docs-user/` aktualisiert
- [ ] `@docs`-Tags vorhanden
- [ ] `pnpm docs:check` grün

## DoD-Check

→ `checklists/pre-merge-pr.md`
