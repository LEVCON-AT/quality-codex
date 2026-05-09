# Runbook: Codex Sync (Quartalsweise)

Codex selbst entwickelt sich weiter (v1.0 → v1.1). Bestandsprojekte müssen nachziehen.

## Wann

- **Quartalsweise** (1. Mo Jan/Apr/Jul/Okt)
- **Nach Codex-Major-Release** (vX.0.0) — pflicht
- **Bei Skill-Update von Anthropic** — wenn Skill-Substanz im Codex referenziert ist

## Skill-Substanz-Sync

```bash
# Im Bestandsprojekt:
cd /path/to/project
/codex-upgrade  # Skill (TODO v1.1)
```

Manuell:
```bash
# 1. Codex-Repo aktuell holen
cd C:\node\quality-codex
git pull

# 2. Diff zu eigenem Projekt
diff -r C:\node\quality-codex\docs\references C:\node\<my-project>\docs\references

# 3. Mergen wo sinnvoll, projekt-spezifische Anpassungen behalten
# 4. SOURCES.md aktualisieren (neuer Sync-Termin)
# 5. Commit
git add docs/references SOURCES.md
git commit -m "chore: codex sync $(date +%Y-%m)"
```

## Codex-Update-Pfad

### Patch (v1.0.x)
- Doc-Klarstellungen, kleine Tooling-Updates
- Auto-Suggest in Renovate-Style PR
- User-Akzeptanz wenn nichts brennt

### Minor (v1.x.0)
- Neue Pfeiler/Optionen, abwärtskompatibel
- `/codex-upgrade`-Skill macht Diff
- User reviewt + akzeptiert
- Migrations-Skript (falls Tooling-Updates)

### Major (vX.0.0)
- Breaking-Changes (z.B. Tooling-Wechsel)
- Migration-Guide pflichtweise im Codex-Repo
- Schritt-für-Schritt-Skript
- Optional: Bestandsprojekte bleiben auf v1.x bis sie aktiv migrieren wollen

## Drift-Detection (Nightly)

`.github/workflows/codex-drift-check.yml` (in Bestandsprojekten):
```yaml
- name: Check Codex Drift
  run: |
    declared_version=$(cat .codex-version)
    latest=$(curl -s https://raw.githubusercontent.com/<org>/quality-codex/main/.codex-version)
    if [ "$declared_version" != "$latest" ]; then
      gh issue create --title "Codex Update available: $latest" \
        --body "Project on $declared_version, latest is $latest. Run /codex-upgrade or update manually."
    fi
```

## Was wird synchronisiert

| Datei | Sync-Strategie |
|---|---|
| `docs/claude/0X-*.md` | Auto-merge bei Patch, Review bei Minor, Manual bei Major |
| `docs/references/*.md` | Auto-merge bei Patch (Skill-Substanz) |
| `templates/*` | NICHT auto-merge — Template ist initial-state, projekt-Anpassungen behalten |
| `checklists/*.md` | Review bei Minor, projekt-spezifische Punkte ergänzen |
| `scripts/*.sh` / `*.ts` | Auto-merge bei Patch |
| `.github/workflows/*.yml` | Review bei Minor (CI-Anpassungen) |

## Was bleibt projekt-eigen

- `docs/claude/00-codex-decisions.md` (projekt-spezifisch)
- `BACKLOG.md`
- `docs-user/`
- `tests/protocols/`
- `legal/` (anpassbar pro Projekt)
- `.env`-Skelette (projekt-eigene Variables)

## Conflict-Resolution

Bei Merge-Konflikten:
1. Codex-Version gewinnt für Standard-Texte
2. Projekt-Version gewinnt für projekt-spezifische Anpassungen
3. Bei Unklarheit: ADR mit Entscheidung dokumentieren

## CHANGELOG-Pflege im Projekt

Beim Sync: Eintrag in projekt-eigenes `CHANGELOG.md`:
```markdown
## [Unreleased]
### Codex-Sync
- Synced to codex v1.1.3 (2026-08-01)
- Adopted: new STRIDE-template (docs/planning/threat-model-template.md)
- Skipped: opentelemetry section (not relevant to this project)
```

## Maintenance-Drill (1× pro Jahr)

Vollständiger Check:
- [ ] `.codex-version` aktuell
- [ ] `docs/references/SOURCES.md` Sync-Termine ≤6 Monate alt
- [ ] Custom-Codex-Anpassungen dokumentiert
- [ ] Drift-Check-Workflow läuft
- [ ] Quartalsweise Skill-Substanz-Reviews durchgeführt
