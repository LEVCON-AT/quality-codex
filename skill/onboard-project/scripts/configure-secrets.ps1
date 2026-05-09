#requires -Version 5.1
<#
.SYNOPSIS
Configure GitHub secrets + .env.local for a newly bootstrapped project.

.PARAMETER Slug
Project slug
#>

param(
    [Parameter(Mandatory=$true)] [string]$Slug,
    [string]$Variant = 'vps'
)

$ErrorActionPreference = 'Stop'
$target = "C:\node\$Slug"

if (-not (Test-Path $target)) { throw "Project not found: $target" }
Push-Location $target

$requiredVps = @(
    'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_DB_PASSWORD', 'SUPABASE_JWT_SECRET',
    'SENTRY_DSN', 'BACKUP_AGE_PUBLIC_KEY',
    'SSH_HOST', 'SSH_PORT', 'SSH_USER', 'DEPLOY_SSH_KEY'
)

$requiredCloud = @(
    'SUPABASE_ACCESS_TOKEN', 'STAGING_SUPABASE_PROJECT_REF', 'PROD_SUPABASE_PROJECT_REF',
    'STAGING_SUPABASE_URL', 'STAGING_SUPABASE_ANON_KEY',
    'PROD_SUPABASE_URL', 'PROD_SUPABASE_ANON_KEY',
    'VERCEL_TOKEN', 'VERCEL_ORG_ID', 'STAGING_VERCEL_PROJECT_ID', 'PROD_VERCEL_PROJECT_ID',
    'SENTRY_DSN', 'BACKUP_AGE_PUBLIC_KEY'
)

$required = if ($Variant -eq 'cloud') { $requiredCloud } else { $requiredVps }

Write-Host "▶ Configuring GitHub secrets for $Slug ($Variant variant)"
Write-Host "  Provide values (empty input = skip):"

try {
    foreach ($name in $required) {
        $secure = Read-Host -Prompt "  $name" -AsSecureString
        if ($secure.Length -gt 0) {
            $plain = [System.Net.NetworkCredential]::new('', $secure).Password
            $plain | gh secret set $name 2>&1 | Out-Null
            Write-Host "    ✓ Set $name"
        } else {
            Write-Host "    — Skipped $name"
        }
    }

    if (-not (Test-Path '.env.local')) {
        Copy-Item -Path '.env.example' -Destination '.env.local'
        Write-Host "▶ Created .env.local from .env.example — fill in local values"
    }

    Write-Host "✓ Secrets configured"
} finally {
    Pop-Location
}
