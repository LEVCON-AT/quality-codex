import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Role } from '@__SLUG__/shared/types';

/**
 * Middleware factory — gate routes by role allowlist.
 * @docs admin/user-management.md#permissions
 */
export function requireRole(allowed: Role[]) {
  return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!req.role) {
      reply.code(401).send({ code: 'UNAUTHORIZED', message: 'No role context', status: 401 });
      return;
    }
    if (!allowed.includes(req.role as Role)) {
      reply.code(403).send({
        code: 'FORBIDDEN',
        message: `Role '${req.role}' not allowed. Required: ${allowed.join(', ')}`,
        status: 403,
      });
    }
  };
}
