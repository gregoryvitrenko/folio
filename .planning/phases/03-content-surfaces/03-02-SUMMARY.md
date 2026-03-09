---
phase: 03-content-surfaces
plan: "02"
subsystem: ui
tags: [tailwind, design-tokens, typography, ArticleStory]

# Dependency graph
requires:
  - phase: 03-01
    provides: text-article token (1.75rem/28px) added to tailwind.config.ts
provides:
  - ArticleStory.tsx fully migrated to named type scale tokens — zero arbitrary px sizes except locked 16px body copy
affects:
  - 03-03
  - future content surface work

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "text-article for article-level headlines (28px/700fw) — removes responsive pair sm: breakpoints"
    - "text-label with explicit tracking-[0.12em or 0.15em] for all 10px uppercase labels (NOT .section-label which is font-mono)"
    - "text-body with leading-[1.75] override for 15px body sections"
    - "text-subheading font-semibold for soundbite (18px; keep explicit font-semibold since token is 500fw)"
    - "text-[16px] locked for long-form summary and legacy body — documented as deliberate exception"

key-files:
  created: []
  modified:
    - components/ArticleStory.tsx

key-decisions:
  - "text-article token (28px) replaces text-[26px] sm:text-[32px] responsive pair — single token, fixed size, 700fw bundled"
  - "text-[16px] on summary body and legacy whyItMatters format preserved unchanged — deliberate exception for extended reading comfort"
  - "font-semibold kept explicitly on soundbite — text-subheading token is 500fw, soundbite needs 600fw"
  - "Blockquote in legacy talkingPoint (line 160) retains text-[16px] — same locked decision as summary body"

patterns-established:
  - "All 10px uppercase labels in ArticleStory: text-label + font-sans + explicit tracking (NOT .section-label)"
  - "Section header labels with topic colour: text-label + styles.label (topic colour class)"
  - "Sub-section labels with stone-400: text-label + text-stone-400 dark:text-stone-500"

requirements-completed: [CONT-02, CONT-05]

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 03 Plan 02: ArticleStory Typography Token Migration Summary

**ArticleStory.tsx fully migrated to named design tokens: text-article headline, text-label for all 10px labels, text-body for 15px sections, text-subheading for soundbite — zero arbitrary px sizes except locked 16px body copy**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T22:24:19Z
- **Completed:** 2026-03-09T22:27:14Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced `text-[26px] sm:text-[32px] font-bold` headline with `text-article` token — removes responsive breakpoint pair, bundles 700fw
- Replaced all `text-[10px]` arbitrary labels (topic, section headers, sub-section labels, sources) with `text-label` — 9 instances across the file
- Replaced all `text-[15px]` body sections with `text-body` — 5 instances (UK Firms, US Firms, On the Ground, Partner answer, Full commercial)
- Replaced `text-[17px]` soundbite with `text-subheading font-semibold` — 1px delta (17px to 18px) accepted per plan
- Preserved locked `text-[16px]` summary body copy and legacy whyItMatters/talkingPoint format unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate ArticleStory.tsx to design tokens** - `97020f5` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `components/ArticleStory.tsx` - All arbitrary text-[Npx] sizes replaced with named tokens; component structure, props, and logic unchanged

## Decisions Made
- text-[16px] locked as deliberate exception — applies to: (1) article summary body, (2) legacy whyItMatters string, (3) legacy blockquote. All three are extended reading contexts where 16px with 1.75 line-height is preferable to 15px text-body
- text-subheading for soundbite accepted at 18px (was 17px) — 1px delta is imperceptible; keeps token system clean
- font-semibold kept explicitly on soundbite — text-subheading bundles fontWeight:500, but soundbite needs 600fw for visual weight

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- ArticleStory typographic hierarchy: text-article > text-subheading > text-body > text-label fully established
- Pattern ready for any future ArticleStory sections that need labels or body copy
- CONT-02 (ArticleStory polished) and CONT-05 (typographic consistency) requirements fulfilled

---
*Phase: 03-content-surfaces*
*Completed: 2026-03-09*
