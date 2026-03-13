---
phase: 36-quiz-page-cleanup
plan: 01
subsystem: quiz
tags: [layout, gamification, quiz]
dependency_graph:
  requires: []
  provides: [quiz-hub-layout]
  affects: [app/quiz/page.tsx]
tech_stack:
  added: []
  patterns: [three-section vertical layout, flex-wrap responsive stats strip]
key_files:
  created: []
  modified:
    - app/quiz/page.tsx
decisions:
  - Pre-existing TypeScript error in app/archive/page.tsx (formatColumnDate → formatLongDate) is out of scope — not touched by this plan, deferred
metrics:
  duration: ~5 minutes
  completed: 2026-03-13
---

# Phase 36 Plan 01: Quiz Page Layout Restructure Summary

**One-liner:** Gamification stats strip promoted from inline-beside-heading to its own full-width row, creating a clean three-section vertical layout on the quiz hub page.

## What Changed in app/quiz/page.tsx

### Before
The quiz page used a single `<div className="flex items-start justify-between gap-8 mb-12 flex-wrap">` row that contained both:
- The heading block (overline + serif title) on the left
- The `{statsStrip}` on the right (`flex-shrink-0`)

This crammed the gamification data beside the heading, competing for horizontal space and burying the stats at the same visual level as the page title.

### After
Three distinct vertical sections:

1. **Heading block** — `<div className="space-y-3 mb-6">` containing the overline and serif h2.
2. **Gamification strip** — `{statsStrip && (<div className="mb-10">{statsStrip}</div>)}` — its own full-width row between heading and panels.
3. **Two-panel grid** — `<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">` unchanged, Daily (lg:col-span-7) left, Deep Practice (lg:col-span-5) right.

The `statsStrip` wrapper was also updated from `flex items-center gap-3 flex-shrink-0` to `flex items-center gap-4 flex-wrap` so the two stat cards (streak + XP/level) wrap on narrow viewports.

The same three-section restructure was applied to both branches of the component: the early-return (no briefing) branch and the main return branch.

## Final DOM Order

```
<main>
  <!-- 1. Heading block (mb-6) -->
  <div class="space-y-3 mb-6">
    <span class="section-label">Intelligence Training</span>
    <h2>Commercial Quiz</h2>
  </div>

  <!-- 2. Gamification strip (mb-10, conditional) -->
  <div class="mb-10">
    <div class="flex items-center gap-4 flex-wrap">
      <!-- streak card -->
      <!-- xp/level card -->
    </div>
  </div>

  <!-- 3. Two-panel grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Daily (lg:col-span-7) -->
    <!-- Deep Practice (lg:col-span-5) -->
  </div>
</main>
```

## Deviations from Plan

None — plan executed exactly as written.

**Note (out of scope):** A pre-existing TypeScript error exists in `app/archive/page.tsx` (`formatColumnDate` not found, should be `formatLongDate`). This file was not touched by this plan. Deferred for a future session.

## Self-Check

- [x] `app/quiz/page.tsx` modified and committed (b13f071)
- [x] No `flex-shrink-0` on statsStrip wrapper
- [x] No date archive list (`dateList`, `AVAILABLE`) in quiz page
- [x] statsStrip rendered before `grid grid-cols` in DOM order (confirmed by grep)
- [x] Three-section structure applied to both early-return and main return branches
- [x] TypeScript error is pre-existing in unrelated file, out of scope

## Self-Check: PASSED
