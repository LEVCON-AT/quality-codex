# 15 — Multi-Tenancy

Tier-2-Doc. Lädt bei Multi-Tenant-Änderungen.

Aktiv nur wenn Onboarding "Tenancy: Multi-Tenant" gewählt hat.

## Modelle

| Modus | Resolver | Use-Case |
|---|---|---|
| **Single-Tenant** | n/a | Solo-Tool, ein Kunde, ein Workspace |
| **Multi-Tenant-Subdomain** | `<tenant>.app.example.com` | SaaS mit Branding, Cookie-Isolation |
| **Multi-Tenant-Path** | `app.example.com/<tenant>/...` | SaaS ohne Subdomain-Setup |

Wahl in `00-codex-decisions.md`.

## Schema-Pattern

### `tenants`-Tabelle

```sql
CREATE TABLE tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,        -- für URL/Subdomain
  name        text NOT NULL,
  plan        text NOT NULL DEFAULT 'free',
  status      text NOT NULL DEFAULT 'active',  -- active/suspended/deleted
  created_at  timestamptz DEFAULT now(),
  deleted_at  timestamptz
);
```

### `tenant_id`-Spalte Pflicht

In **jeder** Tabelle (außer `tenants` selbst):

```sql
CREATE TABLE tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id),
  -- ... weitere Felder
);

CREATE INDEX tasks_tenant ON tasks(tenant_id);
```

### RLS-Tenant-Isolation

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;

CREATE POLICY tasks_tenant_isolation ON tasks
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

`app.tenant_id` wird vom Backend pro Request gesetzt (siehe `tenantContext.ts`-Middleware).

## Backend-Middleware

```typescript
// packages/bridge/src/middleware/tenantContext.ts
export async function tenantContext(req: FastifyRequest) {
  const tenantSlug = extractTenantSlug(req);  // aus Subdomain oder Path
  const tenant = await db.query('SELECT id FROM tenants WHERE slug = $1 AND status = $2', [tenantSlug, 'active']);
  if (!tenant) throw new ApiError('TENANT_NOT_FOUND', 404);

  // User muss Member sein
  const member = await db.query(
    'SELECT role FROM workspace_members WHERE tenant_id = $1 AND user_id = $2',
    [tenant.id, req.user.id]
  );
  if (!member) throw new ApiError('FORBIDDEN', 403);

  req.tenantId = tenant.id;
  req.role = member.role;

  // RLS-Context setzen für DB-Queries dieser Request
  await db.query("SELECT set_config('app.tenant_id', $1, true)", [tenant.id]);
}
```

Registriert als `preHandler` für alle authentifizierten Routes.

## Frontend-Context

```typescript
// packages/client-web/src/lib/tenant.ts
export const tenant = createMemo(() => {
  // aus URL extrahieren
  return extractTenantFromUrl(window.location);
});
```

Alle Supabase-Calls automatisch mit Tenant-Context (via Auth-JWT-Claims).

## Tenant-Onboarding (User-Sicht)

1. User registriert sich → `users`-Eintrag (tenant-agnostisch)
2. User erstellt ersten Workspace → wird **owner** dieses Tenants
3. User lädt weitere Member ein → wird **admin/editor/viewer**
4. Subdomain/Path konfiguriert → User kann Workspace teilen

## Tenant-Offboarding

- **Suspend:** `tenants.status = 'suspended'` → Login möglich, Data read-only
- **Soft-Delete:** `tenants.deleted_at = now()` → Data noch da, aber unzugänglich
- **Hard-Delete:** nach Retention (30d Default) → cascade delete

## Cross-Tenant-Admin-Tooling

System-Admin (z.B. Support-Team) kann Tenants übergreifend einsehen:
- Eigene Tabelle `system_admins(user_id)` — niemals via Rolle in `workspace_members`
- Bypass-RLS via `service_role`-JWT
- Audit-Log: jede Cross-Tenant-Aktion geloggt
- UI in separater Admin-App (`packages/admin-web/`, optional)

## Per-Tenant-Backup-Granularität

Restore eines einzelnen Tenants ohne Anderen zu beeinträchtigen:
```bash
infra/scripts/backup-tenant.sh --tenant-slug acme-corp
infra/scripts/restore-tenant.sh --tenant-slug acme-corp --backup 2026-05-01
```

Implementiert via `pg_dump` mit `WHERE tenant_id = ...` pro Tabelle.

## Pricing / Plans

Wenn Plan-Logic gebraucht:
- `tenants.plan` enum (`free`, `pro`, `enterprise`)
- `plan_limits`-Tabelle mit Quotas (max-users, max-storage, max-api-calls)
- Quota-Check-Middleware blockt Operations bei Überschreitung
- Stripe-Integration (siehe `references/stripe-patterns.md` — TODO v1.1)

## Migration: Single → Multi

Wenn Projekt single-tenant startet und später multi-tenant wird:
1. ADR mit Migration-Plan
2. Default-Tenant erstellen, alle Daten migrieren (`UPDATE x SET tenant_id = '<default>'`)
3. RLS-Policies aktivieren
4. UI mit Tenant-Switcher ausstatten
5. Testprotokoll für jede Cross-Tenant-Isolation

Aufwand: 2-4 Wochen je nach Datenmodell.
