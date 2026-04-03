# Wash — History

## Project Context

**Project:** TripPacker — travel-baggage-checker
**Owner:** Relena
**Stack:** React 18, TypeScript strict, CRA (react-scripts 5), GitHub Pages
**App path:** `travel-baggage-checker/trip-manager-app/`

## Core Context

- CRA 5 quirks: `FAST_REFRESH=false` needed on Windows; `PUBLIC_URL=` for local dev
- CI: `ci.yml` runs unit + E2E in parallel on push/PR to main/squad/**
- Deploy: `deploy.yml` runs `npm ci → unit tests → build → gh-pages deploy`
- Playwright: `playwright.config.ts` → Chromium, webServer localhost:3000, E2E in `e2e/`
- `verify.py` at repo root: runs e2e gen + unit + playwright + build

## Key Config Decisions

- `@playwright/test` at `^1.44.0` as devDependency
- Scripts: `test`, `test:coverage`, `test:e2e`, `test:e2e:ui`
- CI unit test command: `npm test -- --watchAll=false --forceExit --passWithNoTests`
- `.gitignore` must exclude `/playwright-report/` and `/test-results/`
- `homepage` in package.json → GitHub Pages URL (causes local dev issue — fixed by `.env.development`)

## Learnings

- `--passWithNoTests` flag needed in E2E CI job so it doesn't fail before e2e dir exists
- Playwright webServer waits for port 3000 before running tests
- `create_e2e_tests.py` must be run before E2E tests to emit spec files
