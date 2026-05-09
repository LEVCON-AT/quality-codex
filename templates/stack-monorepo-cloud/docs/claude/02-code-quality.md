# 02 — Code Quality (Tier-3 Detail)

Bibel-Doc — wird **nur on-demand** gelesen (Streit-Fälle, Code-Review, Begründungen). Die Awareness selbst arbeitet auf den Tier-1-Stichpunkten in `00-codex-core.md`.

## Doublet-Verbot — Single Source of Truth

### Warum
Doubletten erzeugen Drift: ein Bug wird an 1 Stelle gefixt, an 2 anderen nicht. Code wird langfristig nur lesbar, wenn jedes Konzept genau **einmal** existiert.

### Wo prüfen vor neuem Code
```bash
# Vor "export function formatDate":
grep -rn "^export function formatDate\|^export const.*format" packages/*/src/lib/

# Vor "type DateLike":
grep -n "^export type.*Date\|^export interface.*Date" packages/*/src/lib/types.ts

# Vor neuer CSS-Klasse:
grep -n "\.date-\|\.date_" packages/*/src/styles.css
```

### Wenn Doublette gefunden
1. Existierende Funktion erweitern (Generic, Strategy-Pattern)
2. NIEMALS kopieren mit kleiner Variation
3. Wenn 2 ähnliche Funktionen wirklich nötig: gemeinsame Helper-Function extrahieren

### Skript
`scripts/check-doublets.sh` läuft pre-commit (Hook) + in CI.

## Dead-Code-Verbot

### Erkennung
- Biome: `noUnusedImports: error`, `noUnusedVariables: error`
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters`
- ts-prune (optional, für unbenutzte Exports)

### Reaktion
- Sofort löschen — nicht "vielleicht später nochmal"
- Wenn Funktion *wird-noch-nicht-genutzt-aber-bald*: in Wave-Item-PR landen, nicht orphan in main

## Type-Safety strict

### Verboten
- `any` (außer Library-Adapter mit ADR-begründung)
- `@ts-ignore` (außer dokumentierter Library-Bug, mit `@ts-expect-error` + Kommentar)
- non-null assertion `!` (außer wenn TS provably nicht erkennt; dann Kommentar warum)

### Stattdessen
- Generics für Polymorphie
- Discriminated Unions für Varianten
- Zod (oder valibot) für Runtime-Validation an System-Grenzen
- Type-Guards für Narrowing

## Pre-Commit-Selbstcheck (Manifesto-Walk)

Vor jedem Commit:
1. Animation-Manifesto: alle Animations via Token? Keine Inline-Transition?
2. Style-Manifesto: alle Spacing/Color via Token? Kein hardcoded `px`/`#hex`?
3. Architecture-Manifesto: Schema-Quad konsistent?
4. Code-Quality-Manifesto: keine Doubletten? Kein dead code?
5. Security-Manifesto: kein Secret? RLS für neue Tabellen?
6. i18n-Manifesto: keine User-facing Strings im Code?

## biome-ignore-Verbot

Wenn Linter etwas flaggt → **refactor**, niemals suppress. Ausnahme: dokumentierter Library-Bug mit Kommentar `// biome-ignore <rule>: <reason + issue-link>`.

## Naming-Konventionen

- **Files:** kebab-case (`safe-mutation.ts`, `card-overlay.tsx`)
- **Components:** PascalCase (`CardOverlay`, `Modal`)
- **Functions/Vars:** camelCase (`formatDate`, `userId`)
- **Constants:** UPPER_SNAKE (`MAX_RETRIES`, `DB_VERSION`)
- **Types/Interfaces:** PascalCase (`UserRow`, `AtomType`)
- **Enums:** PascalCase Type, UPPER_SNAKE Values (`AtomType.TASK`)

## Folder-Konventionen

- **Feature-Folder-Pattern:** `lib/alias-*.ts` für 10 Files zur gleichen Domain (statt `alias/` mit `index.ts`-Re-Exports — flacher ist besser)
- **Singleton-Helper:** große, domain-übergreifende Files (`queries.ts`, `mutations.ts`) — bewusst groß, nicht künstlich aufgeteilt

## Umlaute-Konvention (Deutsche Inhalte)

Bei deutschen Texten in **Code, Kommentaren, Doku, Locale-Files und Commits**:

- ✅ **Pflicht:** ä, ö, ü, ß, € — UTF-8-Original verwenden
- ❌ **Verboten:** ae/oe/ue, ss-Ersatz, EUR statt €

```typescript
// ✓ richtig
const msg = 'Übersicht öffnen';
const total = 'Gesamtbetrag: 99,90 €';

// ❌ falsch
const msg = 'Uebersicht oeffnen';
const total = 'Gesamtbetrag: 99,90 EUR';
```

**Begründung:** Lesbarkeit, Konsistenz mit gedruckter Sprache, korrekte Sortierung (`Über` ≠ `Ueber` in Locale-aware-Sortierung).

**Voraussetzung:** Files MÜSSEN als UTF-8 (BOM-less) gespeichert sein. Alle Editoren des Codex-Stacks (VSCode, JetBrains) machen das default. PowerShell-Skripte (`bootstrap.ps1` etc.) nutzen `[System.Text.UTF8Encoding]::new($false)` statt `Set-Content` (das schreibt sonst Windows-CP1252 → Mojibake).

Lint-Check: `scripts/check-encoding.ps1` (TODO v1.1) scannt nach Mojibake-Sequenzen (`Ã¤`, `Ã¶`, `Ã¼`, `â‚¬`) — sofort fix.

## Workspace-Hygiene (pnpm Monorepo)

- **Workspace-spezifische Deps:** `pnpm add -F <workspace> <pkg>` — niemals `pnpm add <pkg>` im Root für Workspace-Code
- **Root `package.json` enthält NUR:** Build-Tools (Biome, TypeScript, vitest, tsx) + Workspace-Coordinators (Scripts via `pnpm -r ...`)
- **Peer-Dependencies-Falle:** Manche Tools (z.B. **VitePress** → `vue` als peer-dep) können bei Auto-Install im Root landen wenn falsch gemounted. Wenn `vue` im Root-`package.json` auftaucht: das ist ein **Bug**, gehört in den `docs-wiki`-Workspace.
  ```powershell
  # Root säubern
  pnpm remove vue   # entfernt aus root/package.json
  # Korrekt installieren (falls überhaupt nötig — VitePress zieht es eh transitiv)
  pnpm add -F docs-wiki vue
  ```
- **Pre-Commit-Check** (TODO v1.1): Skript verbietet bestimmte deps im Root (`vue`, `react`, `solid-js`) — gehören in Workspaces

## Strict-Mode-Defaults (tsconfig)

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true
}
```

## CWE Top 25 — Bezug zu Code-Quality

Code-Quality ist gleichzeitig Security: viele CWE-Top-25-Verstöße sind Quality-Probleme:
- CWE-79 XSS → Output-Encoding (kein `dangerouslySetInnerHTML` ohne Allowlist)
- CWE-89 SQLi → parameterized Queries (kein String-Concat)
- CWE-20 Improper Input Validation → Zod an Grenzen
- CWE-200 Information Exposure → keine Stack-Traces zum Client

Volle Liste in `06-security.md`.
