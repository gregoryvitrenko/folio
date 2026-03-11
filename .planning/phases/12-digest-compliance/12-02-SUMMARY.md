---
phase: 12-digest-compliance
plan: 02
subsystem: api
tags: [resend, email, gdpr, pecr, hmac, redis, anthropic, haiku, list-unsubscribe]

# Dependency graph
requires:
  - phase: 12-digest-compliance/12-01
    provides: buildUnsubscribeUrl(), signUnsubscribeToken(), email-opt-out Redis key pattern
provides:
  - GDPR-compliant digest send with opt-out check before every email
  - List-Unsubscribe and List-Unsubscribe-Post headers on every digest email
  - Editorial subject lines via claude-haiku-4-5-20251001 with template fallback
  - Story de-duplication across days via first-5-word headline fingerprint
  - Per-subscriber unsubscribe URL embedded in email footer
affects:
  - 12-03 — referral CTA will extend the digest template built here

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "List-Unsubscribe one-click header: List-Unsubscribe=One-Click in List-Unsubscribe-Post"
    - "Story de-dup: first-5-word fingerprint (lowercase, stripped punctuation) as Set key"
    - "Haiku subject line: max_tokens=80, returns null on failure, fallback is top headline + count"
    - "Opt-out guard: isOptedOut() checks Redis before send, skipped counter in response"

key-files:
  created: []
  modified:
    - lib/email.ts
    - app/api/digest/route.ts

key-decisions:
  - "digestHtml updated to accept unsubscribeUrl as 4th param — footer now has literal unsubscribe link, not generic account settings text"
  - "sendWeeklyDigest subject param supplied by caller (digest route) so Haiku generation stays in route layer"
  - "siteUrl hardcoded fallback updated to https://www.folioapp.co.uk (canonical) rather than localhost"
  - "Story de-dup uses 5-word fingerprint not firms overlap — DigestStory type has no firms field; fingerprint handles same-deal coverage across multiple briefing days"

patterns-established:
  - "Opt-out gate pattern: await isOptedOut(email); if (optedOut) { skipped++; continue; }"
  - "Subject fallback pattern: aiSubject ?? template string with top headline"

requirements-completed: [DIGEST-01, DIGEST-02]

# Metrics
duration: 12min
completed: 2026-03-11
---

# Phase 12 Plan 02: Digest Compliance — Wire Send Flow Summary

**GDPR-compliant digest send with opt-out checks, List-Unsubscribe headers, Haiku editorial subject lines, and cross-day story de-duplication**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-11T18:30:00Z
- **Completed:** 2026-03-11T18:42:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `sendWeeklyDigest` now accepts `subject` and `unsubscribeUrl` params — List-Unsubscribe and List-Unsubscribe-Post headers included in every Resend send call
- Digest footer replaced: "Manage your subscription at any time from your account settings" is now a literal "Unsubscribe from this digest" hyperlink per GDPR/PECR
- `isOptedOut()` checks `email-opt-out:{email}` in Redis before each send — opted-out subscribers are silently skipped, `skipped` count returned in response JSON
- Claude Haiku generates an editorial subject line under 60 chars; falls back to `{top headline} + N more` on any failure
- Story de-duplication via 5-word headline fingerprint prevents the same deal appearing multiple times when covered across consecutive briefing days

## Task Commits

Each task was committed atomically:

1. **Task 1: Update sendWeeklyDigest with unsubscribe URL, List-Unsubscribe headers, and updated footer** - `2515194` (feat)
2. **Task 2: Add opt-out check, Haiku subject line, and story de-duplication to digest route** - `8cd4bf1` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `lib/email.ts` — updated `sendWeeklyDigest` signature (added `subject`, `unsubscribeUrl`), updated `digestHtml` signature, replaced footer text, added List-Unsubscribe headers
- `app/api/digest/route.ts` — added `isOptedOut()`, `generateSubjectLine()`, story de-dup loop, subject line wiring, per-subscriber URL building, `skipped` counter

## Decisions Made
- `subject` param supplied by the digest route (not internally generated in `sendWeeklyDigest`) — keeps email.ts stateless; AI generation belongs in the route layer
- Fallback `siteUrl` updated to `https://www.folioapp.co.uk` (canonical) instead of localhost — unsubscribe URLs in production emails must be absolute and correct
- 5-word fingerprint for de-dup rather than firms overlap — `DigestStory` has no `firms` field; fingerprint approach is simpler and correct for real-world duplicate story patterns

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. TypeScript compiles clean with zero errors after both task commits.

## User Setup Required

None — no new env vars. CRON_SECRET (used by `buildUnsubscribeUrl`) and UPSTASH_REDIS credentials are already set in Vercel.

## Next Phase Readiness
- Digest is now legally ready to fire: unsubscribe endpoint live (Plan 01), opt-out check wired (this plan), List-Unsubscribe headers present
- Plan 03 (referral CTA) can extend `digestHtml` with a referral section — the template structure is clean and stable
- The weekly cron (`GET /api/digest` at 08:00 UTC Sundays per vercel.json) can be activated without compliance concerns

## Self-Check: PASSED

- `lib/email.ts` — confirmed present and updated
- `app/api/digest/route.ts` — confirmed present and updated
- Commit `2515194` — confirmed in git history
- Commit `8cd4bf1` — confirmed in git history
- `npx tsc --noEmit` — zero errors

---
*Phase: 12-digest-compliance*
*Completed: 2026-03-11*
