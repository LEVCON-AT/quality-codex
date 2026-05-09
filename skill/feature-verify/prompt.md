# /feature-verify — Skill Prompt

Du verifizierst ein abgeschlossenes Wave-Item.

## Schritt 1 — Identifikation

Frage:
- Welches Wave-Item? (z.B. "Wave 3 / Item 2")
- Existiert eine User-Story-Beschreibung in `BACKLOG.md` oder `docs-user/features/`?

Lese:
- `BACKLOG.md` für Wave-Item-Definition
- `docs-user/features/<feature>.md` für User-Soll-Spec
- `tests/protocols/TEMPLATE.md` als Template

## Schritt 2 — Modus-Wahl (AskUserQuestion)

> "Item ist fertig — soll ich die Verifikation übernehmen (Modus A: autonom) oder willst du die Schritte selbst durchgehen, mit mir als Wizard (Modus B)?"

## Schritt 3a — Modus A: Autonomer Replay

1. Plane Playwright-Steps aus User-Story (browser_navigate, _click, _type, _snapshot)
2. Führe aus gegen `staging.<domain>` (oder lokal wenn dev)
3. Screenshots an Schlüsselzuständen (`tests/protocols/screenshots/`)
4. axe-core via Playwright
5. Lighthouse via `lighthouse` CLI
6. Console-/Network-Errors-Capture
7. Generiere `tests/protocols/wave-N-item-X.md` aus Template

## Schritt 3b — Modus B: User-Wizard

Für jeden Soll-Punkt aus User-Story:
1. AskUserQuestion mit Schritt-Anweisung + Optionen [Bestanden / Nicht bestanden]
2. Optional Kommentar via "Other"
3. Parallel im Hintergrund:
   - Screenshot der aktuellen URL
   - Console-Errors-Capture
   - Network-Errors-Capture
   - axe-core-Run

Bei "Nicht bestanden":
> "Soll ich das Problem analysieren und Fix vorbereiten? Oder fürs Backlog notieren?"

## Schritt 4 — Standard-Checks (immer)

- Soll/Ist-Match
- axe-core 0 violations
- Lighthouse Performance ≥ 90
- Console-Errors: 0
- Network-Errors: 0 (außer expected 4xx)
- Reduced-Motion-Variante getestet (DevTools)
- Mobile-Viewport (375×667)
- Keyboard-only-Bedienung

## Schritt 5 — Testprotokoll generieren

Schreibe `tests/protocols/wave-${wave}-item-${item}.md` mit:
- Soll-Liste aus BACKLOG/User-Story
- Ist-Liste mit ✓/⚠️/❌ + Verweise auf Screenshots
- Findings-Tabelle
- Anhänge

## Schritt 6 — INDEX aktualisieren

`tsx scripts/generate-protocol-index.ts`

## Schritt 7 — Findings-Aktion

Bei ⚠️/❌-Findings:
- Severity einordnen
- Fix-Now-Vorschlag oder Backlog-Eintrag
- BACKLOG.md aktualisieren

## Schritt 8 — DoD-Hak

In BACKLOG.md das Wave-Item haken (falls alle Findings adressiert).
Lessons-Learned-Eintrag wenn nicht-trivial.

## Wichtig

- NIE Modus B überspringen wenn User es will (auch wenn länger)
- Screenshots IMMER speichern, nicht nur referenzieren
- User-Kommentare aus Modus B in Testprotokoll übernehmen wortgetreu
- Bei "Nicht bestanden" SOFORT analysieren statt am Ende batched
