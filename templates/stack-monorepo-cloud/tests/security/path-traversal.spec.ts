import { test, expect } from '@playwright/test';

const TRAVERSAL_PAYLOADS = [
  '../../etc/passwd',
  '..\\..\\..\\Windows\\System32',
  '%2e%2e%2f%2e%2e%2f',
  '....//....//etc/passwd',
];

/**
 * Path-Traversal-Pentest. STATUS: Skelett.
 */
test.describe('Path Traversal Pentest', () => {
  for (const payload of TRAVERSAL_PAYLOADS) {
    test.skip(`payload blocked: ${payload}`, async ({ request }) => {
      // TODO: GET /api/files/<payload> → expect 400/403
      expect(request).toBeDefined();
    });
  }
});
