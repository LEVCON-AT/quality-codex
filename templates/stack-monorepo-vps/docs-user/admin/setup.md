# Admin: Setup

(Self-Hosted-Anleitung — überspringen wenn Cloud-gehostet)

## Voraussetzungen

- VPS mit ≥ 2 vCPU, 4 GB RAM, 40 GB Disk
- Ubuntu 22.04 LTS (oder vergleichbar)
- Root-Zugriff
- Domain mit DNS-Kontrolle

## Schritte

1. SSH-Hardening: `bash infra/scripts/ssh-hardening.sh 2222`
2. Docker installieren: `apt install docker.io docker-compose-plugin`
3. Repo klonen nach `/opt/__SLUG__`
4. `.env` befüllen aus `.env.example`
5. `docker compose -f infra/supabase/docker-compose.yml up -d`
6. Migration: `bash infra/scripts/supabase-migrate.sh`
7. nginx + Let's Encrypt: siehe `infra/nginx/`
8. Bridge starten via systemd-Service
9. Smoketest: `bash infra/scripts/smoketest.sh prod`

Detail: `docs/runbooks/deploy.md`.

## MCP-Tools {#mcp-tools}

Bridge stellt MCP-Tools auf `https://__DOMAIN__/mcp` bereit. Konfiguration siehe `docs/claude/16-mcp-integration.md`.

## Auth {#auth}

Supabase-Auth mit JWT-Cookies, RLS aktiv. Detail: `docs/claude/06-security.md`.

## Multi-Tenancy {#multi-tenancy}

Wenn aktiv: `tenant_id` in jeder Tabelle, RLS isoliert. Detail: `docs/claude/15-multi-tenancy.md`.
