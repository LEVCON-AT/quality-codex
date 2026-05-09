# 07 — Globalization (i18n / l10n)

Tier-2-Doc. Lädt bei i18n-Strings, Datum/Zeit/Währung-Code.

## Prinzip: i18n von Tag 1

Selbst bei nur einer Sprache — **niemals** hardcoded User-facing Strings im Code.

## Tech-Stack

- **Frontend:** `i18next` + `react-i18next` (oder `@solid-primitives/i18n` für Solid)
- **ICU MessageFormat** für Pluralisierung + Geschlecht
- **Intl.\*** APIs für Datum/Zeit/Zahl/Währung
- **CSS Logical Properties** für RTL-Bereitschaft

## Locale-Codes — BCP 47

Immer Region-spezifisch:
- ✓ `de-AT`, `de-DE`, `de-CH`
- ✓ `en-US`, `en-GB`
- ❌ `de`, `en` (zu unspezifisch)

## File-Struktur

```
packages/client-web/src/i18n/
├── index.ts                      ← i18next-Init + Loader
├── locales/
│   ├── de-AT/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── tasks.json
│   │   └── errors.json
│   └── en-US/
│       ├── common.json
│       ├── auth.json
│       ├── tasks.json
│       └── errors.json
└── README.md                     ← Translator-Hinweise
```

## ICU MessageFormat — Beispiele

```json
{
  "items.count": "{count, plural, =0 {Keine Items} one {# Item} other {# Items}}",
  "user.greeting": "{gender, select, male {Willkommen, Herr {name}} female {Willkommen, Frau {name}} other {Willkommen, {name}}}!",
  "task.due": "Fällig am {date, date, long}"
}
```

## Datum / Zeit

- **DB:** `timestamptz` (UTC)
- **Display:** `Intl.DateTimeFormat(locale, { timeZone: userTz, ... })`
- **Niemals:** `new Date().toLocaleString()` ohne Locale-Argument
- **User-Timezone:** aus User-Profil (Default: Browser-Timezone)
- **ISO 8601** für API-Verträge

```typescript
// ✓
new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: userTimezone
}).format(date);

// ❌
date.toLocaleString();
```

## Zahlen / Währung

```typescript
// ✓
new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
}).format(99.95);

// ❌
`${value.toFixed(2)} €`
```

## RTL-Bereitschaft

CSS Logical Properties:
- ✓ `margin-inline-start`, `padding-block-end`, `border-inline-end`
- ❌ `margin-left`, `padding-bottom`, `border-right`

HTML:
- `<html lang="de-AT" dir="ltr">` (oder `dir="auto"` für mixed content)
- Bei RTL-Locale: `dir="rtl"` setzen, Layout flippt automatisch

## Lint-Pflicht

`scripts/check-no-hardcoded-strings.ts` — Custom-Skript scannt:
- JSX-TextContent
- HTML-Attribute (`title`, `aria-label`, `placeholder`, `alt`)
- String-Literals in Throw/Toast/Alert

Whitelist via `// i18n-ignore: <reason>`-Kommentar.

## Sprach-Auswahl

- **Browser-Default** beim ersten Besuch (`navigator.language`)
- **User-Override** persistiert in Profil + LocalStorage
- **Fallback** auf Default-Locale bei fehlenden Übersetzungen
- **Lazy-Load** Locale-Dateien (Code-Splitting)

## Translator-Workflow

- `npm run i18n:extract` extrahiert Keys aus Code → Locale-Files
- `npm run i18n:check` warnt bei fehlenden Keys, ungenutzten Keys, unklaren Plural-Strings
- Übersetzungen via Crowdin / Lokalise (Codex-agnostic) oder direkt im Repo

## Currency-Formatierung

```typescript
formatCurrency(99.95, 'EUR', 'de-AT')  // "99,95 €"
formatCurrency(99.95, 'USD', 'en-US')  // "$99.95"
```

Helper in `packages/shared/src/i18n.ts` — eine Funktion, kein Doublet.

## Error-Messages i18n-fähig

Backend liefert **Error-Codes**, Frontend übersetzt:
```typescript
// Backend
throw new ApiError('AUTH_INVALID_CREDENTIALS', 401);

// Frontend
toast.error(t('errors.auth.invalid_credentials'));
```

Kein hardcoded "Login failed" im Backend.
