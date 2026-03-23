# TripPacker — Implementation Plan

**Based on:** `Stich/SPEC.md` v1.0  
**Date:** 2026-03-22  
**Routing:** All changes → frontend-engineer  
**Data-model change?** No → no `decisions.md` entry required  
**Platform changes?** No → platform-engineer not involved

---

## Execution Order

### Phase 1 — Foundation (`globals.css`)
Must happen first. All component styles depend on correct token names existing in `:root`.

**File:** `trip-manager-app/src/styles/globals.css`

1. Add Google Fonts `@import` for **Manrope** (alongside existing Inter)
2. Replace full `:root {}` block with DESIGN tokens (see SPEC §1)
3. Change `body` background to `var(--color-surface)`, color to `var(--color-on-surface)`
4. Remove purple gradient from `body` and `.app`
5. Apply `var(--font-display)` + `letter-spacing: -0.02em` to `h1`–`h3`

---

### Phase 2 — Component Styles (`components.css`)
**File:** `trip-manager-app/src/styles/components.css`

1. Remove all `border: 1px solid` structural borders (`.trip-item`, `.trip-list-item`, `.container`, `.input-field`)
2. Remove all `#f0e68c`, `#8b4513` hardcoded color references
3. Rewrite `.btn-primary` / `.button`: gradient fill, `border-radius: var(--radius-2xl)`, hover lift only
4. Rewrite `.input-field`: no border, `--color-surface-container-high` background, focus ghost border
5. Add `.input-wrapper` + `.input-label` floating label support
6. Replace `.trip-item` `border-bottom` with parent `gap: var(--spacing-3)` flex layout
7. Rewrite `.home-header`: surface card, no gradient
8. Add `.glass` utility class for modals/dropdowns
9. Add `.item-category-group` / `.item-category-header` for grouped lists
10. Update `.chip` / `.chip-secondary` with secondary-container tokens
11. Update Navbar classes: no `border-bottom`, surface background, primary active color

---

### Phase 3 — Component HTML Cleanup (TSX files)
**Routing:** frontend-engineer

| File | Change |
|---|---|
| `src/components/EditableItemList.tsx` | Remove `<hr>` if present; apply `.item-category-group`, `.item-rows`, `.item-row`, `.packed` class names |
| `src/pages/Home.tsx` | Ensure `.home-header` uses CSS class only (no inline styles) |
| `src/components/Navbar.tsx` | Apply `.navbar`, `.navbar-brand`, `.navbar-link` class names |
| `src/components/TripList.tsx` | Apply `.trip-list`, `.trip-list-item` class names |
| `src/components/TripForm.tsx` | Apply `.input-field`, `.btn-primary` class names |
| `src/pages/TripDetails.tsx` | Apply `.trip-header`, `.trip-progress-bar-track`, `.trip-progress-bar-fill` |

---

### Phase 4 — Test Fix
**File:** `trip-manager-app/src/components/TripForm.test.tsx`

```typescript
// BEFORE
expect(mockAddItemToTrip).toHaveBeenCalledWith(tripId, { name: 'Test Item' });

// AFTER
expect(mockAddItemToTrip).toHaveBeenCalledWith(tripId, { name: 'Test Item', category: 'otros' });
```

---

### Phase 5 — Verification

```bash
cd trip-manager-app && npm test -- --watchAll=false
```

Expected: all tests pass including the fixed TripForm test.

---

## Files Modified

| File | Phase | Change Type |
|---|---|---|
| `src/styles/globals.css` | 1 | Full replacement |
| `src/styles/components.css` | 2 | Full replacement |
| `src/components/EditableItemList.tsx` | 3 | Class names + no `<hr>` |
| `src/pages/Home.tsx` | 3 | Class alignment |
| `src/components/Navbar.tsx` | 3 | Class alignment |
| `src/components/TripList.tsx` | 3 | Class alignment |
| `src/components/TripForm.tsx` | 3 | Class alignment |
| `src/pages/TripDetails.tsx` | 3 | Class alignment |
| `src/components/TripForm.test.tsx` | 4 | One-line assertion fix |

## Files Created

| File | Purpose |
|---|---|
| `Stich/SPEC.md` | Formal design token + rule specification |
| `Stich/IMPLEMENTATION_PLAN.md` | This file |

---

## Constraints Checklist

- [ ] No new per-component CSS files created
- [ ] No inline styles in any TSX file
- [ ] No `#000000` — always `var(--color-on-surface)`
- [ ] No `border: 1px solid` for structural sectioning
- [ ] No `<hr>` elements
- [ ] All `data-testid` attributes preserved
- [ ] TripForm.test.tsx fix applied
- [ ] All existing tests pass
