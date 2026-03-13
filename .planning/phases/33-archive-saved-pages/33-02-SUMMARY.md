---
phase: 33-archive-saved-pages
plan: "02"
subsystem: saved
tags: [ui, design, editorial, bookmarks]
dependency_graph:
  requires: []
  provides: [saved-redesign]
  affects: [app/saved/page.tsx, components/SavedView.tsx]
tech_stack:
  added: []
  patterns: [section-label utility, text-caption semantic token, font-serif heading pattern, rounded-card, grid layout, filled Bookmark icon]
key_files:
  modified:
    - app/saved/page.tsx
    - components/SavedView.tsx
decisions:
  - "Card layout changed from single-column space-y-3 list to grid grid-cols-1 md:grid-cols-2 gap-4"
  - "Excerpt removed from card per mockup — title + topic chip + read time only"
  - "Filled Bookmark icon (fill=currentColor) placed top-right, decorative only — BookmarkX remove button adjacent to it"
  - "Hardcoded '8 Min Read' label per plan spec — no dynamic calculation needed"
metrics:
  duration: ~5 minutes
  completed: "2026-03-13"
---

# Phase 33 Plan 02: Saved Page Heading + Card Redesign Summary

**One-liner:** Saved page heading updated to "Personal Archive" section-label overline + large serif h1; SavedView cards redesigned as 2-column grid with muted date top-left, filled bookmark icon top-right, large serif headline, and topic chip + "8 MIN READ" bottom row.

## What Was Done

1. **`app/saved/page.tsx` heading** — replaced raw `text-[11px]` overline ("Your Library") + `text-5xl` h2 ("Saved Articles") + opacity description with: `section-label` overline ("Personal Archive"), `font-serif text-5xl lg:text-6xl font-normal` h1 ("Saved Stories"), `w-16 h-px` short rule, `text-caption` description.

2. **`components/SavedView.tsx` card layout** — changed outer wrapper from `space-y-3` to `grid grid-cols-1 md:grid-cols-2 gap-4`. Each card redesigned:
   - Top row: `text-caption text-stone-400` muted date left; filled `Bookmark` icon (dark stone) + `BookmarkX` remove button right
   - Middle: `font-serif text-heading font-semibold` large headline as link
   - Bottom: topic chip with `rounded-pill border text-label` styling + "8 Min Read" label
   - Note block (if present) preserved with `border-l-2 border-charcoal` styling
   - Colored dot removed; excerpt removed

3. Existing `formatDate` helper kept (returns "Sat, 11 Mar 2026" format, displayed as muted caption).

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `app/saved/page.tsx` — contains "Personal Archive" + `section-label`
- [x] `components/SavedView.tsx` — contains "8 Min Read" + `grid grid-cols-1 md:grid-cols-2`
- [x] `npx tsc --noEmit` — passes clean
