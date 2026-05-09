# Skill-Substanz-Referenzen — Sync-Status

Diese Dateien sind lokal abgelegte Substanzen externer Claude-Code-Skills, damit `CLAUDE.md` direkt darauf verweisen kann ohne Skill-Roundtrip.

## Sync-Tabelle

| Lokale Datei | Upstream-Skill | Letzter Sync | Codex-Anpassungen |
|---|---|---|---|
| `frontend-design.md` | `frontend-design:frontend-design` | 2026-05-09 | Token-System auf Codex-Standard, HyperUI-Default-Bezug |
| `hyperui-component-index.md` | (eigene Erstellung) | 2026-05-09 | 30+ Patterns, Token-Mapping, Verwendungs-Hinweise |
| `supabase-patterns.md` | `supabase:supabase` + `supabase:supabase-postgres-best-practices` | 2026-05-09 | RLS, Auth-SSR, Realtime, Storage |
| `postgres-best-practices.md` | `supabase:supabase-postgres-best-practices` | 2026-05-09 | Indexing, JSONB, Pooling |
| `claude-api-patterns.md` | `claude-api:claude-api` | 2026-05-09 | Prompt-Caching, Tool-Use, MCP |
| `code-review-method.md` | `code-review:code-review` | 2026-05-09 | Review-Methodik |
| `security-review-method.md` | `security-review` | 2026-05-09 | ASVS-Sweep, STRIDE-Walk |

## Quartals-Drill

Alle 3 Monate:
1. Original-Skills lesen (z.B. via `/frontend-design`-Aufruf in fresher Session)
2. Diff zu lokalem Doc bilden
3. Mergen wo sinnvoll, dabei Codex-Anpassungen behalten
4. Sync-Datum hier aktualisieren
5. CHANGELOG.md des Codex aktualisieren (Patch-Bump)

## Wann ein neuer Sync nötig?

- Anthropic released neuen Major-Skill-Update
- User meldet "der Skill sagt X, der Codex sagt Y" — Diskrepanz
- Vor jedem Codex-Major-Release

## Sync-Skript

`scripts/sync-skill-references.sh` (TODO v1.1) — automatisiert den Diff-Prozess.
