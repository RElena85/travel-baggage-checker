---
last_updated: 2026-03-22T00:00:00.000Z
---

# Team Wisdom

Reusable patterns and heuristics for the TripPacker squad. Each entry is a distilled, actionable insight — not a transcript.

## Patterns

**Pattern:** Always read target files before editing.  
**Context:** frontend-engineer must call `read_file` on any `.tsx`, `.ts`, or `.css` file before modifying it. Blind edits break existing patterns and miss context.

**Pattern:** Tests ship with the feature — always.  
**Context:** A `frontend-engineer` task is NOT done until `npm test -- --watchAll=false` passes. The coordinator must re-spawn if tests are missing.

**Pattern:** CSS tokens, not hardcoded values.  
**Context:** All colours, spacing, and radii must use `var(--token-name)` from `globals.css`. No `#000000`, no `px` magic numbers.

**Pattern:** No `border: 1px solid` for structural separation.  
**Context:** Design system rule — use background colour shifts between surface layers instead. See `Stich/SPEC.md §2.1`.

**Pattern:** Tool check before coding.  
**Context:** When `frontend-engineer` receives a task, it should:
1. `read_file` the relevant source file(s)
2. `grep_search` for existing class names / patterns
3. Make targeted edits with `replace_string_in_file` or `multi_replace_string_in_file`
4. Run `run_in_terminal` to verify tests pass

**Pattern:** `decisions.md` is cross-agent shared memory.  
**Context:** Any constraint discovered during implementation (e.g., a pattern that must be preserved) gets logged to `.squad/decisions.md`. Future agent sessions read it and don't re-discover the same thing.

**Pattern:** Squad coordinator works best when invoked directly via `@squad` in VS Code chat.  
**Context:** When coordinator is spawned as a sub-subagent via `runSubagent`, it may lose file tool access. Invoke `@squad` directly for routing. The coordinator then uses `task` to spawn `@frontend-engineer` or `@platform-engineer`.

**Pattern:** `data-testid` selectors only in tests.  
**Context:** `@testing-library/react` tests must use `data-testid`, `getByRole`, `getByLabelText` — never CSS class names. CSS classes can change; test IDs are stable contracts.
