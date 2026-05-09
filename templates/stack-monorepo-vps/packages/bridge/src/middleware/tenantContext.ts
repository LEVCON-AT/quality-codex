import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Extracts tenant from subdomain or path, sets RLS context for DB queries.
 * @docs admin/setup.md#multi-tenancy
 */
export async function tenantContext(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  // TODO: extract tenant slug from req.hostname or req.url
  // TODO: validate tenant exists + user is member
  // TODO: set req.tenantId
  // TODO: SET LOCAL app.tenant_id for upcoming DB queries
  void req;
  void reply;
}
