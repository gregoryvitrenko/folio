---
phase: 37-tests-interview-fit
plan: 01
subsystem: components
tags: [ui, tests, card-redesign]
key-files:
  modified:
    - components/TestCard.tsx
decisions:
  - Used ArrowRight instead of ChevronRight to match plan spec
  - Brain icon for watson-glaser, Users icon for sjt — determined inline by slug check
metrics:
  duration: 5m
  completed: 2026-03-13
  tasks: 1
  files: 1
---

# Phase 37 Plan 01: TestCard Redesign Summary

**One-liner**: Gray icon square (Brain/Users) + "What it measures" bullet list from subtypes replaces Clock/BarChart2 meta row on test cards.

## What Was Built

Rewrote `components/TestCard.tsx`:
- Gray icon square (`w-10 h-10 bg-stone-100 rounded-lg`) at top of card with Brain (watson-glaser) or Users (sjt) icon
- Vendor overline kept
- Description replaced with strapline field
- Clock + BarChart2 meta row removed
- "What it measures" section label + bullet list mapping `test.subtypes.slice(0, 4)` with dot markers
- Overflow subtypes shown as `+ N more`
- Charcoal CTA with ArrowRight (was ChevronRight)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `components/TestCard.tsx` exists and modified
- `npx tsc --noEmit` returned zero errors
- Commit `c929e42` contains the changes
