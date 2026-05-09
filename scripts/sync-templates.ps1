#requires -Version 5.1
<#
.SYNOPSIS
Synchronizes docs/ and checklists/ from codex root into both templates.
Run after changes to docs/claude/, docs/references/, docs/runbooks/, etc.
#>

param(
    [string]$CodexRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$sources = @('docs', 'checklists')
$templates = @(
    "$CodexRoot\templates\stack-monorepo-vps",
    "$CodexRoot\templates\stack-monorepo-cloud"
)

foreach ($template in $templates) {
    foreach ($source in $sources) {
        $srcPath = Join-Path $CodexRoot $source
        $dstPath = Join-Path $template $source
        if (Test-Path $dstPath) { Remove-Item -Recurse -Force $dstPath }
        Copy-Item -Recurse -Path $srcPath -Destination $dstPath
        Write-Host "  ✓ Synced $source → $template"
    }
}

Write-Host "✓ Templates synchronized"
