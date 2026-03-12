---
milestone: v3
milestone_name: Design Refresh & Features
version: 1.0
status: active
created: 2026-03-12
---

# Requirements: v3 — Design Refresh & Features

## Milestone Goal

Align the product to the AI Studio mockup aesthetic — replace Oxford blue with the charcoal accent palette, apply a consistent heading pattern across all pages, redesign the briefing home page as a newspaper layout, unify the archive into a single 3-column destination, standardise podcast and quiz heroes, restructure the quiz format (daily 8-question + deep practice per area) with real gamification (XP/level/streak), and add a persistent Application Tracker for students to manage TC applications.

**Core Value:** Students who use Folio daily walk into TC interviews knowing what's happening in the market and how to talk about it — giving them a credible edge over unprepared candidates.

---

## Requirements

### DESIGN — Accent & Global Style

- [x] **DESIGN-01**: The primary accent colour is updated sitewide from Oxford blue (`#002147`) to charcoal (`#2D3436`) — all CTA buttons, active states, hero backgrounds, and accent elements use charcoal
- [x] **DESIGN-02**: All primary content pages display a consistent heading block: small uppercase overline label + large serif title + optional description — matching the AI Studio mockup heading pattern

### HOME — Briefing Home Page

- [ ] **HOME-01**: On desktop, the briefing home page uses a newspaper layout — a lead story occupies the main left column (large serif headline, full excerpt, topic badge) and secondary stories fill the right sidebar column
- [ ] **HOME-02**: The lead story is the first story from today's briefing — the remaining 7 stories appear in the sidebar and/or a grid below

### ARCH — Unified Archive

- [ ] **ARCH-01**: The `/archive` page shows three sections — Briefings, Quizzes, and Podcasts — each as a column listing past entries by date
- [ ] **ARCH-02**: Past quiz entries in the archive link to `/quiz/[date]` — the quiz column is fully populated from existing quiz cache
- [ ] **ARCH-03**: Past podcast entries in the archive link to playback — the podcast column is populated from existing Blob-cached episode list
- [ ] **ARCH-04**: The main navigation Archive item has a dropdown listing Briefings, Quizzes, and Podcasts as anchor links within the unified archive

### POD — Podcast Hero

- [ ] **POD-01**: The podcast page hero shows a standardised evergreen title ("Daily Briefing Podcast") and description — not today's specific briefing headline or story title

### QUIZ — Quiz Page, Format & Gamification

- [ ] **QUIZ-01**: The quiz page hero shows a standardised card ("Today's Commercial Briefing Quiz") — not a story-specific title; the hero is evergreen
- [ ] **QUIZ-02**: The daily quiz presents exactly 8 questions — one from each of the 8 practice areas (M&A, Capital Markets, Banking & Finance, Energy & Tech, Regulation, Disputes, International, AI & Law)
- [ ] **QUIZ-03**: The quiz page has a "Deep Practice" section listing per-topic practice sets (one per practice area) that users can enter independently of the daily quiz
- [ ] **QUIZ-04**: User earns XP on completing the daily quiz or a deep practice set — XP amount is configurable per set (e.g. +100 for daily, +150 for deep practice)
- [ ] **QUIZ-05**: User has a level derived from cumulative XP (100 XP = 1 level) displayed in the quiz UI with a progress bar showing current XP within the current level
- [ ] **QUIZ-06**: User daily streak (consecutive days with at least one completed quiz) is tracked in Redis and displayed in the quiz UI

### TRKR — Application Tracker

- [ ] **TRKR-01**: User can add a law firm application entry with: firm name, status (Applied / In Progress / Submitted / Interview / Offer), deadline date, and notes
- [ ] **TRKR-02**: User can view all their application entries in a table on a `/tracker` page, sortable by deadline
- [ ] **TRKR-03**: User can update the status or notes of an existing application entry
- [ ] **TRKR-04**: User can delete an application entry
- [ ] **TRKR-05**: Application data is persisted per user in Redis (key: `tracker:{userId}`) and gated behind `requireSubscription()`

---

## Future Requirements (Deferred)

- Social proof — student count, testimonials, or credibility cues (live data when available)
- Trainee experience on firm profiles — "Culture & Experience" section per firm
- Firm interview packs: PDF export
- Fit assessment — values-based firm fit quiz (mockup shows but complex to implement without a data model)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-voice audio | Multiplies ElevenLabs spend against 100k/month cap |
| Native mobile app | Web-first, no revenue to justify native yet |
| Real-time features | Complexity vs. value unclear |
| AI-generated tracker suggestions | Out of budget for this milestone |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DESIGN-01 | Phase 25 | Complete |
| DESIGN-02 | Phase 25 | Complete |
| HOME-01 | Phase 26 | Pending |
| HOME-02 | Phase 26 | Pending |
| ARCH-01 | Phase 27 | Pending |
| ARCH-02 | Phase 27 | Pending |
| ARCH-03 | Phase 27 | Pending |
| ARCH-04 | Phase 27 | Pending |
| POD-01 | Phase 28 | Pending |
| QUIZ-01 | Phase 28 | Pending |
| QUIZ-02 | Phase 28 | Pending |
| QUIZ-03 | Phase 28 | Pending |
| QUIZ-04 | Phase 29 | Pending |
| QUIZ-05 | Phase 29 | Pending |
| QUIZ-06 | Phase 29 | Pending |
| TRKR-01 | Phase 30 | Pending |
| TRKR-02 | Phase 30 | Pending |
| TRKR-03 | Phase 30 | Pending |
| TRKR-04 | Phase 30 | Pending |
| TRKR-05 | Phase 30 | Pending |

**Coverage:**
- v3 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after v3 milestone start*
