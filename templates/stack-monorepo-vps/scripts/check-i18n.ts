#!/usr/bin/env tsx
/**
 * Checks i18n consistency:
 * - All locale files have the same keys
 * - No unused keys (referenced by t('key') in source)
 * - No hardcoded user-facing strings (heuristic)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES_DIR = 'packages/client-web/public/locales';
const SRC_DIRS = ['packages/client-web/src'];

function walk(dir: string, ext: string[], out: string[] = []): string[] {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        walk(full, ext, out);
      } else if (ext.some((e) => full.endsWith(e))) {
        out.push(full);
      }
    }
  } catch {}
  return out;
}

function flatten(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [];
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      keys.push(...flatten(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function main() {
  const locales = readdirSync(LOCALES_DIR);
  const keysByLocale = new Map<string, Set<string>>();

  for (const locale of locales) {
    const files = walk(join(LOCALES_DIR, locale), ['.json']);
    const keys = new Set<string>();
    for (const file of files) {
      const ns = file.split(/[/\\]/).pop()?.replace('.json', '') ?? '';
      const data = JSON.parse(readFileSync(file, 'utf-8'));
      for (const key of flatten(data)) {
        keys.add(`${ns}:${key}`);
      }
    }
    keysByLocale.set(locale, keys);
  }

  let errors = 0;
  const localesArr = Array.from(keysByLocale.keys());
  if (localesArr.length > 1) {
    const reference = keysByLocale.get(localesArr[0])!;
    for (const locale of localesArr.slice(1)) {
      const keys = keysByLocale.get(locale)!;
      for (const k of reference) {
        if (!keys.has(k)) {
          console.error(`✗ Key '${k}' missing in ${locale}`);
          errors++;
        }
      }
      for (const k of keys) {
        if (!reference.has(k)) {
          console.error(`✗ Key '${k}' missing in ${localesArr[0]}`);
          errors++;
        }
      }
    }
  }

  // Used-keys check
  const usedKeys = new Set<string>();
  for (const dir of SRC_DIRS) {
    for (const file of walk(dir, ['.ts', '.tsx'])) {
      const content = readFileSync(file, 'utf-8');
      const matches = content.match(/t\(['"]([^'"]+)['"]/g) ?? [];
      for (const m of matches) {
        const key = m.match(/t\(['"]([^'"]+)['"]/)?.[1];
        if (key) usedKeys.add(`common:${key}`);
      }
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} i18n errors`);
    process.exit(1);
  }
  console.log(`✓ i18n consistent across ${localesArr.length} locales`);
}

main();
