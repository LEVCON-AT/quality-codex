# Sentry Setup

## Self-hosted (VPS)
Sentry läuft als zusätzlicher Docker-Container neben Supabase. Setup:
- https://develop.sentry.dev/self-hosted/
- Container ergänzen in `infra/supabase/docker-compose.yml` als separater Service
- DSN nach Setup in `.env` als `SENTRY_DSN`

## Cloud
Account auf https://sentry.io/, Projekt erstellen, DSN kopieren in `.env`.

## Source-Maps
Bei Frontend-Build: source-maps deployen damit Stack-Traces lesbar sind:
```bash
SENTRY_AUTH_TOKEN=... \
sentry-cli releases new $(git rev-parse HEAD) \
sentry-cli releases files $(git rev-parse HEAD) upload-sourcemaps packages/client-web/dist
```

## Alert-Channel
Slack/Discord-Webhook konfigurieren in Sentry → Alert-Rules.
