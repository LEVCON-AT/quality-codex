import type { Component } from 'solid-js';
import { useTranslation } from './i18n/useTranslation.js';
import { Button } from './components/ui/Button.js';
import { CookieConsent } from './components/CookieConsent.js';

/**
 * Root component — shows welcome page with i18n + HyperUI Button + Cookie-Consent.
 * @docs getting-started/first-login.md
 */
export const App: Component = () => {
  const t = useTranslation();

  return (
    <>
      <main class="min-h-screen flex items-center justify-center p-8">
        <div class="max-w-md text-center">
          <h1 class="text-3xl font-bold mb-4">{t('welcome.title')}</h1>
          <p class="text-gray-600 mb-8">{t('welcome.subtitle')}</p>
          <Button variant="primary" onClick={() => alert(t('welcome.cta_clicked'))}>
            {t('welcome.cta')}
          </Button>
        </div>
      </main>
      <CookieConsent />
    </>
  );
};
