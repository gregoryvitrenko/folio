---
phase: 31-complete-design-overhaul
plan: "04"
subsystem: frontend-ui
tags: [masthead, editorial, home-page, design-polish]
dependency_graph:
  requires: []
  provides: [editorial-masthead-home]
  affects: [components/BriefingView.tsx]
tech_stack:
  added: []
  patterns: [issue-number-from-launch-date, flex-justify-between-masthead]
key_files:
  created: []
  modified:
    - components/BriefingView.tsx
decisions:
  - "POLISH-06 already implemented — FirmQuiz IntroScreen wraps heading in text-center div; firm-fit/page.tsx required no changes"
  - "Issue number derived from days since 2026-03-01 launch date using Math.max(1, ...) to ensure minimum of 1"
  - "Masthead placed above StoryGrid, after Start Here callouts, so it acts as a visual separator between orientation content and daily news"
metrics:
  duration_minutes: 5
  completed_date: "2026-03-13"
  tasks_completed: 2
  files_modified: 1
---

# Phase 31 Plan 04: Home Masthead + Fit Assessment Summary

One-liner: Centered editorial masthead added to briefing home page — large serif "Folio" wordmark flanked by "London Edition" and dynamic issue number above topic tabs.

## Tasks Completed

### Task 1: Add editorial masthead to BriefingView above StoryGrid

Added a three-part editorial masthead immediately before the `<StoryGrid>` wrapper in `components/BriefingView.tsx`:

- Left: "London Edition" in `.section-label` style (stone-400/500)
- Center: serif `<h1>` "Folio" at `text-4xl sm:text-5xl font-bold`, occupying `flex-1` so it truly centers
- Right: "Vol. 1 / No. {issueNumber}" in `.section-label` style

Issue number logic added at top of component function:
```tsx
const LAUNCH_DATE = new Date('2026-03-01');
const briefingDate = new Date(briefing.date);
const issueNumber = Math.max(1, Math.round((briefingDate.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1);
```

Masthead has `border-b border-stone-200 dark:border-stone-800` to visually separate it from the tabs below. `BriefingView` is a server component — `new Date()` is valid here.

Commit: `77e7e9a` — `feat(31-04): add editorial masthead to home page`

### Task 2: Verify Fit Assessment heading alignment (POLISH-06)

Confirmed: `app/firm-fit/page.tsx` renders only `<FirmQuiz />`. The FirmQuiz component's IntroScreen wraps the heading in `<div className="w-full max-w-md text-center">`, which centers the "Which type of law firm suits you?" heading.

**POLISH-06 already implemented — no code change required.**

## Deviations from Plan

None — plan executed exactly as written. Task 2 was verification-only as the plan anticipated.

## Self-Check: PASSED

- `components/BriefingView.tsx` contains "London Edition" — confirmed present
- `components/BriefingView.tsx` contains "Vol. 1 / No." — confirmed present
- Commit `77e7e9a` exists — confirmed
- TypeScript clean — zero errors
