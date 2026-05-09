import { test, expect } from '@playwright/test';

const XSS_PAYLOADS = [
  '<script>window.__xss_triggered=1</script>',
  '<img src=x onerror="window.__xss_triggered=1">',
  'javascript:window.__xss_triggered=1',
  '"><svg onload="window.__xss_triggered=1">',
  '<iframe src="javascript:window.__xss_triggered=1"></iframe>',
];

/**
 * XSS-Injection-Pentest — gegen alle User-Input-Felder.
 *
 * STATUS: Skelett. Vor Production-Deploy MUSS das vollständig implementiert sein.
 * Die test.skip()-Wrapper sind Pflichtsignal in CI: noch nicht abgesichert.
 *
 * Implementierungs-Schritte:
 * 1. Liste aller User-Input-Routes (Search, Forms, URL-Params)
 * 2. Pro Route: Login als test-user, Payload einsetzen, Response prüfen
 * 3. expect: kein <script>-execute, alle Outputs HTML-escaped
 * 4. test.skip → test umbenennen
 */
test.describe('XSS Injection Pentest', () => {
  for (const payload of XSS_PAYLOADS) {
    test.skip(`payload should not execute: ${payload.slice(0, 30)}...`, async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        (window as unknown as { __xss_triggered: number }).__xss_triggered = 0;
      });
      // TODO: project-specific input + submit
      // await page.fill('input[name="search"]', payload);
      // await page.click('button[type="submit"]');
      const triggered = await page.evaluate(
        () => (window as unknown as { __xss_triggered: number }).__xss_triggered,
      );
      expect(triggered).toBe(0);
    });
  }
});
