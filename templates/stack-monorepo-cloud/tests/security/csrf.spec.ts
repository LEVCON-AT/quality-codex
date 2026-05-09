import { test, expect } from '@playwright/test';

/**
 * CSRF-Pentest. STATUS: Skelett.
 */
test.describe('CSRF Pentest', () => {
  test.skip('state-changing request without Origin should fail', async ({ request }) => {
    // TODO: POST /api/tasks ohne Origin-Header → expect 403
    expect(request).toBeDefined();
  });

  test.skip('forged Origin should fail', async ({ request }) => {
    // TODO: POST mit Origin: https://evil.com → expect 403
    expect(request).toBeDefined();
  });
});
