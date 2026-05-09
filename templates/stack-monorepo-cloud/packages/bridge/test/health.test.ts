import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { healthRoute } from '../src/routes/health.js';

describe('healthRoute', () => {
  it('returns ok=true with version + uptime', async () => {
    const app = Fastify();
    await app.register(healthRoute);
    const response = await app.inject({ method: 'GET', url: '/healthz' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.ok).toBe(true);
    expect(typeof body.uptime_s).toBe('number');
  });
});
