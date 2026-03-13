---
phase: 33-archive-saved-pages
plan: "01"
subsystem: archive
tags: [ui, design, editorial, archive]
dependency_graph:
  requires: []
  provides: [archive-redesign]
  affects: [app/archive/page.tsx]
tech_stack:
  added: []
  patterns: [section-label utility, text-caption semantic token, font-serif heading pattern]
key_files:
  modified:
    - app/archive/page.tsx
decisions:
  - "Replaced formatColumnDate with formatShortDate (day + month only, e.g. '11 Mar') for the new muted date line"
  - "Removed full-width divider after heading — replaced by the short w-16 rule inside the heading block"
  - "Changed list wrappers from space-y-4 to space-y-0 — border-b on each item provides visual separation"
metrics:
  duration: ~5 minutes
  completed: "2026-03-13"
---

# Phase 33 Plan 01: Archive Page Redesign Summary

**One-liner:** Editorial archive heading (section-label overline + large serif title + short rule) and pure list rows (short muted date + long serif link, border-b separator, no card backgrounds) across all three columns.

## What Was Done

Redesigned `app/archive/page.tsx` heading and column list items to match the AI Studio mockup:

1. **Heading block** — replaced raw `text-[11px]` overline + `text-5xl` h2 + opacity description with: `section-label` overline, `font-serif text-5xl lg:text-6xl font-normal` h1, `w-16 h-px` short rule, `text-caption` description. Removed the full-width `h-px` divider that followed.

2. **List items (all 3 columns)** — replaced `flex flex-col gap-0.5` with `py-2 border-b border-stone-100` rows. Short date ("11 Mar") as `text-caption text-stone-400` on the first line; full long date as `font-serif text-body` link on the second line.

3. **Date helper** — replaced `formatColumnDate` (day/month/year) with `formatShortDate` (day + month only). `formatLongDate` kept for the second row.

4. **Column wrappers** — changed `space-y-4` to `space-y-0` on all three column list wrappers.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `app/archive/page.tsx` — file exists and contains "Historical Intelligence" + `section-label` + `formatShortDate`
- [x] `npx tsc --noEmit` — passes clean
