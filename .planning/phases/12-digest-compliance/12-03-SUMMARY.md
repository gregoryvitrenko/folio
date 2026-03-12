---
phase: 12-digest-compliance
plan: "03"
subsystem: payments
tags: [stripe, redis, referral, email, resend]

# Dependency graph
requires:
  - phase: 12-digest-compliance
    provides: sendWeeklyDigest with subject + unsubscribeUrl, GDPR opt-out check
  - phase: 12-digest-compliance
    provides: Stripe checkout session creation, webhook idempotency guard
provides:
  - Referral code generation + lazy creation (Redis bidirectional mapping)
  - folio-ref cookie set on ?ref= page visits via ReferralTracker component
  - Stripe checkout metadata passes referralCode from folio-ref cookie
  - Webhook records referral inside idempotency guard (no double-counting)
  - Free-month Stripe coupon applied at every 3rd successful referral
  - Each digest email personalised with subscriber's unique referral CTA block
affects: [digest, checkout, webhook, email]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bidirectional Redis mapping: referral-code:{userId} <-> referral:{code} for O(1) lookup in both directions"
    - "Referral recording uses SET NX to prevent double-counting; runs inside Stripe webhook idempotency guard"
    - "Non-fatal referral lookup in digest: try/catch so email still sends if Redis unavailable"
    - "Dev fallback: deterministic SHA-256 slice for referral codes (no Redis required)"
    - "Self-referral guard: referrerId !== newUserId before incrementing count"

key-files:
  created:
    - lib/referral.ts
    - components/ReferralTracker.tsx
  modified:
    - app/layout.tsx
    - app/api/stripe/checkout/route.ts
    - app/api/stripe/webhook/route.ts
    - lib/email.ts
    - app/api/digest/route.ts

key-decisions:
  - "Referral reward applied at every 3rd referral (newCount % 3 === 0) — milestone-based rewards, not one-time"
  - "Stripe coupon created fresh per reward (percent_off: 100, duration: once, max_redemptions: 1) — no reuse"
  - "ReferralTracker validates ?ref= format (/^[0-9a-f]{8}$/) before setting cookie — prevents XSS/injection"
  - "Subscriber collection refactored from emails[] to {email, customerId}[] to enable referral lookup without extra Redis query"
  - "Referral CTA only renders in digest if referralLink is truthy — graceful degradation when Redis unavailable"

patterns-established:
  - "Bidirectional referral mapping: SET referral-code:{userId} AND referral:{code} atomically via Promise.all"
  - "Webhook non-fatal side-effects: referral recording in try/catch after the main idempotency-guarded block"

requirements-completed: [DIGEST-03]

# Metrics
duration: 4min
completed: 2026-03-12
---

# Phase 12 Plan 03: Digest Compliance — Referral System Summary

**End-to-end viral referral system: unique per-user codes tracked via cookie, passed through Stripe checkout metadata, recorded in webhook, rewarded with free-month coupon at every 3rd referral, and surfaced as a personalised CTA in each weekly digest email.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-12T02:45:27Z
- **Completed:** 2026-03-12T02:49:27Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Full referral pipeline from cookie to coupon reward, wired end-to-end in 2 tasks
- ReferralTracker client component captures ?ref= param on any page visit and stores it as a 30-day cookie
- Stripe checkout reads folio-ref cookie and passes referralCode in session metadata; webhook records referral inside the idempotency guard (no double-counting on retries)
- Weekly digest now includes a personalised stone-palette referral CTA block with the subscriber's unique link; digest still sends if referral lookup fails (non-fatal)

## Task Commits

1. **Task 1: Create lib/referral.ts and ReferralTracker client component** - `5bfc92c` (feat)
2. **Task 2: Wire referral into checkout, webhook, and digest email** - `fb4b2a8` (feat)

## Files Created/Modified

- `lib/referral.ts` - getOrCreateReferralCode, recordReferral, applyFreeMonthCoupon (internal); dual-backend (Redis/FS), self-referral guard, SET NX deduplication
- `components/ReferralTracker.tsx` - client component with Suspense boundary; validates ?ref= format before setting folio-ref cookie
- `app/layout.tsx` - added ReferralTracker import and component after Providers
- `app/api/stripe/checkout/route.ts` - reads folio-ref cookie via next/headers, passes referralCode in session metadata
- `app/api/stripe/webhook/route.ts` - imports recordReferral, records referral after subscription save inside idempotency guard
- `lib/email.ts` - sendWeeklyDigest accepts optional referralLink (6th param); digestHtml renders referral CTA block conditionally
- `app/api/digest/route.ts` - subscriber collection refactored to {email, customerId}[]; referral link built per subscriber via getUserIdByCustomer + getOrCreateReferralCode

## Decisions Made

- Referral reward at every 3rd referral (`newCount % 3 === 0`) — milestone-based so referrers are incentivised to keep sharing, not just for the first reward
- Fresh Stripe coupon created per reward (`max_redemptions: 1`) — no coupon reuse; audit trail clean
- ReferralTracker validates `?ref=` format (`/^[0-9a-f]{8}$/`) before setting cookie — prevents cookie injection with arbitrary values
- Subscriber list refactored from `emails[]` to `{ email, customerId }[]` so referral lookup uses the already-available customerId rather than an extra Redis query by email

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no new environment variables or external service configuration required. Uses existing Stripe, Redis, and Resend credentials.

## Next Phase Readiness

Phase 12 (Digest Compliance) is now complete:
- Plan 01: GDPR unsubscribe endpoint + confirmation page
- Plan 02: Digest send flow compliance (opt-out check, Haiku subject, de-dup)
- Plan 03: Referral system (this plan)

All DIGEST requirements (DIGEST-01 through DIGEST-03) are fulfilled. The weekly digest is legally compliant and has a viral loop. Ready to push to production and send the first digest.

---
*Phase: 12-digest-compliance*
*Completed: 2026-03-12*
