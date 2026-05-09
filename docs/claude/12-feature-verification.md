# 12 — Feature Verification

Tier-2-Doc. Lädt nach Wave-Item-Implementierung.

## Workflow

Nach jedem Wave-Item-DoD-Check fragt Claude:

> *"Item X ist fertig — soll ich die Verifikation übernehmen (Modus A: autonom Playwright + axe + Lighthouse + Testprotokoll-Auto-Generation) oder willst du die Schritte selbst durchgehen, mit mir als Wizard (Modus B)?"*

## Modus A — Claude verifiziert autonom

1. Liest `BACKLOG.md` Wave-Item-Beschreibung
2. Liest `docs-user/features/<feature>.md` (Soll-Spec aus User-Perspektive)
3. Plant Playwright-Steps (browser_navigate, browser_click, browser_type, browser_snapshot)
4. Führt aus, zeichnet Screenshots an Schlüsselzuständen
5. axe-core-Run via Playwright
6. Lighthouse-Run via `lighthouse` CLI gegen Staging
7. Console-/Network-Errors-Capture
8. Generiert Testprotokoll-Markdown unter `tests/protocols/wave-N-item-X.md`
9. Bei Findings: Severity-Einstufung + Vorschlag (fix-now / Backlog / ignore-with-reason)

## Modus B — User-Wizard

Schritt-für-Schritt, Claude fragt via AskUserQuestion:

```
Schritt 1: "Öffne /register im Browser. Siehst du das Formular mit E-Mail+Passwort?"
  Antwort: [Bestanden] [Nicht bestanden]
  Kommentar: ___

Schritt 2: "Gib eine ungültige E-Mail ein und klicke Submit. Erscheint Fehlermeldung?"
  Antwort: [Bestanden] [Nicht bestanden]
  Kommentar: ___
...
```

Parallel zu jedem User-Schritt im Hintergrund:
- Screenshot auf gleicher URL
- Console-Errors-Capture
- Network-Errors-Capture
- axe-core-Run

Bei "Nicht bestanden":
- Claude bietet sofort an: "Soll ich das Problem analysieren und einen Fix vorbereiten? Oder fürs Backlog?"

## Testprotokoll-Template

```markdown
# Testprotokoll — Wave N / Item X: <Titel>

**Datum:** YYYY-MM-DD
**Modus:** A (autonom) / B (Wizard mit User)
**User-Story:** <copy aus BACKLOG.md>
**Tester:** Claude (Modus A) / <user>+Claude (Modus B)

## Soll
- [ ] Akzeptanz-Kriterium 1
- [ ] Akzeptanz-Kriterium 2
- [ ] WCAG: Tab-Order korrekt, Labels verbunden, aria-live
- [ ] Performance-Budget: LCP <2.5s, JS-Bundle <Xkb

## Ist (Auto-Capture / User-Antworten)
- ✅/⚠️/❌ Schritt 1: <Beschreibung> (siehe screenshot-01-...)
- ✅/⚠️/❌ Schritt 2: ...
  - User-Kommentar (Modus B): ___
- a11y: 0 violations (axe-core report angehängt)
- Performance: LCP 1.8s ✅, JS 142kB ✅

## Abweichungen / Findings
| ID | Severity | Beschreibung | Status |
|---|---|---|---|
| F1 | Medium | Aktivierungslink-Domain hardcoded | → Wave 2 / Item 3.1 |
| F2 | Low | Submit-Button braucht Loading-State | → Backlog Tech-Debt |

## Screenshots
- screenshot-01-form.png
- screenshot-02-submit.png
- screenshot-03-mail.png

## Anhänge
- axe-core-report.json
- lighthouse-report.html
- console-log.txt
- network-log.har
```

## Auto-Index

`scripts/generate-protocol-index.ts` läuft in CI nach jedem neuen Protokoll, generiert `tests/protocols/INDEX.md`:

```markdown
# Testprotokolle Index

| Wave | Item | Datum | Modus | Status | Findings |
|---|---|---|---|---|---|
| 2 | 1 | 2026-05-09 | A | ✅ | 0 |
| 2 | 2 | 2026-05-10 | B | ⚠️ | 2 (1 medium fixed, 1 backlog) |
```

## Mobile-App-Verification

Bei Mobile aktiviert: zusätzlich zur Web-Verifikation Detox/Maestro-Suite gegen Build-Output (Android Emulator + iOS Simulator).

## Pflicht-Verifikation

DoD-Pflicht: jedes Wave-Item HAT ein Testprotokoll. Ohne Protokoll → kein DoD-Hak in BACKLOG.

Pre-Release: alle Protokolle der letzten Wave gesichtet, Findings entweder behoben oder bewusst nach BACKLOG verschoben.

## Standard-Checks (immer)

- [ ] Soll/Ist-Match laut User-Story
- [ ] axe-core 0 violations
- [ ] Lighthouse Performance ≥ 90
- [ ] Console-Errors: 0
- [ ] Network-Errors: 0 (außer expected 4xx)
- [ ] Reduced-Motion-Variante getestet (DevTools Emulation)
- [ ] Mobile-Viewport getestet (375×667 minimum)
- [ ] Keyboard-only-Bedienung möglich
- [ ] Screen-Reader-Test stichprobenartig (NVDA/VoiceOver Screenshot)
