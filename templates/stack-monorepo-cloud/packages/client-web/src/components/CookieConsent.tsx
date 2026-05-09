import type { Component } from 'solid-js';
import { createSignal, Show, onMount } from 'solid-js';
import { Button } from './ui/Button.js';
import { useTranslation } from '../i18n/useTranslation.js';

const STORAGE_KEY = 'cookie-consent';

type Consent = {
  essential: true;
  analytics: boolean;
  decided_at: string;
};

/**
 * Cookie-Consent Banner — DSGVO-konform.
 * Pre-Tick verboten, granulare Auswahl, easy withdrawal.
 * @docs admin/setup.md#cookie-consent
 */
export const CookieConsent: Component = () => {
  const t = useTranslation();
  const [show, setShow] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setShow(true);
  });

  function save(analytics: boolean) {
    const consent: Consent = {
      essential: true,
      analytics,
      decided_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setShow(false);
    // Dispatch event so other components can react (e.g., load Plausible)
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  }

  return (
    <Show when={show()}>
      <section
        role="region"
        aria-labelledby="cookie-banner-title"
        class="fixed bottom-0 left-0 right-0 z-[var(--z-notification)] bg-white shadow-lg border-t p-6"
      >
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex-1">
            <h2 id="cookie-banner-title" class="font-semibold mb-1">
              {t('cookie.title')}
            </h2>
            <p id="cookie-banner-text" class="text-sm text-gray-600">
              {t('cookie.text')}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={() => save(false)}>
              {t('cookie.essential_only')}
            </Button>
            <Button variant="primary" size="sm" onClick={() => save(true)}>
              {t('cookie.accept_all')}
            </Button>
          </div>
        </div>
      </section>
    </Show>
  );
};

export function getCookieConsent(): Consent | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearCookieConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}
