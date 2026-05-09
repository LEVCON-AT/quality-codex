# 16 — MCP Integration

Tier-2-Doc. Lädt bei MCP-Tool-Code.

Aktiv nur wenn Onboarding "MCP-Tools: ja" gewählt hat.

## MCP-Server-Setup (in `bridge`)

```typescript
// packages/bridge/src/mcp.ts
import { McpServer } from '@modelcontextprotocol/sdk/server';
import { tools } from './tools';

export function createMcpServer() {
  const server = new McpServer({
    name: '<project>-bridge',
    version: '0.1.0',
  });

  for (const tool of tools) {
    server.tool(tool.name, tool.schema, tool.handler);
  }

  return server;
}
```

## Tool-Definition (Pattern)

```typescript
// packages/bridge/src/tools/create-task.ts
import { z } from 'zod';
import type { McpTool } from '../types';

const inputSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  due_at: z.string().datetime().optional(),
});

export const createTaskTool: McpTool<typeof inputSchema> = {
  name: 'create_task',
  description: 'Creates a new task in the current workspace',
  schema: inputSchema,
  handler: async (input, ctx) => {
    // ctx hat tenantId, userId, role aus Auth-Context
    const task = await db.insert('tasks', {
      tenant_id: ctx.tenantId,
      created_by: ctx.userId,
      ...input,
    });

    await auditLog(ctx, 'task.create', { type: 'task', id: task.id });

    return { id: task.id, title: task.title };
  },
};
```

## Auth-Context-Propagation

MCP-Server muss wissen, wer den Tool-Call macht:

```typescript
// packages/bridge/src/mcp-auth.ts
export async function authMcpRequest(req: McpRequest): Promise<RequestContext> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('UNAUTHORIZED');

  const { user } = await supabase.auth.getUser(token);
  const tenantId = req.headers['x-tenant-id'];
  const member = await db.query(
    'SELECT role FROM workspace_members WHERE tenant_id = $1 AND user_id = $2',
    [tenantId, user.id]
  );

  return {
    userId: user.id,
    tenantId,
    role: member.role,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  };
}
```

## Tool-Registry

```typescript
// packages/bridge/src/tools/index.ts
export const tools = [
  createTaskTool,
  updateTaskTool,
  listTasksTool,
  // ...
];
```

Tool-Discovery automatisch durch MCP-Server.

## Streaming-Outputs

Bei lang laufenden Tools:
```typescript
handler: async (input, ctx, stream) => {
  for (const item of items) {
    stream.write({ status: 'processing', current: item.id });
  }
  return { count: items.length };
}
```

## Error-Handling

```typescript
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk';

throw new McpError(
  ErrorCode.InvalidParams,
  'Title cannot be empty',
  { input }
);
```

User-friendly bei Permission-Errors:
```typescript
if (!hasPermission(ctx.role, 'task', 'create')) {
  throw new McpError(
    ErrorCode.PermissionDenied,
    `Role '${ctx.role}' cannot create tasks. Required: editor, admin, or owner.`
  );
}
```

## MCP-Client-Discovery

Claude-Desktop / Claude-Code findet die MCP-Server via:
- **stdio** (lokaler Prozess) — Setup via `claude_desktop_config.json`
- **HTTP/SSE** — `https://<bridge>/mcp` mit Auth-Token

Beide Modi im Template vorbereitet.

## Capability-Negotiation / Versionierung

```typescript
server.setCapabilities({
  tools: { listChanged: true },
  resources: { subscribe: true, listChanged: true },
  prompts: {},
  logging: {},
});
```

Tool-Schema-Änderungen → Bump `bridge`-Version (SemVer):
- Patch: Beschreibung, internal change
- Minor: neuer Tool, neue optionale Params
- Major: Breaking — Param-Removal, Output-Schema-Change

## Testing

```typescript
// packages/bridge/test/tools/create-task.test.ts
import { createTaskTool } from '../../src/tools/create-task';

test('createTaskTool creates task with audit log', async () => {
  const ctx = mockContext({ tenantId: 't1', userId: 'u1', role: 'editor' });
  const result = await createTaskTool.handler({ title: 'Test' }, ctx);
  expect(result.id).toBeDefined();
  expect(mockAuditLog).toHaveBeenCalledWith(ctx, 'task.create', expect.any(Object));
});
```

## Resources / Prompts

Optional zusätzlich zu Tools:
- **Resources:** Read-only-Daten exponieren (z.B. Workspace-Schema)
- **Prompts:** vordefinierte Prompt-Templates für Claude

## Audit-Log Pflicht

Jeder MCP-Tool-Call schreibt Audit-Event mit `action: 'mcp.<tool_name>'`. Bei Multi-Tenant: `tenant_id` aus Auth-Context.

## Detail

`references/claude-api-patterns.md` — Anthropic SDK Usage, MCP-Integration über SDK
