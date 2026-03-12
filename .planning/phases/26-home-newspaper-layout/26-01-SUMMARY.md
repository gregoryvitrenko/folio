---
phase: 26-home-newspaper-layout
plan: 01
subsystem: frontend/briefing
tags: [layout, newspaper, home-page, story-grid, redesign]
dependency_graph:
  requires: []
  provides: [newspaper-layout-home-page]
  affects: [components/NewspaperGrid.tsx, components/StoryGrid.tsx, components/BriefingView.tsx]
tech_stack:
  added: []
  patterns: [asymmetric-12-col-grid, newspaper-hierarchy, numbered-sidebar]
key_files:
  created:
    - components/NewspaperGrid.tsx
  modified:
    - components/StoryGrid.tsx
    - components/BriefingView.tsx
decisions:
  - "Sidebar CTA replaces MidGridNudge — charcoal bg-[#2D3436] panel in the sidebar is more prominent than the inline nudge"
  - "StoryGrid becomes a thin wrapper (TabBar + NewspaperGrid) — all layout logic lives in NewspaperGrid"
  - "PodcastPlayer.tsx build error was pre-existing and stale-cache artefact — confirmed not caused by this plan"
metrics:
  duration: 15m
  completed: 2026-03-12T23:57:42Z
  tasks_completed: 2
  files_modified: 3
---

# Phase 26 Plan 01: Newspaper Layout for Briefing Home Page Summary

Replaced the flat 2-column story grid with an asymmetric newspaper layout — lead story at `lg:col-span-8` with a 5xl serif headline + full untruncated excerpt, sidebar at `lg:col-span-4` with numbered stories 2-5, and a "More stories" 3-column grid below for stories 6-8.

## Tasks Completed

### Task 1 — Create NewspaperGrid component

Created `components/NewspaperGrid.tsx` as a `'use client'` component implementing the full newspaper layout:

- Lead story (`stories[0]`) in an 8-column left section with right border: topic badge (colour dot + section-label), `text-5xl font-serif font-bold` headline, coloured rule (`h-0.5 w-16`), full untruncated `stripBold(story.summary)` excerpt, lock icon or "Read full article" link gated by `subscribed` prop.
- Sidebar (`stories[1..4]`) in a 4-column right section: numbered items with large faded `text-4xl font-serif` numerals, topic dot, serif title with hover underline.
- Charcoal `bg-[#2D3436]` subscription CTA panel at bottom of sidebar for non-subscribed users.
- Below-fold section: "More stories" horizontal rule divider, 3-column `<StoryCard>` grid for `stories[5..7]`.
- Mobile collapses naturally via `grid-cols-1` base with `lg:grid-cols-12` breakpoint.

### Task 2 — Wire NewspaperGrid into StoryGrid and clean up BriefingView

`StoryGrid.tsx` reduced to a thin wrapper: `TabBar` (topic filter tabs) + `<NewspaperGrid>`. Removed `MidGridNudge` function, the old `grid-cols-2` block, and unused imports (`StoryCard`, `Lock`, `Link`).

`BriefingView.tsx` cleaned up per v3 design spec:
- `text-[13px]` → `text-caption` on "Start Here" card links
- `rounded-sm` → `rounded-card` on "Start Here" link cards and upgrade border box
- Subscribe button: `bg-stone-900` → `bg-[#2D3436]`, `rounded-sm` → `rounded-chrome`, `text-[13px]` → `text-caption`
- Sign-in link: `text-[12px]` → `text-caption`

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` — zero errors
- `npx next build` — clean build, all routes compiled
- Initial build attempt showed a pre-existing `episodeTitle` error in `PodcastPlayer.tsx` from a stale `.next` cache. Confirmed pre-existing: `git diff HEAD -- components/PodcastPlayer.tsx` returned zero lines (file not touched). Second build passed cleanly.

## Self-Check: PASSED

- `components/NewspaperGrid.tsx` — created and verified
- `components/StoryGrid.tsx` — updated, MidGridNudge removed
- `components/BriefingView.tsx` — design token cleanup applied
- TypeScript: zero errors
- Next.js build: clean
