@echo off
cd /d C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app

echo ===== STEP 1: TypeScript Check =====
npx tsc --noEmit
set TS_EXIT_CODE=%ERRORLEVEL%
echo.
echo Exit Code: %TS_EXIT_CODE%
echo.

echo ===== STEP 2: Unit Tests =====
set CI=true
npm test -- --watchAll=false --passWithNoTests
set TEST_EXIT_CODE=%ERRORLEVEL%
echo.
echo Exit Code: %TEST_EXIT_CODE%
echo.

echo ===== SUMMARY =====
echo TypeScript Exit Code: %TS_EXIT_CODE%
echo Test Exit Code: %TEST_EXIT_CODE%
