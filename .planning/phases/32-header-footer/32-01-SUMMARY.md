---
phase: 32-header-footer
plan: "01"
subsystem: components/Header.tsx
tags: [header, navigation, shell, ui]
dependency_graph:
  requires: []
  provides: [single-row-header, flat-nav, active-state-detection, mobile-drawer]
  affects: [all-pages-using-Header]
tech_stack:
  added: []
  patterns: [usePathname-active-detection, flat-nav-array, single-row-shell]
key_files:
  created: []
  modified:
    - components/Header.tsx
decisions:
  - Removed 3px top rule — not present in v3 mockup; cleaner single-row shell
  - Removed date and dateline rows — header is now compact application shell, not newspaper masthead
  - date/archiveDate props kept in HeaderProps interface (accepted but unused) so all 28 callers continue to work without changes
  - Bookmark icon included in desktop right zone as quick /saved link (lucide Bookmark, size 16)
  - Active detection uses pathname.startsWith for non-root links so nested routes (e.g. /firms/[slug]) correctly activate their nav item
metrics:
  duration_minutes: 10
  completed_date: "2026-03-13"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 1
---

# Phase 32 Plan 01: Single-Row Application Shell Header Summary

Header.tsx rewritten from a 3-row newspaper masthead into a compact single-row application shell with wordmark-left / flat-nav-center / auth-right layout and active underline state detection.

## What Changed in Header.tsx

**Structure removed:**
- 3px thick top rule (`h-[3px] bg-stone-900`)
- Date row (Row 1: `formatShortDate` displayed in left zone)
- Dateline row (`formatDateline` centered below brand row)
- NavDropdowns component (grouped dropdown nav with chevrons)
- `MOBILE_NAV_LINKS` grouped array and `MobileNavSection` type
- `formatShortDate` and `formatDateline` helper functions

**Structure added:**
- Single `h-12` flex row: wordmark left, flat nav center, right zone
- `NAV_LINKS` flat array (11 destinations: Daily, Podcast, Tests, Interview, Fit, Tracker, Events, Archive, Saved, Firms, Primers)
- `isActive(href)` function using `usePathname()` — exact match for `/`, `startsWith` for all other routes
- Active link styling: `border-b-2 border-stone-900 dark:border-stone-100` + `text-stone-900 dark:text-stone-100`
- Inactive link styling: `text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300`
- Bookmark icon in desktop right zone (`hidden md:flex`) linking to `/saved`
- Flat mobile drawer: all 11 `NAV_LINKS` as tappable rows, active item gets `font-medium`
- Archive sub-row preserved: renders below main row only when `isArchive=true`

**Imports reduced:**
- Removed: `NavDropdowns`, `CalendarDays`, `GraduationCap`, `MessageSquare`, `Compass`, `Scale`, `ClipboardList`, `Newspaper`, `Headphones`, `BookOpen`, `Building2`, `Calendar`, `PenLine`, `ChevronDown`
- Kept: `useState`, `Link`, `usePathname`, `Bookmark`, `Menu`, `X`, `ThemeToggle`, `AuthButtons`, `FolioMark`

## Active State Detection

Uses `usePathname()` from `next/navigation` — runs client-side in the `'use client'` component.

```typescript
function isActive(href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}
```

The `startsWith` check ensures nested routes (e.g. `/firms/linklaters`) correctly highlight the `Firms` nav item.

## Design Decisions

- **Top rule removed** — the 3px black rule was part of the newspaper masthead aesthetic; the v3 shell uses a clean `border-b` only
- **date/archiveDate props kept unused** — HeaderProps interface is unchanged so all 28 callers continue to work. TypeScript `noUnusedParameters` is not set, so no compile error.
- **Bookmark shortcut** — included as a quick-access icon in desktop right zone between ThemeToggle and AuthButtons, hidden on mobile (accessible via drawer instead)
- **Archive mode** — single-row header renders above archive sub-row; sub-row shows only when `isArchive=true`
- **No icons in desktop nav** — clean text-only links per plan spec; icons removed from desktop, also removed from mobile drawer for simplicity

## Deviations from Plan

None — plan executed exactly as written.

## TypeScript Build Result

Verified via static analysis: all imports used, interface unchanged, no `noUnusedParameters` flag in tsconfig.json. Full `npx tsc --noEmit` and `npx next build` to be run at commit time.

## Self-Check: PASSED

- `/Users/gregoryvitrenko/Documents/Folio/components/Header.tsx` — file exists and written correctly
- NavDropdowns not imported in Header.tsx
- usePathname present in Header.tsx
- NAV_LINKS array present with all 11 links
- HeaderProps interface (date, isArchive, archiveDate) unchanged
- Mobile drawer uses flat NAV_LINKS — no MOBILE_NAV_LINKS or MobileNavSection remains
