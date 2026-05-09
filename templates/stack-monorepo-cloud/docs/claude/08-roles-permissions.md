# 08 — Roles & Permissions

Tier-2-Doc. Lädt bei Auth/Permission-Code.

## Default-Rollen

| Rolle | Beschreibung | Default? |
|---|---|---|
| **owner** | Vollzugriff inkl. Workspace-Löschung, Member-Management | nein (durch Initial-Setup zugewiesen) |
| **admin** | Verwalten, einladen, konfigurieren — kein Workspace-Löschen | nein |
| **editor** | CRUD auf Content, kein User-Management | nein |
| **viewer** | Read-only auf Content | **ja** (Default für neue User) |
| **guest** | Beschränkter Lesen-Zugriff (z.B. einzelner geteilter Resource) | nein |

Anpassbar pro Projekt — aber Skelett ist da.

## Permission-Matrix

```typescript
// packages/shared/src/permissions.ts
export const PERMISSIONS = {
  workspace: {
    delete:         ['owner'],
    update:         ['owner', 'admin'],
    invite_member:  ['owner', 'admin'],
    view_settings:  ['owner', 'admin'],
  },
  task: {
    create:         ['owner', 'admin', 'editor'],
    update_own:     ['owner', 'admin', 'editor'],
    update_any:     ['owner', 'admin'],
    delete_own:     ['owner', 'admin', 'editor'],
    delete_any:     ['owner', 'admin'],
    view:           ['owner', 'admin', 'editor', 'viewer', 'guest'],
  },
  audit_log: {
    view:           ['owner', 'admin'],
  },
} as const;
```

## Defense-in-Depth (3 Schichten)

### 1. Frontend
```tsx
<RequireRole role={['owner', 'admin']}>
  <DeleteWorkspaceButton />
</RequireRole>
```

### 2. Backend
```typescript
// packages/bridge/src/middleware/requireRole.ts
fastify.delete('/api/workspace/:id',
  { preHandler: requireRole(['owner']) },
  async (req) => { ... }
);
```

### 3. Database (RLS)
```sql
CREATE POLICY workspace_delete ON workspaces
  FOR DELETE
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );
```

**Niemals nur eine Schicht.** Frontend-Hide schützt nicht; Backend-Check schützt nicht ohne RLS (Race-Conditions).

## Audit-Log

`audit_events`-Tabelle:
```sql
CREATE TABLE audit_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id),
  actor_id     uuid REFERENCES users(id),     -- wer
  actor_role   text,                           -- rolle zum Zeitpunkt
  action       text NOT NULL,                  -- 'workspace.delete', 'user.role_change'
  target_type  text,                           -- 'workspace', 'task'
  target_id    uuid,                           -- ID des Ziels
  meta         jsonb,                          -- weitere Details
  ip           inet,
  user_agent   text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX audit_events_tenant_created ON audit_events(tenant_id, created_at DESC);
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_view_admin ON audit_events FOR SELECT
  USING (tenant_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));
```

Pflicht-Events:
- Login / Logout / Password-Reset
- Role-Change (alt → neu, durch wen)
- Member-Invite / Member-Remove
- Permission-Grant / Permission-Revoke
- Workspace-Create / Workspace-Delete
- Sensitive-Data-Export (Art. 20 GDPR)
- Account-Deletion (Art. 17 GDPR)

## Mutation-Wrapper integriert Audit-Log

```typescript
// packages/bridge/src/middleware/auditLog.ts
export async function withAudit<T>(
  ctx: RequestContext,
  action: string,
  target: { type: string; id: string },
  fn: () => Promise<T>
): Promise<T> {
  const result = await fn();
  await db.insert('audit_events', {
    tenant_id: ctx.tenantId,
    actor_id: ctx.userId,
    actor_role: ctx.role,
    action,
    target_type: target.type,
    target_id: target.id,
    ip: ctx.ip,
    user_agent: ctx.userAgent,
  });
  return result;
}
```

## Least-Privilege

- Default-Rolle = `viewer` (least access)
- Upgrade explizit durch admin/owner
- Keine "Magic-Admin"-User-Flag — alles über Rollen
- Service-User mit minimaler Rolle (z.B. `mail-bridge` nur lesender Zugriff auf bestimmte Tabellen)

## Helpers

```typescript
// packages/shared/src/permissions.ts
export function hasPermission(
  role: Role,
  resource: keyof typeof PERMISSIONS,
  action: string
): boolean {
  return PERMISSIONS[resource][action]?.includes(role) ?? false;
}
```

## GDPR-Verzahnung

Audit-Log enthält genug Info für Art. 15 (Auskunft) — User kann anfragen "wer hat wann auf meine Daten zugegriffen".
