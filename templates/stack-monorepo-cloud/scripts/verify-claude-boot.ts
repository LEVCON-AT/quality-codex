#!/usr/bin/env tsx
/**
 * Verifies that CLAUDE.md + Tier-1 docs stay under boot-budget (4000 tokens).
 * Rough token estimate: 1 token ≈ 4 chars.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOOT_FILES = [
  'CLAUDE.md',
  'docs/claude/00-codex-core.md',
  'docs/claude/00-codex-decisions.md',
  'MEMORY.md',
];

const BUDGET_TOKENS = 4000;
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function main() {
  let total = 0;
  for (const file of BOOT_FILES) {
    try {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      const tokens = estimateTokens(content);
      total += tokens;
      console.log(`  ${file}: ~${tokens} tokens`);
    } catch {
      console.warn(`  ${file}: NOT FOUND`);
    }
  }

  console.log(`\nTotal boot tokens: ~${total} / budget ${BUDGET_TOKENS}`);

  if (total > BUDGET_TOKENS) {
    console.error(`✗ Boot budget exceeded by ${total - BUDGET_TOKENS} tokens`);
    process.exit(1);
  }
  console.log(`✓ Boot budget OK (${Math.round((total / BUDGET_TOKENS) * 100)}% used)`);
}

main();
