---
phase: 25-accent-global-headings
plan: 01
subsystem: design-tokens
tags: [accent, charcoal, oxford-blue, tailwind, colour]
dependency_graph:
  requires: []
  provides: [charcoal-token]
  affects: [all-components, all-pages]
tech_stack:
  added: []
  patterns: [charcoal-named-token, tailwind-theme-extend]
key_files:
  created: []
  modified:
    - tailwind.config.ts
    - components/FirmCard.tsx
    - components/TestCard.tsx
    - components/StoryGrid.tsx
    - components/QuizInterface.tsx
    - components/FirmsDirectory.tsx
    - components/BookmarkButton.tsx
    - components/SavedView.tsx
    - app/upgrade/page.tsx
    - app/quiz/page.tsx
    - app/events/CityFilter.tsx
decisions:
  - Replaced oxford-blue (#002147) with charcoal (#2D3436) as primary accent
  - charcoal registered as named token with DEFAULT, light, dark variants in tailwind.config.ts
  - EventCard date text migrated from text-[#002147] to text-charcoal for consistency
metrics:
  duration: ~10 minutes
  completed: 2026-03-12
  tasks_completed: 2
  files_modified: 11
---

# Phase 25 Plan 01: Charcoal Accent Token — Summary

**One-liner:** Retired oxford-blue (#002147) sitewide and registered charcoal (#2D3436) as a named Tailwind token with DEFAULT/light/dark variants across 11 files.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Register charcoal token in tailwind.config.ts | 0a80c81 | tailwind.config.ts |
| 2 | Replace all oxford-blue/002147 usages | 0a80c81 | 10 component/page files |

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` — passed, zero errors
- `grep -r "oxford-blue|#002147"` — zero matches in any .tsx/.ts file
- `grep -n "charcoal" tailwind.config.ts` — charcoal token present with DEFAULT (#2D3436), light (#3d4749), dark (#1e2325)

## Self-Check: PASSED

All 11 files modified as specified. TypeScript clean. No oxford-blue references remain.
