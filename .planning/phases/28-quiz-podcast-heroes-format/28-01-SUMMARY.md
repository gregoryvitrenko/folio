---
phase: 28
plan: "01"
subsystem: podcast
tags: [ui, hero, copy, evergreen]
dependency_graph:
  requires: []
  provides: [evergreen-podcast-hero]
  affects: [components/PodcastPlayer.tsx]
tech_stack:
  added: []
  patterns: [static-copy, section-label]
key_files:
  modified: [components/PodcastPlayer.tsx]
decisions:
  - Removed dynamic episodeTitle/episodeSubtitle — hero no longer reflects story content
  - Fixed subtitle is always rendered (no conditional)
  - Cover card brand simplified from "Folio Daily" to "Folio"
metrics:
  duration: 5m
  completed: "2026-03-12"
---

# Phase 28 Plan 01: Podcast Hero Evergreen Copy Summary

Replaced dynamic story-derived podcast hero copy with static evergreen text — "Daily Briefing Podcast" title and a fixed description paragraph. The hero no longer reflects the first story's headline or soundbite, making it consistent regardless of briefing content.

## Changes

- `components/PodcastPlayer.tsx`: Deleted `episodeTitle` and `episodeSubtitle` derived constants
- Overline chip changed from "Latest Episode" to "Daily Briefing"
- h1 set to static "Daily Briefing Podcast"
- Subtitle changed from conditional `{episodeSubtitle}` to always-rendered evergreen description
- Cover art card brand updated from "Folio Daily" to "Folio"

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `components/PodcastPlayer.tsx` modified as specified
- Commit 9538960 exists
- `npx tsc --noEmit` passes with zero errors
