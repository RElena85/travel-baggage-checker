---
updated_at: 2026-03-28T15:23:00.000Z
focus_area: pwsh installed — squad can now run commands automatically. Use `python verify.py` for full test suite.
active_issues: []
---

# What We're Focused On

**Verification phase.** All previously-pending items are now confirmed resolved:

- ✅ `data-testid="new-item-name-input"` added to `TripForm.tsx` (line 116)
- ✅ `data-testid="view-trip-{id}"` added to `TripList.tsx` (line 137)
- ✅ `importTrips()` now calls `migrateTripsToCategories()` before `setTrips` (`useTripData.ts` lines 185–186)
- ✅ All ~14 `setTrips` call sites use functional `prev => ...` form (`useTripData.ts`)
- ✅ Dead code (`ItemForm.tsx`, `ItemList.tsx`, `ItemList.test.tsx`) confirmed absent from `src/`
- ✅ CI/CD gating confirmed: `--passWithNoTests` added to E2E job in `ci.yml`
- ✅ E2E selectors updated in `create_e2e_tests.py` to use new `data-testid` attributes

**To run the full test suite locally:**
```
python verify.py           # everything: e2e gen + unit + playwright + build
python verify.py --unit    # unit tests only
python verify.py --e2e     # E2E tests only
python verify.py --build   # build check only
```

**One remaining minor item (next sprint):** `copyTrip` in `useTripData.ts` still reads `trips` directly before the write — a minor stale-read risk under React 18 concurrent mode. Flagged by Mal's health audit.

**E2E activation:** `create_e2e_tests.py` is updated with proper `data-testid` selectors. `verify.py` runs it automatically before E2E tests.

**Shell execution fixed:** `pwsh.exe` installed via `install-pwsh.bat`. Agents now use the `powershell` tool to run npm/python/git commands automatically. Pattern in `.squad/skills/shell-execution/SKILL.md`.
