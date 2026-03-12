---
phase: 16-global-design-logo-header
plan: 02
subsystem: ui
tags: [svg, logo, header, typography, tailwind]

# Dependency graph
requires:
  - phase: 16-global-design-logo-header
    provides: FolioMark SVG component and icon.svg already written in unstaged changes
provides:
  - Striped-F wordmark live in header on every page
  - Editorial dateline beneath wordmark (Vol./No./Day/Date/London Edition)
  - Browser tab favicon with dark stone background and white striped-F
affects: [all pages — header appears everywhere]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SVG pattern fills for stripe effects using currentColor for dark mode compatibility"
    - "formatDateline() helper computing Vol. number from year, issue from day-of-year"

key-files:
  created: []
  modified:
    - components/Header.tsx
    - components/FolioLogo.tsx
    - app/icon.svg

key-decisions:
  - "Dateline uses font-mono at 9px (below section-label 11px default) — monospace reinforces metadata register"
  - "Letter-spacing -0.03em on olio span — fractionally tighter than tracking-tight (-0.025em) per brand spec"
  - "Dateline always shows on all pages (not just non-archive) — keeps masthead feel consistent"

patterns-established:
  - "Dateline pattern: Vol. (year-2025) · No. (day of year) · DayName, Date · London Edition"

requirements-completed:
  - GDES-03
  - HDR-01
  - HDR-02

# Metrics
duration: 10min
completed: 2026-03-12
---

# Phase 16 Plan 02: Logo + Header Wordmark + Dateline Summary

**Striped-F wordmark live in header with -0.03em tight tracking and editorial dateline showing Vol./No./Day/Date/London Edition beneath on every page**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-12T20:30:00Z
- **Completed:** 2026-03-12T20:40:13Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Committed the striped-F FolioMark SVG component (FolioLogo.tsx) and dark-background favicon (icon.svg) that were already written but unstaged
- Added -0.03em letter-spacing to the "olio" wordmark span (tighter than Tailwind's tracking-tight at -0.025em)
- Added `formatDateline()` helper computing Vol. number (year - 2025), issue number (day of year), and full day/date in en-GB locale
- Inserted dateline row between wordmark row and nav row — monospace 9px uppercase stone-400/stone-500, correctly styled for dark mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Tighten wordmark letter-spacing and add editorial dateline** - `f13406d` (feat)
2. **Task 2: Commit unstaged logo files (FolioLogo.tsx, icon.svg)** - `3bb4177` (feat)

## Files Created/Modified

- `components/Header.tsx` - Added formatDateline() helper, -0.03em letter-spacing on wordmark, dateline row between Row 1 and Row 2
- `components/FolioLogo.tsx` - FolioMark SVG with vertical/horizontal stripe patterns, currentColor, viewBox 0 0 30 40
- `app/icon.svg` - 32x32 favicon: dark stone-900 (#1c1917) rounded background, white striped-F

## Decisions Made

- Dateline uses `font-mono text-[9px]` inline rather than `.section-label` — 9px is below the section-label 11px default, needs the raw size
- Dateline shows on all pages (archive and main) — `displayDate` already handles the archive date swap, so masthead stays consistent
- Vol. 1 = 2026 (year - 2025) — first year of the product

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Header wordmark and dateline are live and ready
- FolioLogo.tsx is exported and available for any other component that needs the mark
- TypeScript passes with zero errors

---
*Phase: 16-global-design-logo-header*
*Completed: 2026-03-12*
