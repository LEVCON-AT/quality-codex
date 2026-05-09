# Globalization Decision

Welche Locales, RTL-Support, Timezone-Strategie?

## Locale-Matrix

| Frage | Optionen | Default |
|---|---|---|
| **Default-Locale** | de-AT, de-DE, en-US, en-GB, … | de-AT |
| **Aktive Locales am Start** | Liste BCP-47-Codes | de-AT, en-US |
| **Geplante Locales (later)** | Liste | — |
| **Fallback-Locale** | Wenn Übersetzung fehlt | en-US |
| **Browser-Detection** | navigator.language → matching Locale | ja |
| **User-Override** | Profil-Setting persistiert | ja |

## RTL-Support

| Frage | Antwort |
|---|---|
| **RTL nötig (Arabisch, Hebräisch, Persisch, Urdu)?** | ja / nein |
| **Wenn ja, welche Locales?** | ar-SA, he-IL, … |

Wenn RTL: CSS Logical Properties Pflicht (`margin-inline-start` statt `margin-left`).

## Timezone-Strategie

| Frage | Antwort |
|---|---|
| **DB-Storage** | UTC (`timestamptz`) |
| **Display** | User-Timezone aus Profil |
| **Default-Timezone für neuen User** | Browser-Timezone (Detection) |
| **Server-Timezone** | UTC |

## Currency-Strategie

| Frage | Antwort |
|---|---|
| **Default-Currency** | EUR |
| **Multi-Currency-Support?** | ja / nein |
| **Conversion-Service** | (z.B. exchangeratesapi.io oder fixed) |
| **Display via** | `Intl.NumberFormat(locale, { style: 'currency', currency })` |

## Translator-Workflow

### Self-Translate (Solo)
- Locale-Files händisch pflegen
- `i18n:check`-Skript catch ungenutzte/fehlende Keys
- DeepL-API für Initial-Drafts möglich

### Crowdsourced (Open-Source)
- Crowdin / Lokalise / Weblate
- Locale-Files pull + push automatisiert

### Professional
- Translator-Agentur
- Glossar im Repo (`i18n/glossary.md`)

## Pluralisierung

ICU MessageFormat überall:
```json
"items.count": "{count, plural, =0 {Keine Items} one {# Item} other {# Items}}"
```

Niemals `${count} Item${count === 1 ? '' : 's'}` — funktioniert nur Englisch.

## Datums-Format

| Locale | Long-Format | Short-Format |
|---|---|---|
| de-AT | "1. Mai 2026" | "01.05.2026" |
| en-US | "May 1, 2026" | "5/1/2026" |
| en-GB | "1 May 2026" | "01/05/2026" |

Über `Intl.DateTimeFormat(locale, { dateStyle: 'long' })`.

## Edge-Cases

- **Mixed-Direction-Content** (LTR + RTL nebeneinander): `dir="auto"` auf Container
- **Zahlen in RTL**: bleiben LTR (Arabic-Indic optional)
- **Plural-Edge-Cases** (Russisch, Polnisch — komplexere Plural-Regeln): ICU regelt
- **Keine Übersetzung vorhanden**: Fallback zur Default-Locale, Sentry-Notification für Translator

## Wann später lokalisieren OK

Wenn Markt klar ist (z.B. Solo-Tool für mich) → Single-Locale anfangen, aber **i18n-Infrastruktur** trotzdem von Tag 1 (Strings in Files, kein hardcoded). Migration zu mehrsprachig ist dann trivial.

Anti-Pattern: hardcoded Strings ins Code, "i18n machen wir später" → führt zu Wochen-Refactor.
