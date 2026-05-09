# Start-Codex-Project Prompts

Kopierfertige Prompts für neue Claude-Code-Sessions, um den Quality-Coding-Codex
(`C:\node\quality-codex`, GitHub: https://github.com/LEVCON-AT/quality-codex) zu laden
und ein neues Projekt damit zu onboarden.

> **Pflege-Hinweis:** Diese Datei lebt im Codex-Repo und wird mit `git pull`
> aktualisiert. Wenn du sie als lokales Snippet unter
> `~/.claude/snippets/start-codex-project.md` hattest, archiviert
> `bootstrap.ps1` diese lokale Kopie automatisch nach erfolgreichem Setup
> (verschiebt nach `~/.claude/snippets/_archive/`), damit sie nicht in
> jeder Claude-Session mitgelesen wird. Single-Source-of-Truth ist immer
> diese Datei hier im Codex-Repo.

---

## Wie der Codex ins neue Projekt kommt — Mental-Model

```
GitHub: LEVCON-AT/quality-codex
        │
        │ git clone (einmalig pro Maschine) oder git pull (Updates holen)
        ▼
C:\node\quality-codex\               ← Codex-Repo (BLEIBT als Quelle, NICHT modifizieren beim Onboarding)
├── docs/                              ← Manifesto-Quelle
├── checklists/
├── templates/
│   ├── stack-monorepo-vps/           ← Skelett für VPS-Projekte
│   └── stack-monorepo-cloud/         ← Skelett für Cloud-Projekte
└── skill/onboard-project/
        │
        │ bootstrap.ps1 kopiert templates/stack-monorepo-<variant>/*
        │ + ersetzt __SLUG__/__DOMAIN__/__PROJECT_NAME__-Platzhalter
        │ + git init im Projekt
        ▼
C:\node\<slug>\                       ← Dein neues Projekt (eigenes Repo)
├── docs/                              ← Kopie aus Codex (zu diesem Zeitpunkt eingefroren)
├── checklists/
├── packages/{client-web, bridge, ...}
├── infra/
├── .github/workflows/
├── CLAUDE.md, BACKLOG.md, README.md
└── .codex-version → 1.0.0             ← merkt sich, welche Codex-Version verwendet wurde
```

**Wichtige Regel:** Nach Bootstrap ist das neue Projekt **unabhängig** vom Codex-Repo.
Codex-Updates ziehst du via `/codex-upgrade`-Skill manuell ein (Diff-basiert,
behält projekt-spezifische Anpassungen) — siehe `docs/runbooks/codex-sync.md`.

### Vor dem Onboarding immer aktuellen Codex haben

```powershell
# Erstes Mal:
git clone https://github.com/LEVCON-AT/quality-codex.git C:\node\quality-codex

# Spätere Updates:
cd C:\node\quality-codex
git pull origin main
git log --oneline -5    # check ob neue Commits/Tags da sind
cat .codex-version       # aktuelle Version prüfen
```

---

## Prompt A — Codex lokal verfügbar (Standard-Fall)

```
Ich starte ein neues Projekt und will den Quality-Coding-Codex
(C:\node\quality-codex, GitHub: https://github.com/LEVCON-AT/quality-codex)
nutzen, um es production-ready aufzusetzen.

Bitte mache folgendes:

0. Aktualisiere den Codex auf den neuesten Stand:
   cd C:\node\quality-codex
   git pull origin main
   (wenn der Pull fehlschlägt — z.B. ungetrackte lokale Änderungen — halte an
    und frag mich vor weiterem Vorgehen.)

1. Lies die Boot-Pflicht-Docs:
   - C:\node\quality-codex\CLAUDE.md (Codex-Self-Maintenance)
   - C:\node\quality-codex\docs\claude\00-codex-core.md (Kern-Regeln)
   - C:\node\quality-codex\skill\onboard-project\prompt.md (Onboarding-Workflow)
   - C:\node\quality-codex\docs\onboarding\new-project-checklist.md (Phase-Checkliste)
   - C:\node\quality-codex\docs\onboarding\stack-decision-tree.md (Stack-Wahl)

2. Führe den /onboard-project-Workflow aus:
   - Phase 1: Discovery via AskUserQuestion (Projekt-Name, Slug, Stack,
     Mobile, MCP, Tenancy, Locales, Infra-Variante VPS/Cloud, Domain,
     GitHub-Org+Repo, Backup-Target, Observability)
   - Phase 2: Bootstrap (scripts/bootstrap.ps1 mit den Antworten)
   - Phase 3: Secrets (configure-secrets.ps1, GitHub-Secrets via gh
     oder Web-UI-Anleitung wenn gh nicht installiert)
   - Phase 4: Verify (verify-setup.ps1 — pnpm install/typecheck/lint/
     test/build/boot:verify/docs:check)
   - Phase 5: BACKLOG.md Wave 1 abhaken nach grünem Verify
   - Phase 6: 00-codex-decisions.md mit allen Antworten füllen
   - Phase 7: ADR-0001 begründen (Stack-Wahl)
   - Phase 8: Memory-File ~/.claude/projects/<slug>/memory/project_setup.md

3. Folge der Operations-Mandate-Disziplin
   (docs/runbooks/operations-mandate.md): keine destruktiven Aktionen
   ohne explizites OK; bei VPS-Variante zusätzlich docs/runbooks/
   github-setup.md durchgehen für Repo-Erstellung + PAT-Setup.

4. Wenn ein Schritt scheitert, halte an und frag mich — nicht weiterraten.

Fang mit Phase 1 (Discovery) an.
```

---

## Prompt B — Codex auf neuer Maschine erst klonen

```
Ich will den Quality-Coding-Codex (https://github.com/LEVCON-AT/quality-codex)
auf dieser Maschine einrichten und damit ein neues Projekt onboarden.

Bitte:

1. Stelle sicher, dass Voraussetzungen erfüllt sind:
   - git --version (mind. 2.40)
   - node --version (mind. 22; wenn nicht: nvm install 22 && nvm use 22)
   - pnpm --version (mind. 9; wenn nicht: npm install -g pnpm@9)

2. Klone den Codex nach C:\node\quality-codex (wenn nicht schon da):
   if (-not (Test-Path C:\node\quality-codex)) {
     git clone https://github.com/LEVCON-AT/quality-codex.git C:\node\quality-codex
   } else {
     cd C:\node\quality-codex; git pull origin main
   }

3. Verifiziere die Struktur — diese Pfade müssen existieren:
   - C:\node\quality-codex\docs\claude\00-codex-core.md
   - C:\node\quality-codex\skill\onboard-project\SKILL.md
   - C:\node\quality-codex\templates\stack-monorepo-vps\
   - C:\node\quality-codex\templates\stack-monorepo-cloud\
   - C:\node\quality-codex\.codex-version (sollte v1.0.0 oder höher zeigen)

4. Lies dann den Onboarding-Workflow (siehe Prompt A — Phase 1-8).

Anschließend Onboarding starten — Phase 1 Discovery via AskUserQuestion.
Bei Fehlern: stoppen und nachfragen, nicht raten.
```

---

## Prompt C — Maximale Effizienz (Discovery vorab)

Wenn du den Stack schon weißt, kannst du die Antworten vorziehen.
Nur die Werte ersetzen, dann pasten:

```
Onboarding-Antworten vorab:
- Projekt-Name: __PROJECT_NAME__
- Slug: __SLUG__
- Stack: Full-Stack-Monorepo
- Mobile: nein
- MCP: ja
- Tenancy: Single-Tenant
- Locales: de-AT, en-US (RTL: nein)
- Infra: VPS
- Domain: __DOMAIN__
- GitHub: LEVCON-AT/__SLUG__
- Backup: Backblaze B2 (Bucket: __BUCKET__)
- Observability: Self-hosted Sentry

Bitte lies den Codex (C:\node\quality-codex), führe bootstrap.ps1 mit
diesen Antworten aus, dann Phase 3-8 wie in skill/onboard-project/prompt.md.
```

---

## Wann welcher Prompt?

| Szenario | Prompt |
|---|---|
| Diese Maschine, normaler Workflow | A |
| Neue Maschine, Codex noch nicht da | B |
| Stack steht fest, schnell loslegen | C (kombinierbar mit A oder B) |

## Was bootstrap.ps1 konkret macht

Wenn Claude `bootstrap.ps1` mit deinen Discovery-Antworten aufruft, passiert intern:

1. `Copy-Item -Recurse C:\node\quality-codex\templates\stack-monorepo-<variant> C:\node\<slug>`
   → das gewählte Template (VPS oder Cloud) wird in dein neues Projekt-Verzeichnis kopiert.
2. Alle Platzhalter werden ersetzt (in `.md`/`.json`/`.yml`/`.ts`/`.tsx`/`.sh`/`.html`/`.conf`/`.css`/`.sql`/`.ps1`):
   - `__SLUG__`        → dein Slug (z.B. `acme-tools`)
   - `__PROJECT_NAME__` → dein Projekt-Name (z.B. `Acme Tools`)
   - `__DOMAIN__`      → deine Domain (z.B. `tools.acme.com`)
   - `__GH_ORG__`      → GitHub-Org (z.B. `LEVCON-AT`)
   - `__GH_OWNER__`    → s.o.
   - `__YEAR__`        → aktuelles Jahr
   - `__OWNER__`       → Owner-Name
3. `git init` im neuen Verzeichnis + Initial-Commit `chore: initial commit from quality-codex v1.0`
4. `gh repo create $org/$slug --private --source=. --remote=origin --push`
   → erstellt GitHub-Repo + pusht (wenn `gh` CLI nicht da: manuelle Anleitung
     aus `docs/runbooks/github-setup.md`)

Anschließend ist `C:\node\<slug>` ein **eigenständiges Projekt** mit eigenem Git-Repo.
Der Codex unter `C:\node\quality-codex` bleibt unverändert die Quelle.

## Wartung

Wenn der Codex weiterentwickelt wird (v1.1, v1.2 …), aktualisiere die Pfade
in Prompt A oben. Die Pfade-Liste sollte synchron mit der Tier-1-Boot-Pflicht
in `C:\node\quality-codex\templates\stack-monorepo-vps\CLAUDE.md` bleiben.

Bestandsprojekte upgraden via `/codex-upgrade`-Skill (siehe
`docs/runbooks/codex-sync.md`). Dieser Skill macht einen Diff zwischen
deklariert-version (`.codex-version` im Projekt) und aktueller Codex-Version,
schlägt Migration-Schritte vor.

## Wartung

Wenn der Codex weiterentwickelt wird (v1.1, v1.2 …), aktualisiere die Pfade
in Prompt A oben. Die Pfade-Liste sollte synchron mit der Tier-1-Boot-Pflicht
in `C:\node\quality-codex\templates\stack-monorepo-vps\CLAUDE.md` bleiben.
