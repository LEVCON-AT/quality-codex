# 05 — Workflow

Tier-2-Doc — beschreibt das Arbeitsmodell des Codex.

## BACKLOG-Wave-Sprint (leichtgewichtig)

Keine Story-Points, keine Velocity, keine Ceremonies. Stattdessen:

```markdown
# BACKLOG.md

## Wave 1 — Bootstrap (DoD: deploys to staging green)
- [x] Repo + CI initialisiert
- [x] Erstes Healthcheck-Endpoint live
- [ ] Backup-Skript getestet (Restore-Drill)

## Wave 2 — Auth + Schema
- [ ] Supabase Auth + RLS-Policies
- [ ] Schema v1 (users, workspaces) — idempotent
- [ ] Client-Auth-Flow

## Tech-Debt-Wave (rolling)
- Doublette `formatDate` in lib/ — siehe Vorschlag aus Wave-3-Item-2

## Lessons Learned
- Wave 1: Backup-Restore brauchte 2× — beim ersten Mal Rolle vergessen
- Wave 2: Magic-Link-Mail brauchte DKIM-Setup vorab
```

## Definition of Ready (DoR)

Vor Wave-Aufnahme:
- [ ] Akzeptanz-Kriterien klar formuliert (User-Story-Form)
- [ ] Threat-Model-Impact bewertet (neue Angriffsfläche?)
- [ ] Performance-Budget abgeschätzt
- [ ] Permissions/Rollen-Auswirkung geklärt
- [ ] i18n-Strings spezifiziert (oder explizit "Wave-N-spätere-Lokalisierung")
- [ ] Doku-Plan: welche `docs-user/`-Page wird angefasst

## Definition of Done (DoD)

Pro Wave-Item:
- [ ] Code: typecheck + lint + test grün lokal
- [ ] Sicherheit: kein neuer ASVS-L2-Verstoss, kein hardcoded Secret, RLS für neue Tabellen
- [ ] SAST/SCA/Secret-Scan grün
- [ ] Pentest-Checkliste durchgegangen bei sensitivem Change
- [ ] STRIDE-Quick-Walk dokumentiert bei neuem Endpoint
- [ ] i18n: keine hardcoded User-facing Strings
- [ ] a11y: WCAG 2.2 AA, axe-core grün
- [ ] Permissions: Permission-Matrix aktualisiert, RBAC-Check vorhanden
- [ ] Audit-Log für privilegierte Actions
- [ ] Performance: Budget eingehalten
- [ ] Globalisierung: Datum/Zahl/Währung via Intl.*
- [ ] Doublet-Sweep grün
- [ ] Dead-Code-Sweep grün
- [ ] `@docs`-Tag auf neuen Funktionen
- [ ] User-Doku aktualisiert
- [ ] Doc-Link-Check grün
- [ ] Feature-Verification durchgeführt + Testprotokoll abgelegt
- [ ] Commit Conventional + signed
- [ ] Branch-Konvention `feat/wave-N-item-X-<slug>`
- [ ] Observability: neue Endpoints/Jobs registriert
- [ ] Staging-Smoketest grün (App + Wiki)
- [ ] BACKLOG.md gehakt + Lessons-Learned wenn nicht-trivial

## Spike-Tickets

Time-boxed Research vor Implementierung — wenn Lösungsweg unklar.

```markdown
## Spike: Welche Mobile-E2E-Bibliothek?

**Time-Box:** 4h
**Frage:** Detox vs Maestro vs Appium für client-mobile?
**Deliverable:** docs/decisions/ADR-0007-mobile-e2e.md
**Akzeptanz:** Entscheidung + 3 Begründungspunkte + 1 verworfene Alternative
```

## Memory-Files

Projekt-spezifische Lernerfahrungen unter `~/.claude/projects/<slug>/memory/`:
- **feedback_*.md** — User-Korrekturen oder bestätigte Approaches
- **project_*.md** — Projekt-spezifischer Kontext
- **reference_*.md** — Wo externe Infos zu finden sind

NICHT in Memory: Code-Patterns (sind im Code), Architektur (ist in `01-architecture.md`).

## Modell-Wahl pro Aufgaben-Typ

| Aufgabe | Modell | Begründung |
|---|---|---|
| Architektur-Design | Opus | Komplexes Reasoning, breiter Kontext |
| Code-Review | Opus | Tiefe Analyse |
| Security-Audit | Opus | Kritische Konsequenzen |
| Plan-Mode | Opus | Strukturierte Planung |
| Standard-Feature | Sonnet | Kosteneffizient |
| Tests schreiben | Sonnet | Pattern-basiert |
| Doc-Updates | Sonnet | Wenig Reasoning |
| Format-Fixes | Haiku | Trivial |
| Translation-Updates | Haiku | Mechanisch |

## Cost-Logging

`docs/cost-log.md` (auto-Append durch Skill):
```markdown
| Datum | Modell | Wave-Item | Tokens-In | Tokens-Out | Kosten ($) |
|---|---|---|---|---|---|
| 2026-05-09 | Opus | wave-2-item-1 | 47k | 8k | $0.78 |
```

Sprint-Ende-Auswertung: Trends, Modell-Wahl-Korrekturen.

## Plan-Mode-Pflicht

- Architektur-Änderungen
- Breaking-Changes
- Neue externe Integrationen
- Sicherheits-relevante Refactorings
- Cross-Workspace-Änderungen
