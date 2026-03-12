---
phase: 18-secondary-pages-conversion-polish
plan: 02
subsystem: ui
tags: [firms-directory, upgrade-page, editorial-design, conversion]
dependency_graph:
  requires: []
  provides: [firms-tier-rule-headers, upgrade-dark-cta-panel, upgrade-serif-outcomes]
  affects: [components/FirmsDirectory.tsx, app/upgrade/page.tsx]
tech_stack:
  added: []
  patterns: [editorial-newspaper-rule, dark-cta-panel, font-serif-titles]
key_files:
  modified:
    - components/FirmsDirectory.tsx
    - app/upgrade/page.tsx
decisions:
  - "Dark stone-900 CTA panel on upgrade page — replaces amber button (was spec exception in v1.2, now corrected per v1.3 brief)"
  - "font-serif at 15px for outcome titles — text-caption (12px) was too small for Playfair Display to read well as a title"
  - "Firms tier header rule: full-width 1px bg-stone-900 line above tier name — classic newspaper section separator pattern"
metrics:
  duration_minutes: 8
  completed_date: "2026-03-12"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 18 Plan 02: Firms Directory Tier Rules + Upgrade Page Editorial Polish Summary

**One-liner:** Editorial newspaper-rule tier headers in FirmsDirectory and dark stone-900 conversion panel with Playfair Display serif outcome titles on the upgrade page.

## What Was Built

### Task 1: Editorial rule treatment for tier headers — `components/FirmsDirectory.tsx`

Replaced the plain `<h3>` tier header with a two-element editorial pattern: a full-width 1px horizontal rule (`bg-stone-900 dark:bg-stone-100`) above the tier name. The tier name retains its `tracking-widest uppercase` sans style. When searching, the count label now reads "N firms" (previously "(N)") using `text-label` sizing.

The outer `<div key={tier} id={...} className="scroll-mt-28">` wrapper was left unchanged. Only the inner header element was replaced.

### Task 2: Serif outcome titles and dark stone-900 CTA panel — `app/upgrade/page.tsx`

Two targeted changes:

1. **Outcome grid titles** — Changed from `text-caption font-semibold` (12px) to `font-serif text-[15px] font-semibold leading-snug`. Playfair Display at 15px is visually distinct from the Inter caption body text below each outcome.

2. **CTA panel** — Replaced the white card with amber `bg-amber-600` button with a dark `bg-stone-900` editorial panel containing: section-label overline ("Monthly subscription"), £4 price in `font-serif text-display`, per-month caption, 3-item feature bullet list, and a border-style button (`border-stone-600 text-stone-200`) with hover states. The amber button is entirely gone. Free tier note preserved below the dark panel, unchanged.

3. **Page background** — Updated from `bg-stone-50` to `bg-paper` to match the sitewide warm cream background established in Phase 16.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `40d00df` | feat(18-02): editorial rule treatment for tier headers in FirmsDirectory |
| 2 | `9723dc2` | feat(18-02): serif outcome titles and dark stone-900 CTA panel on upgrade page |

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` passes with no errors after both tasks.
- Firms directory: each tier section (Magic Circle, Silver Circle, National, International, US Firms, Boutique) shows a full-width dark rule line above the tier name.
- Upgrade page: outcome labels render in Playfair Display serif at 15px — visually distinct from the Inter caption body below.
- Upgrade page: CTA area is a dark `bg-stone-900` panel with `border-stone-600` border-style button. No amber visible.
- Page background uses `bg-paper` (warm cream) consistent with sitewide Phase 16 standard.

## Self-Check: PASSED
