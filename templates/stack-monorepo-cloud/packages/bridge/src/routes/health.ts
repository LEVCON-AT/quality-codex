import type { FastifyInstance } from 'fastify';

const startedAt = Date.now();

/**
 * Healthcheck endpoint — used by uptime-monitor + load-balancer.
 * @docs admin/monitoring.md#healthcheck
 */
export async function healthRoute(app: FastifyInstance): Promise<void> {
  app.get('/healthz', async () => ({
    ok: true as const,
    version: process.env.npm_package_version ?? '0.0.0',
    uptime_s: Math.floor((Date.now() - startedAt) / 1000),
  }));
}
