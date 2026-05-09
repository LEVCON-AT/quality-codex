# /onboard-project — Skill Prompt

Du onboardest ein neues Projekt aus dem Quality-Codex (`C:\node\quality-codex\`).

## Phase 1 — Discovery (AskUserQuestion)

Frage in dieser Reihenfolge (eine pro Frage, mit AskUserQuestion):

1. **Projekt-Name** (nicht der Slug) — z.B. "Acme Tools"
2. **Slug** (kebab-case, für Domain/Repo/Verzeichnis) — z.B. "acme-tools"
3. **Domain (Prod)** — z.B. "tools.acme.com"
4. **Domain (Staging)** — Default: "staging.<prod-domain>"
5. **GitHub-Org + Repo-Name** — z.B. "acme/acme-tools"
6. **Stack** [Frontend / Backend / Full-Stack-Monorepo]
7. **Mobile-App** [ja (Expo) / nein]
8. **MCP-Tools** [ja / nein]
9. **Tenancy** [Single / Multi-Subdomain / Multi-Path]
10. **Default-Locale + aktive Locales** (BCP 47, z.B. "de-AT,en-US")
11. **RTL-Support** [ja / nein]
12. **Infra-Variante** [VPS (Hetzner+Docker+Supabase) / Cloud (Supabase-Cloud+Vercel)]
13. **Backup-Target** [Backblaze B2 / S3 / R2 / nicht jetzt]
14. **Observability** [Self-hosted Sentry / Cloud Sentry]

## Phase 2 — Bootstrap

```powershell
# scripts/bootstrap.ps1
$slug = "<from-discovery>"
$variant = "<vps-or-cloud>"
$source = "C:\node\quality-codex\templates\stack-monorepo-$variant"
$target = "C:\node\$slug"

Copy-Item -Recurse -Path $source -Destination $target

# Replace placeholders
Get-ChildItem -Path $target -Recurse -File | ForEach-Object {
    if ($_.Extension -in @('.md', '.json', '.yml', '.yaml', '.ts', '.tsx', '.sh', '.js', '.html', '.conf', '.css')) {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace '__SLUG__', $slug
        $content = $content -replace '__PROJECT_NAME__', $projectName
        $content = $content -replace '__DOMAIN__', $domain
        $content = $content -replace '__GH_ORG__', $ghOrg
        $content = $content -replace '__GH_OWNER__', $ghOwner
        $content = $content -replace '__YEAR__', (Get-Date -Format 'yyyy')
        $content = $content -replace '__OWNER__', $ownerName
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
}

# Git init
cd $target
git init
git add .
git commit -m "chore: initial commit from quality-codex v1.0"

# GitHub repo
gh repo create $ghRepo --private --source=. --remote=origin --push
```

## Phase 3 — Secrets

Lass den User folgende Secrets setzen (in 1Password/Bitwarden + GitHub Secrets):

- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_PASSWORD, SUPABASE_JWT_SECRET
- SENTRY_DSN
- SMTP-Credentials
- BACKUP_AGE_PUBLIC_KEY (generieren mit `age-keygen -o ~/.age/<slug>-backup-key.txt`)
- DEPLOY_SSH_KEY (VPS-Variante)
- VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID (Cloud-Variante)

```powershell
# scripts/configure-secrets.ps1
$secrets = @(
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    # ...
)
foreach ($s in $secrets) {
    $value = Read-Host "Enter $s (or skip)" -AsSecureString
    if ($value.Length -gt 0) {
        $plainText = [System.Net.NetworkCredential]::new('', $value).Password
        gh secret set $s --body $plainText
    }
}
```

## Phase 4 — Verify

```powershell
# scripts/verify-setup.ps1
cd $target

# Install deps
pnpm install

# Run all checks
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm boot:verify
pnpm docs:check

# Initial CI run
git push -u origin main
Write-Host "Wait for CI to go green at: https://github.com/$ghOrg/$slug/actions"
```

## Phase 5 — Initial-BACKLOG

Aktualisiere `BACKLOG.md` Wave 1 nach Verifikation: alle Bootstrap-Items als gehakt markieren wenn grün.

Erstelle `docs/decisions/ADR-0001-stack-choice.md`, `ADR-0002-datastore.md`, `ADR-0003-auth.md` mit Begründung der Discovery-Antworten.

## Phase 6 — Ausfüllen `00-codex-decisions.md`

Trage alle Discovery-Antworten in `docs/claude/00-codex-decisions.md` ein, sodass zukünftige Sessions Kontext haben.

## Phase 7 — Memory-File

```powershell
$memDir = "$env:USERPROFILE\.claude\projects\$slug\memory"
New-Item -ItemType Directory -Force $memDir | Out-Null
@"
---
name: project_setup
description: Initial-Kontext aus Onboarding-Skill am $(Get-Date -Format 'yyyy-MM-dd')
type: project
---
Slug: $slug
Stack: $stack
Infra: $variant
Tenancy: $tenancy
Mobile: $mobile
"@ | Set-Content "$memDir\project_setup.md"
```

## Phase 8 — Done

Sag dem User:
- "✓ Projekt $slug ist onboarded."
- "Verzeichnis: C:\node\$slug"
- "GitHub: https://github.com/$ghOrg/$slug"
- "Nächster Schritt: Wave 2 (Auth + Schema) starten — siehe BACKLOG.md"
- "Bei Fragen: `docs/onboarding/new-project-checklist.md`"

## Wenn etwas schiefläuft

- Phase failed → User informieren, an dem Punkt anhalten
- Cleanup-Option anbieten: "Soll ich C:\node\$slug wieder löschen und neu starten?"
- Logs/Errors zeigen — keine Vermutungen

## Wichtig

- Plan-Mode aktivieren wenn Architektur-Decisions in Discovery (z.B. "Welcher Datastore?")
- ADRs als `docs/decisions/ADR-XXXX-<slug>.md` für jede non-trivial Entscheidung
- Den `00-codex-decisions.md`-Inhalt sauber ausfüllen — das ist Tier-1-Boot-Pflicht für alle zukünftigen Sessions
