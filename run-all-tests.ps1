# Directory Creation Tests - All 7 Methods
# This script tests 7 different methods to create directories

$base = "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src"
$hooks = "$base\hooks"
$components = "$base\components"
$context = "$base\context"

# Helper function to cleanup directories
function Cleanup-Dirs {
    Remove-Item $hooks -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item $components -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item $context -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 200
}

# Helper function to verify directories
function Verify-Dirs {
    $h = Test-Path $hooks
    $c = Test-Path $components
    $cx = Test-Path $context
    
    if ($h -and $c -and $cx) {
        return @{ Result = "SUCCESS"; Details = "All directories exist" }
    }
    else {
        return @{ Result = "FAILED"; Details = "hooks: $h, components: $c, context: $cx" }
    }
}

# Ensure src directory exists
if (-not (Test-Path $base)) {
    New-Item -ItemType Directory -Force -Path $base | Out-Null
}

Write-Host "======================================== " -ForegroundColor Cyan
Write-Host "DIRECTORY CREATION TEST SUITE" -ForegroundColor Yellow
Write-Host "======================================== " -ForegroundColor Cyan
Write-Host ""

# METHOD 1: PowerShell New-Item
Write-Host "METHOD 1: PowerShell New-Item" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
New-Item -ItemType Directory -Force -Path $hooks | Out-Null
New-Item -ItemType Directory -Force -Path $components | Out-Null
New-Item -ItemType Directory -Force -Path $context | Out-Null
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 2: Python os.makedirs one-liner
Write-Host "METHOD 2: Python os.makedirs one-liner" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
python -c "import os; [os.makedirs(r'$base\' + d, exist_ok=True) for d in ['hooks','components','context']]" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 3: Python script create_all_dirs.py
Write-Host "METHOD 3: Python script create_all_dirs.py" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
python "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\create_all_dirs.py" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 4: Node.js fs.mkdirSync
Write-Host "METHOD 4: Node.js fs.mkdirSync" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/hooks',{recursive:true})" 2>&1
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/components',{recursive:true})" 2>&1
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/context',{recursive:true})" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 5: Python script mkdirs.py
Write-Host "METHOD 5: Python script mkdirs.py" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
python "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\mkdirs.py" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 6: cmd.exe mkdir
Write-Host "METHOD 6: cmd.exe mkdir" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
cmd /c mkdir "$hooks" 2>&1
cmd /c mkdir "$components" 2>&1
cmd /c mkdir "$context" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# METHOD 7: cmd.exe md
Write-Host "METHOD 7: cmd.exe md" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan
Cleanup-Dirs
cmd /c md "$hooks" 2>&1
cmd /c md "$components" 2>&1
cmd /c md "$context" 2>&1
$result = Verify-Dirs
Write-Host "Result: $($result.Result)" -ForegroundColor Green
Write-Host "Details: $($result.Details)" -ForegroundColor Gray
Write-Host ""

# FINAL VERIFICATION
Write-Host "======================================== " -ForegroundColor Cyan
Write-Host "FINAL VERIFICATION" -ForegroundColor Yellow
Write-Host "======================================== " -ForegroundColor Cyan
$h = Test-Path $hooks
$c = Test-Path $components
$cx = Test-Path $context
Write-Host "hooks directory exists: $h" -ForegroundColor Green
Write-Host "components directory exists: $c" -ForegroundColor Green
Write-Host "context directory exists: $cx" -ForegroundColor Green

if ($h -and $c -and $cx) {
    Write-Host ""
    Write-Host "✓ ALL DIRECTORIES SUCCESSFULLY CREATED AND VERIFIED" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "✗ SOME DIRECTORIES ARE MISSING" -ForegroundColor Red
}

Write-Host ""
Write-Host "Directories left in place (NOT deleted)" -ForegroundColor Cyan
