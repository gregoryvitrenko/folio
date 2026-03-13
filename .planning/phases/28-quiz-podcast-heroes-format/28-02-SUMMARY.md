---
phase: 28
plan: "02"
subsystem: quiz
tags: [ui, hero, layout, deep-practice]
dependency_graph:
  requires: []
  provides: [quiz-hero-grid, deep-practice-links]
  affects: [app/quiz/page.tsx]
tech_stack:
  added: []
  patterns: [12-col-grid, topic-dot, section-label, pill-cta]
key_files:
  modified: [app/quiz/page.tsx]
decisions:
  - Two-column 12-col grid (7+5) for daily quiz hero vs deep practice list
  - Deep practice links use TOPIC_STYLES colour dots for visual identity
  - Archive section renamed from "Past Briefings" to "Quiz Archive"
  - Heading updated to "Commercial Quiz" (v3 pattern with overline)
metrics:
  duration: 8m
  completed: "2026-03-12"
---

# Phase 28 Plan 02: Quiz Page Redesign Summary

Replaced the single charcoal hero card on the quiz page with a responsive two-column grid. Left column (7/12) shows the daily quiz hero with radial glow and rounded pill CTA. Right column (5/12) lists all 8 practice areas as tappable rows with TOPIC_STYLES colour dots, difficulty labels, and Plus icons.

## Changes

- `app/quiz/page.tsx`: Added `DEEP_PRACTICE_TOPICS` static array with 8 practice areas
- Removed old `bg-charcoal` hero card
- Added 12-col grid hero block with daily quiz left, deep practice list right
- Updated page heading to "Commercial Quiz" with v3 overline pattern
- Renamed archive list heading to "Quiz Archive"
- Added `Plus` from lucide-react and `TOPIC_STYLES` from `@/lib/types` imports
- Removed unused `deepCount` and `storyCount` derived variables

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `app/quiz/page.tsx` modified as specified
- Commit 4656f5a exists
- `npx tsc --noEmit` passes with zero errors
