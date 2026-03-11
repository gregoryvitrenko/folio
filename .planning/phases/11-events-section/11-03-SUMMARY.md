---
phase: 11-events-section
plan: "03"
subsystem: ui
tags: [events, next-js, react, server-component, suspense, city-filter, nav]

requires:
  - phase: 11-01
    provides: getEvents, LegalEvent, EventsStore interfaces, lib/events.ts
  - phase: 11-02
    provides: /api/events route with format=ics support
provides:
  - /events listing page (free tier, no paywall)
  - /events/[id] detail page (free tier, no paywall)
  - CityFilter client component with useSearchParams-based city tabs
  - Events entry in desktop nav (Daily dropdown) and mobile nav
affects: []

tech-stack:
  added: []
  patterns: [server-component-with-suspense-boundary, client-filter-via-search-params, free-tier-page]

key-files:
  created:
    - app/events/page.tsx
    - app/events/CityFilter.tsx
    - app/events/[id]/page.tsx
  modified:
    - components/Header.tsx
    - components/NavDropdowns.tsx

key-decisions:
  - "Events placed in Daily nav dropdown alongside Briefing and Podcast — fresh weekly content matches editorial grouping"
  - "CalendarDays icon used for Events nav item to avoid clash with Calendar icon already used for Briefings archive entry"
  - "EventsGrid exported from CityFilter.tsx so it can serve as both the Suspense fallback and the filtered view — single source of truth for card rendering"
  - "params typed as Promise<{ id: string }> in detail page — required by Next.js 15 App Router async params contract"

patterns-established:
  - "Suspense boundary pattern: Server Component wraps useSearchParams client component in <Suspense fallback={<UnfilteredView />}> to prevent hydration flash"
  - "Free-tier page pattern: no requireSubscription import, no paywall — events accessible to signed-out users"

requirements-completed: [EVT-01, EVT-03]

duration: 5min
completed: 2026-03-11
---

# Phase 11 Plan 03: Events UI Pages Summary

**Server-rendered /events listing with Suspense-wrapped CityFilter, /events/[id] detail with .ics + registration CTA, and Events wired into desktop and mobile nav under Daily.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-11T17:05:16Z
- **Completed:** 2026-03-11T17:10:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- /events listing page filters past events server-side (date >= today), renders city tabs derived from available events data
- Suspense boundary wraps CityFilter to satisfy Next.js 15 useSearchParams requirement — fallback shows all events unfiltered during hydration
- /events/[id] detail page shows full event info, .ics download (links to /api/events?format=ics), and external registration link; notFound() for unknown IDs
- Events entry added to both desktop nav (Daily dropdown in NavDropdowns.tsx) and mobile nav drawer (Daily section in Header.tsx)
- No requireSubscription anywhere in app/events/ — events are free tier

## Task Commits

1. **Task 1: Build /events listing page with CityFilter client component** - `d78112a` (feat)
2. **Task 2: Build /events/[id] detail page and wire nav link** - `2690375` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `app/events/page.tsx` — Server Component listing page; fetches events, filters past events, wraps CityFilter in Suspense
- `app/events/CityFilter.tsx` — Client Component; city tab bar using useSearchParams + router.push; EventsGrid exported for Suspense fallback reuse
- `app/events/[id]/page.tsx` — Server Component detail page; full event rendering, .ics anchor, external registration link, notFound() for missing events
- `components/Header.tsx` — Events added to MOBILE_NAV_LINKS Daily section with CalendarDays icon
- `components/NavDropdowns.tsx` — Events added to Daily NAV_GROUPS with CalendarDays icon

## Decisions Made

- Events placed in Daily nav dropdown (alongside Briefing and Podcast) — reflects its weekly-fresh editorial character
- CalendarDays icon used to distinguish Events nav entry from Calendar icon already used for Briefings archive
- EventsGrid extracted as a named export from CityFilter.tsx so Server Component can use it as Suspense fallback without duplicating card markup
- Next.js 15 requires `params: Promise<{ id: string }>` with `await params` in async Server Components

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 11 (Events Section) is now complete: data layer (plan 01), API route (plan 02), and UI pages (plan 03) all shipped
- Phase 12 (Digest Compliance) is ready to plan — DIGEST-02 unsubscribe endpoint must ship in same deployment as DIGEST-01

---
*Phase: 11-events-section*
*Completed: 2026-03-11*

## Self-Check: PASSED

- app/events/page.tsx: FOUND
- app/events/CityFilter.tsx: FOUND
- app/events/[id]/page.tsx: FOUND
- Commit d78112a (Task 1): FOUND
- Commit 2690375 (Task 2): FOUND
