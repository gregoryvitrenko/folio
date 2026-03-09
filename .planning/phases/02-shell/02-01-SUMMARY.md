---
phase: 02-shell
plan: "01"
subsystem: ui
tags: [tailwind, design-tokens, header, navigation, typography]

# Dependency graph
requires:
  - phase: 01-design-tokens
    provides: text-display, text-label, bg-paper CSS custom properties and Tailwind token mappings
provides:
  - Token-compliant Header.tsx with bg-paper, text-display, text-label
  - Token-compliant NavDropdowns.tsx TRIGGER_CLS and dropdown panel using bg-paper and text-label
affects:
  - 02-shell subsequent plans (header is shared shell; all pages inherit it)
  - 03-components (any component audits should note these patterns as canonical)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "bg-paper replaces bg-stone-50 dark:bg-stone-950 — single token, dark-mode-aware via CSS variable"
    - "text-display replaces responsive font-size classes on the wordmark — removes sm: breakpoint size variant"
    - "text-label replaces text-[11px] tracking-[0.1em] on triggers and nav labels — token bundles size + spacing"
    - "text-[10px] tracking-[0.15em] on the Archive Edition span is an intentional carry-over (wider tracking overrides token)"
    - "text-[12px] on dropdown item links is acceptable carry-over for Phase 3"

key-files:
  created: []
  modified:
    - components/Header.tsx
    - components/NavDropdowns.tsx

key-decisions:
  - "Leave Archive Edition span (text-[10px] tracking-[0.15em]) unchanged — the explicit tracking-[0.15em] overrides text-label's 0.1em, preserving intentional wider spacing"
  - "Remove font-bold from wordmark h1 alongside text-[32px] sm:text-[38px] — text-display bakes in fontWeight 700, the explicit class is redundant"
  - "Remove tracking-[0.1em] from archive nav links and TRIGGER_CLS alongside text-[11px] — text-label provides the identical 0.1em letterSpacing"
  - "Write bg-paper without dark:bg-paper — CSS variable switches automatically under .dark"

patterns-established:
  - "bg-paper: use as single class only, never alongside dark:bg-paper"
  - "text-display: use on wordmark/hero headings, removes need for responsive text-[Npx] sm:text-[Npx] pairs"
  - "text-label: use on mono labels and sans trigger/link labels at 10-11px; removes text-[11px] + explicit tracking-[0.1em]"

requirements-completed:
  - SHELL-01

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 2 Plan 01: Header Token Migration Summary

**Header.tsx and NavDropdowns.tsx migrated from arbitrary px values to Phase 1 design tokens — bg-paper, text-display, and text-label replace all magic-number classes in the site shell**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T21:46:15Z
- **Completed:** 2026-03-09T21:48:21Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Header background migrated from `bg-stone-50 dark:bg-stone-950` to `bg-paper` — single token, dark mode handled automatically via CSS variable
- Folio wordmark migrated from `text-[32px] sm:text-[38px] font-bold` to `text-display` — removes responsive breakpoint variant, fontWeight 700 baked into token
- Date span and archive nav links migrated from `text-[11px] tracking-[0.1em]` to `text-label` in both Header.tsx and NavDropdowns.tsx TRIGGER_CLS
- NavDropdowns dropdown panel background migrated from `bg-stone-50 dark:bg-stone-950` to `bg-paper`
- TypeScript compile and Next.js full build pass with zero new errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Header.tsx to design tokens** - `bf2dcc3` (feat)
2. **Task 2: Migrate NavDropdowns.tsx to design tokens** - `4f650e3` (feat)

**Plan metadata:** (docs commit follows this summary)

## Files Created/Modified

- `components/Header.tsx` - bg-paper on header element, text-label on date span, text-display on wordmark h1, text-label on archive nav links
- `components/NavDropdowns.tsx` - text-label in TRIGGER_CLS constant, bg-paper on dropdown panel div

## Decisions Made

- Leave `text-[10px] tracking-[0.15em]` on the "Archive Edition" span unchanged — plan explicitly notes this as intentional (wider tracking overrides token default)
- Leave `text-[12px]` on dropdown item links unchanged — plan defers these to Phase 3
- Remove `font-bold` alongside `text-[32px] sm:text-[38px]` since `text-display` provides fontWeight 700
- Remove `tracking-[0.1em]` alongside `text-[11px]` in TRIGGER_CLS and archive nav links since `text-label` provides the identical letterSpacing

## Deviations from Plan

None - plan executed exactly as written. All four Header.tsx changes and both NavDropdowns.tsx changes matched the plan specification precisely.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Header shell is now fully token-compliant; visual appearance is unchanged
- Any subsequent shell component (footer, sidebar) should follow the same bg-paper / text-label / text-display pattern
- Phase 3 component audits can reference these two files as canonical examples of correct token usage

---
*Phase: 02-shell*
*Completed: 2026-03-09*
