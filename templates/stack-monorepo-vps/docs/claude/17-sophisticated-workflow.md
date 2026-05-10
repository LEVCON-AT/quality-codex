# 17 — Sophisticated Workflow (Konzept-zu-Implementation-Lifecycle)

Tier-2-Doc. Wird **nur gelesen, wenn die Modus-Frage mit "sophisticated" beantwortet wurde**. Bei "klassisch" oder Trivial-Anfragen NICHT lesen — direkt umsetzen mit Foundation-Bewusstsein.

**Quelle:** Bewährt im Matrix-Projekt für strategische Umbauten (Konzept-Sprints mit ~100 Worksheet-Items, Manifest-Erweiterungen, Schema-Migrationen). Hier auf Codex-Generizität adaptiert.

---

## Wann sophisticated, wann klassisch

### Sophisticated wenn
- Aufgabe berührt > 3 Komponenten oder ist Foundation-relevant
- Aufgabe etabliert ein neues Pattern, das wiederverwendet wird
- Aufgabe ist Teil eines Wave-Plans / Konzept-Sprints / Refactor-Welle
- User-Sprache deutet strategisches Denken an ("eigentlich denke ich größer", "eine Ebene höher", "bevor wir starten")
- Aufwand-Schätzung > 1 Tag
- Schema-Migration mit Breaking-Change
- Tooling-Wechsel (z.B. Linter/Test-Runner)
- Architektur-Entscheidung (neuer External-Service, neuer Workspace)

### Klassisch wenn
- Bugfix mit klarem Reproduktions-Pfad
- UI-Tweak (Token-Anpassung, Animation-Fix, Toast-Text)
- Einzelne Migration ohne Cross-Domain-Konsequenz
- Einzelne Test-Reparatur
- Status-Anfrage ("was steht an?", "wie ist der Stand?")
- User explizit "mach kurz" / "schnell" / "nur das"

---

## Die 12 Phasen

### Phase 1 — Idee + Grobkonzept

User-Aussage als Anker. **Plan-Mode aktivieren** mit Strukturierung in Sektionen. Plan-File schreibt Claude — User editiert/genehmigt.

- **Output:** Plan-File mit Sektion-Liste + Output-Liste (welche Files entstehen)
- **Stop-Punkt:** `ExitPlanMode` → User-Approval bevor erste Datei geschrieben wird

### Phase 2 — Foundation-Direktive zuerst

Wenn die Aufgabe eine strategische Leitlinie hat (Beispiele aus Matrix: "Tool ist Organisations-Layer, nicht Storage"; "Native ist Fallback"; "Zero-Shift-Edit-Mode"), wird sie **zuerst** verankert:

- in den Foundation-Manifesten (`docs/claude/01-architecture.md`, `02-code-quality.md`, `03-design.md`, `04-animations.md`, `06-security.md`)
- als eigenes Memory-File (projekt-spezifisch unter `~/.claude/projects/<slug>/memory/`)
- mit Querverweis im Konzept-File

Alle nachfolgenden Sektionen referenzieren die Foundation-Direktive.

### Phase 3 — Audit (Code-Stand prüfen)

Was existiert heute, welche Code-Pfade sind betroffen, was ist Drift, was ist Single-Source. **Glob/Grep + Read.**

- **Output:** Inventur-Tabelle pro Feature/Komponente in der Sektion "Inventur" des Konzept-Files
- **Drift-Befunde** als Adjacent-Cleanup-Auftrag dokumentieren (eigene deferred Sub-Sprints anlegen — nicht stillschweigend mitsanieren)

### Phase 4 — Implikationen

Pro neuer Foundation-Direktive: Konsequenzen pro Domain / Tabelle / Komponente.

- **Output:** Implikations-Block im Konzept-File pro Foundation-Direktive

### Phase 5 — Konzept-Hauptfile + Worksheet (CSV + MD)

**Drei Begleit-Files:**

1. **Konzept-Hauptfile** (`docs/concepts/<thema>-foundation.md`): 15-20 Sektionen mit stabilen Anker-IDs.
2. **Worksheet MD** (`docs/concepts/<thema>-review.md`): Tabellen-File pro Sektion mit 8 Spalten: `# / Sektion / Item / Beschreibung / Frage / Optionen mit Trade-offs / Status / Kommentar`.
3. **Worksheet CSV** (`docs/concepts/<thema>-review.csv`): identisches Format, **Excel-import-tauglich**.

**Pflicht-Format pro Worksheet-Punkt** (User-Story-artig, nicht technisch-knapp):

- **Beschreibung:** 2-3 Sätze in Alltagssprache — was bedeutet der Punkt, warum ist er relevant, worauf hat er Einfluss?
- **Frage:** EINE konkrete Frage, die der User beantworten kann (nicht "RLS-Granularität klären" sondern "Sollen alle Workspace-Mitglieder alle Daten sehen, oder nach Rolle eingeschränkt?")
- **Optionen mit Trade-offs:** 2-3 Wahlmöglichkeiten je mit Vor/Nachteil + Empfehlung. Format: `A) X — Vor: ... | Nachteil: ... | B) Y — Vor: ... | Nachteil: ... | Empfehlung: A weil ...`

**Anti-Pattern (User schreibt überall "müssen wir besprechen"):** technische Kürzel ohne Beschreibung in der Frage-Spalte. Wenn User ohne Tech-Vorbildung den Punkt nicht entscheiden kann, ist die Beschreibung zu knapp.

User kommentiert in Status (`offen` / `bestätigt` / `geändert` / `verworfen` / `vorschlag-claude`) + Kommentar-Spalte. **MD und CSV bleiben synchron.**

Templates: siehe `docs/planning/sophisticated-worksheet-template.md` + `.csv` + `concept-template.md`.

### Phase 6 — Diskussionsschleifen mit Foundation-Bewusstsein

Pro Worksheet-Punkt:

1. **Foundation-Bezug** zitieren (1-2 Sätze aus dem relevanten Manifest)
2. **Grund-Info:** was ist heute, was wäre Soll, welche Optionen
3. **Fragen-Block:** alles was noch unklar ist + Adjacent-Cleanup-Verdacht (typischerweise 3-7 Fragen)
4. **STOP** — auf User-Antwort warten
5. User antwortet → Ergebnis ins Konzept-File + Worksheet (Status `bestätigt` / `geändert`)
6. Wenn Punkt umsetzbar geworden: Plan-File schreiben → User-Approval → Code → Test

**Auto-Mode überschreibt das NICHT.** Konzept-Entscheidungen sind keine Routine — sie sind strategisch und brauchen explizite User-Antwort. Setze Status NIE selbständig auf `bestätigt` ohne User-Antwort.

**Ausnahme: User delegiert explizit** ("du entscheidest fachlich im Projektkontext", "bitte durchentscheiden") — dann Claude entscheidet mit dokumentierter **Begründung** im Konzept-File + Worksheet, kein Stop. Aber: Begründung sichtbar machen, damit User korrigieren kann.

### Phase 7 — Manifest-Updates parallel

Wenn neue Querschnitt-Direktiven entstehen, werden parallel zur Konzept-Entwicklung die Foundation-Manifeste erweitert.

- **Pflicht:** Memory-File pro Top-Level-Direktive + Memory-Index-Eintrag + Konzept-File-Querverweis + CLAUDE.md "Was NICHT tun"-Eintrag bei Anti-Pattern.

### Phase 8 — Schema-Quad-Pflege pro Tabelle

Jede neue Tabelle / Spalten-Erweiterung pflegt **alle** Architektur-Slots gleichzeitig:

```
1. Schema       (Migration mit RLS + Indexes + Tenant-ID)
2. Mutations    (Service-Functions, Audit-Log-Wrapper)
3. MCP-Tools    (falls Bridge enthalten — Tool-Bundle + Registrierung)
4. Export       (Import/Export-Pfade idempotent)
```

Optional bei Realtime-/Offline-relevanten Tabellen erweitert auf **Heptad** (siehe Matrix-Pattern):

```
5. Offline-Cache    (TABLES + DB_VERSION-Bump)
6. Realtime-Subscribe (Channel + Bumps)
7. Channel-Bridge   (falls User-Inhalt — User-Privacy-Direktive)
```

**Worksheet-Eintrag pro Tabelle mit explizit gefüllten Slots, kein "dito"-Schleifen.**

Coverage-Matrix-Template: `docs/planning/schema-quad-coverage-template.csv`.

### Phase 9 — Risiken-Sektion

Eigene Sektion mit `R-1`, `R-2`, ... Format. Pro Risiko: Ursache + Mitigation. Mitigation verweist auf konkrete Sub-Sprints / Code-Stellen / deferred Audits.

- **Pflicht:** R-Items aus Diskussion herausziehen, auch nachträgliche neue Risiken aufnehmen sobald sichtbar.
- Verbindung zu `docs/planning/risk-register-template.md` (CSV-Variante mit Probability×Impact-Matrix)

### Phase 10 — BACKLOG-Updates parallel

Wave-Einträge im BACKLOG mit Aufwand-Schätzung + Output-Liste. Deferred Sprints separat markiert. Total-Schätzung anpassen.

### Phase 11 — Plan-Tracker als persistente Diskussions-Spur

Plan-File bekommt einen **Diskussions-Tracker** mit Datum + Sub-Sektion-Abschlüssen + offenen Korrektur-Aufträgen. So bleibt der Stand auch über `/clear` hinaus rekonstruierbar.

```markdown
## Plan-Tracker

| Datum | Sub-Sektion | Status | Notiz |
|---|---|---|---|
| 2026-05-10 | §3 Auth-Flow | KOMPLETT | OAuth + Magic-Link bestätigt, Spike R-3 abgeschlossen |
| 2026-05-10 | §4 Permission-Matrix | OFFEN | User-Kommentar zu RBAC-Granularität ausstehend |
| 2026-05-11 | §5 Audit-Log-Schema | KOMPLETT | Heptad gepflegt, R-1 mitigated |
```

### Phase 12 — Verifikation (Trace-Tests + Coverage-Matrix)

**Vor Implementierungs-Start:**

- **Trace-Tests** mit konkreten Setups + Schritten + Erfolgs-Kriterien (Latenz-Zahlen, Permission-Checks, Performance-SLOs) + Fail-Modes
- **Schema-Quad-Coverage-Matrix** als CSV (Tabellen × Slots) — alle Felder gefüllt vor Wave-Start
- **Foundation-Audit-Matrix** als CSV (Domains × Manifesto-Direktiven)
- **Backlog-Konsistenz** + Risiken-Akzeptanz

---

## Erfolgs-Faktoren

- **Foundation zuerst** — strategische Leitlinie verankert vor allen Detail-Diskussionen
- **Excel-tauglich** — User kann offline mit dem Worksheet-CSV arbeiten, kommt mit fertigen Antworten zurück
- **Stop-Punkte ehrlich** — Auto-Mode wird nicht missbraucht für Konzept-Entscheidungen
- **Adjacent-Cleanup proaktiv** — beim Audit entdeckte Drift wird benannt, nicht ignoriert
- **Schema-Quad-Pflege rigoros** — alle Slots pro Tabelle, kein "dito"-Schleifen
- **Memory-Files als Top-Level-Sicherung** — Querschnitt-Direktiven bleiben über Sessions hinweg verbindlich
- **Manifest-Updates parallel** — Konzept und Manifest wachsen gemeinsam, kein Nachzieh-Sprint
- **Risiken explizit** — auch neue Risiken aus der Diskussion in die Risiken-Sektion aufnehmen
- **Plan-Tracker persistent** — pro Sektion ein KOMPLETT-Block mit Datum, sodass Stand rekonstruierbar bleibt
- **User-Direktive "du entscheidest fachlich"** als Erlaubnis für Claude-Auto-Decision — aber **mit dokumentierter Begründung**

---

## Anti-Pattern (sofort durchfallen)

- Ohne Modus-Frage starten bei nicht-trivialen Aufgaben
- Auto-Mode-Übergriff auf Konzept-Entscheidungen ohne User-Antwort
- "dito"-Schleifen in Schema-Quad-/Heptad-Tabellen
- Manifest-Updates erst nach Konzept-Abschluss (Drift-Risiko)
- Stille Adjacent-Drift — beim Audit entdeckte Inkonsistenzen ignoriert
- Worksheet ohne CSV-Pendant — User kann nicht in Excel arbeiten
- Stop-Punkte übersprungen weil "logischerweise klar"
- Konzept-Änderungen ohne Plan-Tracker-Update

---

## Quick-Reference für Claude

Wenn die Modus-Frage mit "sophisticated" beantwortet ist:

1. Plan-File anlegen mit Sektion-Liste + Output-Liste (Phase 1)
2. Foundation-Direktive zuerst verankern (Phase 2)
3. Audit Code-Stand (Phase 3)
4. Implikationen pro Foundation-Direktive (Phase 4)
5. Konzept-Hauptfile + Worksheet (MD + CSV) anlegen (Phase 5)
6. Pro Worksheet-Punkt: Foundation-Bezug + Grund-Info + Fragen → Stop → User antwortet → Status (Phase 6)
7. Manifest-Updates parallel bei Querschnitt-Direktiven (Phase 7)
8. Schema-Quad-Pflege pro neuer Tabelle (Phase 8)
9. Risiken-Sektion mit Mitigations (Phase 9)
10. BACKLOG mit Wave-Einträgen (Phase 10)
11. Plan-Tracker mit Sektion-Abschlüsse + Datum (Phase 11)
12. Verifikation mit Trace-Tests + Coverage-Matrix (Phase 12)

**Why:** Pfusch in der Konzept-Phase multipliziert sich in der Implementation. Sophisticated-Workflow ist teurer in der Vorlauf-Phase (~3-5 Tage Diskussion vor Code-Start), aber spart vielfache Re-Work-Wellen, weil Foundation-Direktiven, Schema-Quad-Pflichten, Risiken und Adjacent-Cleanup im Vorfeld geklärt sind.

---

## Verbindung zu anderen Codex-Pfeilern

| Pfeiler | Verbindung |
|---|---|
| **#5 BACKLOG-Wave-Sprint** (`05-workflow.md`) | Sophisticated ist die "große" Wave-Methodik; klassisch ist die "kleine" Wave-Methodik. Beide nutzen denselben BACKLOG. |
| **#11 Continuous Quality Awareness** (`11-continuous-quality.md`) | Awareness läuft IMMER, auch in sophisticated. Aber Konzept-Entscheidungen sind nicht "Auto-Fix"-Material. |
| **#12 Feature Verification** (`12-feature-verification.md`) | Modus-A/B Verification kommt NACH dem sophisticated-Workflow, in Phase 12 als Trace-Tests. |
| **DoR / Spike** (`docs/planning/`) | DoR-Checkliste gilt vor Wave-Aufnahme; Spikes sind kleine sophisticated-Mini-Cycles für offene Fragen. |
| **Risk-Register** (`docs/planning/risk-register-template.md`) | Phase-9-Risiken werden ins Risk-Register hochgezogen wenn übergreifend. |
