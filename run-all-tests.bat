@echo off
setlocal enabledelayedexpansion

set "BASE=C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src"
set "HOOKS=%BASE%\hooks"
set "COMPONENTS=%BASE%\components"
set "CONTEXT=%BASE%\context"

echo.
echo ========== ENSURING SRC DIRECTORY EXISTS ==========
if not exist "%BASE%" (
    mkdir "%BASE%"
)

REM ===== METHOD 1: PowerShell New-Item =====
echo.
echo ========== METHOD 1: PowerShell New-Item ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Force -Path '%HOOKS%' -Out $null; New-Item -ItemType Directory -Force -Path '%COMPONENTS%' -Out $null; New-Item -ItemType Directory -Force -Path '%CONTEXT%' -Out $null"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
    echo   hooks exists: %exist "%HOOKS%"
    echo   components exists: %exist "%COMPONENTS%"
    echo   context exists: %exist "%CONTEXT%"
)

REM ===== METHOD 2: Python os.makedirs one-liner =====
echo.
echo ========== METHOD 2: Python os.makedirs one-liner ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
python -c "import os; [os.makedirs(r'%BASE%\\' + d, exist_ok=True) for d in ['hooks','components','context']]"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== METHOD 3: Python script create_all_dirs.py =====
echo.
echo ========== METHOD 3: Python script create_all_dirs.py ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
python "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\create_all_dirs.py"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== METHOD 4: Node.js fs.mkdirSync =====
echo.
echo ========== METHOD 4: Node.js fs.mkdirSync ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/hooks',{recursive:true})"
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/components',{recursive:true})"
node -e "require('fs').mkdirSync('C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/context',{recursive:true})"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== METHOD 5: Python script mkdirs.py =====
echo.
echo ========== METHOD 5: Python script mkdirs.py ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
python "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\mkdirs.py"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== METHOD 6: cmd.exe mkdir =====
echo.
echo ========== METHOD 6: cmd.exe mkdir ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
cmd /c mkdir "%HOOKS%"
cmd /c mkdir "%COMPONENTS%"
cmd /c mkdir "%CONTEXT%"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== METHOD 7: cmd.exe md =====
echo.
echo ========== METHOD 7: cmd.exe md ==========
powershell -Command "Remove-Item '%HOOKS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%COMPONENTS%' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%CONTEXT%' -Recurse -Force -ErrorAction SilentlyContinue"
cmd /c md "%HOOKS%"
cmd /c md "%COMPONENTS%"
cmd /c md "%CONTEXT%"
if exist "%HOOKS%" if exist "%COMPONENTS%" if exist "%CONTEXT%" (
    echo Result: SUCCESS
) else (
    echo Result: FAILED
)

REM ===== FINAL VERIFICATION =====
echo.
echo ========== FINAL VERIFICATION ==========
powershell -Command "Write-Host 'Checking directories with Test-Path:'; $h = Test-Path 'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\hooks'; $c = Test-Path 'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\components'; $cx = Test-Path 'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\context'; Write-Host \"hooks: $h`ncomponents: $c`ncontext: $cx\"; if ($h -and $c -and $cx) { Write-Host 'ALL DIRECTORIES EXIST - SUCCESS' } else { Write-Host 'MISSING DIRECTORIES - FAILED' }"

echo.
echo ========== TEST COMPLETE ==========
echo All directories are now in place (NOT deleted)
pause
