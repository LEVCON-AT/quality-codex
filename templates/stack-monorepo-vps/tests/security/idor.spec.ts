import { test, expect } from '@playwright/test';

test.describe('IDOR Pentest', () => {
  test('User-A cannot access User-B resource', async ({ request }) => {
    // TODO: 1. Create User-A, login, create resource → resource_id
    // TODO: 2. Login as User-B
    // TODO: 3. GET /api/resources/<resource_id> → expect 403/404
    expect(true).toBe(true); // skeleton
  });

  test('Tenant-A cannot access Tenant-B resource', async ({ request }) => {
    // TODO: cross-tenant ID-manipulation
    expect(true).toBe(true);
  });
});
