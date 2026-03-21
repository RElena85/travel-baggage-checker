# Squad Spec — travel-baggage-checker

> Hand this document to `@squad-builder` (or feed it to the `spawn-squad` prompt) to generate the `.squad/` directory for this project.

---

## Project Summary

**TripPacker** is a browser-only React 18 + TypeScript SPA for managing travel packing lists. No backend, no auth, no external APIs. State is persisted in `localStorage`. Deployed as a static site to GitHub Pages via GitHub Actions.

- **Repo:** `travel-baggage-checker/trip-manager-app/`
- **Stack:** React 18, TypeScript (strict), CRA (react-scripts 5), React Router v6, localStorage
- **Testing:** Jest + @testing-library/react, `data-testid` selectors
- **Deploy:** GitHub Actions → GitHub Pages (`gh-pages` package)
- **Scale:** ~10 source files, solo/hobbyist scope, no planned backend

---

## Team Size

**3 agents.** No more.

---

## Agent Roster

| Handle | Role |
|--------|------|
| `lead` | Coordinator & Decision Governor |
| `frontend-engineer` | React/TS Developer + Test Author |
| `platform-engineer` | Tooling, CI/CD & Deploy Owner |

---

## Agent Charters

### `lead`

- Coordinates all incoming tasks and owns `routing.md` and `decisions.md`.
- Does **not** write application code or tests directly.
- Any change to the core data model (`Item`, `Trip`, `ItemCategory`) requires a logged entry in `decisions.md` before implementation starts.
- Routes data model changes to `frontend-engineer` and ensures tests are part of the same PR.
- When a task crosses into both application code and tooling, broadcasts to both `frontend-engineer` and `platform-engineer` and synthesises the result.
- Decides the fate of dead-code files (`ItemForm.tsx`, `ItemList.tsx`) before delegating removal to `frontend-engineer`.

---

### `frontend-engineer`

- Primary author of all components, pages, hooks, state management, TypeScript types, and **all test files**.
- Ships features and tests together in every PR. A change without test coverage is not done.
- Tech expertise: React 18 functional components, custom hooks, React Context, React Router v6, TypeScript strict mode, `useTripData.ts` hook pattern, `@testing-library/react`, `data-testid` selectors.
- Understands the dual-checkbox pattern (`isIn` = packed, `isBack` = returned) on `Item`.
- Knows `Date.now()` IDs are an intentional design choice for single-user localStorage scope — must not change without a `lead` decision log entry.
- First open task: fix the failing test in `TripForm.test.tsx` — it expects `{ name: 'Test Item' }` but the actual call now passes `{ name: 'Test Item', category: 'otros' }` since the `category` field was added to the `Item` type.
- Never targets CSS classes in tests. Uses `data-testid` and accessible queries exclusively.
- Owns grouping/filtering logic in `EditableItemList.tsx` and the `useMemo` optimisation pattern there.

#### UI Generation Workflow (Google Stitch)

Every new UI surface — new components, new pages, redesigned layouts — follows this mandatory workflow:

1. **Prompt Stitch** at https://stitch.withgoogle.com/ with a clear description of the screen or component, including its purpose, key data it displays, and primary actions. Example:
   > *"A trip detail page with an editable trip name, a list of packing items grouped by category, each item having a 'packed' and 'returned' checkbox, and a progress bar showing overall packing percentage."*

2. **Take the generated output** (HTML + CSS or React skeleton) as the visual starting point.

3. **Adapt to the project design system:**
   - Replace all hardcoded colours, fonts, and spacing with the CSS custom properties defined in `globals.css` (e.g. `--color-primary`, `--color-surface`, `--spacing-*`, `--radius-*`).
   - Merge or replace generated CSS into `components.css` — do not introduce a new stylesheet per component.
   - Remove any inline styles — all styling lives in the CSS files.

4. **Wire up the React integration layer** (Stitch does not know about the app internals):
   - Add TypeScript props interface matching `Item` / `Trip` types from `src/types/index.ts`.
   - Connect to `useTripContext()` for state reads and mutations.
   - Add `data-testid` attributes on every interactive and meaningful element.
   - Ensure routing uses `useNavigate` / `<Link>` from React Router v6 — no raw `<a href>` for internal navigation.

5. **Write the test** covering the component's key behaviours before marking the task done.

**What Stitch owns:** visual structure, layout, spacing, interactive states (hover, focus, empty states).
**What the engineer always owns:** TypeScript types, hook connections, routing, localStorage persistence, test coverage, accessibility attributes.

---

### `platform-engineer`

- Owns `package.json`, `tsconfig.json`, GitHub Actions `deploy.yml`, `deploy.bat`, and `deploy.sh`.
- Understands the CRA (react-scripts 5) toolchain and the `baseUrl: "src"` + path alias config (`@components/*`, `@hooks/*`, `@pages/*`, etc.) in `tsconfig.json`.
- Monitors CRA deprecation risk — migration to Vite or another bundler is owned by this agent when the team decides to do it.
- Ensures the `gh-pages` deploy package remains compatible with the GitHub Actions workflow.
- Does not touch React component code or test files.

---

## Routing Rules

```
IF task involves React components, hooks, pages, routing, TypeScript types, OR tests  → frontend-engineer
IF task involves package.json, tsconfig, CI/CD workflows, GitHub Actions, deploy scripts  → platform-engineer
IF task involves cross-cutting decisions, scope prioritisation, or breaking design changes  → lead
IF task involves the data model (Item, Trip, ItemCategory)  → lead logs decision FIRST, then frontend-engineer implements (code + tests together)
IF task involves dead-code files (ItemForm.tsx, ItemList.tsx)  → lead decides remove or rehabilitate; frontend-engineer executes
IF task crosses both application code and tooling  → lead broadcasts to frontend-engineer AND platform-engineer
```

---

## Pre-wired Decisions (seed `decisions.md` with these)

1. **No external state library.** React Context + `useTripData` custom hook is sufficient for this app's scale. Redux, Zustand, or any other store library would be over-engineering.

2. **`category` is required on `Item`.** Any new form component or factory function must include a `category` field. The stale `ItemForm.tsx` which references a non-existent `quantity` field and lacks `category` is dead code.

3. **`ItemForm.tsx` and `ItemList.tsx` are dead code.** They are not referenced by any active route or page. Pending `lead` decision to remove before next release.

4. **`Date.now()` IDs are intentional.** Acceptable for single-user, single-device localStorage persistence. Not a bug. Must not be changed without a logged decision if multi-device sync is ever considered.

5. **Static SPA only — no SSR, no server routes.** The deploy target is GitHub Pages. All routing must work as a client-side SPA. No server-side rendering will be introduced without a full architectural decision.

6. **Tests ship in the same PR as the feature.** `frontend-engineer` is the single agent responsible for both code and tests. QA is not a separate phase or a separate agent.

---

## Skills to Wire

- `squad-design` — general squad design practices
- `squad-agent-charter` — how to write effective charter files
- `squad-routing` — routing rule authoring

No domain-specific skills need to be created at squad init time. The charters above contain sufficient domain knowledge for the current app scope.

---

## Notes for Squad Builder

- Squad root should be placed at: `travel-baggage-checker/.squad/`
- The coordinator agent file should be placed at: `travel-baggage-checker/.github/agents/squad.agent.md`
- Do not create backend, DevOps, design/UX, or scribe agents — they are explicitly out of scope for this project at its current scale.
- Casting universe: builder's choice from the allowed policy list.
