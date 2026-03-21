# Routing Rules — TripPacker

## Quick Reference

| Task Type | Route To |
|-----------|----------|
| React components, hooks, pages, routing, TypeScript types, tests | `frontend-engineer` |
| `package.json`, `tsconfig.json`, CI/CD workflows, GitHub Actions, deploy scripts | `platform-engineer` |
| Cross-cutting decisions, scope prioritisation, breaking design changes | `lead` |
| Data model changes (`Item`, `Trip`, `ItemCategory`) | `lead` logs decision FIRST → `frontend-engineer` implements (code + tests) |
| Dead-code files (`ItemForm.tsx`, `ItemList.tsx`) | `lead` decides remove or rehabilitate → `frontend-engineer` executes |
| Task crossing application code AND tooling | `lead` broadcasts to `frontend-engineer` AND `platform-engineer`; synthesises result |

---

## Rules (Detailed)

### → `frontend-engineer`

Assign when the work involves any of:
- React 18 functional components (any `.tsx` file under `src/`)
- Custom hooks (`useTripData.ts` or new hooks)
- Pages, layouts, routing configuration (React Router v6)
- TypeScript types, interfaces, or type guards
- Test files — `*.test.tsx` / `*.test.ts` (Jest + @testing-library/react)
- `data-testid` attribute additions or changes
- State management via React Context
- Grouping/filtering logic in `EditableItemList.tsx`

**Constraint:** Tests ship in the same PR as the feature. A task is not done until both code and tests are delivered.

---

### → `platform-engineer`

Assign when the work involves any of:
- `package.json` (dependencies, scripts, versioning)
- `tsconfig.json` (compiler options, path aliases `@components/*`, `@hooks/*`, `@pages/*`)
- GitHub Actions workflow files (`deploy.yml`)
- Deploy scripts (`deploy.bat`, `deploy.sh`)
- `gh-pages` package configuration
- Bundler/toolchain decisions (CRA → Vite migration, etc.)

**Constraint:** Does not touch React component code or test files.

---

### → `lead` (decision required first)

Assign or intercept when the work involves any of:
- Any change to the core data model (`Item`, `Trip`, `ItemCategory`) — a `decisions.md` entry is **mandatory before** implementation begins
- Architectural trade-offs or scope prioritisation
- Fate of dead-code files (`ItemForm.tsx`, `ItemList.tsx`)
- Cross-cutting tasks that span both application code and tooling

---

## Decision Logging Protocol

Before any data model change is implemented:

1. `lead` writes an entry to `decisions.md` (format: date, title, context, decision, impact).
2. Only after the entry is written does `lead` route to `frontend-engineer`.
3. `frontend-engineer` delivers code **and** tests in the same PR.

---

## Escalation

If any agent is uncertain about scope or authority → escalate to `lead` immediately.
