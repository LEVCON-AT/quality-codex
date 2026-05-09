# Status Page Setup

## Optionen

- **Cachet** (self-hosted, free)
- **Statuspage.io** (managed, paid ab gewisser Größe — free für kleine)
- **Uptime-Kuma** (eigene Status-Page-Funktion bereits enthalten)

## Empfehlung für VPS-Variante
Uptime-Kuma's eigenes Status-Page-Feature reicht für kleine Setups — keine zusätzliche Infra.

## Komponenten

- **App** — Frontend
- **API** — Bridge
- **Database** — Postgres
- **Documentation** — Wiki

## Initial-Incident-History
Leer beim Launch. Vor Live-Schaltung bewusst leer halten.

## Public-URL
status.__DOMAIN__ — eigener Subdomain-Eintrag, eigener Let's Encrypt Cert.
