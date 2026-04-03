#!/usr/bin/env pwsh

Write-Host "===== STEP 1: TypeScript Check ====="
Write-Host "Current directory: $(Get-Location)"
Write-Host ""

$startTime = Get-Date
npx tsc --noEmit
$tsExitCode = $LASTEXITCODE
$endTime = Get-Date
Write-Host ""
Write-Host "TypeScript Exit Code: $tsExitCode"
Write-Host "Time: $(($endTime - $startTime).TotalSeconds) seconds"
Write-Host ""

Write-Host "===== STEP 2: Unit Tests ====="
$env:CI = "true"
$startTime = Get-Date
npm test -- --watchAll=false --passWithNoTests
$testExitCode = $LASTEXITCODE
$endTime = Get-Date
Write-Host ""
Write-Host "Test Exit Code: $testExitCode"
Write-Host "Time: $(($endTime - $startTime).TotalSeconds) seconds"
Write-Host ""

Write-Host "===== SUMMARY ====="
Write-Host "TypeScript Exit Code: $tsExitCode"
Write-Host "Test Exit Code: $testExitCode"
