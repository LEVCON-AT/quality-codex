# Quality-Coding-Codex

Wiederverwendbares Framework für Production-Grade-Software-Engineering — abgeleitet aus dem Matrix-Projekt.

## Was ist das

Ein klonbarer Template-Repo + Claude-Code-Skill, der ein neues Projekt in <10 Minuten von "leer" auf "Staging-Pipeline läuft, Backup ist verifiziert, Foundation-Manifesto bereit" bringt.

## Schneller Einstieg

```powershell
# In Claude Code:
/onboard-project
```

Der Skill fragt: Projekt-Name, Stack, Tenancy, Mobile, Locales, Infra-Variante, Domain, Backup-Target. Kopiert das passende Template, initialisiert Git, setzt Secrets, deployed Initial-Stack.

## Inhalte

```
docs/
├── claude/           ← Foundation-Manifesto (16 Docs, Tier-1/2/3-System)
├── references/       ← Skill-Substanzen lokal (frontend-design, supabase, claude-api, ...)
├── decisions/        ← ADR-Templates
├── runbooks/         ← Deploy, Rollback, DB-Restore, Secret-Rotation, Incident, GDPR, Operations-Mandate
├── planning/         ← Risk-Register, Threat-Model (STRIDE), Performance-Budget, DoR, Spike
└── onboarding/       ← New-Project-Checkliste, Stack-Decision-Tree, PRR-Checkliste

templates/
├── stack-monorepo-vps/    ← Hetzner-VPS + Docker + Supabase (Self-hosted)
└── stack-monorepo-cloud/  ← Supabase-Cloud + Vercel/Netlify (Managed)

skill/
├── onboard-project/  ← /onboard-project Skill
└── feature-verify/   ← /feature-verify Skill (Wizard-Modus für User-Verification)

checklists/           ← Pre-Merge-PR, Pre-Release, Security-Pentest, A11y, I18n, Permission-Change, Doc-Update
```

## Kern-Pfeiler

1. **Foundation-Manifesto** (Tier-1 Pflicht-Boot ≤4k Tokens, Rest on-demand)
2. **Strict-Tooling** (TypeScript strict, Biome, Vitest, no ESLint)
3. **Staging→Prod-Pipeline** von Tag 1 (getrennte Domains, getrennte DB)
4. **Backup + Restore** mit wöchentlichem Verify-Drill
5. **HyperUI als Default-Komponentenbibliothek**
6. **Globalisierung von Tag 1** (i18next, ICU, Intl.*, BCP 47)
7. **RBAC + RLS Defense-in-Depth** + Audit-Log
8. **Continuous-Quality-Awareness** während des Codens (Doublet-/Dead-Code-/Standard-Drift-Detection)
9. **Feature-Verification** via Playwright + Soll/Ist-Testprotokoll (Auto- oder Wizard-Modus)
10. **Living User-Docs** (parallel zu Code, gerendert via VitePress-Wiki)
11. **Code-↔-Doku-Linking** via `@docs`-TSDoc-Tags (bidirektional geprüft)
12. **Pentest-Aware-Security** durchgängig (Setup, Architektur, Codereview, Testung)
13. **Branch/Merge/Release-Disziplin** (Trunk-based-Light, Conventional Commits, SemVer)
14. **Observability + Status-Page** vor Prod-Go-Live
15. **Operations-Mandat** für Claude (VPS-Steuerung, Auto-Smoketest, Rollback)
16. **Production-Readiness-Review (PRR)** als finale Pflicht-Wave vor v1.0

## Anerkannte Standards

OWASP ASVS L2 · OWASP Top 10 · CWE Top 25 · WCAG 2.2 AA · GDPR · SemVer · Conventional Commits · OpenAPI 3.1 · ISO 8601 · BCP 47 · STRIDE · Core Web Vitals

## Versionierung

Codex selbst folgt SemVer. Aktuelle Version in [.codex-version](.codex-version), Änderungen in [CHANGELOG.md](CHANGELOG.md). Bestandsprojekte upgraden via `/codex-upgrade`-Skill.

## Was NICHT enthalten ist

- **Yjs/CRDT-Collab** — kommt in v1.1 wenn Matrix das Pattern stabilisiert hat
- **ESLint** — bewusst weggelassen, Biome ersetzt es vollständig

## Quelle

Abgeleitet aus den Patterns des Matrix-Projekts (`C:\node\Matrix`). Matrix bleibt unangetastet die Referenz-Implementierung.
