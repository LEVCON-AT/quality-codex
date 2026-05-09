import { i18next } from './index.js';

/**
 * Tiny translation helper — for production use @solid-primitives/i18n or i18next-react.
 * @docs getting-started/concepts.md#i18n
 */
export function useTranslation() {
  return (key: string, vars?: Record<string, string | number>) => i18next.t(key, vars);
}
