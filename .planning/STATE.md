---
gsd_state_version: 1.0
milestone: v2
milestone_name: Premium Experience
status: complete
stopped_at: All phases 20-24 executed and verified
last_updated: "2026-03-12T23:00:00.000Z"
last_activity: 2026-03-12 — v2 milestone complete. All 5 phases shipped and verified.
progress:
  total_phases: 5
  completed_phases: 5
  total_plans: 8
  completed_plans: 8
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-12)

**Core value:** Students who use Folio daily walk into TC interviews knowing what's happening in the market and how to talk about it — giving them a credible edge over unprepared candidates.
**Current focus:** v2 Premium Experience — COMPLETE

## Current Position

Phase: — (milestone complete)
Plan: —
Status: All v2 phases shipped and verified. Ready for next milestone.
Last activity: 2026-03-12 — v2 all phases complete (20-24).

Progress: [██████████] 100% (5/5 phases)

## v2 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 20 | Design System Tokens | ROUND-01, ROUND-02, COL-01 | Complete |
| 21 | Firms Directory Redesign | FDIR-01 | Complete |
| 22 | Secondary Page Redesigns | QUIZ-01, PRIM-01, TESTS-01, SAVED-01 | Complete |
| 23 | Events + Podcast Accent | EVENTS-01, POD-01 | Complete |
| 24 | Interview Prep Page | INTVW-01, INTVW-02, INTVW-03, INTVW-04 | Complete |

**Coverage:** 14/14 requirements delivered.

## Performance Metrics

**v2 velocity:**
- Total plans completed: 8 (phases 20-24)
- Parallel execution: phases 21-24 ran in parallel after Phase 20
- Estimated execution time: ~1 session

## Accumulated Context

### Decisions

- v1.3: Paper background `#F9F7F2` warm cream — replaces cold bg-stone-50 sitewide
- v1.3: font-mono restored to `.section-label` — the v1.2 sweep was overcorrection; CSS variable bug is fixed
- v1.3: New logo committed (app/icon.svg, components/FolioLogo.tsx, components/Header.tsx)
- v1.3: Dark stone-900 CTA panel replaces amber CTA on upgrade page (was a spec exception in v1.2, now corrected)
- Phase 14 REVERTED — do not re-introduce lead story hierarchy or asymmetric layout
- [Phase 16-global-design-logo-header]: Dateline uses font-mono at 9px (below section-label 11px default)
- [Phase 16-global-design-logo-header]: Striped-F wordmark: olio span at -0.03em letter-spacing, tighter than tracking-tight per brand spec
- [Phase 18-02]: Dark stone-900 CTA panel on upgrade page — amber button removed
- [Phase 18-02]: font-serif at 15px for upgrade outcome titles — text-caption (12px) too small for Playfair Display
- [Phase 18-02]: Firms tier header: full-width 1px bg-stone-900 rule above tier name
- v2: Rounded aesthetic target — `rounded-3xl` (24px) card radius, `rounded-full`/`rounded-2xl` for chrome
- v2: Oxford blue `#002147` replaces amber as primary action/accent colour — CTA buttons, active states, hero accents
- v2: Story grid (home page) stays as flat 2-column — do not touch StoryCard or StoryGrid radius
- [Phase 20]: radius-card updated to 1.5rem (24px) — premium rounded-3xl aesthetic for cards
- [Phase 20]: oxford-blue #002147 registered as Tailwind colour token with light/dark variants
- [Phase 20]: Bookmark active state uses oxford-blue/30 border + oxford-blue/5 bg for visual legibility on light backgrounds
- [Phase 21]: Search takes precedence over tier filter in FirmsDirectory — query active greyed-out tier buttons, all firms searched
- [Phase 21]: Jump link anchors removed from firms directory — sidebar tier filter tabs replace navigation
- [Phase 22-secondary-page-redesigns]: interviewQs (not interviewQuestions) is the correct Primer interface field name
- [Phase 22-secondary-page-redesigns]: Oxford blue hero card pattern established for quiz page entry (bg-[#002147] rounded-card)
- [Phase 22-secondary-page-redesigns]: TestCard uses test.description (not strapline) — richer content for feature card treatment
- [Phase 23-events-podcast-accent]: Events city filter: Oxford blue pill tabs replace underline active state (bg-[#002147] text-white rounded-full)
- [Phase 23-events-podcast-accent]: Event card date accent: text-[#002147] dark:text-blue-300 font-medium for Oxford blue accent
- [Phase 23-events-podcast-accent]: Podcast hero: Oxford blue radial glow at 35% opacity (rgba(0,33,71,0.35)) as absolute z-0 layer, content above via z-10
- [Phase 24-interview-prep-page]: Interview prep uses lib/interview-data.ts (dedicated 40+ question bank) — richer data structure with framework, keyPoints, tips, commonMistakes
- [Phase 24-interview-prep-page]: INTVW-02 gap closed — "By Practice Area" section added to /interview landing using PRIMERS.interviewQs (8 topic cards: M&A, Capital Markets, etc.)

### Pending Todos

None — v2 milestone complete.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-12
Stopped at: v2 milestone complete — all 5 phases executed, verified, gaps closed
Resume file: None
Next action: `/gsd:new-milestone` for v3 planning, or deploy and monitor
