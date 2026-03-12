---
gsd_state_version: 1.0
milestone: v3
milestone_name: Design Refresh & Features
status: not_started
stopped_at: Requirements defined, roadmap pending
last_updated: "2026-03-12T23:30:00.000Z"
last_activity: 2026-03-12 — Milestone v3 started, requirements defined (20 requirements across 6 phases)
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-12)

**Core value:** Students who use Folio daily walk into TC interviews knowing what's happening in the market and how to talk about it — giving them a credible edge over unprepared candidates.
**Current focus:** v3 Design Refresh & Features — requirements defined, roadmap creating

## Current Position

Phase: Not started (defining roadmap)
Plan: —
Status: Defining roadmap
Last activity: 2026-03-12 — Milestone v3 started

## v3 Phase Map (planned)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 25 | Accent + Global Headings | DESIGN-01, DESIGN-02 | Pending |
| 26 | Home Newspaper Layout | HOME-01, HOME-02 | Pending |
| 27 | Unified Archive | ARCH-01, ARCH-02, ARCH-03, ARCH-04 | Pending |
| 28 | Quiz + Podcast Heroes & Format | POD-01, QUIZ-01, QUIZ-02, QUIZ-03 | Pending |
| 29 | Quiz Gamification | QUIZ-04, QUIZ-05, QUIZ-06 | Pending |
| 30 | Application Tracker | TRKR-01, TRKR-02, TRKR-03, TRKR-04, TRKR-05 | Pending |

**Wave structure:**
- Wave 1: Phase 25 (colour + heading tokens — everything depends on this)
- Wave 2: Phases 26, 27, 28, 30 (all parallel — independent pages/features)
- Wave 3: Phase 29 (quiz gamification — depends on Phase 28 quiz UI)

## Accumulated Context

### Decisions (carried from v2)

- v1.3: Paper background `#F9F7F2` warm cream — replaces cold bg-stone-50 sitewide
- v1.3: font-mono restored to `.section-label` — the v1.2 sweep was overcorrection; CSS variable bug is fixed
- v1.3: New logo committed (app/icon.svg, components/FolioLogo.tsx, components/Header.tsx)
- Phase 14 REVERTED (v1.2) — do not re-introduce lead story hierarchy or asymmetric layout — **BUT Phase 26 (v3) introduces newspaper layout the correct way per AI Studio mockup; this supersedes the Phase 14 note**
- [Phase 20]: radius-card updated to 1.5rem (24px) — premium rounded-3xl aesthetic for cards
- [Phase 20]: oxford-blue #002147 registered as Tailwind colour token — **to be replaced in v3 by charcoal #2D3436**
- [Phase 21]: Search takes precedence over tier filter in FirmsDirectory
- [Phase 22]: interviewQs (not interviewQuestions) is the correct Primer interface field name
- [Phase 24]: Interview prep uses lib/interview-data.ts (dedicated 40+ question bank)

### v3 Design Decisions

- Accent colour: charcoal `#2D3436` (AI Studio mockup palette) replaces oxford blue `#002147`
- Background: `#F9F7F2` paper (unchanged)
- Ink: `#1A1A1A` (near-black, unchanged)
- Heading pattern: `text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40` overline + large `font-serif` title
- Home page: newspaper layout per AI Studio mockup — lead story (lg:col-span-8) + sidebar (lg:col-span-4), NOT the Phase 14 approach
- Archive: unified 3-column page at /archive — Briefings | Quizzes | Podcasts
- Quiz format: 8 daily questions (1/topic) + deep practice sets per area
- Gamification: XP 100/level, Redis keys `quiz:xp:{userId}`, `quiz:level:{userId}`, `quiz:streak:{userId}` + `quiz:last-completed:{userId}`

### Pending Todos

None yet — roadmap creation in progress.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-12
Stopped at: Requirements defined — spawning roadmapper
Resume file: None
Next action: Approve roadmap then execute phases 25-30
