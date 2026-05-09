#requires -Version 5.1
<#
.SYNOPSIS
Run full verification suite on freshly onboarded project.

.PARAMETER Slug
Project slug
#>

param(
    [Parameter(Mandatory=$true)] [string]$Slug
)

$ErrorActionPreference = 'Stop'
$target = "C:\node\$Slug"

if (-not (Test-Path $target)) { throw "Project not found: $target" }

Push-Location $target
try {
    Write-Host "▶ Installing dependencies..."
    pnpm install --frozen-lockfile

    Write-Host "▶ Type-checking..."
    pnpm typecheck
    if ($LASTEXITCODE -ne 0) { throw "typecheck failed" }

    Write-Host "▶ Linting..."
    pnpm lint
    if ($LASTEXITCODE -ne 0) { throw "lint failed" }

    Write-Host "▶ Testing..."
    pnpm test
    if ($LASTEXITCODE -ne 0) { throw "tests failed" }

    Write-Host "▶ Building..."
    pnpm build
    if ($LASTEXITCODE -ne 0) { throw "build failed" }

    Write-Host "▶ Boot-budget verify..."
    pnpm boot:verify
    if ($LASTEXITCODE -ne 0) { throw "boot budget exceeded" }

    Write-Host "▶ Doc-link check..."
    pnpm docs:check
    if ($LASTEXITCODE -ne 0) { throw "doc-link check failed" }

    Write-Host "✓ All checks passed for $Slug"
    Write-Host "  Project ready at: $target"
    Write-Host "  Next: trigger initial CI run via 'git push'"
} finally {
    Pop-Location
}
