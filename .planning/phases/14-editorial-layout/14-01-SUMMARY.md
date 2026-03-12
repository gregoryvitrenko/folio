---
phase: 14-editorial-layout
plan: 01
status: complete
started: "2026-03-12"
completed: "2026-03-12"
requirements_delivered:
  - LAYOUT-01
  - LAYOUT-02
  - LAYOUT-03
  - LAYOUT-04
files_modified:
  - components/StoryCard.tsx
  - components/StoryGrid.tsx
commits:
  - "78f5567"
---

# Plan 14-01 Summary: Editorial Layout Hierarchy

## What was built

Restructured the home briefing from a flat 2-column grid into newspaper-style editorial hierarchy:

1. **Lead story** (story[0]) — renders full-width on desktop (lg+) with `featured` prop: 28px Playfair Display semibold headline (`text-article` token), full summary without line-clamp truncation
2. **Secondary row** (stories[1-2]) — 2-column row below the lead, standard card styling (positional hierarchy only)
3. **Divider** — `h-px bg-stone-200 dark:bg-stone-800` horizontal rule between featured section and remaining grid (desktop only)
4. **Remaining grid** (stories[3+]) — standard `grid-cols-1 lg:grid-cols-2 gap-6` layout below the divider

**Mobile behaviour:** All stories render identically in a single column — no lead distinction, no divider. The `hidden lg:block` / `lg:hidden` pattern ensures editorial hierarchy is desktop-only.

## Key decisions

- Used `featured?: boolean` prop on StoryCard rather than a separate component — minimal surface area, single component to maintain
- Lead story uses `hidden lg:block` / `lg:hidden` dual rendering to show featured variant only on desktop
- MidGridNudge repositioned to appear after the first card in the remaining grid (story[3] overall), preserving the "after 4 stories" placement
- Edge case: if < 3 stories, secondary row is skipped and all non-lead stories go to remaining grid

## Requirements delivered

| Requirement | How |
|-------------|-----|
| LAYOUT-01 | Lead story renders full-width with 28px headline and full summary on lg+ |
| LAYOUT-02 | stories[1-2] in `grid-cols-2` row between lead and divider |
| LAYOUT-03 | `h-px` horizontal rule divider, desktop only |
| LAYOUT-04 | stories[3+] in standard 2-column grid below divider |

## Verification

- TypeScript: clean (`tsc --noEmit` — no errors)
- Build: clean (`next build` — success)
- Human verification: approved by user
