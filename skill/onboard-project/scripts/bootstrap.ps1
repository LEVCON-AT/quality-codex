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
Production domain

.PARAMETER GhOrg
GitHub organization

.PARAMETER GhRepo
GitHub repository name (defaults to Slug)

.EXAMPLE
.\bootstrap.ps1 -Slug acme-tools -Variant vps -ProjectName "Acme Tools" -Domain tools.acme.com -GhOrg acme
#>

param(
    [Parameter(Mandatory=$true)] [string]$Slug,
    [Parameter(Mandatory=$true)] [ValidateSet('vps','cloud')] [string]$Variant,
    [Parameter(Mandatory=$true)] [string]$ProjectName,
    [Parameter(Mandatory=$true)] [string]$Domain,
    [Parameter(Mandatory=$true)] [string]$GhOrg,
    [string]$GhRepo = $Slug,
    [string]$OwnerName = $env:USERNAME,
    [string]$CodexRoot = "C:\node\quality-codex"
)

$ErrorActionPreference = 'Stop'

$source = Join-Path $CodexRoot "templates\stack-monorepo-$Variant"
$target = "C:\node\$Slug"

if (Test-Path $target) {
    throw "Target already exists: $target"
}

Write-Host "▶ Copying template ($Variant) → $target"
Copy-Item -Recurse -Path $source -Destination $target

Write-Host "▶ Replacing placeholders..."
$placeholders = @{
    '__SLUG__' = $Slug
    '__PROJECT_NAME__' = $ProjectName
    '__DOMAIN__' = $Domain
    '__GH_ORG__' = $GhOrg
    '__GH_OWNER__' = $GhOrg
    '__YEAR__' = (Get-Date -Format 'yyyy')
    '__OWNER__' = $OwnerName
}

$extensions = @('.md', '.json', '.yml', '.yaml', '.ts', '.tsx', '.sh', '.js', '.html', '.conf', '.css', '.sql', '.ps1')

Get-ChildItem -Path $target -Recurse -File | Where-Object { $extensions -contains $_.Extension } | ForEach-Object {
    $content = Get-Content -Path $_.FullName -Raw
    foreach ($k in $placeholders.Keys) {
        $content = $content -replace [regex]::Escape($k), $placeholders[$k]
    }
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "▶ Initializing git..."
Push-Location $target
try {
    git init -q
    git add -A
    git commit -m "chore: initial commit from quality-codex v1.0" -q

    Write-Host "▶ Creating GitHub repo $GhOrg/$GhRepo..."
    gh repo create "$GhOrg/$GhRepo" --private --source=. --remote=origin --push 2>&1 | Out-Null

    Write-Host "✓ Bootstrap complete: $target"
    Write-Host "  Next: scripts/configure-secrets.ps1"
} finally {
    Pop-Location
}
