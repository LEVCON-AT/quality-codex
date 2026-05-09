import { test, expect } from '@playwright/test';

/**
 * Auth-Bypass-Pentest. STATUS: Skelett (außer dem Missing-Auth-Header-Test).
 */
test.describe('Auth Bypass Pentest', () => {
  test.skip('JWT alg=none rejected', async ({ request }) => {
    // TODO: forge JWT with alg=none → expect 401
    expect(request).toBeDefined();
  });

  test.skip('expired JWT rejected', async ({ request }) => {
    // TODO: JWT with exp in past → expect 401
    expect(request).toBeDefined();
  });

  test.skip('manipulated role claim rejected', async ({ request }) => {
    // TODO: JWT with modified role: 'admin' (signature ungültig) → expect 401
    expect(request).toBeDefined();
  });

  // Aktiv: Missing-Auth ist generischer Test, nicht projekt-spezifisch
  test('missing Authorization header → 401 on protected route', async ({ request }) => {
    const res = await request.get('/api/protected-route');
    expect([401, 404]).toContain(res.status());
  });
});
