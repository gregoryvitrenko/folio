---
phase: 06-bug-fixes-content-quality
plan: "02"
subsystem: database
tags: [redis, quiz, storage, sorted-set, upstash]

# Dependency graph
requires:
  - phase: 05-utility-pages-analytics
    provides: quiz page and quiz storage infrastructure used by this fix
provides:
  - quiz:index sorted set in Redis — only dates with real quiz data
  - listQuizDates() returns only cached quiz dates (not all briefing dates)
  - Accurate question count badge in /quiz/[date] page
affects: [quiz, storage, 06-bug-fixes-content-quality]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "quiz:index sorted set mirrors briefing:index pattern — zadd on save, zrange on list"
    - "redisListQuizDates() returns empty array when quiz:index is missing (graceful bootstrap)"

key-files:
  created: []
  modified:
    - lib/storage.ts
    - app/quiz/[date]/page.tsx

key-decisions:
  - "quiz:index sorted set populated only when a quiz is actually saved — not backfilled, so index starts empty on first deploy (correct behaviour)"
  - "?? 0 fallback used instead of removing nullish coalescing entirely — safe render when no quiz data exists"
  - "redisListQuizDates wraps zrange in try/catch returning empty array — quiz:index may not exist on first boot"

patterns-established:
  - "Storage index pattern: every save operation writes to both the data key and a sorted set index"

requirements-completed: [BUG-03]

# Metrics
duration: 12min
completed: 2026-03-10
---

# Phase 6 Plan 02: Quiz Date Index Bug Fix Summary

**quiz:index sorted set added to Redis so /quiz page only lists dates with real cached quiz data, removing the briefing:index conflation bug**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-10T02:38:25Z
- **Completed:** 2026-03-10T02:50:41Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `redisSaveQuiz` now writes to both `quiz:{date}` key and `quiz:index` sorted set (mirrors `briefing:index` pattern)
- `redisListQuizDates()` reads `quiz:index` — returns only dates where a quiz was actually cached
- `listQuizDates()` routes to `redisListQuizDates()` instead of the buggy `redisList()` (briefing index)
- Hardcoded `?? 18` question count fallback replaced with `?? 0` in `/quiz/[date]` page

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix lib/storage.ts — add quiz:index sorted set** - `4b0f5fa` (fix)
2. **Task 2: Remove hardcoded ?? 18 fallback from app/quiz/[date]/page.tsx** - `03f4d6b` (fix)

**Plan metadata:** (see final commit)

## Files Created/Modified
- `/Users/gregoryvitrenko/Documents/Folio/lib/storage.ts` - Added `redisSaveQuiz` Promise.all with `quiz:index` zadd; added `redisListQuizDates()` function; fixed `listQuizDates()` Redis branch
- `/Users/gregoryvitrenko/Documents/Folio/app/quiz/[date]/page.tsx` - Replaced `?? 18` with `?? 0` in `questionCount` calculation

## Decisions Made
- `quiz:index` starts empty on first deploy — no backfill needed because future cron saves will populate it. This is correct: showing an empty "Available" list is better than showing misleading dates.
- `?? 0` kept instead of removing the nullish coalescing entirely — safer if the page is somehow visited before a quiz is cached.
- `redisListQuizDates()` uses try/catch around `zrange` so it gracefully returns `[]` when `quiz:index` key doesn't exist yet in Redis.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run build` shows a trace collection error (`edge-runtime-webpack.js` ENOENT) at the very end of the build after all 17 static pages are generated. Confirmed pre-existing issue unrelated to this plan's changes — does not affect build output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Quiz date listing now accurate — deploy to production to populate `quiz:index` from future cron runs
- The `/quiz` "Available" list will be empty until at least one successful quiz generation (expected and correct)
- No blockers for remaining bug-fix plans in Phase 6

---
*Phase: 06-bug-fixes-content-quality*
*Completed: 2026-03-10*

## Self-Check: PASSED

- lib/storage.ts: FOUND
- app/quiz/[date]/page.tsx: FOUND
- 06-02-SUMMARY.md: FOUND
- Commit 4b0f5fa (Task 1): FOUND
- Commit 03f4d6b (Task 2): FOUND
