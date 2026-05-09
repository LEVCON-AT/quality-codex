# Branching Strategy — Trunk-based Light

Optimiert für Solo-Dev mit AI-Pair, skaliert auf kleine Teams.

## Branches

| Branch | Zweck | Auto-Deploy | Geschützt |
|---|---|---|---|
| `main` | immer-deploybar = Prod | Prod (mit Approval) | ja, force-push verboten, signed commits Pflicht |
| `develop` | Integration = Staging | Staging (auto on push) | PR-Pflicht ab v0.5 |
| `feat/wave-N-item-X-<slug>` | Feature-Arbeit | — | — |
| `fix/<slug>` | Bug-Fix | — | — |
| `hotfix/<slug>` | Prod-Hotfix von `main` | Direkt-PR zu `main` | — |
| `chore/<slug>` | Tooling, CI, Deps | — | — |
| `docs/<slug>` | Doku-only | — | — |
| `refactor/<slug>` | Refactoring | — | — |

## Workflow

### Standard-Feature
```
1. git checkout develop && git pull
2. git checkout -b feat/wave-2-item-3-user-export
3. <implement>
4. <local DoD-Check>
5. git push -u origin feat/wave-2-item-3-user-export
6. PR develop ← feat/wave-2-item-3-user-export
7. CI grün → squash-merge nach develop
8. Auto-Deploy zu Staging
9. Feature-Verification (Modus A oder B)
10. Wenn grün: PR develop → main
11. Manual Approval → Prod-Deploy
```

### Hotfix (Prod down)
```
1. git checkout main && git pull
2. git checkout -b hotfix/auth-bypass
3. <fix>
4. git push -u origin hotfix/auth-bypass
5. PR main ← hotfix/auth-bypass (verkürzte Checkliste, aber Pentest+DAST trotzdem)
6. Squash-merge nach main → Prod-Deploy
7. Cherry-pick / merge auch nach develop
```

## Conventional Commits

Format: `<type>(<scope>): <subject>`

```
feat(auth): add magic-link login
fix(tasks): resolve N+1 in list-view
chore(deps): bump axios to 1.13.5
docs(architecture): clarify atom-zwiebel layers
refactor(client): extract date-helpers
perf(db): add index on tasks(tenant_id, created_at)
security(api): add rate-limit to /login
breaking(api): rename /users/me to /me
test(tasks): add IDOR coverage
ci: add semgrep job
```

`commitlint` Pflicht. Format-Verstoss → pre-commit-hook bricht ab.

## Squash-Merge Pflicht

Pro PR ein Squash-Commit. Saubere Historie, einfaches Revert. Commit-Message = PR-Titel.

## Signed Commits

`main`-Branch akzeptiert nur signed Commits (GPG oder SSH-Sign).

```bash
# Setup einmalig
git config --global commit.gpgsign true
git config --global user.signingkey <KEY-ID>
```

Branch-Protection-Rule erzwingt das.

## Tags & Releases

### Tag-Format
`v<MAJOR>.<MINOR>.<PATCH>` (SemVer 2.0)

### Tag-Mechanik
- Tag wird auf `main` gesetzt, nie auf andere Branches
- Tag triggert Release-Workflow: GitHub-Release, SBOM, Doc-Wiki-Snapshot, Backup-Snapshot
- CHANGELOG.md auto-generiert via `release-please` aus Conventional Commits

### Release-Workflow
```
1. PR develop → main (mit Pre-Release-Checkliste)
2. Approval → Squash-Merge → Prod-Deploy
3. Wenn Prod-Deploy grün: Tag setzen (`git tag v1.2.3 && git push --tags`)
4. release-please-PR aktualisiert CHANGELOG
5. GitHub-Release-Notes auto-publiziert
```

## Branch-Protection-Rules

`main`:
- PR Pflicht, mind. 1 Approval (oder Self-Approval bei Solo-Dev mit Justification-Comment)
- Alle CI-Checks must pass
- Signed Commits
- No force-push
- Linear history (squash-merge enforced)
- Verified-Tag pro Release

`develop`:
- PR Pflicht ab v0.5 (vorher direkt-push erlaubt)
- CI-Checks must pass

## PR-Template

```markdown
## Was

<1-2 Sätze>

## Warum

<Wave-Item-Verweis oder Bug-Report>

## Test-Plan

- [ ] Local: typecheck + lint + test grün
- [ ] Staging: Smoketest grün
- [ ] Feature-Verification (Modus A/B): Testprotokoll unter `tests/protocols/wave-N-item-X.md`

## Migrations

- [ ] Idempotent (2-Pass-Test grün)
- [ ] RLS für neue Tabellen
- [ ] Rollback-Pfad dokumentiert

## Risiken

<STRIDE-Quick-Walk wenn neue Surface, sonst "keine">

## Doku

- [ ] `docs-user/` aktualisiert
- [ ] `@docs`-Tags vorhanden
- [ ] `pnpm docs:check` grün

## DoD-Check

→ siehe checklists/pre-merge-pr.md
```

## Rebase vs Merge

- `feat/...` Branches lokal rebasen vor PR (sauberer Diff)
- Niemals `main`/`develop` rebasen (history rewrite verboten)
- Bei Merge-Konflikten: rebase auf aktuellen develop, dann erneut pushen

## Long-running-Branches

Bei Wave-Items länger >1 Woche:
- Häufig von `develop` rebasen (vermeidet Big-Bang-Konflikte)
- Optional: Feature-Flag, in develop mergen aber dort deaktiviert
