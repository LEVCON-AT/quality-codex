import { test, expect } from '@playwright/test';

const XSS_PAYLOADS = [
  '<script>window.__xss_triggered=1</script>',
  '<img src=x onerror="window.__xss_triggered=1">',
  'javascript:window.__xss_triggered=1',
  '"><svg onload="window.__xss_triggered=1">',
  '<iframe src="javascript:window.__xss_triggered=1"></iframe>',
];

test.describe('XSS Injection Pentest', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      // biome-ignore lint/suspicious/noExplicitAny: test setup
      (window as any).__xss_triggered = 0;
    });
  });

  for (const payload of XSS_PAYLOADS) {
    test(`payload should not execute: ${payload.slice(0, 30)}...`, async ({ page }) => {
      // TODO: replace with project-specific input fields
      // await page.fill('input[name="search"]', payload);
      // await page.click('button[type="submit"]');
      // const triggered = await page.evaluate(() => (window as any).__xss_triggered);
      // expect(triggered).toBe(0);
      expect(true).toBe(true); // skeleton — fill in for project
    });
  }
});
