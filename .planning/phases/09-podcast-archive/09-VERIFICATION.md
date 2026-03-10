---
phase: 09-podcast-archive
verified: 2026-03-10T21:00:00Z
status: human_needed
score: 7/7 automated checks passed
re_verification: false
human_verification:
  - test: "POST /api/admin/backfill-quiz as admin user on production"
    expected: "Response { backfilled: N } where N > 0; /quiz/archive then shows pre-Phase-6 dates"
    why_human: "Requires live Redis data on production — no local Redis in dev; backfill only meaningful with real quiz:{date} keys"
  - test: "Visit /podcast/archive on production after deploy"
    expected: "Page lists episodes from before Blob activation (pre-session-6); play button present on dates with cached MP3; 'No audio' label on script-only dates"
    why_human: "Requires live Redis podcast-script:* keys and Vercel Blob — cannot verify with local filesystem"
  - test: "Day after deploy: at 06:05 UTC call GET /api/podcast-audio?date=today&check=true"
    expected: "Returns { exists: true } before any user visits /podcast — confirming cron pre-generated the MP3"
    why_human: "Requires real 06:00 UTC cron execution, live ElevenLabs call, and live Blob write — cannot reproduce locally"
  - test: "Verify BLOB_READ_WRITE_TOKEN is set in Vercel production environment"
    expected: "Vercel dashboard shows BLOB_READ_WRITE_TOKEN set; /api/podcast-audio?date=recent&check=true returns { exists: true } for a recent cached date"
    why_human: "Env var presence confirmed by user in session 6 but requires live Vercel infra to assert Blob backend is active"
---

# Phase 9: Podcast Archive — Verification Report

**Phase Goal:** Podcast episodes are cached in Vercel Blob (stopping ElevenLabs character burn on every play) and subscribers can browse and play past episodes from a dedicated archive page. Also covers: quiz archive backfill (backfillQuizIndex + admin route) and cron MP3 pre-generation.
**Verified:** 2026-03-10T21:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `backfillQuizIndex()` is exported from `lib/storage.ts` with idempotent Redis scan | VERIFIED | `lib/storage.ts` lines 211-233: exported function, cursor-based scan with `Number(nextCursor)` coercion, `nx:true` on zadd, returns count |
| 2 | Admin POST route at `/api/admin/backfill-quiz` calls `backfillQuizIndex()` and is admin-gated | VERIFIED | `app/api/admin/backfill-quiz/route.ts`: imports `backfillQuizIndex`, checks `ADMIN_USER_ID` from env (no fallback), returns `{ backfilled: count }` |
| 3 | `listPodcastDatesWithStatus()` exported from `lib/podcast-storage.ts`, unions Blob + Redis script dates in single pass | VERIFIED | `lib/podcast-storage.ts` lines 205-260: Blob list pass sets `blobDates`, Redis scan sets `scriptDates`, merged and sorted descending, maps `{ date, hasAudio: blobDates.has(date) }` |
| 4 | `/podcast/archive` page uses `listPodcastDatesWithStatus()` and renders conditional play/no-audio per row | VERIFIED | `app/podcast/archive/page.tsx` line 3 imports `listPodcastDatesWithStatus`; lines 79-118: clickable `<Link>` for `hasAudio || isToday`, non-clickable `<div>` with "No audio" label otherwise |
| 5 | `lib/podcast-audio.ts` shared helper checks cache first, checks `hasCapacity()`, calls ElevenLabs, saves to Blob | VERIFIED | `lib/podcast-audio.ts` lines 20-78: cache-first return, `getCachedScript` null check, `hasCapacity` guard, API key guard, ElevenLabs fetch, `recordUsage` + `saveAudio` |
| 6 | `app/api/generate/route.ts` cron chains `generateAndCachePodcastAudio` fire-and-forget after podcast script | VERIFIED | Lines 80-84: `generateAndSavePodcastScript(briefing).then(() => generateAndCachePodcastAudio(briefing.date)).catch(...)` — no `await`, entire chain is non-blocking |
| 7 | `app/api/podcast-audio/route.ts` POST handler calls shared helper instead of inlining ElevenLabs | VERIFIED | Lines 111-130: replaces ~60-line inline block with `generateAndCachePodcastAudio(date, resolvedVoiceId)` call; no `hasCapacity`/`recordUsage`/`saveAudio` imports remain in POST path |

**Score:** 7/7 automated truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/storage.ts` | `backfillQuizIndex()` export: cursor scan, `nx:true` zadd, Number() coercion | VERIFIED | Lines 211-233 — function present, all three requirements met |
| `app/api/admin/backfill-quiz/route.ts` | POST-only handler, admin gating, returns `{ backfilled: count }` | VERIFIED | 17 lines; POST only; `ADMIN_USER_ID` from env with no fallback; calls `backfillQuizIndex()` |
| `lib/podcast-storage.ts` | `listPodcastDatesWithStatus()` returns `Array<{ date: string; hasAudio: boolean }>` | VERIFIED | Lines 205-260; correct return type; Blob + Redis union; filesystem fallback; `listPodcastDates()` unchanged |
| `app/podcast/archive/page.tsx` | Imports `listPodcastDatesWithStatus`; conditional `<Link>`/`<div>` rendering per `hasAudio` | VERIFIED | Lines 1-128; imports correct; `groupByMonth` accepts typed episodes; "No audio" label wired |
| `lib/podcast-audio.ts` | Exports `generateAndCachePodcastAudio(date, voiceId?)` shared helper | VERIFIED | Lines 20-78; all required steps present in correct order |
| `app/api/generate/route.ts` | Chains `generateAndCachePodcastAudio` fire-and-forget after `generateAndSavePodcastScript` | VERIFIED | Lines 80-84; non-blocking chain confirmed |
| `app/api/podcast-audio/route.ts` | POST handler uses shared helper, no duplicate ElevenLabs logic | VERIFIED | Lines 111-130; shared helper call confirmed; old ElevenLabs inline block removed |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/api/admin/backfill-quiz/route.ts` | `lib/storage.ts` | `import { backfillQuizIndex }` | WIRED | Line 3: `import { backfillQuizIndex } from '@/lib/storage'`; line 14: called |
| `lib/podcast-storage.ts backfillQuizIndex()` | Redis `quiz:index` sorted set | `redis.zadd` with `nx:true` | WIRED | Line 224: `redis.zadd('quiz:index', { nx: true, score: ..., member: date })` |
| `app/podcast/archive/page.tsx` | `lib/podcast-storage.ts` | `import { listPodcastDatesWithStatus }` | WIRED | Line 3: import confirmed; line 43: `await listPodcastDatesWithStatus()` called |
| `lib/podcast-storage.ts listPodcastDatesWithStatus()` | Redis `podcast-script:*` keys | `redis.scan` cursor loop | WIRED | Lines 226-235: scan with `podcast-script:*` match pattern, `Number(nextCursor)` coercion |
| `app/api/generate/route.ts` | `lib/podcast-audio.ts` | `import { generateAndCachePodcastAudio }` | WIRED | Line 6: import; line 81: `.then(() => generateAndCachePodcastAudio(briefing.date))` |
| `lib/podcast-audio.ts` | `lib/char-usage.ts` `hasCapacity()` | `import { hasCapacity, recordUsage }` | WIRED | Line 8: `import { hasCapacity, recordUsage } from '@/lib/char-usage'`; lines 36-41 and 75: both called |
| `lib/podcast-audio.ts` | `lib/podcast-storage.ts` `saveAudio()` | `import { saveAudio, getAudioUrl, getCachedScript }` | WIRED | Line 7: import confirmed; lines 27, 32, 76: all three functions called |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| INFRA-01 | 09-01-PLAN.md, 09-02-PLAN.md, 09-03-PLAN.md | Vercel Blob storage configured — `BLOB_READ_WRITE_TOKEN` set in production | NEEDS HUMAN | Code uses `useBlob()` correctly; `BLOB_READ_WRITE_TOKEN` confirmed set by user in session 6 per MEMORY.md; cannot verify programmatically from codebase |
| PODCAST-01 | 09-02-PLAN.md | `/podcast/archive` lists all past audio briefings with date, play button, design-token-consistent styling | NEEDS HUMAN | Archive page implementation verified — `listPodcastDatesWithStatus` wired, conditional rendering correct; actual listing of pre-Blob dates requires live Redis + Blob |

**REQUIREMENTS.md inconsistency:** `PODCAST-01` is marked `[ ]` (unchecked) and "Pending" in the traceability table despite the implementation being complete. This is a documentation gap — the requirements file was not updated after Plan 09-02 was executed. INFRA-01 is correctly marked `[x]` / "Complete".

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/api/generate/route.ts` | 17 | Hardcoded fallback ADMIN_USER_ID: `process.env.ADMIN_USER_ID ?? 'user_3AR29PSfsNfmy9wxcyjCvplC7hH'` | Info | Pre-existing issue (flagged in MEMORY.md); not introduced by Phase 9. The new backfill route correctly has no fallback. No impact on Phase 9 goal. |
| `app/api/generate/route.ts` | 80-84 | Cron chain uses single flat `.catch()` — both script failure and audio failure logged as `error`, not distinguished | Info | Deviation from plan spec (plan wanted nested `.then().catch()` with `warn` for ElevenLabs, `error` for script). Goal achieved (fire-and-forget, non-blocking); logging fidelity reduced. Not a blocker. |

---

### Human Verification Required

#### 1. Quiz archive backfill (production smoke test)

**Test:** POST `/api/admin/backfill-quiz` as admin user with valid Clerk session cookie on `www.folioapp.co.uk`
**Expected:** Response `{ "backfilled": N }` where N > 0; then visit `/quiz/archive` and confirm quiz dates from before Phase 6 (before 2026-03-09) appear in the list; POST a second time and confirm same count and archive unchanged (idempotency)
**Why human:** Requires live Redis containing pre-Phase-6 `quiz:{date}` keys; cannot simulate locally

#### 2. Podcast archive lists pre-Blob episodes (production smoke test)

**Test:** Visit `https://www.folioapp.co.uk/podcast/archive` as a subscriber
**Expected:** Episodes from before Blob was activated (sessions 1-5, roughly before 2026-03-09) appear in the list; rows with cached MP3 show a clickable play row (ChevronRight); rows with script-only show "No audio" label and are non-clickable; total count badge reflects all episodes
**Why human:** Requires live Redis `podcast-script:*` keys and Vercel Blob — local dev has no historical data

#### 3. Cron MP3 pre-generation (next morning after deploy)

**Test:** Day after deploy, at approximately 06:05 UTC call `GET https://www.folioapp.co.uk/api/podcast-audio?date={today's date}&check=true`
**Expected:** Returns `{ "exists": true }` before any user has visited `/podcast` — confirming cron pre-generated the MP3
**Why human:** Requires real cron execution, live ElevenLabs budget, live Blob write; cannot reproduce locally

#### 4. Vercel Blob backend active confirmation

**Test:** In Vercel dashboard, confirm `BLOB_READ_WRITE_TOKEN` is set under Environment Variables for the production environment; then call `GET https://www.folioapp.co.uk/api/podcast-audio?date=2026-03-09&check=true` (or another recent date with known audio)
**Expected:** `{ "exists": true }` confirms Blob backend is serving from cache, not the filesystem fallback
**Why human:** Env var presence cannot be verified from codebase; requires production Vercel access

---

### Gaps Summary

No automated gaps found. All 7 must-have truths verified against actual code.

Two info-level findings do not block the goal:
1. The hardcoded fallback `ADMIN_USER_ID` in `app/api/generate/route.ts` line 17 is pre-existing and does not affect Phase 9 functionality.
2. The cron fire-and-forget chain uses a flat `.catch()` rather than the plan's nested structure, losing the `warn` vs `error` log distinction for ElevenLabs vs. script failures. Goal achievement (non-blocking pre-generation) is unaffected.

One documentation gap: `PODCAST-01` in `REQUIREMENTS.md` remains `[ ]` / "Pending" despite implementation being complete. This should be updated to `[x]` / "Complete" in the requirements file.

All remaining verification items require production infrastructure (Redis, Blob, ElevenLabs, live cron) and must be confirmed by human smoke test after deploy.

---

_Verified: 2026-03-10T21:00:00Z_
_Verifier: Claude (gsd-verifier)_
