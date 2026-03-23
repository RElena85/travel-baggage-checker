# TripPacker — Design Implementation Specification

**Source design:** `Stich/DESIGN.md`  
**Date:** 2026-03-22  
**Author:** lead (coordinator)  
**Status:** Approved — ready for implementation

---

## 1. Design Token Reference

### 1.1 Color Tokens

| CSS Variable | Hex | Role |
|---|---|---|
| `--color-surface` | `#f8f9fa` | App body background |
| `--color-surface-container-low` | `#f3f4f5` | Large section backgrounds, category headers |
| `--color-surface-container-lowest` | `#ffffff` | Cards, interactive content, modals |
| `--color-surface-container-high` | `#e8e9ea` | Unfocused input backgrounds |
| `--color-primary` | `#003c73` | Atlantic Blue — brand primary, CTA gradient start |
| `--color-primary-container` | `#00539c` | CTA gradient end, active nav states |
| `--color-on-primary` | `#ffffff` | Text on primary backgrounds |
| `--color-secondary` | `#2c694e` | Packed/completed state |
| `--color-secondary-container` | `#aeeecb` | Secondary chip backgrounds |
| `--color-on-secondary-container` | `#316e52` | Text on secondary container |
| `--color-tertiary` | `#593300` | Warm accent — badges, "Warning/Urgent" |
| `--color-surface-tint` | `#003c73` | Focus ring ghost border |
| `--color-on-surface` | `#191c1d` | Primary body text (replaces `#000000`) |
| `--color-on-surface-variant` | `#424751` | Secondary / muted text |
| `--color-outline-variant` | `#c2c6d3` | Subtle decorative outlines only |

### 1.2 Typography Tokens

| CSS Variable | Value |
|---|---|
| `--font-display` | `'Manrope', sans-serif` |
| `--font-body` | `'Inter', sans-serif` |

- `h1`–`h3` → `--font-display`, `font-weight: 700`, `letter-spacing: -0.02em`
- Body text, labels, inputs → `--font-body`
- Metadata badge/label uppercase → `letter-spacing: +0.05em`

### 1.3 Spacing Tokens

| CSS Variable | Value |
|---|---|
| `--spacing-1` | `0.25rem` |
| `--spacing-2` | `0.5rem` |
| `--spacing-3` | `0.75rem` |
| `--spacing-4` | `1rem` |
| `--spacing-6` | `1.5rem` |
| `--spacing-8` | `2rem` |
| `--spacing-10` | `2.5rem` |
| `--spacing-12` | `3rem` |

### 1.4 Border Radius Tokens

| CSS Variable | Value |
|---|---|
| `--radius-sm` | `0.25rem` |
| `--radius-md` | `0.5rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-xl` | `1rem` |
| `--radius-2xl` | `1.5rem` |
| `--radius-full` | `9999px` |

### 1.5 Elevation / Shadow Tokens

| CSS Variable | Value |
|---|---|
| `--shadow-ambient` | `0 10px 40px rgba(25, 28, 29, 0.06)` |

- **Cards:** NO shadow — separation via background color difference only
- **Floating UI (modals, dropdowns):** `--shadow-ambient` + `backdrop-filter: blur(20px)`
- **Hover state on interactive elements:** `--shadow-ambient` + `translateY(-2px)`

### 1.6 Gradient Tokens

| CSS Variable | Value |
|---|---|
| `--gradient-primary` | `linear-gradient(135deg, var(--color-primary), var(--color-primary-container))` |

---

## 2. Design Rules

### 2.1 No-Line Rule
- **Forbidden:** `border: 1px solid` for any structural sectioning
- **Forbidden:** `<hr>` elements
- **Replacement:** Background color shifts between surface layers; `gap` spacing in flex/grid

### 2.2 Surface Layering
```
Body (app bg)  → --color-surface (#f8f9fa)
Sections       → --color-surface-container-low (#f3f4f5)
Cards/inputs   → --color-surface-container-lowest (#ffffff)
Input (resting)→ --color-surface-container-high (#e8e9ea)
Elevated Glass → --color-surface @ 80% opacity + backdrop-filter: blur(20px)
```

### 2.3 Buttons
- **Primary CTA:** `background: var(--gradient-primary)`, `color: var(--color-on-primary)`, `border-radius: var(--radius-2xl)`, no border
- **Hover:** `transform: translateY(-2px)` + `box-shadow: var(--shadow-ambient)` — NOT color darken
- **Secondary chips:** `background: var(--color-secondary-container)`, `color: var(--color-on-secondary-container)`, `border-radius: var(--radius-full)`

### 2.4 Inputs
- **Resting:** `background: var(--color-surface-container-high)`, no border
- **Focus:** `background: var(--color-surface-container-lowest)`, `outline: 1px solid rgba(0, 60, 115, 0.2)` (ghost border at 20% opacity)
- Labels: always visible, uppercase, `letter-spacing: 0.05em`

### 2.5 List Items
- No `border-bottom` dividers of any kind
- Use `gap: var(--spacing-3)` in parent flex container
- Packed state: `color: var(--color-secondary)`, `text-decoration: line-through`

### 2.6 Forbidden Values
| Forbidden | Replacement |
|---|---|
| `#000000` | `var(--color-on-surface)` |
| `#8b4513`, `#f0e68c` | Removed entirely |
| Purple gradient body/`.app` | `background-color: var(--color-surface)` |
| `#6366f1` (old indigo) | `var(--color-primary)` |
| Heavy `box-shadow` with dark alpha | `--shadow-ambient` only |

---

## 3. Component Impact Matrix

| Component | Token Changes | Structural Changes |
|---|---|---|
| `globals.css` | Full `:root` replacement | Manrope font import; body becomes flat surface |
| `components.css` | All color refs rewritten | Border/hr rules removed; button/input/list rewritten |
| `Home.tsx` | `.home-header` surface-based | No inline styles allowed |
| `TripDetails.tsx` | Progress bar + item state colors | — |
| `TripsPage.tsx` | Trip card surfaces | — |
| `CreateTrip.tsx` | Form input styles | — |
| `Navbar.tsx` | Surface + primary tokens | No border-bottom |
| `EditableItemList.tsx` | Gap spacing, packed state, group headers | No `<hr>` elements |
| `TripList.tsx` | Trip card surfaces, no borders | — |
| `TripForm.tsx` | Input class alignment | — |
| `TripForm.test.tsx` | — | Fix: add `category: 'otros'` to assertion |
