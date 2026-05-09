# 01 — Architecture

Tier-2-Doc. Lädt bei DB/Schema-Änderungen (`migrations/`, `*.sql`) oder Architektur-Diskussionen.

## Atom-Zwiebel — ECS-basiertes Datenmodell

Inspiriert von Matrix' bewährter Schichten-Struktur. **Anwendbar auf jede Domain mit "viele Sichten auf wenige Aggregate-Roots".**

### Layer-Modell

| Layer | Inhalt | Beispiele |
|---|---|---|
| **0** | Aggregate-Roots — primäre Entitäten | `users`, `tasks`, `documents` |
| **1** | Manifestations — polymorphe Sichten auf Layer-0 | `task_kanban_view`, `task_calendar_view` |
| **2** | Metadaten — Tags, Pins, Dependencies | `task_tags`, `task_dependencies` |
| **3** | Rules — wenn-dann-Logik (optional, oft Phase 2) | `automation_rules` |
| **4** | Annotations — Comments, Attachments | `comments`, `attachments` |

### Schema-Quad

Jede Entität hat **vier synchrone Artefakte** — Doublet-Verbot gilt auch hier:

1. **Schema** (`migrations/*.sql`) — Tabellendefinition + RLS-Policies
2. **Mutations** — Backend-Service-Functions, die schreiben (mit Audit-Log)
3. **MCP-Tools** (falls Bridge enthalten) — automatisierbare Operations
4. **Export/Import** — Serialisierungs-Schemas

Schema-Quad-Disziplin: bei jeder Schema-Änderung alle 4 Artefakte mit-anpassen oder ADR begründet warum nicht.

## Multi-Tenant-Pattern (wenn aktiv)

- **`tenant_id`-Spalte Pflicht** in jeder Tabelle (außer `tenants` selbst)
- **RLS-Policy Pflicht:** `USING (tenant_id = current_setting('app.tenant_id')::uuid)`
- **Bridge/Backend-Middleware** setzt `app.tenant_id` aus Auth-Context
- Detail siehe `15-multi-tenancy.md`

## Versions-Strategie (SemVer 2.0)

- **MAJOR** breaking, **MINOR** feature, **PATCH** fix
- API-Endpoints mit `/v1/`, `/v2/` versionieren
- DB-Migrationen idempotent + monoton-wachsend (000_init, 001_add_x, 002_…)
- Client-Side `DB_VERSION` für IndexedDB-Cache
- CHANGELOG.md auto-generiert via `release-please` aus Conventional Commits

## API-Verträge (OpenAPI 3.1)

- HTTP-Endpoints: OpenAPI-Spec auto-generiert (Fastify + `@fastify/swagger`)
- WebSocket-Messages: Zod-Schemas in `packages/shared/src/protocol.ts`
- MCP-Tools: Zod-Input/Output, automatisch Capability-Discovery

## Aggregat-vs-Manifestation Entscheidungs-Hilfe

Vor neuer Tabelle fragen:
1. Hat das Ding eine eigene Lebenszyklus (Create/Update/Delete unabhängig)? → Layer 0
2. Ist es eine Sicht / View auf Layer-0-Daten? → Layer 1
3. Ist es Metadaten zu einem Layer-0-Item? → Layer 2

**Niemals** zwei Tabellen für dieselbe Domain — Schema-Quad wird inkonsistent.

## Detail-Reasoning

`docs/references/supabase-patterns.md` — RLS, Auth-SSR, Realtime, Storage, Edge-Functions
`docs/references/postgres-best-practices.md` — Indexing, JSONB, Pooling
