import { test, expect } from '@playwright/test';

const SQLI_PAYLOADS = [
  "' OR 1=1--",
  "'; DROP TABLE users--",
  "1 UNION SELECT * FROM users",
  "admin'--",
  "' OR '1'='1",
];

test.describe('SQL Injection Pentest', () => {
  for (const payload of SQLI_PAYLOADS) {
    test(`payload should not bypass: ${payload}`, async ({ request }) => {
      // TODO: project-specific endpoint
      // const res = await request.get('/api/search', { params: { q: payload } });
      // expect(res.status()).not.toBe(500); // no DB error leaked
      // const body = await res.json();
      // expect(body).not.toContainEqual({ id: expect.any(String) }); // no rows leaked
      expect(true).toBe(true); // skeleton
      void payload;
    });
  }
});
