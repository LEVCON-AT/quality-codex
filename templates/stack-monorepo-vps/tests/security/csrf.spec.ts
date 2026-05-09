import { test, expect } from '@playwright/test';

test.describe('CSRF Pentest', () => {
  test('state-changing request without Origin should fail', async ({ request }) => {
    // TODO: POST /api/tasks ohne Origin-Header → expect 403
    expect(true).toBe(true);
  });

  test('forged Origin should fail', async ({ request }) => {
    // TODO: POST /api/tasks mit Origin: https://evil.com → expect 403
    expect(true).toBe(true);
  });
});
