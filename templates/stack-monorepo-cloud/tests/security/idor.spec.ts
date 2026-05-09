import { test, expect } from '@playwright/test';

/**
 * IDOR-Pentest. STATUS: Skelett.
 * Implementierung: 2 Test-User anlegen, Resource-Cross-Access verifizieren.
 */
test.describe('IDOR Pentest', () => {
  test.skip('User-A cannot access User-B resource', async ({ request }) => {
    // TODO: Create User-A + login + create resource
    // TODO: Login as User-B
    // TODO: GET /api/resources/<resource_id>
    // expect 403 or 404
    expect(request).toBeDefined();
  });

  test.skip('Tenant-A cannot access Tenant-B resource', async ({ request }) => {
    // TODO: Cross-tenant ID-manipulation test
    expect(request).toBeDefined();
  });
});
