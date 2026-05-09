# Definition of Ready (DoR)

Vor Aufnahme in eine Wave: jedes Item muss DoR erfüllen. Sonst zurück in den Pool.

## Story-Form

```markdown
## Wave N / Item X: <Titel>

**User-Story:**
Als <Rolle> möchte ich <Aktion>, damit <Mehrwert>.

**Akzeptanz-Kriterien:**
- [ ] <Konkret beobachtbares Verhalten 1>
- [ ] <Konkret beobachtbares Verhalten 2>
- [ ] <Konkret beobachtbares Verhalten 3>

**Out-of-Scope:**
- <Was ausdrücklich nicht in diesem Item drin ist>
```

## DoR-Checkliste

### Inhaltlich
- [ ] User-Story formuliert (Rolle, Aktion, Mehrwert)
- [ ] Akzeptanz-Kriterien spezifisch + testbar (kein "soll funktionieren")
- [ ] Out-of-Scope dokumentiert (verhindert Scope-Creep)
- [ ] Mockup / Wireframe falls UI (oder explizit: "freie UI-Wahl, HyperUI-Pattern X")

### Risiko-Bewertung
- [ ] Threat-Model-Impact bewertet (1-Zeile pro STRIDE-Kat oder "keine neue Surface")
- [ ] Risk-Register-Eintrag wenn Score ≥ 10
- [ ] Performance-Budget abgeschätzt (Bundle-/Query-Impact)
- [ ] Permissions-Auswirkung (welche Rollen, neue Actions in Permission-Matrix?)

### Compliance / Globalisierung
- [ ] i18n-Strings spezifiziert (welche Texte werden gebraucht — oder "i18n-Wave-N+1")
- [ ] PII-Impact bewertet (neue PII gesammelt? Lawful-Basis?)
- [ ] a11y-Anforderungen klar (Tastatur-Bedienung, Screen-Reader, Reduced-Motion)

### Doku
- [ ] `docs-user/`-Page identifiziert (welche Page wird angefasst oder neu erstellt)
- [ ] `@docs`-Tag-Ziel klar (welche User-Doku-Anchor)

### Tech
- [ ] Migrationen nötig? Wenn ja: idempotent + RLS
- [ ] Schema-Quad-Auswirkung (Schema, Mutations, Tools, Export)
- [ ] Externe Abhängigkeiten klar (neue Library? DPA-relevant?)
- [ ] Estimate (rough): S (½ Tag) / M (1-2 Tage) / L (3-5 Tage) / XL (>5 Tage → splitten!)

## Bei "nein" zu einem Punkt

→ Zurück in den Pool, Item nicht in Wave aufnehmen.
→ Klärungs-Subtask anlegen ("Klären: a11y-Anforderungen für Bulk-Action").

## Spike-Pfad

Wenn Lösungsweg unklar → erst Spike (siehe `spike-template.md`), dann DoR-Pass.

## Verbindung zu DoD

DoR ist die Eingangs-Schwelle, DoD die Ausgangs-Schwelle. Beide sind nicht verhandelbar bei Wave-Items mit User-facing Impact.
