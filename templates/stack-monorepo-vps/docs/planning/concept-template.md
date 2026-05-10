# Konzept: <Thema>

**Datum:** YYYY-MM-DD
**Initiator:** <user>
**Modus:** sophisticated
**Worksheet:** `docs/concepts/<thema>-review.md` + `docs/concepts/<thema>-review.csv`
**Plan-File:** `~/.claude/plans/<thema>.md` (mit Plan-Tracker)

---

## §0 Zielbild

(Wofür ist dieses Konzept? Was ist das Outcome wenn alle Sektionen `bestätigt` sind?)

## §1 Foundation-Direktive (zuerst verankern)

**Direktive:** `<einzeilige Aussage, z.B. "Audit-Log ist write-once, append-only">`

**Konsequenzen:**
- Manifest-Update: `docs/claude/06-security.md` §X
- Memory-File: `~/.claude/projects/<slug>/memory/feedback_audit_immutable.md`
- "Was NICHT tun"-Eintrag in CLAUDE.md: keine `UPDATE`/`DELETE` auf `audit_events`

---

## §2 Inventur (Phase 3 Audit)

| Komponente | Zustand heute | Drift / Notiz | Adjacent-Aktion |
|---|---|---|---|
| `audit_events` Tabelle | existiert, mit RLS | trigger fehlt für immutability | AC-1 (siehe Worksheet) |
| `auditLog`-Middleware | wraps mutations | nicht in MCP-Tools genutzt | AC-2 |
| Wiki-Doc | placeholder | leer | Phase-7-Output |

---

## §3 Implikationen pro Foundation-Direktive

### 3.1 — DB-Schicht
- Neuer Trigger `audit_events_immutable` (BEFORE UPDATE/DELETE → RAISE)
- RLS-Policy bleibt SELECT-only
- Migration `001_audit_immutable.sql`

### 3.2 — Backend-Schicht
- `auditLog`-Middleware unverändert (nur INSERT)
- MCP-Tool `audit_query` nur SELECT, kein UPDATE/DELETE-Pfad
- Bei manueller Korrektur: zweiter Audit-Eintrag mit `corrects: '<old_id>'`

### 3.3 — Client-Schicht
- Audit-Log-View in Settings (read-only Liste)
- Filter + Export (Art. 15 GDPR)

---

## §4..§N Detail-Sektionen

(Jede Sektion mit eigenem Anker `{#sN}`. Worksheet-Punkte verlinken hierhin.)

---

## §X Risiken

| ID | Risiko | Mitigation | Status |
|---|---|---|---|
| R-1 | Trigger-Fehler bricht alle audit-Inserts | Test in Migration + Rollback-Skript | offen |
| R-2 | Performance-Hit auf hot-write-Pfad | Index-Pflege, Partitioning ab 10M Rows | mitigated |

---

## §Y BACKLOG-Auswirkung

| Wave-Item | Effort | Output |
|---|---|---|
| Wave 4 / Item 2 — Audit-Immutability-Migration | M (1-2 Tage) | Migration + Trigger + Doc |
| Wave 4 / Item 3 — Audit-Wiki-Doc | S (½ Tag) | `docs-user/admin/audit-log.md` |
| Wave 5 / Item 1 — Audit-Filter-UI | M | Settings-Page mit Filter |

---

## Plan-Tracker (persistente Diskussions-Spur)

| Datum | Sub-Sektion | Status | Notiz |
|---|---|---|---|
| 2026-MM-DD | §1 Foundation | KOMPLETT | Direktive bestätigt durch User |
| 2026-MM-DD | §2 Inventur | KOMPLETT | 2 Drifts dokumentiert |
| 2026-MM-DD | §3.1 DB-Schicht | OFFEN | Trigger-Strategie unklar |
| 2026-MM-DD | §3.2 Backend | KOMPLETT | Middleware unverändert |

---

## Cross-References

- Manifest: `docs/claude/06-security.md`
- Risk-Register: Eintrag R-1, R-2
- Worksheet: `docs/concepts/audit-immutable-review.md/.csv`
