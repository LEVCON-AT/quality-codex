import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { healthRoute } from './routes/health.js';
import { authMiddleware } from './middleware/auth.js';

/**
 * Main entry point — boots HTTP + WebSocket + MCP server.
 * @docs admin/setup.md#bridge
 */
async function main() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
    bodyLimit: 1024 * 1024, // 1MB
    trustProxy: true,
  });

  await app.register(cors, {
    origin: config.CORS_ORIGINS,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(healthRoute);

  // Auth-Middleware für alle /api-Routes
  app.addHook('preHandler', authMiddleware);

  // TODO: WebSocket + MCP-Server registrieren

  const port = config.PORT;
  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Bridge listening on :${port}`);
}

main().catch((err) => {
  // biome-ignore lint/suspicious/noConsole: bootstrap error before logger ready
  console.error('Bridge startup failed:', err);
  process.exit(1);
});
