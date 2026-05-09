# ADR-0001: Stack-Wahl für __PROJECT_NAME__

**Status:** Accepted
**Datum:** __DATE__
**Autor(en):** __OWNER__ + Claude

## Kontext

Neues Projekt — Stack-Entscheidung steht an. Quality-Codex bietet 2 Varianten:
- VPS-Variante: Hetzner + Docker + Self-hosted Supabase + nginx
- Cloud-Variante: Supabase Cloud + Vercel/Netlify

Constraint: __CONSTRAINT__ (z.B. DSGVO-Compliance, Solo-Dev, Budget < 50 €/Monat).

## Entscheidung

Wir nutzen die __VARIANT__-Variante mit:
- Frontend: SolidJS + Vite + HyperUI + i18next (de-AT, en-US)
- Backend: Fastify + WebSocket + MCP
- Database: Supabase (Postgres 15)
- Tenancy: __TENANCY__
- Mobile: __MOBILE__

## Begründung

1. **Volle Kontrolle (VPS)** vs **Niedrige Ops-Burden (Cloud)** — Begründung anpassen
2. __REASON_2__
3. __REASON_3__

## Verworfene Alternativen

### Alternative A: __ALT_A__
- Vor: ...
- Nachteil: ...
- Warum verworfen: ...

### Alternative B: Plain Node.js + eigene Auth statt Supabase
- Vor: noch mehr Kontrolle
- Nachteil: Hoher Implementierungs-Aufwand, RLS+Auth-Provider müssen selbst gebaut werden
- Warum verworfen: Supabase liefert RLS/Auth/Realtime/Storage out-of-box

## Konsequenzen

### Positiv
- Onboarding in <10 min via `/onboard-project`-Skill
- Bewährter Codex-Stack
- Clear Quality-Gates von Tag 1

### Negativ / Trade-offs
- Codex-Update-Pflicht quartalsweise (siehe `docs/runbooks/codex-sync.md`)
- Bei Supabase-Wechsel später: Migration-Aufwand

### Risiken
- Supabase-Pricing-Änderung → Mitigation: Self-host-Migration-Pfad dokumentiert
- VPS-Provider-Outage → Mitigation: Backup-Off-Site + DR-Drill

## Auswirkung auf Codex

- `00-codex-decisions.md` mit gewählter Variante befüllen
- Bei VPS: SSH-Hardening + Backup-Setup vor erstem Deploy
- Bei Cloud: Supabase-Cloud + Vercel-Account-Setup

## Referenzen

- `docs/onboarding/stack-decision-tree.md` — Entscheidungs-Hilfe
- `docs/claude/01-architecture.md` — Atom-Zwiebel-Pattern
- Quality-Codex v__CODEX_VERSION__
