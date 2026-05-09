#!/usr/bin/env tsx
/**
 * Auto-generates tests/protocols/INDEX.md from all *.md protocols.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PROTOCOLS_DIR = 'tests/protocols';
const INDEX = join(PROTOCOLS_DIR, 'INDEX.md');

function parseProtocol(path: string): { wave: string; item: string; date: string; mode: string; status: string; findings: number } | null {
  const content = readFileSync(path, 'utf-8');
  const titleMatch = content.match(/Wave (\S+)\s*\/\s*Item (\S+)/);
  const dateMatch = content.match(/\*\*Datum:\*\*\s+(\S+)/);
  const modeMatch = content.match(/\*\*Modus:\*\*\s+([AB])/);
  const findings = (content.match(/^\|\s+F\d+\s+\|/gm) ?? []).length;
  const status = content.includes('❌') ? '❌' : content.includes('⚠️') ? '⚠️' : '✅';
  if (!titleMatch || !dateMatch) return null;
  return {
    wave: titleMatch[1],
    item: titleMatch[2],
    date: dateMatch[1],
    mode: modeMatch?.[1] ?? '?',
    status,
    findings,
  };
}

function main() {
  const protocols: ReturnType<typeof parseProtocol>[] = [];
  try {
    for (const entry of readdirSync(PROTOCOLS_DIR)) {
      if (entry === 'INDEX.md' || entry === 'TEMPLATE.md') continue;
      const full = join(PROTOCOLS_DIR, entry);
      if (statSync(full).isFile() && entry.endsWith('.md')) {
        const parsed = parseProtocol(full);
        if (parsed) protocols.push(parsed);
      }
    }
  } catch {
    console.error('No protocols found');
    return;
  }

  protocols.sort((a, b) => `${a!.wave}.${a!.item}`.localeCompare(`${b!.wave}.${b!.item}`));

  let md = '# Testprotokoll Index\n\nAuto-generiert. Nicht händisch editieren.\n\n';
  md += '| Wave | Item | Datum | Modus | Status | Findings |\n';
  md += '|---|---|---|---|---|---|\n';
  for (const p of protocols) {
    if (!p) continue;
    md += `| ${p.wave} | ${p.item} | ${p.date} | ${p.mode} | ${p.status} | ${p.findings} |\n`;
  }

  writeFileSync(INDEX, md);
  console.log(`✓ Generated ${INDEX} with ${protocols.length} protocols`);
}

main();
