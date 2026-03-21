# Decisions Log

_Appended by agents during sessions. Use the format below. Do not edit existing entries retroactively._

<!-- Format:
## [YYYY-MM-DD] [Decision Title]
**Made by**: [Agent]
**Context**: [Why this decision was needed]
**Decision**: [What was decided]
**Impact**: [What changes as a result]
-->

---

## 2026-03-21 No External State Library

**Made by**: lead
**Context**: TripPacker is a small, solo-scope SPA (~10 source files) with no plans for server-side state, real-time sync, or cross-tab coordination. Evaluating third-party state libraries was raised as the app began growing beyond a single component.
**Decision**: React Context combined with the `useTripData` custom hook is the canonical state solution for this project. Redux, Zustand, Jotai, and any other external store library are explicitly out of scope and must not be introduced.
**Impact**: All state management work routes to `frontend-engineer` under the existing `useTripData` + Context pattern. Any proposal to introduce a state library requires a new decision log entry and lead sign-off before implementation.

---

## 2026-03-21 `category` Is Required on `Item`

**Made by**: lead
**Context**: The `Item` type was extended to include a `category` field. Some legacy form components and factory functions were written before this field existed and do not include it. This caused a test failure in `TripForm.test.tsx` (expected `{ name: 'Test Item' }`, actual call now passes `{ name: 'Test Item', category: 'otros' }`).
**Decision**: `category` is a required field on `Item`. Every form component, factory function, and test fixture that creates an `Item` must include a `category` value. The `'otros'` default is acceptable as a fallback category.
**Impact**: `frontend-engineer` must fix `TripForm.test.tsx` to expect `{ name: 'Test Item', category: 'otros' }`. Any new component or helper that constructs an `Item` must include `category`. Legacy code that omits `category` is non-conformant and must be updated or removed.

---

## 2026-03-21 `ItemForm.tsx` and `ItemList.tsx` Are Dead Code

**Made by**: lead
**Context**: `ItemForm.tsx` references a non-existent `quantity` field and lacks the required `category` field introduced in the current `Item` type. `ItemList.tsx` is not referenced by any active route or page. Both files were found unreachable during a routing audit.
**Decision**: `ItemForm.tsx` and `ItemList.tsx` are formally classified as dead code. They are not to be maintained, extended, or treated as active components. Removal is pending a final `lead` decision before the next release.
**Impact**: `frontend-engineer` must not add new functionality to either file. `lead` will issue a follow-up decision (remove vs rehabilitate) before the next release cycle. Once that decision is logged, `frontend-engineer` executes the outcome.

---

## 2026-03-21 `Date.now()` IDs Are Intentional

**Made by**: lead
**Context**: `Date.now()` is used as the ID generation strategy for `Trip` and `Item` records stored in `localStorage`. This was flagged as a potential collision risk.
**Decision**: `Date.now()` IDs are an intentional design choice, appropriate for a single-user, single-device localStorage scope. They are not a bug. No change to the ID strategy is permitted without a new decision log entry.
**Impact**: `frontend-engineer` must not replace `Date.now()` with UUID libraries or other ID schemes without prior `lead` approval and a logged decision. If multi-device sync is ever considered, a new architectural decision covering ID uniqueness must be written before any implementation work begins.

---

## 2026-03-21 Add Navbar Component

**Made by**: lead
**Context**: The app had no persistent navigation. Users navigated only via in-page links, making it impossible to reach the trips list from the detail view without a back button. A shared top-bar was needed.
**Decision**: Add a `Navbar` component rendered at the `App` root above all routes. Uses React Router `useLocation` for active styling. No external navigation library introduced. Fully client-side.
**Impact**: `src/components/Navbar.tsx` created. `src/App.tsx` imports and renders it above all Routes. CSS added to `components.css`.

---

## 2026-03-21 Remove Dead-Code Files: ItemForm and ItemList

**Made by**: lead
**Context**: `ItemForm.tsx` and `ItemList.tsx` were superseded by the inline item UX inside `TripDetails.tsx` using `EditableItemList`. Neither component is imported anywhere in the active codebase. `ItemList.test.tsx` tests a component no longer in use. Keeping them risks confusion and false confidence from orphaned tests.
**Decision**: Delete `src/components/ItemForm.tsx`, `src/components/ItemList.tsx`, and `src/components/ItemList.test.tsx`. No replacement needed; responsibilities are already handled by `EditableItemList`.
**Impact**: Three files removed. No import changes required (both are already unreferenced). Test suite loses orphaned `ItemList.test.tsx` suite.

---

## 2026-03-21 Static SPA Only — No SSR, No Server Routes

**Made by**: lead
**Context**: The deploy target is GitHub Pages, which serves static files only. Server-side rendering or API routes are architecturally incompatible with this deploy model.
**Decision**: TripPacker is a static, client-side SPA. No server-side rendering (Next.js, Remix, etc.) and no server routes will be introduced. All routing must function as client-side SPA routing. GitHub Pages remains the canonical deploy target.
**Impact**: `platform-engineer` must ensure `deploy.yml` and the `gh-pages` configuration remain aligned with static SPA requirements. Any proposal to introduce SSR requires a full architectural decision log entry and is considered a breaking scope change.

---

## 2026-03-21 Tests Ship in the Same PR as the Feature

**Made by**: lead
**Context**: To prevent test debt accumulation and ensure every merged feature is immediately verifiable, a policy on test delivery timing was needed.
**Decision**: `frontend-engineer` is the single agent responsible for both application code and tests. Tests must be delivered in the same PR as the feature or fix they cover. QA is not a separate phase. A PR without test coverage for the changed behaviour is not considered complete and must not be merged.
**Impact**: All task definitions routed to `frontend-engineer` implicitly include test authorship. `lead` must not accept a PR as done if test coverage for the changed path is absent. This policy applies to bug fixes as well as new features.
