# Testprotokoll — Wave N / Item X: <Titel>

**Datum:** YYYY-MM-DD
**Modus:** A (autonom) / B (Wizard mit User)
**User-Story:** <copy aus BACKLOG.md>
**Tester:** Claude (Modus A) / User+Claude (Modus B)
**Branch / Commit:** feat/wave-N-item-X-<slug> / <SHA>

## Soll
- [ ] Akzeptanz-Kriterium 1
- [ ] Akzeptanz-Kriterium 2
- [ ] WCAG 2.2 AA: Tab-Order korrekt, Labels verbunden, aria-live
- [ ] Performance-Budget: LCP <2.5s, JS-Bundle <Xkb

## Ist
- ✅ Schritt 1: <Beschreibung> (siehe screenshots/01-...)
- ✅ Schritt 2: ...
- ⚠️ Schritt 3: ... (User-Kommentar Modus B: "...")
- a11y: 0 violations (siehe axe-core-report.json)
- Performance: LCP X ms ✅, JS Y kB ✅

## Findings

| ID | Severity | Beschreibung | Status |
|---|---|---|---|
| F1 | Medium | ... | → Wave N+1 |
| F2 | Low | ... | → Backlog Tech-Debt |

## Anhänge

- screenshots/01-initial.png
- screenshots/02-action.png
- screenshots/03-result.png
- axe-core-report.json
- lighthouse-report.html
- console-log.txt
- network-log.har

## Sign-off

- Claude verifiziert: ✓
- User reviewt: ☐ → wenn ja, hier abhaken + Datum
