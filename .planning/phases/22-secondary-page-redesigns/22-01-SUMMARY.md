---
phase: 22-secondary-page-redesigns
plan: "01"
subsystem: ui
tags: [react, tailwind, lucide-react, quiz, primers, oxford-blue]

requires:
  - phase: 20-design-system-tokens
    provides: rounded-card token (24px), oxford-blue colour token, section-label utility

provides:
  - Quiz page Oxford blue hero card anchoring today's entry experience
  - PrimerCard with topic-specific lucide icons, rounded-card corners, line-clamp strapline

affects:
  - 22-secondary-page-redesigns (plan 02 follows same design language)
  - 23-events-podcast-accent (Oxford blue accent pattern established)

tech-stack:
  added: []
  patterns:
    - Oxford blue bg-[#002147] hero card pattern for page entry focal points
    - Topic icon map (TOPIC_ICONS + TOPIC_ICON_COLORS) keyed on TopicCategory
    - section-label utility on dark backgrounds via text-stone-300

key-files:
  created: []
  modified:
    - app/quiz/page.tsx
    - components/PrimerCard.tsx

key-decisions:
  - "interviewQs (not interviewQuestions) — plan had wrong field name; fixed to match actual Primer interface"
  - "Hero card placed in both main return and no-briefing fallback (no question count in fallback)"
  - "PrimerCard footer shows interview Qs count only when interviewQs array is non-empty"

patterns-established:
  - "Oxford blue hero card: rounded-card bg-[#002147] p-6 sm:p-8 flex sm:flex-row sm:items-end sm:justify-between"
  - "Topic icon lookup: TOPIC_ICONS[category] + TOPIC_ICON_COLORS[category] for consistent colour"

requirements-completed: [QUIZ-01, PRIM-01]

duration: 2min
completed: 2026-03-12
---

# Phase 22 Plan 01: Quiz Hero + PrimerCard Icons Summary

**Oxford blue hero card anchoring quiz page entry, PrimerCard updated with topic lucide icons and rounded-card corners**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-12T22:24:12Z
- **Completed:** 2026-03-12T22:26:01Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Quiz page now opens with a prominent bg-[#002147] rounded-card hero showing today's date in large serif, question count, and a white CTA button — rendering above the date archive list
- PrimerCard replaced dot-indicator + inline category label with a 20px lucide icon in topic colour, section-label utility class, rounded-card corners, and line-clamp-2 strapline
- TypeScript compiles with zero errors across both changes

## Task Commits

1. **Task 1: Quiz page hero card** - `544c14a` (feat)
2. **Task 2: PrimerCard icons + rounded-card** - `12ee686` (feat)

## Files Created/Modified
- `app/quiz/page.tsx` - Added bg-[#002147] rounded-card hero block above dateList in both main and no-briefing branches
- `components/PrimerCard.tsx` - Rewrote with TOPIC_ICONS map, TOPIC_ICON_COLORS map, rounded-card, section-label, line-clamp-2 strapline, interviewQs footer stat

## Decisions Made
- Used `primer.interviewQs` (not `interviewQuestions`) — plan referenced wrong field name; corrected to match the actual `Primer` interface in `lib/types.ts`
- Hero card included in no-briefing fallback without the question count line (briefing unavailable, so count is meaningless)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Wrong field name in plan spec for interview questions**
- **Found during:** Task 2 (PrimerCard rewrite)
- **Issue:** Plan spec used `primer.interviewQuestions` but the actual `Primer` interface in `lib/types.ts` uses `interviewQs?: PrimerInterviewQ[]`
- **Fix:** Used `primer.interviewQs` throughout the component
- **Files modified:** components/PrimerCard.tsx
- **Verification:** TypeScript compiled clean with zero errors
- **Committed in:** 12ee686 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - type/field name bug)
**Impact on plan:** Essential correction — wrong field name would have caused runtime `undefined` renders for interview question count. No scope creep.

## Issues Encountered
None beyond the field name correction above.

## Next Phase Readiness
- Plan 22-02 can proceed immediately: TestCard and SavedView redesigns follow the same Oxford blue + rounded-card pattern established here
- No blockers

---
*Phase: 22-secondary-page-redesigns*
*Completed: 2026-03-12*
