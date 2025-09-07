@echo off
echo ============================================
echo    Trip Manager - GitHub Pages Deploy
echo ============================================
echo.

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Running tests...
call npm run test:coverage

if %ERRORLEVEL% neq 0 (
    echo ❌ Tests failed! Deployment cancelled.
    pause
    exit /b 1
)

echo.
echo [3/4] Building application...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Deployment cancelled.
    pause
    exit /b 1
)

echo.
echo [4/4] Deploying to GitHub Pages...
call npm run deploy

if %ERRORLEVEL% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Successfully deployed to GitHub Pages!
echo 🌐 Your app will be available at: https://tu-usuario.github.io/travel-baggage-checker
echo.
pause