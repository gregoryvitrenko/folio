---
phase: 05-utility-pages-analytics
plan: "03"
subsystem: infra
tags: [analytics, vercel-analytics, tracking, conversion-funnel]

# Dependency graph
requires:
  - phase: 04-conversion-surfaces
    provides: upgrade page and success page (conversion funnel endpoints)
provides:
  - "@vercel/analytics installed and Analytics component mounted globally in layout"
  - "Four conversion funnel events: upgrade_view, checkout_click, subscription_activated, free_signup"
  - "Baseline telemetry for CRO-01 requirement"
affects: [05-utility-pages-analytics]

# Tech tracking
tech-stack:
  added: ["@vercel/analytics ^1.6.1"]
  patterns:
    - "Analytics component mounted as direct child of <body> after <ScrollToTop />, outside <Providers>"
    - "track() called client-side only — import from '@vercel/analytics' in client components"
    - "upgrade_view fires via useEffect([], []) on mount; checkout_click fires at start of handleUpgrade() before async work"
    - "subscription_activated fires via useEffect([verified]) when verified===true"
    - "free_signup fires via useEffect([isSignedIn]) with useUser() hook after Clerk completes sign-up"

key-files:
  created: []
  modified:
    - app/layout.tsx
    - app/upgrade/page.tsx
    - app/success/page.tsx
    - "app/sign-up/[[...sign-up]]/page.tsx"

key-decisions:
  - "Analytics placed outside <Providers> to avoid unnecessary re-render scope on provider state changes"
  - "checkout_click fires before the fetch() call so it records intent even if checkout fails"
  - "sign-up page converted to 'use client' via Approach A (direct) — no SignUpTracker wrapper needed; SignUp from @clerk/nextjs already client-compatible in client component files"
  - "free_signup tracks isSignedIn transition, not Clerk onboarding events — simpler and sufficient for funnel baseline"

patterns-established:
  - "Conversion events use track() from '@vercel/analytics' in client components"
  - "Mount-time events use useEffect(() => { track(...) }, [])"
  - "State-transition events use useEffect(() => { if (condition) track(...) }, [dep])"

requirements-completed: [ANLYT-01, ANLYT-02]

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 05 Plan 03: Vercel Analytics + Conversion Funnel Tracking Summary

**@vercel/analytics installed with four conversion events wired across the upgrade funnel: upgrade_view, checkout_click, subscription_activated, and free_signup**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T23:53:02Z
- **Completed:** 2026-03-09T23:55:00Z
- **Tasks:** 2
- **Files modified:** 4 (+ package.json, package-lock.json)

## Accomplishments
- Installed `@vercel/analytics@^1.6.1` and mounted `<Analytics />` globally in layout as a direct child of `<body>`, outside `<Providers>`
- Added `track('upgrade_view')` on mount and `track('checkout_click')` before the Stripe checkout fetch call in `app/upgrade/page.tsx`
- Added `track('subscription_activated')` when `verified` transitions to `true` in `app/success/page.tsx`
- Added `track('free_signup')` via `useUser()` + `useEffect` in the sign-up page (converted to client component via Approach A)
- Build passes cleanly — TypeScript accepts all `track()` calls

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @vercel/analytics and mount Analytics in layout** - `c596461` (feat)
2. **Task 2: Add conversion event tracking to upgrade, success, and sign-up pages** - `e762db8` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `app/layout.tsx` - Added Analytics import and `<Analytics />` component after `<ScrollToTop />`
- `app/upgrade/page.tsx` - Added track import, upgrade_view useEffect, checkout_click call
- `app/success/page.tsx` - Added track import, subscription_activated useEffect
- `app/sign-up/[[...sign-up]]/page.tsx` - Added 'use client', useUser, useEffect, free_signup tracking
- `package.json` / `package-lock.json` - @vercel/analytics dependency added

## Decisions Made
- Analytics placed outside `<Providers>` — avoids adding re-render scope when provider state changes
- `checkout_click` fires before the `fetch()` call so the event records intent even if the Stripe checkout call fails
- Sign-up page converted to a client component directly (Approach A) rather than using a `SignUpTracker` wrapper (Approach B) — `<SignUp />` from Clerk already works in client component files, so no SSR conflict occurs
- `free_signup` tracks the `isSignedIn` state transition from `useUser()` rather than Clerk's onboarding completion events — simpler and sufficient for funnel baseline measurement

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

**External services require manual configuration.**

Vercel Analytics must be enabled in the project dashboard before events are recorded:
- Location: Vercel Dashboard → Folio project → Analytics tab → Enable
- Note: events silently no-op if Analytics is not enabled — no build errors, just no data in dashboard
- Verification: after deploying, visit /upgrade and check Vercel Analytics dashboard for `upgrade_view` event

## Next Phase Readiness
- All four conversion funnel events are instrumented and build-verified
- Production verification (events appearing in dashboard) is in Plan 05-04
- ANLYT-01 and ANLYT-02 requirements are satisfied

---
*Phase: 05-utility-pages-analytics*
*Completed: 2026-03-09*
