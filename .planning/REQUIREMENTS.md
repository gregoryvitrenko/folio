# Requirements: Folio

**Defined:** 2026-03-12
**Core Value:** Students who use Folio daily walk into TC interviews knowing what's happening in the market and how to talk about it — giving them a credible edge over unprepared candidates.

## v1.2 Requirements

### Typography (TYPO)

- [ ] **TYPO-01**: Story card headlines render in Playfair Display serif (replacing Inter sans-serif)
- [ ] **TYPO-02**: Playfair Display headings use semibold weight (600) not bold (700)
- [ ] **TYPO-03**: Section/topic labels display at minimum 11px (up from 10px) for legibility
- [ ] **TYPO-04**: Body and article text renders at 16px (up from 15px)

### Editorial Layout (LAYOUT)

- [ ] **LAYOUT-01**: Home briefing opens with a lead story in large-format dominant position
- [ ] **LAYOUT-02**: Two secondary stories appear below the lead in a 2-column row
- [ ] **LAYOUT-03**: A visual divider separates the featured section from the remaining story grid
- [ ] **LAYOUT-04**: Remaining stories render in a standard grid below the divider

### Spacing & Rhythm (SPACE)

- [ ] **SPACE-01**: Vertical gap between cards/sections increases to gap-y-6 or gap-y-8
- [ ] **SPACE-02**: Internal card element spacing increases between headline, excerpt, and meta

### Conversion (CONV)

- [ ] **CONV-01**: Upgrade page layout reads as editorial/newspaper section (not SaaS pricing)
- [ ] **CONV-02**: Upgrade page includes outcome-framed social proof section (student count + testimonial placeholders)
- [ ] **CONV-03**: Upgrade page primary CTA uses differentiated accent colour to stand out

## v1.3 Requirements

### Global Design (GDES)

- [ ] **GDES-01**: All pages use warm paper background (`#F9F7F2`) replacing cold bg-stone-50/white
- [ ] **GDES-02**: Section label utility (`.section-label`) uses JetBrains Mono — restored after v1.2 font sweep
- [ ] **GDES-03**: Striped-F + "olio" wordmark deployed from existing codebase changes

### Header (HDR)

- [ ] **HDR-01**: Header shows editorial dateline (Vol. · No. · Day, Date · London Edition) in small uppercase tracking
- [ ] **HDR-02**: Folio wordmark uses tight letter-spacing (`-0.03em`) matching brand studio `.folio-wordmark` treatment

### Firm Profile (FIRM)

- [ ] **FIRM-01**: Firm profile displays NQ salary, TC salary, intake/year, and seats in a prominent horizontal stat strip below the firm name
- [ ] **FIRM-02**: Firm profile content sections use visually differentiated treatments — not all identical left-border cards
- [ ] **FIRM-03**: "Why This Firm?" section uses editorial numbered callout style with large background numbers
- [ ] **FIRM-04**: Interview questions use clean typographic numbering — no Q1/Q2 chip/box styling

### Quiz (QUIZ)

- [ ] **QUIZ-01**: Quiz mode selection (Daily vs Deep Practice) uses a clearly differentiated editorial two-panel layout
- [ ] **QUIZ-02**: Quiz date list shows visual distinction between today, available past dates, and completed dates

### Firms Directory (FDIR)

- [ ] **FDIR-01**: Tier section headers (Magic Circle, Silver Circle, etc.) use a full-width editorial rule treatment

### Conversion (CONV)

- [ ] **CONV-04**: Upgrade page feature grid item titles use `font-serif`
- [ ] **CONV-05**: Upgrade page CTA panel redesigned as dark stone-900 block with border button

## Future Requirements

### Brand

- **BRAND-01**: Typographic serif wordmark (Playfair Display) in header replaces plain text — implement after logo/mark is designed
- **BRAND-02**: F monogram favicon — implement after logo/mark is designed

## Out of Scope

| Feature | Reason |
|---------|--------|
| Logo/mark design | Design-first: owner designs the mark outside this milestone; implementation deferred to v1.3 |
| Dark mode overrides for new typography | Follow existing dark mode token patterns; no new dark-mode-specific work |
| Editorial layout on archive/topic pages | Home page only for v1.2; extend in future milestone once lead story pattern is validated |
| Real-time content metrics | No live user data yet to display |
| Lead story hierarchy on homepage | Reverted in v1.2 — user prefers flat 2-column grid; do not re-introduce |
| Asymmetric 8+4 column layout | Brand studio mockup reference only — not implementing lead story split |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TYPO-01 | Phase 13 | Pending |
| TYPO-02 | Phase 13 | Pending |
| TYPO-03 | Phase 13 | Pending |
| TYPO-04 | Phase 13 | Pending |
| SPACE-01 | Phase 13 | Pending |
| SPACE-02 | Phase 13 | Pending |
| LAYOUT-01 | Phase 14 | Pending |
| LAYOUT-02 | Phase 14 | Pending |
| LAYOUT-03 | Phase 14 | Pending |
| LAYOUT-04 | Phase 14 | Pending |
| CONV-01 | Phase 15 | Pending |
| CONV-02 | Phase 15 | Pending |
| CONV-03 | Phase 15 | Pending |

**Coverage (v1.2):**
- v1.2 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

**Coverage (v1.3):**
- v1.3 requirements: 13 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 13 ⚠️

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after v1.3 milestone start*
