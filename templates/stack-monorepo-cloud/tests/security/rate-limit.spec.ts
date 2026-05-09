import { test, expect } from '@playwright/test';

test.describe('Rate Limit Pentest', () => {
  test.skip('100 login attempts in 1 min → some return 429', async ({ request }) => {
    const responses: number[] = [];
    for (let i = 0; i < 100; i++) {
      const res = await request.post('/api/auth/login', {
        data: { email: `attacker${i}@x`, password: 'wrong' },
      });
      responses.push(res.status());
    }
    expect(responses.filter((s) => s === 429).length).toBeGreaterThan(0);
  });
});
