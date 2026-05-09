# Code-Review-Methodik

Lokale Substanz aus `code-review`-Skill.

## Confidence-Based Filtering

Reviewer reportet **nur** Findings mit hoher Confidence — vermeidet Noise.

### Confidence-Stufen
- **Hoch:** Eindeutige Verstöße, Test-bare Bugs, klare Standard-Verletzungen
- **Mittel:** Plausible Verbesserungen, Style-Themen mit guter Begründung
- **Niedrig:** "Könnte man auch anders machen" — NICHT reporten

Niedrig-Confidence ist meist persönliche Präferenz, nicht objektives Problem.

## Review-Aspekte (Reihenfolge)

### 1. Bugs (höchste Priorität)
- Logic-Errors (off-by-one, falsche Bedingung)
- Race-Conditions
- Resource-Leaks (Connections, Timers, Listeners)
- Edge-Cases nicht behandelt
- Error-Paths fehlerhaft

### 2. Security
- OWASP Top 10 (siehe `06-security.md`)
- CWE Top 25
- Secrets im Code
- Injection-Risk
- IDOR / Permission-Bypass
- Input-Validation fehlt

### 3. Code-Quality
- Doubletten
- Dead Code
- Type-Safety-Verstöße
- Naming
- Komplexitätsschmerz (zu lange Funktion, zu viele Parameter)

### 4. Standards-Compliance
- Codex-Manifesto-Verstöße
- Token-System nicht genutzt
- i18n-Verstöße
- a11y-Verstöße
- `@docs`-Tag fehlt

### 5. Performance
- N+1-Queries
- Unnötige Re-Renders
- Bundle-Size-Impact
- Synchronous-Blocking

### 6. Tests
- Test-Coverage für neue Logic
- Tests sinnvoll (nicht nur "läuft durch")
- Edge-Cases in Tests

### 7. Documentation
- Public-API hat JSDoc
- `@docs`-Tag bei User-facing
- README/Wiki aktualisiert wenn nötig
- BACKLOG-Eintrag gehakt

## Review-Output-Format

```markdown
## Code-Review: PR #123 — Add user-export endpoint

### Critical (must-fix)
- **CWE-89 SQL-Injection-Risk** in `user-export.ts:42` — Input wird direkt in Query konkateniert. Lösung: `.eq()` Builder nutzen.
- **Missing RLS-Policy** für neue `user_exports`-Tabelle. Ohne RLS sehen alle User alle Exports.

### Important (should-fix)
- **Doublette** `formatDate` jetzt 4× im Repo. Konsolidieren in `lib/format.ts`.
- **`@docs`-Tag** fehlt auf neuer `requestExport`-Funktion.

### Suggestions (nice-to-have)
- Loading-State für Export-Button. Optimistic-Update wäre nett.

### Confirmed-OK
- Tests sehen gut aus, Coverage 92% für neue Code-Blöcke.
- Auth-Middleware korrekt verwendet.
- i18n-Strings alle in Locale-Files.

### Verdict
**Changes-requested** — 2 critical Findings müssen vor Merge gefixt werden.
```

## Review-Anti-Patterns

- ❌ "Looks good to me!" ohne tiefer geprüft (rubber-stamp)
- ❌ Style-Bikeshedding ohne Codex-Bezug
- ❌ Persönliche Präferenz als Verstoss reporten
- ❌ Riesige Comment-Threads über kleine Details
- ❌ Vorschläge ohne Begründung
- ❌ Hint auf "use library X" ohne Kontext

## Review-Skill-Trigger

Skill `/code-review` aufrufen vor:
- Merge to main
- Wave-Item-Abschluss
- Bei verdächtig großen PRs (>500 LOC)

Bei trivialen PRs (rename, typo): kein Skill-Aufruf nötig, manueller Look-Over reicht.

## Pair-Review-Modus

Bei kritischen Pfaden (Auth, Payments, Permissions):
1. Erste Runde: Claude (`/code-review`)
2. Zweite Runde: Anderer Agent (`/security-review`)
3. Dritte Runde: User selbst (Eyeballs)

## Review-Memory

Häufige Findings → in `02-code-quality.md` aufnehmen, damit zukünftig vermieden.

## Detail-Lookup

`docs/references/security-review-method.md` — Security-spezifische Review-Methodik
`checklists/pre-merge-pr.md` — Pflicht-Checkliste vor Merge
