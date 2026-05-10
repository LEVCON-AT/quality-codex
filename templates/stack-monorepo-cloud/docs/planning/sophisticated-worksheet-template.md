# Worksheet — <Thema>

**Konzept-File:** `docs/concepts/<thema>-foundation.md`
**Stand:** YYYY-MM-DD
**Status-Werte:** `offen` / `bestätigt` / `geändert` / `verworfen` / `vorschlag-claude`

> Synchron mit `docs/concepts/<thema>-review.csv` halten — User arbeitet das CSV in Excel offline durch.

---

## Sektion §1 — <Sektions-Titel> {#s1}

**Foundation-Bezug:** `docs/claude/01-architecture.md` §X (Atom-Zwiebel-Layer 1)

| # | Item | Form | Annahme-oder-Frage | Status | Kommentar |
|---|---|---|---|---|---|
| §1.1 | Aggregate-Root-Entscheidung | Annahme | `tasks` ist Layer-0-Aggregate-Root, manifestations als Views | offen | |
| §1.2 | Tenant-ID-Pflicht | Annahme | jede Tabelle hat `tenant_id NOT NULL` (außer `tenants`) | offen | |
| §1.3 | RLS-Policy-Granularität | Frage | pro-Tenant + pro-Role oder nur pro-Tenant? | offen | |
| §1.4 | Schema-Versionierung | Frage | `schema_version` enum auf manifestations oder global? | offen | |

---

## Sektion §2 — <Sektions-Titel> {#s2}

**Foundation-Bezug:** `docs/claude/06-security.md` §STRIDE

| # | Item | Form | Annahme-oder-Frage | Status | Kommentar |
|---|---|---|---|---|---|
| §2.1 | Auth-Provider | Frage | Supabase-Auth allein, oder OAuth-Federation? | offen | |
| §2.2 | MFA-Pflicht | Frage | für owner/admin sofort oder Phase 2? | offen | |
| §2.3 | Audit-Log-Retention | Annahme | 90d default, anonymisierter Restbestand 365d | offen | |

---

## Sektion §3 — <weitere Sektionen analog> {#s3}

...

---

## Adjacent-Cleanup-Verdacht

(Drift-Befunde aus Phase 3 Audit — werden als deferred Sub-Sprints angelegt, NICHT stillschweigend mitsaniert)

| # | Drift | Adjacent-Aktion | Status |
|---|---|---|---|
| AC-1 | `formatDate` 3× im Repo | Sub-Sprint "lib-Konsolidierung" | offen |
| AC-2 | RLS fehlt auf `legacy_logs` | Sub-Sprint "RLS-Sweep" | offen |

---

## Workflow-Hinweise

- **Pro Sektions-Punkt:** Claude zitiert Foundation-Bezug, gibt Grund-Info (heute/soll/optionen) + 3-7 Fragen → STOP → User antwortet → Status auf `bestätigt`/`geändert` setzen.
- **Status `vorschlag-claude`:** wenn User explizit "du entscheidest" gesagt hat — Begründung im Kommentar.
- **CSV-Sync:** Diese MD-Tabelle in CSV-Variante exportieren (gleiche Spalten, gleiche IDs) — User kann das in Excel öffnen.
