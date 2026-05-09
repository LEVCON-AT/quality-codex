# Codex-Decisions — Projekt-Setup-Antworten

Diese Datei wird vom `/onboard-project`-Skill ausgefüllt und ist Teil von Tier-1 Pflicht-Boot. Hard-Cap: **≤ 1.000 Tokens**.

Sie sagt Claude in jeder Session, was die Projekt-Kontur ist — ohne dass Claude raten muss.

## Projekt-Identität

| Feld | Wert |
|---|---|
| **Projekt-Name** | <PLACEHOLDER> |
| **Slug** | <slug> |
| **Domain (Prod)** | https://<domain> |
| **Domain (Staging)** | https://staging.<domain> |
| **GitHub-Repo** | <org>/<slug> |
| **Codex-Version** | siehe `.codex-version` |

## Stack-Wahl

| Komponente | Wert |
|---|---|
| **Stack-Typ** | Frontend-only / Backend-only / Full-Stack-Monorepo |
| **Frontend** | SolidJS+Vite / React+Vite / nicht enthalten |
| **Mobile-App** | ja (Expo) / nein |
| **Backend** | Fastify / nicht enthalten |
| **MCP-Tools** | ja (Beispiel-Tool + Dispatcher) / nein |
| **Datastore** | Supabase (Postgres + Auth + Storage) |
| **Cache** | IndexedDB (Client-Offline) |

## Tenancy-Modell

| Feld | Wert |
|---|---|
| **Modus** | Single-Tenant / Multi-Tenant-Subdomain / Multi-Tenant-Path |
| **Tenant-Resolver** | (z.B. `subdomain.domain.tld` → tenant-slug) |

## Globalisierung

| Feld | Wert |
|---|---|
| **Default-Locale** | de-AT |
| **Aktive Locales** | de-AT, en-US |
| **RTL-Support** | nein / ja |
| **Default-Timezone** | Europe/Vienna |
| **Default-Currency** | EUR |

## Infra-Variante

| Feld | Wert |
|---|---|
| **Variante** | VPS (Hetzner+Docker+Supabase) / Cloud (Supabase-Cloud+Vercel) |
| **VPS-Host** | (nur bei VPS) z.B. `root@xx.xx.xx.xx` |
| **Vercel/Netlify-Project** | (nur bei Cloud) z.B. `vercel-project-id` |
| **Backup-Target** | Backblaze B2 / S3 / R2 — Bucket-Name |
| **DB-Backup-Verschlüsselung** | age-public-key (Schlüssel separat im 1Password) |

## Observability

| Feld | Wert |
|---|---|
| **Error-Tracking** | Sentry self-hosted / Sentry Cloud |
| **Uptime-Monitor** | UptimeRobot / Uptime-Kuma / Healthchecks.io |
| **Status-Page** | Cachet / Statuspage.io / nicht aktiv |
| **Logs** | journalctl + logrotate / Vercel Logs |

## Mail / Domain-Reputation

| Feld | Wert |
|---|---|
| **Transactional-Mail** | Postmark / Resend / lokal (Mailpit/MailHog für Dev) |
| **Mail-Domain** | mail.<domain> |
| **DKIM/SPF/DMARC** | konfiguriert ja/nein |

## Legal/Compliance (DACH/EU)

| Feld | Wert |
|---|---|
| **Impressum-URL** | /imprint |
| **Privacy-Policy-URL** | /privacy |
| **Terms-of-Service-URL** | /terms |
| **Cookie-Consent** | ja (klaro/cookie-consent-Bibliothek) |
| **DSGVO-Subject-Request-E-Mail** | privacy@<domain> |

## Aktuelle Wave

| Feld | Wert |
|---|---|
| **Aktive Wave-Nummer** | (z.B. Wave 3) |
| **Wave-Thema** | (z.B. "User-Onboarding+Auth-Flow") |
| **Wave-Start** | 2026-MM-DD |

## Feedback-Memory-Pfad

`~/.claude/projects/<projekt-slug>/memory/` — projekt-spezifische Lernerfahrungen, getrennt vom Code.
