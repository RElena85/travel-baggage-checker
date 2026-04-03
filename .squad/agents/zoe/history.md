# Zoe — History

## Project Context

**Project:** TripPacker — travel-baggage-checker
**Owner:** Relena
**Stack:** React 18, TypeScript strict, CRA, Jest + @testing-library/react, Playwright
**App path:** `travel-baggage-checker/trip-manager-app/`

## Core Context

- Test hygiene rules: no wall-clock timing, centralized localStorage mock in setupTests.ts
- All mock Items must include `category` field (required per team decision)
- `data-testid` selectors ONLY — no CSS class targeting in tests
- E2E via Playwright: `create_e2e_tests.py` generates 5 spec files → 31 tests
- `localStorageMock` exported from `setupTests.ts` for reuse across all test files

## Test Coverage Map

- `App.test.tsx` — routing, renders without errors
- `TripForm.test.tsx` — create trip form behaviors
- `useTripData.test.ts` — all 16 mutations
- `TripDetails.test.tsx` (needed), `TripsPage.test.tsx` (needed) — coverage gaps

## E2E Coverage

- `e2e/navigation.spec.ts` — 7 tests (routes, navigation)
- `e2e/create-trip.spec.ts` — 9 tests (form, items, submission)
- `e2e/trip-management.spec.ts` — 9 tests (pack, copy, delete)
- `e2e/persistence.spec.ts` — 6 tests (reload, localStorage)
- `e2e/helpers.ts` — `createTrip()`, `getFirstTripId()` helpers

## Learnings

- `AppRoutes` must be a named export from App.tsx for MemoryRouter injection in tests
- `localStorage.clear()` in `beforeEach` for E2E isolation
- Dev server at `http://localhost:3000` for Playwright webServer
