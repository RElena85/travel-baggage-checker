@echo off
echo Running trip-manager-app scaffold...
python "%~dp0make_dirs.py"
if %ERRORLEVEL% neq 0 (
  echo Python failed. Trying python3...
  python3 "%~dp0make_dirs.py"
)
pause
