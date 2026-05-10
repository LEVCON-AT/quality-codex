# Worksheet — <Thema>

**Konzept-File:** `docs/concepts/<thema>-foundation.md`
**Stand:** YYYY-MM-DD
**Status-Werte:** `offen` / `bestätigt` / `geändert` / `verworfen` / `vorschlag-claude`

> Synchron mit `docs/concepts/<thema>-review.csv` halten — User arbeitet das CSV in Excel offline durch.

---

## Spalten-Format (Pflicht für jeden Punkt)

| Spalte | Inhalt |
|---|---|
| **#** | ID, z.B. §1.3 |
| **Sektion** | Welche Konzept-Sektion (Cross-Ref ins Konzept-File) |
| **Item** | Kurztitel (max 5 Wörter) — als Ankerpunkt |
| **Beschreibung** | 2-3 Sätze in Alltagssprache: was bedeutet der Punkt? Warum ist das relevant? Worauf hat es Einfluss? |
| **Frage** | EINE konkrete Frage, die der User beantworten kann. Nicht "RLS-Granularität klären" sondern "Sollen User in einem Workspace alle Daten sehen, oder nur die eigenen?" |
| **Optionen mit Trade-offs** | 2-3 Wahlmöglichkeiten, je mit Vor-/Nachteil + Empfehlung. Format: `A) X — Vor: ..., Nachteil: ... | B) Y — Vor: ..., Nachteil: ... | Empfehlung: A weil ...` |
| **Status** | `offen` / `bestätigt` / `geändert` / `verworfen` / `vorschlag-claude` |
| **Kommentar** | User-Feedback / Begründung / Verweis auf weitere Diskussion |

**Anti-Pattern (nicht so):**
```
§1.3,§1,RLS-Granularität,Frage,"pro-Tenant oder pro-Role?",offen
```
User kann das ohne Tech-Vorbildung nicht entscheiden → kommentiert "müssen wir besprechen".

**So ist es richtig:**
```
§1.3,§1,RLS-Granularität,
"Beim Datenbankzugriff entscheiden Filter, wer was sieht. Heute filtern wir nur nach Tenant/Workspace — alle Mitglieder sehen also alles im Workspace. Wir können zusätzlich nach Rolle filtern, sodass z.B. ein Viewer nur eigene Tasks sieht.",
"Sollen alle Workspace-Mitglieder alle Daten sehen, oder soll der Zugriff auch nach Rolle eingeschränkt werden?",
"A) nur Tenant-Filter — Vor: einfach, schnell zu implementieren | Nachteil: alle sehen alles im Workspace, kein DB-seitiger Schutz wenn Backend-Code Bugs hat | B) Tenant + Role-Filter — Vor: Defense-in-Depth, granular | Nachteil: komplexere RLS-Policies, mehr Test-Aufwand | Empfehlung: A für v1.0, B in Phase 2 wenn Compliance es fordert",
offen,
```

---

## Sektion §1 — <Sektions-Titel> {#s1}

**Foundation-Bezug:** `docs/claude/01-architecture.md` §X (Atom-Zwiebel-Layer 1)

| # | Item | Beschreibung | Frage | Optionen mit Trade-offs | Status | Kommentar |
|---|---|---|---|---|---|---|
| §1.1 | Aggregate-Root | Im Datenmodell unterscheiden wir "Hauptobjekte" (z.B. ein Task) und "Sichten" darauf (z.B. Task in Kanban-Board). Aggregate-Roots sind die einen Wahrheits-Quellen. Wenn wir das durcheinander bringen, gibt es später Drift bei parallelen Updates. | Welche unserer Tabellen ist Aggregate-Root, welche ist nur eine Sicht? | A) `tasks` als Root, `task_kanban_view` als Sicht — Vor: klare Trennung | B) Beides eigene Tabellen mit Sync — Nachteil: Drift-Risiko, doppelte Wahrheit | Empfehlung: A | offen | |
| §1.2 | Tenant-ID-Pflicht | Jede Tabelle (außer der `tenants`-Tabelle selbst) braucht eine Spalte `tenant_id`, sonst können wir nicht zwischen Workspaces trennen. Auch zukünftige Tabellen müssen das einhalten — sonst Datenleck zwischen Tenants. | Akzeptieren wir die Regel "jede Tabelle hat tenant_id NOT NULL"? | A) Ja, harte Regel + CI-Check — Vor: Verhindert Bugs | B) Nein, Tabellen ohne Tenant-Bezug erlaubt — Nachteil: später schwer durchzusetzen | Empfehlung: A | offen | |
| §1.3 | RLS-Policy-Granularität | Beim Datenbankzugriff entscheiden Filter, wer was sieht. Heute filtern wir nur nach Tenant — alle Mitglieder sehen alles im Workspace. Wir können zusätzlich nach Rolle filtern, sodass z.B. ein Viewer nur eigene Tasks sieht. | Sollen alle Workspace-Mitglieder alle Daten sehen, oder soll der Zugriff auch nach Rolle eingeschränkt werden? | A) nur Tenant-Filter — Vor: einfach | Nachteil: alle sehen alles | B) Tenant + Role-Filter — Vor: Defense-in-Depth | Nachteil: komplexere Policies | Empfehlung: A für v1.0, B in Phase 2 | offen | |

---

## Sektion §2 — <Sektions-Titel> {#s2}

**Foundation-Bezug:** `docs/claude/06-security.md` §STRIDE

| # | Item | Beschreibung | Frage | Optionen mit Trade-offs | Status | Kommentar |
|---|---|---|---|---|---|---|
| §2.1 | Auth-Provider | Wir brauchen Login. Supabase liefert Auth out-of-box (E-Mail+Passwort, Magic-Link). Alternativ können wir externe OAuth-Provider (Google, GitHub) anbieten. OAuth ist bequemer für User, aber mehr Konfig + Drittanbieter-Abhängigkeit. | Reicht uns Supabase-Auth, oder bieten wir auch Google/GitHub-Login an? | A) Nur Supabase-Auth — Vor: simpel, alle Daten im eigenen System | Nachteil: User muss neuen Account anlegen | B) + OAuth — Vor: weniger Friction beim Signup | Nachteil: DPA mit OAuth-Provider, Kontoverknüpfung | Empfehlung: A für v1.0, OAuth in Phase 2 wenn User-Wachstum es fordert | offen | |
| §2.2 | MFA-Pflicht | Mehrfach-Authentifizierung (TOTP via Authenticator-App) erhöht die Sicherheit deutlich, kostet aber Onboarding-Komfort. Für admin/owner-Rollen ist MFA quasi Industriestandard, für viewer eher übertrieben. | Wann erzwingen wir MFA? | A) MFA für owner+admin Pflicht ab Tag 1 — Vor: sicher, compliant | Nachteil: User-Friction beim Setup | B) MFA optional für alle, Pflicht erst in Phase 2 — Vor: schnellerer Start | Nachteil: Account-Übernahme leichter | Empfehlung: A | offen | |

---

## Sektion §3 — <weitere Sektionen analog> {#s3}

...

---

## Adjacent-Cleanup-Verdacht

(Drift-Befunde aus Phase 3 Audit — werden als deferred Sub-Sprints angelegt, NICHT stillschweigend mitsaniert)

| # | Drift | Was-das-bedeutet | Adjacent-Aktion | Status |
|---|---|---|---|---|
| AC-1 | `formatDate` 3× im Repo | Wir haben drei verschiedene Versionen einer Datums-Formatierungs-Funktion. Wenn wir Bugs in einer fixen, sind die anderen weiter kaputt. | Sub-Sprint "lib-Konsolidierung" — alle 3 in eine Funktion zusammenführen | offen |
| AC-2 | RLS fehlt auf `legacy_logs` | Eine alte Tabelle hat keinen Row-Level-Security-Schutz aktiviert. Wenn jemand Service-Role-Zugriff bekommt, sieht er alles. | Sub-Sprint "RLS-Sweep" — Policy ergänzen, in CI absichern | offen |

---

## Workflow-Hinweise

- **Pro Sektions-Punkt** zitiert Claude den Foundation-Bezug, gibt Beschreibung in Alltagssprache, formuliert die Frage konkret, listet 2-3 Optionen mit Trade-offs + Empfehlung → STOP → User antwortet → Status auf `bestätigt`/`geändert` setzen.
- **Status `vorschlag-claude`:** wenn User explizit "du entscheidest" gesagt hat — Begründung im Kommentar.
- **CSV-Sync:** Diese MD-Tabelle in CSV-Variante exportieren (gleiche Spalten, gleiche IDs) — User kann das in Excel öffnen.
- **Anti-Pattern:** technische Kürzel ohne Beschreibung in der Frage-Spalte → User kann nicht entscheiden, schreibt überall "müssen wir besprechen".
