# Mal — History

## Project Context

**Project:** TripPacker — travel-baggage-checker
**Owner:** Relena
**Stack:** React 18, TypeScript strict, CRA (react-scripts 5), React Router v6, localStorage, GitHub Pages
**App path:** `travel-baggage-checker/trip-manager-app/`
**Design system:** "The Curated Journey" — see `Stich/SPEC.md`
**Casting universe:** Firefly

## Core Context

- App spec captured in `ANALYSIS.md` — this is the ground truth for everything to build
- Design system: `Stich/DESIGN.md`, `Stich/SPEC.md` — editorial concierge aesthetic, no borders, no #000
- 4 routes: `/`, `/trips`, `/create-trip`, `/trip/:id`
- State: React Context + `useTripData` custom hook → localStorage
- No backend, no external APIs, static SPA only
- Dead code (`ItemForm.tsx`, `ItemList.tsx`) must NOT exist in new build
- All `setTrips` calls must use functional form `prev => ...`
- `importTrips()` must call `migrateTripsToCategories()` before `setTrips`

## Learnings

- Architecture decisions must precede implementation — log to decisions.md first
- `Date.now()` IDs are intentional per Relena's decision
- `category` is REQUIRED on Item (default: 'otros')
- CRA 5 + `react-scripts 5.0.1` — needs `FAST_REFRESH=false` in `.env.development` on Windows
