import { z } from 'zod';

export const Role = z.enum(['owner', 'admin', 'editor', 'viewer', 'guest']);
export type Role = z.infer<typeof Role>;

export const TenantId = z.string().uuid();
export type TenantId = z.infer<typeof TenantId>;

export const UserId = z.string().uuid();
export type UserId = z.infer<typeof UserId>;

export const RequestContext = z.object({
  userId: UserId,
  tenantId: TenantId,
  role: Role,
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});
export type RequestContext = z.infer<typeof RequestContext>;

export const AuditEvent = z.object({
  id: z.string().uuid(),
  tenant_id: TenantId,
  actor_id: UserId.nullable(),
  actor_role: Role.nullable(),
  action: z.string(),
  target_type: z.string().nullable(),
  target_id: z.string().uuid().nullable(),
  meta: z.record(z.unknown()).nullable(),
  ip: z.string().nullable(),
  user_agent: z.string().nullable(),
  created_at: z.string().datetime(),
});
export type AuditEvent = z.infer<typeof AuditEvent>;
