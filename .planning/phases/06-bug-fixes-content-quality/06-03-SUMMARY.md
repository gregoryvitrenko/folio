---
phase: 06-bug-fixes-content-quality
plan: "03"
subsystem: api
tags: [anthropic, prompt-engineering, content-quality, quiz, generate]

# Dependency graph
requires:
  - phase: 06-bug-fixes-content-quality
    provides: Bug fix context and content quality goals for Folio briefing platform
provides:
  - Enhanced talkingPoints prompt instructions with BAD/GOOD contrast examples and explicit anti-filler rules
  - Rewritten quiz question design rules using Commercial Inference, Law Firm Angle, Interview So-What framework
affects: [lib/generate.ts, lib/quiz.ts, daily briefing output quality, quiz content quality]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prompt engineering: BAD/GOOD contrast examples embedded directly in instruction strings to guide AI output"
    - "Prompt engineering: Explicit prohibition phrases ('significant development', 'marks a new era') to prevent filler language"
    - "Quiz design: Three-tier question framework (Commercial Inference / Law Firm Angle / Interview So-What)"

key-files:
  created: []
  modified:
    - lib/generate.ts
    - lib/quiz.ts

key-decisions:
  - "talkingPoints soundbite: BAD/GOOD contrast example embedded inline to steer Claude away from generic filler headlines"
  - "Quiz Q1 renamed from Recall to Commercial Inference: explicitly forbids deal-price questions, requires reasoning"
  - "Quiz distractor guidance names specific real firms (Linklaters, Freshfields, Kirkland, Latham) and regulatory bodies (CMA, FCA, Takeover Panel) to prevent obviously-wrong options"
  - "JSON structure and key names in both files left unchanged — only human-readable instruction text modified"

patterns-established:
  - "Prompt quality gate: anti-filler prohibitions in prompts ('Zero filler phrases') reduce generic AI output"
  - "Distractor specification: naming real competing firms and bodies in prompt instructions improves quiz difficulty calibration"

requirements-completed: [QUAL-01, QUAL-02]

# Metrics
duration: 5min
completed: 2026-03-10
---

# Phase 6 Plan 03: AI Prompt Quality Enhancement Summary

**Rewritten talkingPoints and quiz prompts to produce interview-ready commercial observations instead of generic headline restatements — BAD/GOOD contrast examples in generate.ts, Commercial Inference/Law Firm Angle/Interview So-What framework in quiz.ts**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-10T02:39:30Z
- **Completed:** 2026-03-10T02:44:28Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- talkingPoints soundbite instruction now explicitly forbids 'significant development' language, includes inline BAD/GOOD contrast example with Carlyle PE illustration
- talkingPoints partnerAnswer and fullCommercial instructions now require naming specific practice areas and named firms with reasoning, zero filler phrases
- Quiz Q1 renamed from 'Recall' to 'Commercial Inference': explicitly forbids deal-price recall, requires reading + reasoning
- Quiz Q2 renamed to 'Law Firm Angle': requires real competing firms as distractors
- Quiz Q3 renamed to 'Interview So-What': tests market trend connections and trainee day-to-day observations
- Distractor guidance now lists specific Magic Circle/US firms, real regulatory bodies, and real practice areas

## Task Commits

Each task was committed atomically:

1. **Task 1: Strengthen talkingPoints prompt instructions in lib/generate.ts** - `c967998` (feat)
2. **Task 2: Rewrite question design rules in lib/quiz.ts** - `b027c2c` (feat)

## Files Created/Modified
- `lib/generate.ts` - Updated talkingPoints instruction strings (soundbite, partnerAnswer, fullCommercial) with BAD/GOOD examples and anti-filler rules; JSON structure unchanged
- `lib/quiz.ts` - Replaced Question design rules block with Commercial Inference / Law Firm Angle / Interview So-What framework; JSON structure unchanged

## Decisions Made
- BAD/GOOD contrast example embedded inline in the soundbite instruction — this is the highest-leverage technique for steering Claude away from generic summaries without structural changes
- Distractor guidance names specific real firms rather than generic "real firm names" — specificity helps Haiku produce plausible wrong options
- JSON key names (soundbite, partnerAnswer, fullCommercial) and the full JSON structure unchanged — backward compatibility with all downstream consumers preserved

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Build step reports a pre-existing ENOENT error during "Collecting build traces" phase (`edge-runtime-webpack.js` not found) — confirmed pre-existing by testing on original code via git stash. Compilation itself ("Compiled successfully in 19.4s") and all 17 static pages generate cleanly. Not related to changes in this plan.

## User Setup Required

None - no external service configuration required. Quality improvements will be visible after the next cron generation run at 06:00 UTC (or via admin POST to /api/generate).

## Next Phase Readiness
- All 6 plans in phase 06-bug-fixes-content-quality are now complete
- Content quality improvements will take effect on the next briefing generation cycle
- Manual verification required: read talkingPoints on next generated briefing to confirm no 'significant development' language; read quiz Q1 to confirm it requires reasoning, not recall

---
*Phase: 06-bug-fixes-content-quality*
*Completed: 2026-03-10*
