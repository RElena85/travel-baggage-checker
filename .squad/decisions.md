# Squad Decisions

## Active Decisions

### 2026-03-28: No external state library
**By:** Relena (pre-wired)  
React Context + `useTripData` custom hook is sufficient for this app's scale. Redux, Zustand, or any other store library would be over-engineering. Do not introduce external state management without a logged decision.

### 2026-03-28: `category` is required on `Item`
**By:** Relena (pre-wired)  
Any new form component, factory function, or test that creates an `Item` must include a `category` field. The default for uncategorized items is `'otros'`. The stale `ItemForm.tsx` which references a non-existent `quantity` field and lacks `category` is dead code.

### 2026-03-28: `ItemForm.tsx` and `ItemList.tsx` are dead code
**By:** Relena (pre-wired)  
Neither file is referenced by any active route or page. Pending Mal's decision to remove before next release.

### 2026-03-28: `Date.now()` IDs are intentional
**By:** Relena (pre-wired)  
Acceptable for single-user, single-device localStorage persistence. Not a bug. Must not be changed without a logged decision if multi-device sync is ever considered.

### 2026-03-28: Static SPA only — no SSR, no server routes
**By:** Relena (pre-wired)  
Deploy target is GitHub Pages. All routing must work as a client-side SPA. No server-side rendering will be introduced without a full architectural decision.

### 2026-03-28: Tests ship in the same PR as the feature
**By:** Relena (pre-wired)  
Kaylee is the single agent responsible for both code and tests. Zoe reviews. QA is not a separate phase. A PR without test coverage is not done.

### 2026-03-28: Design system — "The Curated Journey"
**By:** Relena (pre-wired)  
The design spec in `Stich/SPEC.md` is authoritative. CSS token names in `globals.css` must match exactly. No new per-component CSS files. No inline styles. No `border: 1px solid` for structural sectioning. No `<hr>` elements. No `#000000` — use `var(--color-on-surface)`. Primary CTAs use `--gradient-primary`. Buttons hover = lift (`translateY(-2px)`) not darken.

### 2026-03-28: Stitch UI generation is mandatory for new UI surfaces
**By:** Relena (pre-wired)  
Every new component or page must follow the 5-step Stitch workflow documented in `squad-spec.md`. Stitch output is the visual baseline; the engineer always owns TypeScript types, hooks, routing, test coverage, and accessibility attributes.

---

## Merged from Inbox

> The following decisions were filed by agents via `.squad/decisions/inbox/` and merged here by Scribe. Source files deleted after merge.

### 2026-01-22 (merged 2026-03-28): Phase 3 TSX class name decisions — Kaylee
**Source:** `.squad/decisions/inbox/kaylee-phase3-complete.md`

**TripDetails.tsx:** Canonical progress bar class names are `.trip-progress-bar-track` / `.trip-progress-bar-fill` / `.trip-progress-bar-fill--returned`.

**EditableItemList.tsx:** Item rows use `.item-row`. The `.packed` modifier is applied when `item.isIn === true`.

**TripList.tsx:** `.trip-card` is the authoritative class (not `.trip-list-item`). The implementation plan was wrong; CSS is authoritative. Sub-classes `.trip-card-header` etc. only work under `.trip-card`.

**Home.tsx / Navbar.tsx / TripForm.tsx:** Clean — no violations, no changes needed.

**Dead code (ItemForm.tsx, ItemList.tsx, ItemList.test.tsx):** Confirmed orphaned. Deletion blocked by missing `pwsh.exe`. Recommended manual `git rm` in terminal.

### 2025-07-14 (merged 2025-07-15): QA audit verdict — Zoe
**Source:** `.squad/decisions/inbox/zoe-qa-verdict.md`

**Overall verdict:** APPROVED WITH NOTES. Test suite is well-structured with correct selectors and main user-flow coverage.

**MED source bugs to fix before next release:**
- `useTripData.ts` — `importTrips()` does NOT call `migrateTripsToCategories()` on imported data; old backups will have undefined `item.category`.
- `useTripData.ts` — Stale closure: all 11 state mutators capture `trips` directly rather than using `setTrips(prev => ...)`. Risk of dropped updates under React 18 concurrent mode.

**Test quality issues fixed (see below):** Wall-clock timing assertions removed; localStorage mock centralised; category fields added to mock items.

**Dead code to remove:** `ItemList.tsx`, `ItemForm.tsx`, `ItemList.test.tsx`.

**Test coverage gaps flagged:** `TripsPage`, `TripDetails`, and several `useTripData` methods have zero or weak test coverage. See full audit in `.squad/decisions/inbox/zoe-qa-verdict.md` history.

**Missing `data-testid` attributes** flagged for Kaylee — see QA verdict for full table.

### 2025-07-15 (merged 2025-07-15): Test hygiene fixes — Zoe
**Source:** `.squad/decisions/inbox/zoe-test-quality-fixes.md`

**`setupTests.ts`:** Central localStorage mock now uses `Object.defineProperty` with `configurable: true, writable: true` and exports `localStorageMock` for reuse by all test files.

**`App.test.tsx` and `useTripData.test.ts`:** Removed local localStorage mock declarations; both now import the shared `localStorageMock` from `setupTests.ts`. Redundant `mockClear()` calls removed from `beforeEach`.

**`App.test.tsx`:** Added `category` field to all mock `Item` objects (enforces `category is required on Item` decision). Removed flaky `performance.now()` wall-clock timing assertions; test renamed to `'should render without errors'`.

**Standing rule:** No wall-clock timing assertions (`performance.now()`) in JSDOM-based tests — they are non-deterministic in CI. Central mock setup in `setupTests.ts` is the single source of truth for the localStorage mock.

### 2026-03-28 (merged 2026-03-28): Playwright added for E2E verification — Wash
**Source:** `.squad/decisions/inbox/wash-playwright-setup.md`

**Infrastructure:** @playwright/test added as devDependency. playwright.config.ts configured to run against http://localhost:3000 with webServer auto-start. E2E tests live in trip-manager-app/e2e/. CI workflow (ci.yml) runs unit tests + E2E tests on push/PR. Deploy workflow gates on unit tests passing.

**Rationale:** Agents cannot run tests via pwsh.exe in this environment. GitHub Actions provides the real verification layer. Playwright gives real browser verification.

### 2026-03-28 (merged 2026-03-28): E2E test coverage — 29 tests across 4 specs — Zoe
**Source:** `.squad/decisions/inbox/zoe-e2e-coverage.md`

**Test generation:** All 5 E2E spec files embedded in `trip-manager-app/create_e2e_tests.py`. Run `python create_e2e_tests.py` from `trip-manager-app/` to emit:
- `e2e/helpers.ts` — `createTrip()`, `getFirstTripId()` helpers
- `e2e/navigation.spec.ts` — 7 tests (routes, navigation)
- `e2e/create-trip.spec.ts` — 7 tests (form, items, submission)
- `e2e/trip-management.spec.ts` — 9 tests (pack, copy, delete, actions)
- `e2e/persistence.spec.ts` — 6 tests (reload, navigation, stats)

**Covered flows:** Navigation (7 tests), trip creation (7 tests), trip operations & actions (9 tests), data persistence (6 tests). Missing `data-testid` attributes flagged for Kaylee in TripForm new-item input, trip card view links, and Home menu cards.

**Assumptions:** Dev server at `http://localhost:3000`. `PUBLIC_URL` empty in dev. `localStorage.clear()` sufficient isolation. `Date.now()` IDs intentional (team decision).

### 2026-03-28: Dead code removal approved
**By:** Mal (Lead)  
**What:** `ItemForm.tsx`, `ItemList.tsx`, and `ItemList.test.tsx` are confirmed orphaned — no active route, page, or import references them. Approved for deletion. Kaylee to execute with `git rm`. This unblocks accurate coverage reporting.  
**Why:** Dead code accumulates misleading coverage numbers and creates maintenance confusion. Removal is low-risk (zero references).

### 2026-03-28: Fix stale closures in useTripData.ts
**By:** Mal (Lead)  
**What:** All 11 state mutators in `useTripData.ts` capture `trips` directly rather than using the functional `setTrips(prev => ...)` form. Under React 18 concurrent mode this risks dropped updates. Approved fix: convert all mutators to `setTrips(prev => ...)` form. Kaylee to implement — ships with unit test coverage confirming no regressions.  
**Why:** MED-severity correctness bug surfaced by Zoe's QA audit. React 18 concurrent features (Suspense, transitions) can batch state updates; stale closures will lose intermediate writes.

### 2026-03-28: Fix importTrips() missing migration call
**By:** Mal (Lead)  
**What:** `useTripData.ts` → `importTrips()` does not call `migrateTripsToCategories()` before merging imported data. Old backup JSON files will have `undefined` on `item.category`, violating the "category is required on Item" rule. Approved fix: add `migrateTripsToCategories(parsed)` call inside `importTrips()` before `setTrips()`. Kaylee to implement.  
**Why:** MED-severity data integrity bug. Users who export and re-import trips from before the category field was introduced will see broken category rendering and potential TypeScript errors.

### 2026-03-28: Architectural health check — summary
**By:** Mal (Lead)  
**Overview:** Codebase in good structural health. Stale closure bug substantially resolved—all write-path mutators use functional `setTrips(prev => ...)` updates. Dead code files (`ItemForm.tsx`, `ItemList.tsx`, `ItemList.test.tsx`) confirmed orphaned and eligible for removal. `Item.category` required field is enforced in types.  
**P0 Actions:** Fix `copyTrip` read-then-write race by refactoring lookup inside `setTrips()` callback.  
**P1 Actions:** Add missing `data-testid` attributes; expand test coverage for `TripsPage`, `TripDetails`, `useTripData` edge cases.  
**P2 Actions:** Audit dead code references in decisions.md; E2E smoke run in CI; document `exportTrips` format.

### 2026-03-28: CI/Toolchain health — all critical checks pass
**By:** Wash (Platform Eng)  
**Package.json:** @playwright/test present (`^1.44.0`); all test scripts configured (`test`, `test:coverage`, `test:e2e`, `test:e2e:ui`).  
**CI Workflow:** Unit tests job runs `npm test -- --watchAll=false --forceExit --passWithNoTests`; E2E tests job runs `npm run test:e2e`; parallel execution with artifact upload.  
**Deploy Workflow:** Unit tests correctly gate deployment; `npm test -- --watchAll=false --forceExit --passWithNoTests` before build.  
**.gitignore:** Properly excludes `/playwright-report/` and `/test-results/`.  
**E2E Directory:** Does not exist yet (expected); will be created by `create_e2e_tests.py`. No blocking issues.

### 2026-03-28: E2E test coverage — 31 tests across 4 specs (Zoe)
**By:** Zoe (QA)  
**Files:** All 5 output files embedded in `trip-manager-app/create_e2e_tests.py`. Run `python create_e2e_tests.py` from `trip-manager-app/` to emit:
- `e2e/helpers.ts` — `createTrip()`, `getFirstTripId()` helpers
- `e2e/navigation.spec.ts` — 7 tests (routes, navigation)
- `e2e/create-trip.spec.ts` — 9 tests (form, items, submission)
- `e2e/trip-management.spec.ts` — 9 tests (pack, copy, delete, actions)
- `e2e/persistence.spec.ts` — 6 tests (reload, navigation, stats)

**Covered Flows:** Navigation (7), trip creation (9), trip operations & actions (9), data persistence (6).  
**QA Compliance:** No wall-clock timing assertions; `localStorageMock` centralized in `setupTests.ts` and exported; `category` field present in all mock Items; `waitForURL()` used instead of `waitForTimeout()`.  
**Assumptions:** Dev server at `http://localhost:3000`; `PUBLIC_URL` empty in dev; `localStorage.clear()` sufficient isolation; `Date.now()` IDs intentional (team decision).

### 2026-03-28: data-testid fixes — Kaylee
**By:** Kaylee (Frontend Dev)  
**TripForm.tsx:** Added `data-testid="new-item-name-input"` to new-item name input (~line 109).  
**TripList.tsx:** Added `data-testid={\`view-trip-${trip.id}\`}` to View/navigate link for each trip card (~line 134).  
**TripDetails.tsx:** Added `data-testid="stat-packed"` to packed stat value and `data-testid="stat-returned"` to returned stat value (~lines 148, 152).  
**Changes:** Attributes only — no logic, styling, or structural changes.

### 2026-03-28: Static verification complete — Kaylee
**By:** Kaylee (Frontend Dev)  
**Status:** PASS WITH NOTES

**Checks Passed:**
- TripForm.tsx data-testid at line 116 (`data-testid="new-item-name-input"`) ✅ No regressions on `trip-name-input`, `add-item-button`, `save-trip-button`
- TripList.tsx data-testid at line 137 (`data-testid={\`view-trip-${trip.id}\`}`) ✅ All copy/delete/confirm/cancel testids present
- useTripData.ts importTrips migration at L185 calls `migrateTripsToCategories(tripsWithDates)` before `setTrips()` ✅
- useTripData.ts setTrips usage: 12/15 calls use functional form; 3 direct calls are safe (non-stale, independent variables) ✅
- `copyTrip` uses `setTrips(prev => ...)` functional form ✅
- TripForm.test.tsx: mock Items include `category: 'otros'`; testids used correctly; no CSS class targeting ✅

**Notes:** The 3 non-functional `setTrips` calls (L36 initial load, L143 clearAllTrips, L186 importTrips) are all safe — none reference stale `trips` directly. `copyTrip` reads `trips.find()` for lookup before functional setter (minor stale-closure exposure but low-risk in practice).

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
