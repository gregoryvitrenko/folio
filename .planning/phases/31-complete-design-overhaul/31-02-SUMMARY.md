---
phase: 31-complete-design-overhaul
plan: 02
subsystem: ui
tags: [react, tailwind, lucide-react, primer-card]

# Dependency graph
requires: []
provides:
  - Redesigned minimal PrimerCard matching newspaper aesthetic mockup
affects: [primers page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Minimal card design: category chip (plain text) + serif title + clock+read-time + divider + link text — no icons, no colored accents"

key-files:
  created: []
  modified:
    - components/PrimerCard.tsx

key-decisions:
  - "Removed TOPIC_ICONS and TOPIC_ICON_COLORS constants — no colored icons in redesigned card"
  - "Used primer.readTimeMinutes (existing field) for clock + read time row"
  - "Read Primer ↗ link text with section-label-style typography replaces chevron + stat chips"

patterns-established:
  - "Editorial card pattern: plain text chip + serif title + meta row + divider + link text — no icon decoration"

requirements-completed:
  - POLISH-04

# Metrics
duration: 5min
completed: 2026-03-13
---

# Phase 31 Plan 02: PrimerCard Redesign Summary

**Replaced icon-heavy stat-cluttered PrimerCard with minimal editorial card: plain category chip, clock + read time, serif title, thin divider, and "Read Primer ↗" link text**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-13T00:00:00Z
- **Completed:** 2026-03-13T00:05:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Removed TOPIC_ICONS, TOPIC_ICON_COLORS records and TOPIC_STYLES import entirely
- Removed colored icon row, strapline paragraph, section count chip, interview Q chip, and ChevronRight footer
- New layout: category chip (section-label, plain stone text), serif h3 title with group-hover:underline, Clock + readTimeMinutes row, thin border-t divider, "Read Primer ↗" uppercase text
- TypeScript passes with zero errors

## Task Commits

1. **Task 1: Rewrite PrimerCard to minimal mockup layout** - `c8e3558` (feat)

## Files Created/Modified
- `components/PrimerCard.tsx` - Complete rewrite to minimal mockup design; imports reduced to Clock from lucide-react + Primer type only

## Decisions Made
- Kept the same outer `<article>` and `<Link>` wrapper classes (rounded-card, bg-white, border-stone-200 etc.) — only the inner layout changed
- "Read Primer ↗" uses inline ↗ arrow character rather than a lucide icon to keep imports minimal

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- PrimerCard redesign complete, ready for any subsequent design polish plans
- No blockers

---
*Phase: 31-complete-design-overhaul*
*Completed: 2026-03-13*
