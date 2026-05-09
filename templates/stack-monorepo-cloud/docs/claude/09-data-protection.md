# 09 — Data Protection (GDPR / DSGVO)

Tier-2-Doc. Lädt bei Auth/User-Daten/Export-Code.

## Standards
- **GDPR / DSGVO** (EU-Verordnung 2016/679)
- **Privacy by Design** (Art. 25)
- **Privacy by Default** (Art. 25)

## PII-Inventar (Pflicht)

`docs/decisions/ADR-XXXX-pii-inventory.md` listet **alle** Spalten mit personenbezogenen Daten:

| Tabelle | Spalte | PII-Klasse | Retention | Lawful-Basis |
|---|---|---|---|---|
| users | email | direkt | 30d nach Account-Deletion | Vertrag (Art. 6.1.b) |
| users | name | direkt | s.o. | s.o. |
| audit_events | ip | indirekt | 90d | Berechtigtes Interesse (Art. 6.1.f) |
| sessions | user_agent | indirekt | bis Session-Ende | s.o. |

PII-Klassen:
- **direkt:** identifiziert Person eindeutig (E-Mail, Name, Telefon)
- **indirekt:** mit anderen Daten kombinierbar (IP, User-Agent, Geo)
- **special-category** (Art. 9): Gesundheit, Religion, Bio — extra Schutz

## Subject-Rights-Workflows

### Art. 15 — Auskunft
User klickt "Meine Daten anzeigen" → Backend generiert JSON mit allen seinen Daten + Audit-Events.

### Art. 17 — Right to be forgotten
User klickt "Account löschen":
1. Confirmation-Modal mit konkreten Konsequenzen
2. Backend setzt `users.deleted_at = now()` + anonymisiert PII (`email = 'deleted-<uuid>@anon'`)
3. Cascade-Delete oder Anonymize abhängiger Daten (siehe ADR pro Tabelle)
4. Backup-Restore-Window: Daten aus Backups verschwinden nach Retention-Period
5. Audit-Event "user.deleted"
6. Confirmation-Mail an alte Adresse

### Art. 20 — Datenportabilität
Export-API liefert JSON in standardisiertem Format (eigenes Schema dokumentieren) — Pflicht-Routine in `tests/protocols/`.

## Cookie-Consent

- **Banner** beim ersten Besuch (klaro / cookie-consent / orestbida-cookieconsent)
- **Pre-Tick verboten** — User muss aktiv zustimmen
- **Granulare Auswahl** — Essential (immer an), Analytics, Marketing
- **Easy Withdrawal** — "Cookies verwalten"-Link im Footer
- **Konfig:** `legal/cookie-consent-config.json`

## Data-Retention-Policies

`infra/scripts/data-retention-cron.sh`:
```bash
# Audit-Events älter 90 Tage löschen
DELETE FROM audit_events WHERE created_at < now() - interval '90 days';

# Inactive Users (nicht-eingeloggt seit 2 Jahren) → Soft-Delete + Mail
UPDATE users SET deleted_at = now() WHERE last_login < now() - interval '2 years';

# Logs (logrotate)
find /var/log/ -mtime +30 -name "*.log" -delete
```

Cron läuft täglich, Audit-Event "data_retention.run".

## Privacy-by-Design-Checkliste (pro neuer Feature)

- [ ] Welche PII wird neu gesammelt?
- [ ] Lawful-Basis (Art. 6) klar?
- [ ] Minimum-Necessary-Prinzip beachtet?
- [ ] Retention-Period definiert?
- [ ] Wird Sub-Prozessor involviert? (Sentry, Postmark, …) → DPA?
- [ ] Cookie-Consent-Update nötig?
- [ ] Privacy-Policy-Update nötig?

## Sub-Prozessoren

`legal/sub-processors.md` listet:
- Supabase (Database + Auth) — DPA verlinkt
- Sentry (Error-Tracking) — DPA verlinkt
- Postmark/Resend (Mail) — DPA verlinkt
- Backblaze/AWS (Backups) — DPA verlinkt

Jeder neue Sub-Prozessor → `legal/dpa-template.md` als Vorlage.

## DKIM/SPF/DMARC (Domain-Reputation für Subject-Mails)

Pflicht für Mail-Versand:
- **SPF:** `v=spf1 include:_spf.<provider>.com -all`
- **DKIM:** Provider-spezifisch, Public-Key in DNS
- **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@<domain>`
- **Verify:** `mail-tester.com` Score ≥ 9/10

## Encryption-at-Rest für PII

PII-Spalten via `pgcrypto`:
```sql
-- Beispiel: hochsensible Felder
CREATE TABLE user_secrets (
  user_id uuid PRIMARY KEY,
  ssn_encrypted bytea  -- via pgp_sym_encrypt(value, key)
);
```

Schlüssel im Vault, nicht in DB.

## Data-Breach-Notification (Art. 33/34)

Bei Sicherheitsvorfall:
1. **Innerhalb 72h:** Meldung an zuständige Aufsichtsbehörde (in AT: dsb.gv.at)
2. **Bei hohem Risiko:** Direkt-Benachrichtigung der betroffenen User
3. Runbook: `docs/runbooks/data-breach-response.md`

## Detail-Lookup

`docs/runbooks/gdpr-subject-request.md` — Schritt-für-Schritt-Workflow
`legal/privacy-policy-template.md` — DSGVO-konforme Vorlage
