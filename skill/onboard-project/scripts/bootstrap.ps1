#requires -Version 5.1
<#
.SYNOPSIS
Bootstrap a new project from the Quality-Codex template.

.PARAMETER Slug
Project slug (kebab-case)

.PARAMETER Variant
"vps" or "cloud"

.PARAMETER ProjectName
Human-readable project name

.PARAMETER Domain
Production domain (e.g. tools.acme.com or prod.crepe.levcon.at)

.PARAMETER StagingDomain
Staging domain. Default: if Domain begins with "prod.", swap to "staging.";
otherwise prefix "staging." to Domain.
Provide explicitly when defaults don't fit.

.PARAMETER GhOrg
GitHub organization

.PARAMETER GhRepo
GitHub repository name (defaults to Slug)

.EXAMPLE
.\bootstrap.ps1 -Slug acme-tools -Variant vps `
    -ProjectName "Acme Tools" -Domain tools.acme.com -GhOrg acme

.EXAMPLE — separate staging-domain
.\bootstrap.ps1 -Slug crepe -Variant vps `
    -ProjectName "Crepe" `
    -Domain prod.crepe.levcon.at `
    -StagingDomain staging.crepe.levcon.at `
    -GhOrg LEVCON-AT
#>

param(
    [Parameter(Mandatory=$true)] [string]$Slug,
    [Parameter(Mandatory=$true)] [ValidateSet('vps','cloud')] [string]$Variant,
    [Parameter(Mandatory=$true)] [string]$ProjectName,
    [Parameter(Mandatory=$true)] [string]$Domain,
    [string]$StagingDomain,
    [Parameter(Mandatory=$true)] [string]$GhOrg,
    [string]$GhRepo = $Slug,
    [string]$OwnerName = $env:USERNAME,
    [string]$CodexRoot = "C:\node\quality-codex"
)

$ErrorActionPreference = 'Stop'
# UTF-8 für Console + Pipeline — vermeidet Mojibake bei Umlauten
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# StagingDomain default
if ([string]::IsNullOrWhiteSpace($StagingDomain)) {
    if ($Domain -match '^prod\.') {
        $StagingDomain = $Domain -replace '^prod\.', 'staging.'
    } else {
        $StagingDomain = "staging.$Domain"
    }
    Write-Host "  Auto-derived StagingDomain: $StagingDomain"
}

$source = Join-Path $CodexRoot "templates\stack-monorepo-$Variant"
$target = "C:\node\$Slug"

if (Test-Path $target) {
    throw "Target already exists: $target"
}

Write-Host "Copying template ($Variant) -> $target"
Copy-Item -Recurse -Path $source -Destination $target

Write-Host "Replacing placeholders (UTF-8 safe)..."
$placeholders = @{
    '__SLUG__' = $Slug
    '__PROJECT_NAME__' = $ProjectName
    '__DOMAIN__' = $Domain
    '__STAGING_DOMAIN__' = $StagingDomain
    '__GH_ORG__' = $GhOrg
    '__GH_OWNER__' = $GhOrg
    '__YEAR__' = (Get-Date -Format 'yyyy')
    '__OWNER__' = $OwnerName
}

$extensions = @('.md', '.json', '.yml', '.yaml', '.ts', '.tsx', '.sh', '.js', '.html', '.conf', '.css', '.sql', '.ps1')

# UTF-8 BOM-less via .NET API (PS 5.1's Set-Content uses ANSI by default → Mojibake!)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Get-ChildItem -Path $target -Recurse -File | Where-Object { $extensions -contains $_.Extension } | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    foreach ($k in $placeholders.Keys) {
        $content = $content -replace [regex]::Escape($k), $placeholders[$k]
    }
    [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
}

Write-Host "Initializing git..."
Push-Location $target
try {
    git init -q
    git add -A
    git commit -m "chore: initial commit from quality-codex" -q

    Write-Host "Creating GitHub repo $GhOrg/$GhRepo..."
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        gh repo create "$GhOrg/$GhRepo" --private --source=. --remote=origin --push 2>&1 | Out-Null
    } else {
        Write-Host "  gh CLI not found - manual repo creation required:"
        Write-Host "     1. https://github.com/new -> Owner: $GhOrg, Name: $GhRepo, Private, empty"
        Write-Host "     2. cd $target"
        Write-Host "     3. git remote add origin https://github.com/$GhOrg/$GhRepo.git"
        Write-Host "     4. git push -u origin main"
        Write-Host "     Detail: docs/runbooks/github-setup.md"
    }

    Write-Host "Bootstrap complete: $target"
    Write-Host "  Domain (prod):    $Domain"
    Write-Host "  Domain (staging): $StagingDomain"
    Write-Host "  Next: scripts/configure-secrets.ps1"
} finally {
    Pop-Location
}

# Archive local snippet copy after successful onboarding
$snippetPath = Join-Path $env:USERPROFILE ".claude\snippets\start-codex-project.md"
if (Test-Path $snippetPath) {
    $archiveDir = Join-Path $env:USERPROFILE ".claude\snippets\_archive"
    New-Item -ItemType Directory -Force -Path $archiveDir | Out-Null
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $archivedName = "start-codex-project-archived-$stamp.md"
    $archivedPath = Join-Path $archiveDir $archivedName
    Move-Item -Path $snippetPath -Destination $archivedPath -Force
    Write-Host "Snippet archived -> $archivedPath"
    Write-Host "  Source-of-truth bleibt im Codex-Repo: $CodexRoot\START-HERE.md"
}
