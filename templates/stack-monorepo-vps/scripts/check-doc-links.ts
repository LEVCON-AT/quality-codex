#!/usr/bin/env tsx
/**
 * Bidirectional doc-link check:
 * 1. Every @docs <path>#<anchor> in source code points to existing docs-user file + anchor
 * 2. Every docs-user/**.md page is referenced by at least one @docs tag (no orphans)
 *
 * Usage: pnpm docs:check
 *        pnpm docs:find <slug>   # reverse-lookup
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DOCS_USER_DIR = join(ROOT, 'docs-user');
const SRC_GLOBS = ['packages/**/src'];

interface DocsTag {
  file: string;
  line: number;
  path: string;
  anchor?: string;
}

function walk(dir: string, ext: string[], out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules' && entry !== 'dist') {
      walk(full, ext, out);
    } else if (ext.some((e) => full.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

function findDocsTags(): DocsTag[] {
  const tags: DocsTag[] = [];
  for (const glob of SRC_GLOBS) {
    const baseDir = join(ROOT, glob.replace('/**/src', ''));
    if (!safeStat(baseDir)) continue;
    for (const file of walk(baseDir, ['.ts', '.tsx', '.svelte'])) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        const match = line.match(/@docs\s+([^\s*]+)/);
        if (!match) return;
        const ref = match[1];
        if (ref === 'internal') return;
        const [path, anchor] = ref.split('#');
        tags.push({ file: relative(ROOT, file), line: i + 1, path, anchor });
      });
    }
  }
  return tags;
}

function safeStat(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function findDocsUserPages(): string[] {
  if (!safeStat(DOCS_USER_DIR)) return [];
  return walk(DOCS_USER_DIR, ['.md']).map((f) => relative(DOCS_USER_DIR, f));
}

function checkAnchorExists(file: string, anchor: string): boolean {
  try {
    const content = readFileSync(join(DOCS_USER_DIR, file), 'utf-8');
    // Markdown headings: # Foo {#anchor} or simple # Foo → slugified
    if (content.includes(`{#${anchor}}`)) return true;
    const slugAnchors = (content.match(/^#+\s+(.+)$/gm) ?? [])
      .map((h) => h.replace(/^#+\s+/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    return slugAnchors.includes(anchor);
  } catch {
    return false;
  }
}

function main() {
  const findArg = process.argv.find((a) => a === '--find');
  if (findArg) {
    const slug = process.argv[process.argv.length - 1];
    const tags = findDocsTags().filter((t) => t.path.includes(slug));
    for (const tag of tags) {
      console.log(`${tag.file}:${tag.line} → ${tag.path}${tag.anchor ? `#${tag.anchor}` : ''}`);
    }
    return;
  }

  const tags = findDocsTags();
  const pages = new Set(findDocsUserPages().map((p) => p.replace(/\\/g, '/')));
  const referenced = new Set<string>();
  let errors = 0;

  for (const tag of tags) {
    const normalized = tag.path.replace(/^docs-user\//, '');
    referenced.add(normalized);
    if (!pages.has(normalized)) {
      console.error(`✗ ${tag.file}:${tag.line} → docs-user/${tag.path} not found`);
      errors++;
      continue;
    }
    if (tag.anchor && !checkAnchorExists(normalized, tag.anchor)) {
      console.error(`✗ ${tag.file}:${tag.line} → anchor #${tag.anchor} not found in ${tag.path}`);
      errors++;
    }
  }

  for (const page of pages) {
    if (!referenced.has(page) && !page.startsWith('admin/') && page !== 'index.md' && page !== 'faq.md' && page !== 'troubleshooting.md') {
      console.warn(`⚠ docs-user/${page} has no @docs reference (orphan)`);
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} doc-link errors`);
    process.exit(1);
  }
  console.log(`✓ ${tags.length} @docs tags, ${pages.size} pages — all valid`);
}

main();
