# Runbook: GDPR Subject Request

User-Anfragen nach DSGVO Art. 15-22.

## Eingangs-Kanal

E-Mail an `privacy@<domain>` (Pflicht in Privacy-Policy verlinkt).

Auto-Forward an internen Issue-Tracker mit Label `gdpr-request`.

## Identitäts-Verifikation

Vor Datenherausgabe:
1. Anfragender muss aus authentifizierter Session kommen ODER
2. Bei E-Mail-Anfrage: Verifikations-Mail an die hinterlegte Adresse mit Token
3. Bei Zweifel: zusätzliche Verifikation über alt. Kanal (Telefon, Adresse)

## Art. 15 — Auskunftsrecht (Right of Access)

User fragt: "Welche Daten habt ihr über mich?"

### Antwort innerhalb 30 Tage

```bash
# Skript generiert JSON mit allen User-Daten
./infra/scripts/gdpr-export.sh --user-id <uuid>

# Output: gdpr-exports/<user-id>-<date>.json
{
  "user": { ... },
  "workspaces": [ ... ],
  "tasks": [ ... ],
  "audit_events": [ ... ],
  "subscriptions": [ ... ]
}
```

Liefern als:
- JSON-Download via signed-URL (24h gültig)
- Optional: Mail-Anhang verschlüsselt

### Audit-Log
`action: 'gdpr.subject_access', actor: <admin>, target_id: <user_id>`

## Art. 16 — Berichtigung

User fragt: "Bitte ändert meinen Namen."

→ User kann das selbst über Settings-Seite. Bei Backend-only-Felder (z.B. Geburtsdatum, das nicht editierbar ist) → Manual-Update.

## Art. 17 — Right to be Forgotten

User fragt: "Löscht meinen Account und alle Daten."

### Workflow

1. **Confirmation-Modal** mit konkreten Konsequenzen:
   - Workspaces, deren `owner` User ist → werden gelöscht (oder Owner-Transfer)
   - Tasks → werden gelöscht
   - Audit-Events → bleiben (Compliance-Anforderung), aber `actor_id` anonymisiert
   - Backup-Retention: Daten verschwinden in 30-90 Tagen

2. **Hard-Delete-Skript** (`./infra/scripts/gdpr-delete-user.sh --user-id <uuid>`):
   ```sql
   BEGIN;

   -- Audit-Event vor Anonymisierung
   INSERT INTO audit_events (action, actor_id, target_id, meta)
   VALUES ('gdpr.user_deleted', $1, $1, jsonb_build_object('confirmation_token', $2));

   -- PII anonymisieren
   UPDATE users SET
     email = 'deleted-' || id || '@anonymized.invalid',
     name = 'Anonymisiert',
     deleted_at = now()
   WHERE id = $1;

   -- Audit-Events: actor_id behalten, aber als anonymized markieren
   UPDATE audit_events SET meta = meta || jsonb_build_object('actor_anonymized', true)
   WHERE actor_id = $1;

   -- Cascade-Delete dependents (oder anonymize, je nach Tabelle)
   DELETE FROM workspace_members WHERE user_id = $1;
   DELETE FROM sessions WHERE user_id = $1;

   COMMIT;
   ```

3. **Bestätigungs-Mail** an alte Adresse: "Account gelöscht am DD.MM.YYYY".

4. **Backup-Retention** dokumentiert: Daten verschwinden aus Backups nach <retention-period>.

## Art. 20 — Datenportabilität

User fragt: "Gebt meine Daten in maschinenlesbarem Format."

→ JSON-Export wie Art. 15, plus:
- **Bekanntes Schema** (z.B. Schema.org)
- **Datenpunkte aus Vertrag** (alles was User direkt geliefert hat)
- **Optional auch JSON-LD oder CSV**

## Art. 21 — Widerspruch

User: "Ich widerspreche der Verarbeitung für Marketing/Profiling."

→ User-Profile-Flag `marketing_opt_out = true`. Alle Marketing-Mails ab sofort gesperrt. Newsletter-Subscription sofort entfernen.

## Art. 22 — Automatisierte Einzelentscheidungen

Wenn App AI-basierte Entscheidungen über User trifft (z.B. "Account suspended via Automated-Fraud-Detection"):
- Erklärbarkeit-Pflicht
- Right to human review
- Logging der Entscheidungs-Faktoren

## Response-Tracking

`gdpr_requests`-Tabelle:
```sql
CREATE TABLE gdpr_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users(id),
  email         text NOT NULL,
  request_type  text NOT NULL,  -- 'access', 'erasure', 'portability', 'objection'
  status        text NOT NULL,  -- 'received', 'verified', 'in_progress', 'fulfilled', 'rejected'
  received_at   timestamptz DEFAULT now(),
  fulfilled_at  timestamptz,
  notes         text
);
```

## SLA

- **Acknowledge:** binnen 72h
- **Fulfill:** binnen 30 Tage (verlängerbar auf 60 Tage bei Komplexität, mit Begründung)

## Wenn nicht erfüllbar

Begründung schriftlich an User + Hinweis auf Beschwerde-Recht bei Aufsichtsbehörde (in AT: dsb.gv.at).

## Audit

Jede GDPR-Request hat `audit_events`-Eintrag. Aufsichtsbehörde kann diese im Audit-Fall anfordern.
