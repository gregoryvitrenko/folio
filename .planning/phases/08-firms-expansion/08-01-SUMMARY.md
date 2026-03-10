---
phase: 08-firms-expansion
plan: 01
subsystem: ui
tags: [firms-data, typescript, static-data, law-firms, training-contracts]

# Dependency graph
requires: []
provides:
  - 8 new FirmProfile objects in FIRMS array (lib/firms-data.ts)
  - 4 Silver Circle firms: eversheds-sutherland, cms, addleshaw-goddard, pinsent-masons
  - 4 US Firms entries: baker-mckenzie, jones-day, mayer-brown, dla-piper
  - FIRMS array grows from 38 to 46 entries
affects: [09-podcast-archive, 10-primer-interview-questions, 11-events-section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Silver Circle firms inserted in Silver Circle block with comment separator"
    - "US Firms inserted before Boutique block with comment separator"
    - "Non-rotational firm (Jones Day) documented via intakeSizeNote field"
    - "TC salaries for CMS/Addleshaw/Pinsent Masons use conservative placeholder ~£40k-£46k pending The Trackr verification"

key-files:
  created: []
  modified:
    - lib/firms-data.ts

key-decisions:
  - "Used seats: 4 for Jones Day (non-rotational) — interface expects a number; non-rotational structure documented in intakeSizeNote"
  - "TC salaries for CMS, Addleshaw Goddard, Pinsent Masons set to conservative placeholder (~£40,000-£46,000) because exact figures were not confirmed in research; NQ salaries are HIGH confidence from Legal Cheek/RollOnFriday 2025 sources"
  - "DLA Piper classified as US Firms tier (amber accent) not Silver Circle — aligns with Folio taxonomy and NQ salary level of £130k"
  - "Baker McKenzie deadline dates are HIGH confidence (confirmed from graduate portal): Spring VS closes Dec, Summer VS closes Jan, Direct TC closes Apr 2026"

patterns-established:
  - "Data-only firm expansion: insert into appropriate tier block, TypeScript compiler enforces FirmProfile interface compliance"

requirements-completed: [FIRMS-01, FIRMS-02]

# Metrics
duration: 4min
completed: 2026-03-10
---

# Phase 8 Plan 01: Firms Expansion Summary

**8 new firm profiles added to lib/firms-data.ts — 4 Silver Circle (Eversheds, CMS, Addleshaw Goddard, Pinsent Masons) and 4 US Firms (Baker McKenzie, Jones Day, Mayer Brown, DLA Piper) — growing the directory from 38 to 46 entries**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-10T17:26:15Z
- **Completed:** 2026-03-10T17:30:34Z
- **Tasks:** 2 auto-tasks complete; 1 checkpoint pending human verification
- **Files modified:** 1 (lib/firms-data.ts)

## Accomplishments
- Added 4 Silver Circle firms with verified NQ salaries, TC salary estimates, intake sizes, and application deadlines
- Added 4 US Firms tier entries with HIGH confidence salary data from Legal Cheek/RollOnFriday 2025 sources
- FIRMS array now has 46 entries — `/firms` page badge and `/firms/[slug]` routing auto-updated with no additional code changes
- TypeScript compiler passes with zero errors; Next.js full build passes cleanly
- Baker McKenzie includes confirmed exact deadline dates (opens/closes ISO dates from graduate portal)
- Jones Day's non-rotational training model documented via intakeSizeNote

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Silver Circle firms** - `a76ddec` (feat)
2. **Task 2: Add US Firms entries** - `c7b0a32` (feat)

## Files Created/Modified
- `lib/firms-data.ts` - Added 8 FirmProfile objects (280 lines): 4 Silver Circle after Macfarlanes, 4 US Firms before Boutique block

## Decisions Made
- Used `seats: 4` for Jones Day (non-rotational system) — the `FirmProfile` interface requires a number; distinction documented in `intakeSizeNote`
- TC salaries for CMS, Addleshaw Goddard, and Pinsent Masons set to conservative placeholder `'~£40,000 – £46,000'` — exact figures were not confirmed in research; NQ salaries for all three are HIGH confidence from 2025 sources
- DLA Piper classified as `'US Firms'` tier with amber accentColor — consistent with Folio taxonomy and the firm's US co-HQ structure and £130k NQ salary level
- Baker McKenzie deadline exact dates (`openDate`/`closeDate`) confirmed HIGH confidence from Baker McKenzie graduate recruitment portal

## Deviations from Plan

None — plan executed exactly as written. The TC salary placeholder approach for CMS/Addleshaw/Pinsent Masons was the recommended fallback specified in the research document.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Checkpoint Status

**Task 3 is a `checkpoint:human-verify`** — the two auto-tasks are complete and committed. Human verification required before plan is considered complete:

1. Run `npx tsc --noEmit` — must exit 0 with zero errors
2. Run `npm run build` — full Next.js build must complete without errors
3. Start dev server (`npm run dev` in Terminal.app — NOT from Claude Code) then visit:
   - http://localhost:3001/firms — check the count badge shows 46+ firms
   - http://localhost:3001/firms/baker-mckenzie — firm name, NQ salary, deadlines all display correctly
   - http://localhost:3001/firms/jones-day — non-rotational note visible in intake
   - http://localhost:3001/firms/mayer-brown — renders without layout break
   - http://localhost:3001/firms/dla-piper — renders without layout break
   - http://localhost:3001/firms/eversheds-sutherland — renders without layout break
   - http://localhost:3001/firms/cms — renders without layout break
   - http://localhost:3001/firms/addleshaw-goddard — renders without layout break
   - http://localhost:3001/firms/pinsent-masons — renders without layout break

## Next Phase Readiness
- All 8 new firm profiles are live in the FIRMS array; /firms/[slug] routing works automatically
- No blockers for Phase 9 (Podcast Archive) or other phases
- Future: TC salary figures for CMS, Addleshaw Goddard, Pinsent Masons can be updated against The Trackr when verified

---
*Phase: 08-firms-expansion*
*Completed: 2026-03-10*
