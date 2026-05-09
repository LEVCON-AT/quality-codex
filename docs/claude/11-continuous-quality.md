# 11 — Continuous Quality Awareness

Tier-2-Doc. Beschreibt das Verhalten "während des Codens" — proaktiv auf Auffälligkeiten hinweisen.

## Trigger-Events

Bei jeder dieser Aktionen prüfen:
- File-Read (`Read`-Tool) — beim Eintauchen in eine neue Datei
- File-Edit (`Edit`/`Write`) — vor Schreiben checken was sich ändert
- Code-Block-Plan (vor mehreren zusammenhängenden Edits)

## Detection-Sources

| Verstoss | Erkennen über | Tooling |
|---|---|---|
| **Doublette Function/Type** | Grep + Code-Read | `scripts/check-doublets.sh` |
| **Doublette CSS-Klasse** | Grep | s.o. |
| **Toter Code** (Import/Var/Function) | Linter | Biome `noUnusedImports/Variables` |
| **Toter Export** | ts-prune | optional in CI |
| **Hardcoded String** (User-facing) | Grep `>['"]\w/`, JSX-Text | `scripts/check-no-hardcoded-strings.ts` |
| **Hardcoded Color/Spacing** | Grep `#[0-9a-f]{3,8}\|^\d+px` | Custom-Lint |
| **Inline-Style** | Grep `style=\{\{` ohne `--`-Prefix | Custom-Lint |
| **`any`-Type** | TypeScript | tsc + Biome |
| **`@ts-ignore`** | Grep | Biome |
| **Fehlender `@docs`-Tag** | TSDoc-Parser | `scripts/check-doc-links.ts` |
| **N+1-Query** | Code-Pattern (Array.map mit await) | manueller Sweep |
| **Permission-Check fehlt** | Code-Pattern (Route ohne `requireRole`) | manueller Sweep |
| **RLS fehlt für neue Tabelle** | Migration-Diff | manueller Sweep |
| **Sync-XHR** | Grep | Browser-DevTools |
| **Reduced-Motion-Variante fehlt** | Animation-Helper-Pattern | manueller Sweep |

## Reaktion-Modi

### Modus 1: Auto-Fix
**Wann:** trivial, im aktuellen Edit-Scope, kein User-Risiko.
**Beispiele:**
- Ungenutzter Import löschen
- Ungenutzte Variable entfernen
- Hardcoded `8px` → `var(--space-2)` (wenn Mapping eindeutig)
- Fehlender `@docs`-Tag (vorgeschlagener Ziel-Pfad ergibt sich aus Dateiname/Funktion)

### Modus 2: Anbieten (Inline)
**Wann:** zusammenhängend mit aktuellem Task, aber Scope-Erweiterung.
**Beispiele:**
- "Ich sehe `formatDate` existiert auch in `lib/foo.ts:42` — soll ich konsolidieren?"
- "Diese 3 Inline-Styles könnte ich auf Tokens umstellen — gleich machen?"
- "RLS fehlt für `new_table` — soll ich Policy ergänzen?"

User-Antwort: Ja → durchführen / Nein → Backlog-Vorschlag

### Modus 3: Backlog-Vorschlag
**Wann:** größerer Refactor oder zu großer Scope-Sprung.
**Beispiele:**
- "Habe 12 ähnliche Stellen mit hardcoded `#3b82f6` gefunden — Tech-Debt-Wave-Item?"
- "API-Surface hat 8 Endpoints ohne Rate-Limit — eigenes Item?"

Wenn User zustimmt: Eintrag automatisch in `BACKLOG.md` unter "Tech-Debt-Wave" mit Datum + Quell-Verweis.

## Severity-Tabelle (Default)

| Severity | Beispiele | Default-Modus |
|---|---|---|
| **Critical** | Security-Vuln (XSS, IDOR), Secret-Leak | sofort fixen, blocken Merge |
| **High** | Permission-Check fehlt, RLS fehlt, hardcoded Secret in Test | Auto-Fix oder Anbieten |
| **Medium** | Doublette, toter Code, Token-Verstoss | Anbieten |
| **Low** | Stilistik, fehlender `@docs`-Tag | Auto-Fix oder Backlog |
| **Info** | Mögliche Optimierung | Backlog-Vorschlag |

## Konfiguration pro Projekt

`docs/claude/00-codex-decisions.md` kann Schwellwerte überschreiben:
```markdown
## Quality-Awareness-Konfiguration
- doublet-detection: anbieten (default: anbieten)
- dead-code: auto-fix (default: auto-fix)
- hardcoded-strings: anbieten (default: anbieten)
- permission-check-missing: critical (default: high)
```

## Allowlist für bewusste Ausnahmen

`scripts/quality-allowlist.json`:
```json
{
  "doublets": [
    {
      "name": "formatNumber",
      "files": ["lib/format-de.ts", "lib/format-en.ts"],
      "reason": "Locale-spezifische Varianten, gemeinsamer Helper extrahiert"
    }
  ],
  "hardcoded-colors": [
    {
      "file": "components/Logo.tsx",
      "color": "#FF5733",
      "reason": "Brand-Farbe, nicht Token-bar"
    }
  ]
}
```

## Wie das in der Praxis aussieht

User: "Ergänze die Login-Funktion um Remember-Me"

Claude:
1. Liest `auth/login.ts` → erkennt: hardcoded "Login failed"-String (i18n-Verstoss)
2. Erkennt: `formatDate` wird hier importiert — auch in 2 anderen Files
3. Implementiert Remember-Me
4. Sagt: "Done. Beim Reinschauen sind mir 2 Sachen aufgefallen:
   - String 'Login failed' ist hardcoded — soll ich auf `t('errors.auth.failed')` umstellen? (Anbieten)
   - `formatDate` gibt's 3× im Repo, könnte konsolidiert werden — fürs Backlog? (Backlog-Vorschlag)"

Awareness ist NICHT: alle Findings im Codebase auflisten ohne Anlass. Sondern: bei dem was ich sowieso anfasse, mit-mitdenken.
