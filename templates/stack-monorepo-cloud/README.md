# Cloud Template (Supabase-Cloud + Vercel)

Identische Workspace-Struktur wie VPS-Template, aber mit folgenden Unterschieden:

## Was anders ist

| Bereich | VPS | Cloud |
|---|---|---|
| **DB** | Self-hosted Postgres in Docker | Supabase Cloud (managed) |
| **Auth** | Supabase Auth in Docker | Supabase Cloud Auth |
| **Storage** | Supabase Storage in Docker | Supabase Cloud Storage |
| **Frontend-Hosting** | nginx + rsync | Vercel (Edge-CDN, serverless) |
| **Backend-Hosting** | Bridge auf VPS via systemd | Bridge auf Vercel oder Fly.io |
| **CI/CD-Deploy** | SSH + rsync | Vercel-CLI + Supabase-CLI |
| **Backup** | age-encrypted pg_dump → B2 | Supabase Cloud Daily-Backups (Pro Plan) + zusätzliches `supabase db dump` weekly |
| **Monitoring** | Self-hosted Sentry | Sentry Cloud |
| **Skripte** | `infra/scripts/{deploy,backup,ssh-hardening,...}` | `infra/scripts/{vercel-deploy,supabase-backup,...}` |

## Was gleich ist

- Manifesto-Docs (`docs/claude/`)
- Code-Quality-Standards
- HyperUI / Token-System / i18n / RBAC
- Pentest-Suite, Doc-Link-Check, Boot-Verify
- BACKLOG.md / CLAUDE.md / Workflow

## Vercel-Konfiguration

`vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "packages/client-web/dist",
  "framework": null,
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]}
  ]
}
```

## Supabase-Cloud-Setup

1. Projekt für Staging + Prod in https://supabase.com erstellen
2. Region EU (Frankfurt) für DSGVO-Compliance
3. JWT-Secret + DB-Password im 1Password
4. Migration via `supabase db push --include-all`
5. Edge-Functions: `supabase functions deploy <name>`

## Backup (Cloud-Variante)

- **Supabase Cloud's Daily-Backup** (7 Tage Retention auf Pro)
- **Zusätzlich wöchentliches `supabase db dump`** → S3/R2 (für Off-Site, längere Retention)
- **Point-in-Time-Recovery** auf Pro+ verfügbar (RPO <1min)

## Status

Skelett-Stub für v1.0. Volle Implementierung in v1.1 (Codex-Roadmap).

## Migration VPS ↔ Cloud

Wenn ein bestehendes Projekt zwischen Varianten wechselt:
1. ADR mit Migration-Plan
2. DB-Dump aus alter Variante
3. Restore in neue Variante
4. DNS-Cutover (kurze Downtime)
5. Smoketest beide Seiten

Aufwand: 1-2 Tage je nach Datenmodell.
