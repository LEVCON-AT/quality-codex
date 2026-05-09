import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Validates JWT auth header. Public routes (/healthz) are skipped.
 * @docs admin/setup.md#auth
 */
export async function authMiddleware(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  // Public routes — no auth required
  if (req.url === '/healthz' || req.url.startsWith('/public/')) {
    return;
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Missing auth token', status: 401 });
    return;
  }

  // TODO: Verify JWT against SUPABASE_JWT_SECRET, set req.userId/tenantId/role
  // Skipped in skeleton — fill in after Supabase setup.
}

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    tenantId?: string;
    role?: string;
  }
}
