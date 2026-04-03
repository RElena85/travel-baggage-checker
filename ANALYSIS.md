# TripPacker — Complete Application Analysis

**Purpose:** Capture every capability, data model, design rule, and interaction so the app can be rebuilt from scratch.  
**Date:** 2026-03-28  
**Source audit:** All `src/` files, `Stich/` design system, Stitch HTML prototypes

---

## Part 1: Data Model

### `Item`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | yes | Generated via `Date.now()-index-random` |
| `name` | `string` | yes | Max 50 chars (validated in helpers) |
| `isIn` | `boolean` | yes | "Packed" checkbox |
| `isBack` | `boolean` | yes | "Returned" checkbox |
| `category` | `ItemCategory` | yes | Default `'otros'`; required on all items |
| `tag` | `string` | no | Optional free-text tag for grouping |

### `ItemCategory` (union type — 10 values)
| Key | Label (Spanish) | Icon | Display Color |
|-----|-----------------|------|---------------|
| `higiene` | Higiene Personal | 🧴 | `#e3f2fd` |
| `ropa-interior` | Ropa Interior | 👙 | `#fce4ec` |
| `ropa-exterior` | Ropa Exterior | 👕 | `#f3e5f5` |
| `calzado` | Calzado | 👟 | `#fff3e0` |
| `electronica` | Electrónicos | 📱 | `#e8f5e8` |
| `documentos` | Documentos | 📄 | `#fff8e1` |
| `medicamentos` | Medicamentos | 💊 | `#ffebee` |
| `accesorios` | Accesorios | 🎒 | `#f1f8e9` |
| `entretenimiento` | Entretenimiento | 🎧 | `#e0f2f1` |
| `otros` | Otros | 📦 | `#f5f5f5` |

### `Trip`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | yes | Generated via `Date.now().toString()` |
| `name` | `string` | yes | Trimmed on save |
| `destination` | `string` | no | Free-text city/country |
| `departureDate` | `string` | no | ISO `YYYY-MM-DD` |
| `items` | `Item[]` | yes | Array of packing items |
| `createdAt` | `Date` | yes | Set on creation |
| `updatedAt` | `Date` | yes | Updated on every mutation |

### Persistence
- **Storage:** `localStorage` key `trippacker_trips`
- **Serialization:** `JSON.stringify` / `JSON.parse`
- **Date handling:** Dates stored as ISO strings, re-hydrated via `new Date(value)` on load
- **Migration:** `migrateTripsToCategories()` adds `category: 'otros'` to items missing the field on load AND import

---

## Part 2: State Management & Mutations

Single custom hook `useTripData()` exposed via `TripContext` → `useTripContext()`.

### All 16 mutations

| # | Function | Signature | What it does |
|---|----------|-----------|-------------|
| 1 | `addTrip` | `(name, items[], destination?, departureDate?)` | Creates a new trip with `Date.now()` ID; items get composite IDs |
| 2 | `copyTrip` | `(tripId)` | Deep-clones trip, appends " (Copy)", resets all `isIn`/`isBack` to false |
| 3 | `deleteTrip` | `(tripId)` | Removes trip from array |
| 4 | `updateItemStatus` | `(tripId, itemId, 'isIn'\|'isBack')` | Toggles the boolean field on the item |
| 5 | `addItemToTrip` | `(tripId, itemName, category?)` | Adds a new item to an existing trip; defaults category to `'otros'` |
| 6 | `removeItemFromTrip` | `(tripId, itemId)` | Removes a single item from a trip |
| 7 | `updateTripName` | `(tripId, newName)` | Renames a trip |
| 8 | `updateItemName` | `(tripId, itemId, newName)` | Renames a single item |
| 9 | `updateItemTag` | `(tripId, itemId, tag)` | Sets/clears the optional tag on an item |
| 10 | `updateItemCategory` | `(tripId, itemId, category)` | Changes item's category |
| 11 | `markAllPacked` | `(tripId)` | Sets `isIn: true` on ALL items in a trip |
| 12 | `unpackAll` | `(tripId)` | Sets `isIn: false, isBack: false` on ALL items |
| 13 | `clearAllTrips` | `()` | Empties array + removes localStorage key |
| 14 | `getTrip` | `(tripId)` → `Trip \| undefined` | Lookup by ID |
| 15 | `exportTrips` | `()` → `string` | Returns JSON string of all trips |
| 16 | `importTrips` | `(json)` → `boolean` | Parses JSON, migrates categories, replaces all trips |

### Auto-save
- `useEffect` watches `[trips, loading]` — writes to localStorage on every change after initial load

---

## Part 3: Routing & Page Structure

**Router:** React Router v6 with `BrowserRouter`  
**Basename:** `process.env.PUBLIC_URL` (for GitHub Pages subpath)

| Path | Page | Purpose |
|------|------|---------|
| `/` | `Home` | Dashboard landing — menu cards + quick stats |
| `/trips` | `TripsPage` | Trip list with search, sort, export/import |
| `/create-trip` | `CreateTrip` | Form to create a new trip with items |
| `/trip/:id` | `TripDetails` | Full trip view: edit name, manage items, progress |

### Navbar (persistent across all pages)
- Brand link → `/`
- "My Trips" link → `/trips` with trip count badge
- "New Trip" CTA link → `/create-trip`
- Active state: underline/highlight on current route

---

## Part 4: Components & Their Capabilities

### 4.1 `Navbar`
- Shows on all pages
- Brand: "✈️ TripPacker" links to home
- Nav links: My Trips (with count badge), New Trip
- Active route detection via `useLocation()`
- `data-testid`: `navbar-brand`, `nav-trips`, `nav-trips-count`, `nav-create-trip`

### 4.2 `TripForm` (used in CreateTrip page)
**Purpose:** Create a new trip with name, destination, date, and initial items.

**Fields:**
- Trip name (required, text input)
- Destination (optional, text input)
- Departure date (optional, date picker)
- Items list builder:
  - New item name input + category dropdown + add button
  - Enter key adds item
  - Items displayed grouped by category
  - Each item: editable name, changeable category, removable
  - Empty state with tip text

**Behaviors:**
- Submit disabled until trip name is non-empty
- Valid items = name is non-empty after trim
- On save: navigates to `/trips`
- Cancel link → `/`

**`data-testid` attributes:** `trip-name-input`, `trip-destination-input`, `trip-departure-input`, `new-item-name-input`, `category-select`, `add-item-button`, `item-input-{index}`, `remove-item-{index}`, `save-trip-button`

### 4.3 `TripList` (used in TripsPage)
**Purpose:** Display all trips as cards with stats and actions.

**Per-trip card shows:**
- Trip name
- Destination (if set)
- Created date + departure date badge (if set)
- Item count
- Stats: packed count, returned count
- Progress bar (packed %) using CSS custom property `--bar-fill`
- Progress text: "X% packed • Y/Z returned"

**Actions per trip:**
- View → navigates to `/trip/{id}`
- Copy → calls `copyTrip(id)`
- Delete → two-step inline confirmation (no browser confirm dialog)
  - Click Delete → shows "Delete {name}?" with Yes/No buttons
  - Yes → calls `deleteTrip(id)`
  - No → cancels, returns to normal actions

**Empty state:** Icon + "No trips yet" + Create Trip link

**`data-testid` attributes:** `view-trip-{id}`, `copy-trip-{id}`, `delete-trip-{id}`, `delete-confirm-{id}`, `confirm-delete-{id}`, `cancel-delete-{id}`

### 4.4 `EditableItemList` (used in TripDetails)
**Purpose:** Full item management within an existing trip.

**Grouping controls:**
- Group by: Category (default) | Tag | None
- Filter by category (when grouped by category)

**Add item form (inline):**
- Name input + category dropdown + Add button

**Per-item display:**
- Two checkboxes: Packed (`isIn`) and Returned (`isBack`)
- Item name
- Category badge (icon + label)
- Tag badge (if present)
- Edit button → inline edit mode
- Remove button

**Inline edit mode:**
- Editable name input (autofocus)
- Category dropdown
- Tag input (with datalist of existing tags)
- Save/Cancel buttons
- Enter to save, Escape to cancel

**Packed state:** Item row gets `.packed` class (visual: strikethrough/muted)

**Group headers:** Category icon + label + count

**Empty state:** "📦 No items yet — Add your first item"

**`data-testid` attributes:** `group-by-select`, `filter-category-select`, `new-item-input`, `item-{id}-in`, `item-{id}-back`

### 4.5 `Home` page
- Hero header: "✈️ TripPacker" + subtitle
- Menu grid: two cards
  - "My Trips" card → `/trips` (shows trip count badge)
  - "New Trip" card → `/create-trip` (shows "Start planning →")
- Quick stats (visible when trips > 0):
  - Total trips count
  - Total items count (across all trips)
  - Items packed count (across all trips)

### 4.6 `TripsPage`
- Page header: "🧳 My Trips" with subtitle
- Loading state: spinner + "Loading your trips..."
- Empty state: icon + message + "Create Your First Trip" CTA
- **When trips exist:**
  - Search bar (filters by name OR destination, case-insensitive)
  - Sort dropdown: Newest first | Oldest first | Name A–Z | Most packed
  - Results count: "X of Y trips" (with search query text if filtering)
  - Export button → downloads JSON backup file
  - Import button → file picker (`.json`) → replaces all trips
  - Import success/error alerts (auto-dismiss after 3s for success)
  - "No trips match" empty state with Clear Search button
  - `TripList` component with filtered/sorted trips

**`data-testid` attributes:** `trips-search`, `trips-sort`, `export-trips`, `import-trips`, `import-file-input`, `import-error`, `import-success`, `clear-search-btn`

### 4.7 `TripDetails` page
- **Trip not found:** error state with "Back to Home" link
- **Trip header:**
  - Editable trip name (click edit button → inline input with Save/Cancel)
  - Destination display (if set)
  - Departure date display (if set)
  - Back to Trips link
- **Overview stats cards:** Total Items, Packed (with %), Returned (with %)
- **Quick actions bar (visible when items > 0):**
  - "Mark All Packed" button (disabled when all packed)
  - "Reset All" button (disabled when none packed and none returned)
- **EditableItemList** — full item management
- **Trip Progress section (visible when items > 0):**
  - Packing progress bar with `--bar-fill` CSS prop
  - Return progress bar with `--bar-fill` CSS prop + `trip-progress-bar-fill--returned` class
  - Counts: "Packed: X/Y" and "Returned: X/Y (Z%)"

**`data-testid` attributes:** `edit-trip-name-btn`, `save-trip-name-btn`, `cancel-trip-name-btn`, `stat-card-packed`, `stat-packed`, `stat-card-returned`, `stat-returned`, `mark-all-packed`, `unpack-all`, `stat-card-progress`

---

## Part 5: Design System — "The Curated Journey"

### Philosophy
- **Editorial Concierge** aesthetic — high-end travel journal, not a utility tool
- Intentional asymmetry, generous white space
- Surface layering (background color shifts, not borders)
- Fonts: **Manrope** (display/headlines) + **Inter** (body/labels)

### Non-negotiable Rules
1. **No `border: 1px solid`** for structural sectioning
2. **No `<hr>` elements**
3. **No `#000000`** → always `var(--color-on-surface)` (#191c1d)
4. **No per-component CSS files** → everything in `globals.css` + `components.css`
5. **No inline styles** (except CSS custom property injection like `--bar-fill`)
6. **Primary CTA:** gradient fill (`--gradient-primary`), never flat color
7. **Hover:** lift (`translateY(-2px)` + shadow), never darken
8. **Packed state:** `var(--color-secondary)` green (#2c694e) + line-through
9. **List items:** separated by gap spacing, not borders/dividers
10. **Inputs:** resting = `--color-surface-container-high` no border; focus = white + ghost border

### Full Token Set
(See `globals.css` `:root` block — 16 colors, 1 gradient, 1 shadow, 6 radii, 8 spacing values, 2 font families, 8 font sizes)

---

## Part 6: User Stories & Acceptance Criteria

---

### Epic 1: Trip Management

#### US-1.1: Create a New Trip
**As a** traveler  
**I want to** create a new trip with a name, optional destination, optional departure date, and initial packing items  
**So that** I can start organizing what I need to pack

**Acceptance Criteria:**
1. ✅ A "New Trip" entry point exists on the Home page and Navbar
2. ✅ The create form has fields: Trip Name (required), Destination (optional), Departure Date (optional date picker)
3. ✅ The Save/Create button is disabled until Trip Name is non-empty
4. ✅ I can add items to the trip before saving, each with a name and category
5. ✅ Pressing Enter in the item name input adds the item
6. ✅ Items in the pre-save list are grouped by category with icon + label headers
7. ✅ I can edit item names and categories in the pre-save list
8. ✅ I can remove individual items from the pre-save list
9. ✅ Empty items (blank name after trim) are excluded on save
10. ✅ On save, the app navigates to the trips list page
11. ✅ A Cancel action returns to the Home page without saving
12. ✅ The new trip gets a unique `Date.now()` ID, `createdAt`, and `updatedAt` timestamps

#### US-1.2: View All Trips
**As a** traveler  
**I want to** see all my trips in a list/grid view  
**So that** I can quickly find and access any trip

**Acceptance Criteria:**
1. ✅ Each trip card shows: name, destination (if set), created date, departure date (if set), item count
2. ✅ Each trip card shows packed/returned counts and a visual progress bar (packed %)
3. ✅ Progress text format: "X% packed • Y/Z returned"
4. ✅ Each card has View, Copy, and Delete actions
5. ✅ Empty state shows icon + message + "Create Your First Trip" CTA when no trips exist
6. ✅ Loading state shows spinner + "Loading your trips..." text

#### US-1.3: Search and Sort Trips
**As a** traveler  
**I want to** search trips by name or destination and sort them  
**So that** I can find specific trips quickly

**Acceptance Criteria:**
1. ✅ Search input filters trips in real-time (case-insensitive) by name OR destination
2. ✅ Sort options: Newest first, Oldest first, Name A–Z, Most packed
3. ✅ Filtered count shows "X of Y trips" with the search query when filtering
4. ✅ A "No trips match" message with Clear Search button appears when search has zero results
5. ✅ Search and sort work together (sort applies to filtered subset)

#### US-1.4: Copy a Trip
**As a** traveler  
**I want to** duplicate an existing trip  
**So that** I can reuse a packing list for a similar trip

**Acceptance Criteria:**
1. ✅ Copy action creates a new trip with the same name + " (Copy)" suffix
2. ✅ All items are copied with their names, categories, and tags
3. ✅ All copied items have `isIn: false` and `isBack: false` (reset packing state)
4. ✅ The copied trip gets a new unique ID and fresh timestamps
5. ✅ The copied trip appears in the trips list immediately

#### US-1.5: Delete a Trip
**As a** traveler  
**I want to** delete a trip I no longer need  
**So that** my trips list stays clean

**Acceptance Criteria:**
1. ✅ Delete requires a two-step inline confirmation (no browser `confirm()` dialog)
2. ✅ Clicking Delete shows "Delete {name}?" with Yes and No buttons
3. ✅ Clicking Yes removes the trip permanently
4. ✅ Clicking No cancels and returns to normal action buttons
5. ✅ Only one trip's delete confirmation is shown at a time

#### US-1.6: Edit Trip Name
**As a** traveler  
**I want to** rename an existing trip  
**So that** I can correct typos or update the trip purpose

**Acceptance Criteria:**
1. ✅ An edit button appears next to the trip name on the Trip Details page
2. ✅ Clicking edit shows an inline text input pre-filled with the current name
3. ✅ Save button commits the change; Cancel discards it
4. ✅ Enter key saves; Escape key cancels
5. ✅ Empty/whitespace-only names are not saved
6. ✅ `updatedAt` timestamp is refreshed on save

---

### Epic 2: Packing Item Management

#### US-2.1: Add Items to an Existing Trip
**As a** traveler  
**I want to** add new packing items to a trip after creation  
**So that** I can update my list as I remember more things to pack

**Acceptance Criteria:**
1. ✅ An "Add item" form appears on the Trip Details page
2. ✅ The form has a name input and a category dropdown
3. ✅ Submitting adds the item to the trip immediately
4. ✅ The item gets a unique composite ID
5. ✅ Default category is `'otros'` if not specified
6. ✅ The input clears after adding

#### US-2.2: Mark Items as Packed / Returned
**As a** traveler  
**I want to** check off items as packed (for departure) and returned (after the trip)  
**So that** I can track my packing progress in both directions

**Acceptance Criteria:**
1. ✅ Each item has TWO independent checkboxes: "Packed" (`isIn`) and "Returned" (`isBack`)
2. ✅ Checking "Packed" applies a visual packed state (green color + strikethrough per design system)
3. ✅ The checkboxes toggle independently — I can mark "Returned" without "Packed" and vice-versa
4. ✅ Each toggle updates `updatedAt` on the trip

#### US-2.3: Edit Item Details
**As a** traveler  
**I want to** edit an item's name, category, and tag  
**So that** I can fix mistakes or reorganize my packing

**Acceptance Criteria:**
1. ✅ Clicking the edit button on an item enters inline edit mode
2. ✅ Edit mode shows: editable name, category dropdown, tag input (with datalist of existing tags)
3. ✅ Enter saves, Escape cancels
4. ✅ Save and Cancel buttons are available
5. ✅ Empty name prevents saving
6. ✅ Category change immediately re-groups the item

#### US-2.4: Remove an Item
**As a** traveler  
**I want to** remove an item from my packing list  
**So that** I can clean up items I don't need

**Acceptance Criteria:**
1. ✅ Each item has a remove/delete button
2. ✅ Clicking remove immediately deletes the item (no confirmation)
3. ✅ The item disappears from the grouped list
4. ✅ Progress bars and counts update immediately

#### US-2.5: Group and Filter Items
**As a** traveler  
**I want to** group my items by category or tag and filter by category  
**So that** I can focus on what I still need in a specific category

**Acceptance Criteria:**
1. ✅ A "Group by" dropdown offers: Category (default), Tag, None
2. ✅ When grouped by Category: items grouped under headers with category icon + label + count
3. ✅ When grouped by Tag: items grouped under tag headers; untagged items show as "Untagged"
4. ✅ When "None": flat list with "All Items" header
5. ✅ A "Filter Category" dropdown appears when grouping by category
6. ✅ Filtering shows only items in the selected category
7. ✅ Category order follows `ITEM_CATEGORIES` definition order (hygiene → otros)

#### US-2.6: Bulk Actions
**As a** traveler  
**I want to** mark all items as packed or reset all items  
**So that** I can quickly update status for the whole trip

**Acceptance Criteria:**
1. ✅ "Mark All Packed" button sets `isIn: true` on every item in the trip
2. ✅ "Reset All" button sets `isIn: false` AND `isBack: false` on every item
3. ✅ "Mark All Packed" is disabled when all items are already packed
4. ✅ "Reset All" is disabled when no items are packed and no items are returned
5. ✅ Both buttons are only visible when the trip has at least one item

---

### Epic 3: Data Portability

#### US-3.1: Export Trips
**As a** traveler  
**I want to** export all my trips as a JSON backup file  
**So that** I can have a local backup of my data

**Acceptance Criteria:**
1. ✅ Export button is available on the Trips page (only when trips exist)
2. ✅ Clicking Export downloads a `.json` file named `trippacker-backup-YYYY-MM-DD.json`
3. ✅ The file contains all trips with all their items, dates, and metadata

#### US-3.2: Import Trips
**As a** traveler  
**I want to** import trips from a backup JSON file  
**So that** I can restore my data or transfer between devices

**Acceptance Criteria:**
1. ✅ Import button opens a file picker accepting `.json` files
2. ✅ Valid import replaces all current trips with imported data
3. ✅ Imported data is migrated (legacy items without `category` get `'otros'`)
4. ✅ Dates are properly re-hydrated from strings to Date objects
5. ✅ Success message appears and auto-dismisses after 3 seconds
6. ✅ Invalid file shows an error message
7. ✅ The file input resets after import so the same file can be imported again

---

### Epic 4: Navigation & Layout

#### US-4.1: Persistent Navigation Bar
**As a** traveler  
**I want to** see a navigation bar on every page  
**So that** I can move between sections without going back to the home page

**Acceptance Criteria:**
1. ✅ Navbar shows on all four routes
2. ✅ Brand "✈️ TripPacker" links to Home (`/`)
3. ✅ "My Trips" link shows trip count badge when trips > 0
4. ✅ "New Trip" link styled as a CTA
5. ✅ Active route is visually highlighted

#### US-4.2: Trip Progress Visualization
**As a** traveler  
**I want to** see visual progress bars for packing and return status  
**So that** I can quickly gauge how prepared I am

**Acceptance Criteria:**
1. ✅ Trip cards show a single progress bar for packed percentage
2. ✅ Trip Details page shows TWO progress bars: packing progress + return progress
3. ✅ Progress bars use CSS custom property `--bar-fill` for width
4. ✅ Return progress bar has a distinct visual style (`.trip-progress-bar-fill--returned`)
5. ✅ Stats cards show numeric counts with percentages

#### US-4.3: Trip Not Found Handling
**As a** traveler  
**I want to** see a friendly error when I visit a trip that doesn't exist  
**So that** I know what happened and can navigate back

**Acceptance Criteria:**
1. ✅ Visiting `/trip/{invalid-id}` shows a "Trip Not Found" message
2. ✅ The error page has a "Back to Home" link
3. ✅ No JS errors thrown — graceful handling

---

### Epic 5: Persistence & Offline

#### US-5.1: Automatic Local Persistence
**As a** traveler  
**I want** my trips to persist in the browser  
**So that** I don't lose my data when I close the tab

**Acceptance Criteria:**
1. ✅ All trip data is saved to `localStorage` under key `trippacker_trips`
2. ✅ Data is auto-saved on every state change (after initial load completes)
3. ✅ On app load, data is read from localStorage and displayed
4. ✅ Corrupted localStorage data is caught gracefully — app loads with empty trips
5. ✅ Legacy items missing `category` are migrated to `'otros'` on load

#### US-5.2: No Backend Required
**As a** developer  
**I want** the app to work entirely client-side  
**So that** it can be deployed as a static site with zero server costs

**Acceptance Criteria:**
1. ✅ No API calls — no fetch, no axios, no network requests for data
2. ✅ All state is in React Context + localStorage
3. ✅ Deployable to any static host (GitHub Pages, Netlify, Vercel, etc.)
4. ✅ Works offline after initial page load (all assets bundled)

---

### Epic 6: Design System Compliance

#### US-6.1: "The Curated Journey" Visual Language
**As a** user  
**I want** the app to feel like a premium editorial travel journal  
**So that** using it is a pleasant experience, not a chore

**Acceptance Criteria:**
1. ✅ Fonts: Manrope for headlines/display, Inter for body/labels
2. ✅ Color palette uses Atlantic blues + Mediterranean greens (all via CSS variables)
3. ✅ NO `#000000` anywhere — text uses `var(--color-on-surface)` (#191c1d)
4. ✅ NO structural borders (`1px solid`) — separation via surface layer backgrounds
5. ✅ NO `<hr>` elements anywhere
6. ✅ NO per-component CSS files — all styles in `globals.css` + `components.css`
7. ✅ NO inline styles (except CSS custom property injection)
8. ✅ Primary CTAs use gradient (`--gradient-primary`), not flat color
9. ✅ Hover = lift (`translateY(-2px)` + ambient shadow), never darken
10. ✅ Inputs: no border at rest (surface-container-high bg), ghost border on focus
11. ✅ Packed items: green (`--color-secondary`) + line-through decoration
12. ✅ Cards: no heavy shadows — separation from background color alone
13. ✅ Floating elements (modals): glass effect (80% opacity + backdrop-blur 20px)
14. ✅ Spacing strict 4px grid; 1:3 ratio between internal padding and external margin
15. ✅ Labels uppercase with `+0.05em` tracking when used as metadata badges

---

### Epic 7: Testing & Quality

#### US-7.1: Unit Test Coverage
**As a** developer  
**I want** comprehensive unit tests  
**So that** regressions are caught before deployment

**Acceptance Criteria:**
1. ✅ All tests use `@testing-library/react` with `data-testid` selectors (no CSS class selectors)
2. ✅ Centralized localStorage mock in `setupTests.ts` (exported `localStorageMock`, `configurable: true`)
3. ✅ All mock items include required `category` field
4. ✅ No wall-clock timing assertions (JSDOM/CI unreliable)
5. ✅ `AppRoutes` tested via `MemoryRouter` injection (named export)
6. ✅ Every component has a corresponding `.test.tsx` file

#### US-7.2: E2E Test Coverage
**As a** developer  
**I want** Playwright E2E tests covering user flows  
**So that** the full application works correctly end-to-end

**Acceptance Criteria:**
1. ✅ E2E specs: navigation (7), create-trip (7), trip-management (9), persistence (6)
2. ✅ All specs use `localStorage.clear()` in beforeEach for isolation
3. ✅ Primary selector: `page.getByTestId()` — fallback to role/text only when no testid exists
4. ✅ Dynamic IDs handled via `getFirstTripId()` helper
5. ✅ Playwright config: Chromium only, webServer auto-start port 3000
6. ✅ CI workflow runs both unit + E2E tests

---

### Epic 8: Deployment

#### US-8.1: GitHub Pages Deployment
**As a** developer  
**I want** automated deployment to GitHub Pages  
**So that** the app is publicly accessible

**Acceptance Criteria:**
1. ✅ `package.json` `homepage` points to GitHub Pages URL
2. ✅ `gh-pages` package handles the deploy
3. ✅ `deploy.yml` workflow: `npm ci` → unit tests → build → deploy
4. ✅ `ci.yml` workflow: runs on push/PR to `main`/`squad/**`
5. ✅ `PUBLIC_URL` must be overridden to empty for local development (`.env.development`)
6. ✅ Router `basename` set from `process.env.PUBLIC_URL`

---

## Part 7: Known Bugs & Tech Debt (to address in rebuild)

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | `homepage` in `package.json` breaks local dev | HIGH | Must use `.env.development` with `PUBLIC_URL=` override |
| 2 | HMR crash on Windows (CRA 5 + react-scripts 5.0.1) | HIGH | `FAST_REFRESH=false` needed in `.env.development` |
| 3 | Dead code: `ItemForm.tsx`, `ItemList.tsx`, `ItemList.test.tsx` | MED | Not referenced — should not exist in rebuild |
| 4 | Some `useTripData` mutators used stale closure (now fixed in some) | MED | Use `setTrips(prev => ...)` pattern consistently |
| 5 | `importTrips` didn't call `migrateTripsToCategories` (now fixed) | MED | Ensure migration runs on import in rebuild |
| 6 | Missing `data-testid` on some page-level elements | LOW | Add comprehensive testids from the start |
| 7 | CRA 5 is deprecated — consider Vite migration | MED | Rebuild should evaluate Vite as bundler |

---

## Part 8: Stitch HTML Reference Screens

Two Stitch-generated prototypes exist as visual baselines:

### `stitch_trips_list (1)/code.html` — Trip Details Page
- Top nav with frosted glass effect
- Trip header: title + location + date
- Action buttons: "Mark All Packed" + "Reset All"
- Left sidebar: progress bento card + destination image
- Right main: packing list grouped by category
- Item states: packed (green checkbox + strikethrough) vs unpacked (outline checkbox)
- Delete button: hidden, reveals on hover
- Add item: inline form at top of list
- Mobile: bottom nav bar

### `stitch_trips_list (2)/code.html` — Create Trip Page  
- Side navigation + top app bar
- Form: Trip Name, Destination (with location icon), Departure Date (with calendar icon)
- "Packing Blueprint" section with item cards
- Item cards: icon + name + category label + close button
- Empty card slot: dashed border + "Quick Add"
- Pull quote design pattern: indented, border-left accent
- Footer actions: Cancel (text) + Create Trip (gradient CTA)
- Background: faded vintage map texture (decorative, asymmetric)
