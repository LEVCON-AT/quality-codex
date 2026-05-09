# 13 — Documentation (Living User-Docs + `@docs`-Linking)

Tier-2-Doc. Lädt bei Doku-Updates oder neuem Feature.

## Prinzip: Doku entsteht parallel zum Code

NICHT am Projekt-Ende, sondern **mit jedem Wave-Item**.

- DoD-Pflicht: `docs-user/features/<feature>.md` aktualisiert
- Wiki-Deploy zusammen mit App-Deploy (Staging + Prod)
- User sieht Doku-Update sobald Feature deployed ist

## Struktur

```
docs-user/
├── getting-started/
│   ├── installation.md
│   ├── first-login.md
│   └── concepts.md
├── features/
│   ├── tasks.md            ← entsteht parallel zum tasks-Feature
│   ├── calendar.md
│   └── ...
├── admin/
│   ├── setup.md
│   ├── backup-restore.md
│   ├── user-management.md
│   └── monitoring.md
├── faq.md
└── troubleshooting.md
```

## Wiki-Rendering: VitePress

`packages/docs-wiki/` — eigenes Workspace-Package:
- liest `docs-user/**/*.md`
- generiert statische Site mit Sidebar, Suche, Dark-Mode
- Deploy zu `docs.<domain>` (Prod) und `docs-staging.<domain>` (Staging)

Alternative: MkDocs-Material — wählbar im Onboarding.

```typescript
// packages/docs-wiki/.vitepress/config.ts
export default defineConfig({
  title: '<Project Name>',
  description: 'User-Doku',
  themeConfig: {
    sidebar: { /* auto-generiert aus docs-user/ */ },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/<org>/<repo>' }
    ]
  }
});
```

## `@docs`-Tag (Code-↔-Doku-Linking)

Jede User-facing exportierte Funktion / Komponente / Route:

```typescript
/**
 * Registriert einen neuen User mit E-Mail + Passwort.
 * @docs user/getting-started/first-login.md#registration
 */
export async function registerUser(email: string, password: string) { ... }
```

Bei nicht-User-facing Funktionen:
```typescript
/**
 * Internal helper for date diff calculations.
 * @docs internal
 */
export function dayDiff(a: Date, b: Date): number { ... }
```

## Lint-Rule

`scripts/check-doc-links.ts` läuft in CI:
1. Jeder `@docs <path>`-Verweis → existiert die Datei? Existiert der Anker?
2. Jede `docs-user/**/*.md`-Page → hat sie mindestens eine `@docs`-Quelle? (sonst "verwaiste Doku")
3. User-facing Exports ohne `@docs` → Build rot (außer Allowlist)

Allowlist via `// @docs internal`-Tag oder `scripts/doc-allowlist.json`.

## Reverse-Lookup

```bash
pnpm docs:find tasks
# → Listet alle Code-Stellen mit @docs-Verweis auf docs-user/features/tasks.md
```

## Wiki-Integration: Source-Links

VitePress-Plugin rendert je Doku-Page eine "Source-Code"-Sektion:

```html
<!-- automatisch generiert -->
<div class="source-refs">
  Diese Funktionalität wird im Code implementiert in:
  <ul>
    <li><a href="https://github.com/.../blob/main/packages/.../auth.ts#L42">registerUser()</a></li>
    <li><a href="https://github.com/.../blob/main/packages/.../signup.tsx#L18">SignupForm</a></li>
  </ul>
</div>
```

## Doku-Schreib-Standards

- **User-Perspektive** — "Klicke auf X, um Y zu tun" (nicht "Die Funktion `registerUser` …")
- **Kein Code-Detail** in `docs-user/` (das gehört in `docs/claude/` oder JSDoc)
- **Screenshots** — aktuell, mit annotierten Pfeilen wenn nötig
- **Step-by-step** für Workflows
- **FAQ** für häufige Fragen, nicht Wall-of-Text-Doku

## Versionierung der Doku

- Doku ist mit Code im selben Repo → Git-Versionierung
- VitePress-Snapshot bei jedem Release-Tag (Asset im GitHub-Release)
- "View older versions" optional (nur bei Major-Versions sinnvoll)

## Sprachen

Wenn i18n aktiv: `docs-user/de-AT/...`, `docs-user/en-US/...`. VitePress unterstützt Locales nativ.

## Pre-Release-Pflicht

Vor v1.0:
- [ ] Wiki vollständig (Getting-Started + Features + Admin + FAQ + Troubleshooting)
- [ ] `pnpm docs:check` 0 Findings
- [ ] Screenshots aktuell (alle <30 Tage alt)
- [ ] Search funktioniert end-to-end
- [ ] Mobile-Layout getestet
