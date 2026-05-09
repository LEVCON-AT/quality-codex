# i18n Review

## Strings
- [ ] Keine hardcoded User-facing Strings im Code
- [ ] Alle Strings in `i18n/locales/<locale>/<namespace>.json`
- [ ] Neue Keys in allen aktiven Locales (de-AT, en-US, …)
- [ ] Key-Naming konsistent (`feature.area.action`)

## Datum / Zeit
- [ ] DB-Storage: UTC (`timestamptz`)
- [ ] Display via `Intl.DateTimeFormat(locale, { timeZone, dateStyle, timeStyle })`
- [ ] User-Timezone aus Profil (Default: Browser-Timezone)
- [ ] Niemals `toLocaleString()` ohne Locale-Argument

## Zahlen / Währung
- [ ] `Intl.NumberFormat(locale, { style: 'currency', currency })` für Währungen
- [ ] `Intl.NumberFormat(locale)` für allgemeine Zahlen
- [ ] Decimal-Separator beachtet (`,` vs `.`)
- [ ] Niemals string-Manipulation für Number-Format

## Pluralisierung
- [ ] ICU MessageFormat für plurals (`{count, plural, one {# Item} other {# Items}}`)
- [ ] Kein `count === 1 ? 'item' : 'items'` (englisch-only)

## RTL (wenn aktiviert)
- [ ] CSS Logical Properties (`margin-inline-start` statt `margin-left`)
- [ ] `dir="rtl"` für RTL-Locales
- [ ] Layout flippt korrekt
- [ ] Icons mit Direction-Awareness (Pfeile flippen, Logos nicht)
- [ ] Mixed-Direction-Content mit `dir="auto"`

## Error-Messages
- [ ] Backend liefert Error-Codes (`AUTH_INVALID_CREDENTIALS`)
- [ ] Frontend übersetzt via `t('errors.auth.invalid_credentials')`
- [ ] Niemals hardcoded "Login failed" im Backend

## Locale-Detection
- [ ] Browser-Default beim ersten Besuch
- [ ] User-Override persistiert
- [ ] Fallback zur Default-Locale bei fehlenden Keys
- [ ] Lazy-Loading der Locale-Files (Code-Splitting)

## Translator-Workflow
- [ ] `i18n:check`-Skript: keine fehlenden Keys, keine ungenutzten Keys
- [ ] Glossar (`i18n/glossary.md`) aktuell für consistent-translations
- [ ] Übersetzungs-Pipeline (manual / Crowdin / DeepL) dokumentiert

## URL-Strukturen
- [ ] Locale in URL (z.B. `/de-AT/dashboard`) oder via Subdomain
- [ ] hreflang-Tags auf Public-Pages
- [ ] Sitemap.xml mit Locale-Varianten

## Content
- [ ] Bilder mit Text: i18n-Versionen oder Text als Overlay
- [ ] Datums-Beispiele in Doku-Locale-spezifisch
- [ ] FAQ und Wiki ebenfalls lokalisiert (oder explizit nicht)

## Tests
- [ ] E2E-Test in mind. 2 Locales (Default + 1 weitere)
- [ ] Snapshot-Test für DateFormat / NumberFormat-Output
- [ ] axe-core auch bei RTL-Layout grün
