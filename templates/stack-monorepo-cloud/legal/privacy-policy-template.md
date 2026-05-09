# Datenschutzerklärung (DSGVO-konform)

**Stand:** YYYY-MM-DD

## 1. Verantwortlicher

__OWNER_NAME__
E-Mail: __PRIVACY_EMAIL__ (privacy@__DOMAIN__)

## 2. Welche Daten wir verarbeiten

| Datenkategorie | Zweck | Rechtsgrundlage | Speicherdauer |
|---|---|---|---|
| E-Mail-Adresse | Authentifizierung, Kommunikation | Vertrag (Art. 6.1.b) | 30d nach Account-Deletion |
| Name, Profilbild | Profil-Anzeige | Vertrag | s.o. |
| IP-Adresse, User-Agent | Sicherheits-Logs | Berechtigtes Interesse (Art. 6.1.f) | 90d |
| Cookies (essential) | Session-Management | Vertrag | bis Session-Ende |
| Cookies (analytics) | Statistik | Einwilligung (Art. 6.1.a) | 2 Jahre |

## 3. Sub-Prozessoren

- **Supabase** (Hosting / Database) — DPA: https://supabase.com/legal/dpa
- **Sentry** (Error-Tracking) — DPA: https://sentry.io/legal/dpa/
- **Postmark / Resend** (E-Mail) — DPA verlinkt
- **Backblaze B2** (Backup-Storage) — DPA verlinkt
- **Vercel** (CDN / Edge) — DPA: https://vercel.com/legal/dpa (nur Cloud-Variante)

## 4. Deine Rechte (Art. 15-22 DSGVO)

- **Auskunft** (Art. 15)
- **Berichtigung** (Art. 16)
- **Löschung** (Art. 17, "Right to be forgotten")
- **Einschränkung** (Art. 18)
- **Datenübertragbarkeit** (Art. 20)
- **Widerspruch** (Art. 21)
- **Beschwerde** bei der Aufsichtsbehörde (in AT: dsb.gv.at)

Anfragen: privacy@__DOMAIN__ — Antwort innerhalb 30 Tage.

## 5. Cookies

- **Essential** (immer aktiv): Session-Cookie, CSRF-Token
- **Analytics** (Opt-in): __ANALYTICS_TOOL__ (privacy-respecting)

Verwaltung über Cookie-Banner oder im Footer-Link "Cookie-Einstellungen".

## 6. Sicherheits-Maßnahmen

- TLS 1.3 verschlüsselte Übertragung
- Passwörter: argon2id-Hashing
- Backups: age-Verschlüsselung
- Audit-Log für privilegierte Zugriffe
- Regelmäßige Pen-Tests + Vulnerability-Scans

## 7. Internationale Datenübermittlungen

Daten werden in der EU verarbeitet (Hetzner FSN/NBG bzw. Supabase EU-Region). Bei US-Sub-Prozessoren: Standard-Vertragsklauseln + DPF-Zertifizierung.

## 8. Änderungen dieser Erklärung

Wir aktualisieren diese Erklärung bei wesentlichen Änderungen. Stand siehe oben.

## 9. Kontakt für Datenschutz-Fragen

privacy@__DOMAIN__
