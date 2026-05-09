import { test, expect } from '@playwright/test';

const SQLI_PAYLOADS = [
  "' OR 1=1--",
  "'; DROP TABLE users--",
  '1 UNION SELECT * FROM users',
  "admin'--",
  "' OR '1'='1",
];

/**
 * SQL-Injection-Pentest. STATUS: Skelett — vor Prod implementieren.
 * test.skip() = nicht-implementiert-Signal in CI.
 */
test.describe('SQL Injection Pentest', () => {
  for (const payload of SQLI_PAYLOADS) {
    test.skip(`payload should not bypass: ${payload}`, async ({ request }) => {
      // TODO: project-specific filter/search endpoint
      const res = await request.get('/api/search', { params: { q: payload } });
      expect(res.status()).not.toBe(500);
      // No data leak
      const body = await res.json();
      expect(body).toBeDefined();
    });
  }
});
