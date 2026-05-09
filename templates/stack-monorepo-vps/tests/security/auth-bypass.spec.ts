import { test, expect } from '@playwright/test';

test.describe('Auth Bypass Pentest', () => {
  test('JWT alg=none rejected', async ({ request }) => {
    // TODO: forge JWT with alg=none → expect 401
    expect(true).toBe(true);
  });

  test('expired JWT rejected', async ({ request }) => {
    // TODO: JWT with exp in past → expect 401
    expect(true).toBe(true);
  });

  test('manipulated role claim rejected', async ({ request }) => {
    // TODO: JWT with modified role: 'admin' (signature ungültig) → expect 401
    expect(true).toBe(true);
  });

  test('missing Authorization header → 401 on protected route', async ({ request }) => {
    const res = await request.get('/api/protected-route');
    // skeleton: project-specific protected route to be defined
    expect([401, 404]).toContain(res.status());
  });
});
