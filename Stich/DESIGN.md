```markdown
# Design System Specification: The Curated Journey

This document defines the visual language and interaction model for the Trip Planner & Packing List application. As designers, your goal is to transcend "utility" and move toward "hospitality." We are not just building a list-maker; we are building a digital concierge.

---

## 1. Creative North Star: The Editorial Concierge
The "Editorial Concierge" aesthetic rejects the cluttered, boxy look of traditional productivity tools. Instead, it draws inspiration from high-end travel journals and premium architectural wayfinding. 

**The Vision:**
*   **Intentional Asymmetry:** Use white space as a structural element. Avoid perfectly centered grids; allow content to breathe and "flow" like a well-laid-out magazine.
*   **Tonal Authority:** Replace harsh dividers with soft shifts in background value.
*   **Digital Tactility:** Treat the UI as layers of frosted glass and heavy-stock paper, creating a sense of physical organization.

---

## 2. Color & Surface Philosophy
Our palette is rooted in the deep blues of the Atlantic and the soft teals of Mediterranean coves. 

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning. Structural definition must be achieved through background shifts using the `surface-container` tokens. 

### Surface Hierarchy & Nesting
Treat the interface as a physical stack. Each layer "rises" toward the user by shifting color:
1.  **Base Layer:** `surface` (#f8f9fa) – The foundation of the application.
2.  **Sectioning:** `surface-container-low` (#f3f4f5) – Used for large sidebar or background groupings.
3.  **Content Cards:** `surface-container-lowest` (#ffffff) – Reserved for the highest priority interactive content (e.g., a specific trip card).
4.  **The "Glass" Rule:** For floating elements like modals or dropdowns, use `surface` at 80% opacity with a `20px` backdrop-blur to create an "Elevated Glass" effect.

### Signature Textures
Avoid flat action areas. Use a subtle linear gradient (135°) from `primary` (#003c73) to `primary_container` (#00539c) for primary CTAs to add "soul" and depth.

---

## 3. Typography: The Narrative Scale
We use a dual-sans serif approach. **Manrope** provides a modern, geometric character for headers, while **Inter** ensures surgical legibility for dense packing lists and flight data.

*   **Display (Manrope):** `display-lg` to `display-sm`. Use these sparingly for trip titles or "Welcome back" moments. Set with tight letter-spacing (-0.02em).
*   **Headlines (Manrope):** `headline-lg` (#191c1d). High-contrast editorial style.
*   **Body (Inter):** `body-lg` to `body-sm`. Use `on_surface_variant` (#424751) for secondary descriptions to reduce visual noise.
*   **Labels (Inter):** `label-md`. Always uppercase with +0.05em tracking when used for metadata badges (e.g., "FLIGHT," "PENDING").

---

## 4. Elevation & Depth
Depth in this system is a result of light and layering, not "drop shadows."

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The difference in hex value provides all the separation needed.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a multi-layered shadow: `0 10px 40px rgba(25, 28, 29, 0.06)`. The shadow color is a tinted version of `on_surface`, never pure black.
*   **The Ghost Border:** If a border is required for accessibility (e.g., input focus), use `outline_variant` (#c2c6d3) at 20% opacity.

---

## 5. Components

### Buttons & Chips
*   **Primary Button:** Gradient fill (`primary` to `primary_container`), `on_primary` text, `xl` (1.5rem) roundedness.
*   **Secondary/Action Chips:** Use `secondary_container` (#aeeecb) with `on_secondary_container` (#316e52) text. These should feel "organic" and soft.
*   **Interaction:** On hover, a button should not get darker; it should "lift" via a subtle 2px Y-axis shift and the addition of an Ambient Shadow.

### Inputs & Forms
*   **The Soft Input:** Inputs use `surface_container_high` with no border. On focus, they transition to `surface_container_lowest` with a 1px `surface_tint` Ghost Border.
*   **Typography in Forms:** Labels use `label-md` in `on_surface_variant`. Never hide labels; use "Floating Labels" to maintain context.

### Lists & Packing Items
*   **The Divider-Free List:** Forbid the use of horizontal rules (`<hr>`). Separate packing items using `spacing-4` (1rem) of vertical white space.
*   **State Signifiers:** Use `secondary` (#2c694e) for "Packed/Completed" states. This refreshing green signals progress without the "emergency" feel of traditional checkmarks.

### Special Component: The Itinerary Timeline
*   **Construction:** Use a vertical line of `outline_variant` at 10% opacity. Travel events are nested `surface_container_lowest` cards that "overlap" the timeline, creating a 3D feeling of chronological flow.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `spacing-10` and `spacing-12` for top-level padding. Negative space is a luxury.
*   **Do** use `rounded-xl` (1.5rem) for main containers to suggest a friendly, approachable tool.
*   **Do** use the `tertiary` (#593300) palette for "Warning" or "Urgent" trip updates—the warm ochre feels curated, not alarming.

### Don't:
*   **Don't** use high-contrast black (#000000). Always use `on_surface` (#191c1d) for text.
*   **Don't** use standard "Material Design" shadows. If a card looks like it has a heavy shadow, it is too "heavy" for this system.
*   **Don't** align everything to the left. Experiment with indented "Pull Quotes" for trip notes or highlighted packing tips.

---

## 7. Spacing & Rhythm
Consistency is maintained through a strict 4px grid, but hierarchy is driven by the **1:3 Ratio**. If a component has `spacing-2` internal padding, it should have at least `spacing-6` external margin to ensure it feels like a distinct "object" on the page.