# Kaylee — History

## Project Context

**Project:** TripPacker — travel-baggage-checker
**Owner:** Relena
**Stack:** React 18, TypeScript strict, CRA (react-scripts 5), React Router v6, localStorage, GitHub Pages
**App path:** `travel-baggage-checker/trip-manager-app/`
**Design system:** "The Curated Journey" — see `Stich/SPEC.md`

## Core Context

- ANALYSIS.md is the complete spec — every component, prop, behavior, testid documented there
- 10 categories: higiene, ropa-interior, ropa-exterior, calzado, electronica, documentos, medicamentos, accesorios, entretenimiento, otros
- `category` REQUIRED on Item — default `'otros'`
- All `setTrips` calls: functional form `setTrips(prev => ...)` — no stale closures
- `importTrips` must call `migrateTripsToCategories(parsed)` before `setTrips`
- Dead code: ItemForm.tsx, ItemList.tsx do NOT exist in this build
- Design system rules (non-negotiable): no #000000, no borders, no <hr>, no inline styles, gradient CTAs, lift hover

## Component List

- `Navbar` — brand + My Trips (count badge) + New Trip CTA
- `TripForm` — create trip with items; grouped by category pre-save
- `TripList` — trip cards with progress bars and actions
- `EditableItemList` — group/filter items, inline edit, dual checkboxes
- `Home` — hero + menu cards + quick stats
- `TripsPage` — search, sort, export, import
- `TripDetails` — editable name, stats, actions, EditableItemList, progress

## Key Patterns

- `useTripData` hook via `TripContext` → `useTripContext()`
- 16 mutations defined in ANALYSIS.md Part 2
- `data-testid` attributes: see ANALYSIS.md Part 4 per-component sections
- CSS: no per-component files; use `globals.css` + `components.css`

## Learnings

- CSS class `.trip-card` is authoritative (not `.trip-list-item`)
- Progress bars: `.trip-progress-bar-track` / `.trip-progress-bar-fill` / `--returned` variant
- Item rows: `.item-row` with `.packed` modifier when `isIn === true`
- Packed state: `var(--color-secondary)` green + line-through
