# Plan-Tracker — Persistente Diskussions-Spur

**Wann nutzen:** als Block am Ende jedes Plan-Files (`~/.claude/plans/<thema>.md`) — Phase 11 des Sophisticated-Workflows.

**Why:** Ohne Plan-Tracker ist der Stand nach `/clear` weg. Mit Plan-Tracker kann eine neue Session den Plan lesen und sofort weitermachen ohne Re-Discovery.

---

## Format

```markdown
## Plan-Tracker

| Datum | Sub-Sektion | Status | Notiz |
|---|---|---|---|
| YYYY-MM-DD | §X.Y Sektions-Titel | KOMPLETT / OFFEN / TEILWEISE | 1-2-Satz Stand-Notiz |
```

## Status-Werte

- **KOMPLETT** — Sub-Sektion durchdiskutiert, User hat bestätigt, Worksheet-Status aller Items in dieser Sektion ist `bestätigt`/`geändert`/`verworfen`. Keine offenen Fragen.
- **TEILWEISE** — Mehrheit klar, einzelne Punkte noch offen. Notiz nennt was offen ist.
- **OFFEN** — Diskussion läuft, viele unbeantwortete Fragen.
- **BLOCKIERT** — Wartet auf externe Information (z.B. Provider-Antwort, Architektur-Spike, Spec).

## Beispiel

```markdown
## Plan-Tracker

| Datum | Sub-Sektion | Status | Notiz |
|---|---|---|---|
| 2026-05-08 | §0 Zielbild | KOMPLETT | Audit-Log immutable, write-once. User-Direktive bestätigt. |
| 2026-05-08 | §1 Foundation-Direktive | KOMPLETT | Memory-File angelegt, Manifest-Update §6.4 in 06-security.md. |
| 2026-05-09 | §2 Inventur | KOMPLETT | 2 Adjacent-Cleanups (AC-1 trigger fehlt, AC-2 MCP-tool ungenutzt) als deferred Sprints. |
| 2026-05-09 | §3.1 DB-Schicht | TEILWEISE | Trigger-Strategie offen — User entscheidet bis 05-11. Worksheet §3.1.4 noch offen. |
| 2026-05-10 | §3.2 Backend | KOMPLETT | Middleware bleibt unverändert. MCP-Tool nur SELECT. |
| 2026-05-10 | §3.3 Client | OFFEN | UI-Mockup von User ausstehend. |
| 2026-05-10 | §4 Risiken | KOMPLETT | R-1 + R-2 dokumentiert + Mitigations. |
| 2026-05-10 | §5 BACKLOG | OFFEN | Effort-Schätzung für Filter-UI fehlt. |
```

## Pflicht-Eintragungen

Bei jedem Update am Konzept-File MUSS ein Plan-Tracker-Update folgen:
- **Neue Sektion bearbeitet** → Eintrag mit Datum
- **User-Antwort verschiebt Status** → Eintrag mit Notiz "User entschied X"
- **Adjacent-Cleanup entdeckt** → Eintrag mit Verweis auf AC-Item
- **Risiko hinzugekommen** → Eintrag mit R-ID

## Recovery-Pattern (nach `/clear`)

Neue Claude-Session liest:
1. `~/.claude/plans/<thema>.md` → Plan-Tracker-Tabelle
2. Identifiziert: was ist KOMPLETT, was OFFEN, was BLOCKIERT
3. Liest Worksheet (`docs/concepts/<thema>-review.md`) für Detail
4. Kann ohne Re-Discovery weitermachen mit den OFFEN-Items

So bleibt der Sophisticated-Cycle über Tage/Wochen kohärent ohne dass User die ganze Diskussion wiederholen muss.
