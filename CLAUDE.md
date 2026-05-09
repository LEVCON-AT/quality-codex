# CLAUDE.md — Quality-Codex Repo

Du arbeitest am **Quality-Codex selbst**, nicht an einem Projekt, das ihn nutzt.

## Pflicht-Lektüre

- `README.md` — Was ist der Codex
- `CHANGELOG.md` — was hat sich geändert
- `docs/runbooks/codex-sync.md` — wie wird der Codex evolutioniert

## Was beim Codex anders ist

- **Templates sind Snapshots** — `templates/stack-monorepo-vps/` und `templates/stack-monorepo-cloud/` sind die geklonten Skelette. Änderungen daran wirken sich auf zukünftige Onboardings aus.
- **`docs/`-Ordner ist doppelt vorhanden** — einmal im Codex-Root (Quelle), einmal IN jedem Template (Kopie). Synchronisierung via Sync-Skript oder manuell.
- **SemVer-Disziplin** beim Codex selbst:
  - Patch (v1.0.x): Doc-Klarstellungen, Tooling-Updates ohne Breaking-Change
  - Minor (v1.x.0): Neue Pfeiler/Optionen, abwärtskompatibel
  - Major (v2.0.0): Breaking-Changes (Tooling-Wechsel)
- **Skill-Substanz-Sync** quartalsweise mit Original-Skills (siehe `docs/references/SOURCES.md`)

## Edits am Codex

Wenn du Manifesto-Docs änderst:
1. Änderung in `docs/claude/` (Quelle)
2. **Auch in `templates/*/docs/claude/` synchronisieren** — sonst diverged Codex-Quelle und Templates
3. CHANGELOG-Eintrag (Patch/Minor/Major nach Auswirkung)
4. Bei Breaking-Change: Migration-Guide für Bestandsprojekte

## Sync-Skript (TODO v1.1)

`scripts/sync-templates.ts` (noch nicht implementiert) soll automatisch `docs/`, `checklists/` aus Codex-Root in beide Templates spiegeln.

Bis dahin manuell:
```powershell
Copy-Item -Recurse -Path docs -Destination templates\stack-monorepo-vps\docs -Force
Copy-Item -Recurse -Path docs -Destination templates\stack-monorepo-cloud\docs -Force
Copy-Item -Recurse -Path checklists -Destination templates\stack-monorepo-vps\checklists -Force
Copy-Item -Recurse -Path checklists -Destination templates\stack-monorepo-cloud\checklists -Force
```

## Nicht im Codex landen

- Projekt-spezifische Inhalte (würden zu jedem Template gehören)
- Memory-Files (sind per-Projekt unter `~/.claude/projects/<slug>/memory/`)
- Test-Protokolle (sind per-Projekt)

## Quelle

Patterns abgeleitet aus dem Matrix-Projekt (`C:\node\Matrix`). Matrix bleibt die Referenz-Implementierung — nicht im Codex modifizieren.
