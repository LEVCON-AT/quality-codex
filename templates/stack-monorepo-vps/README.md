# __PROJECT_NAME__

> Created from [Quality-Coding-Codex](https://github.com/__GH_ORG__/quality-codex) v1.0.0

## Quick-Start

```bash
# Install
pnpm install

# Dev (alle Workspaces parallel)
pnpm dev

# Tests
pnpm test

# Typecheck + Lint
pnpm typecheck
pnpm lint

# Boot-Self-Test (Claude-Tokens)
pnpm boot:verify

# Doc-Link-Check
pnpm docs:check
```

## Workspaces

```
packages/
├── client-web/         ← SolidJS + Vite + PWA (Web-App)
├── client-mobile/      ← Expo (optional, im Onboarding gewählt)
├── bridge/             ← Fastify + WebSocket + MCP-Server
├── shared/             ← Type-Hub mit Zod-Schemas
└── docs-wiki/          ← VitePress (User-Doku)

infra/
├── supabase/           ← Docker-Compose + Migrations
├── nginx/              ← Reverse-Proxy + Security-Headers
├── scripts/            ← Deploy, Backup, Hardening
└── services/           ← Edge-Functions (optional)
```

## Stack

- **Runtime:** Node.js 22+, pnpm 9+
- **Frontend:** SolidJS + Vite + Tailwind + HyperUI
- **Backend:** Fastify (HTTP+WS+MCP)
- **Database:** Supabase (Postgres 15) self-hosted via Docker
- **Type-Safety:** TypeScript strict, Biome (lint+format)
- **Tests:** Vitest + Playwright (E2E + Pentest)
- **Docs:** VitePress
- **CI:** GitHub Actions
- **Deploy:** SSH + rsync + Docker-Compose

## Pipeline

```
develop (Auto-Deploy → Staging)
   ↑
   PR + Squash-Merge
   ↓
feat/wave-N-item-X-...

main (PR + Manual-Approval → Prod)
   ↑
   PR develop → main + Pre-Release-Checkliste
```

## Wichtige Docs

- [CLAUDE.md](./CLAUDE.md) — Foundation-Manifesto Boot
- [BACKLOG.md](./BACKLOG.md) — Wave-Sprint-Plan
- [docs/claude/](./docs/claude/) — 16 Manifesto-Docs (Tier-1/2/3)
- [docs/runbooks/](./docs/runbooks/) — Deploy, Rollback, Backup, Incidents
- [checklists/](./checklists/) — Pre-Merge, Pre-Release, Security, A11y, i18n

## Support

- E-Mail: support@__DOMAIN__
- DSGVO-Anfragen: privacy@__DOMAIN__

## License

(Siehe LICENSE)
