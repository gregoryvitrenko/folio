---
phase: 17-firm-profile-redesign
verified: 2026-03-12T21:30:00Z
status: passed
score: 4/4 must-haves verified
re_verification: false
gaps: []
---

# Phase 17: Firm Profile Redesign — Verification Report

**Phase Goal:** Redesign firm profile pages with a prominent stat strip, visually differentiated section treatments, editorial "Why This Firm?" callouts, and clean typographic interview question numbering.
**Verified:** 2026-03-12T21:30:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | NQ salary, TC salary, annual intake, and seat count appear in a horizontal stat strip immediately below the firm hero | VERIFIED | `StatStrip` component defined at line 114; rendered at line 347 between hero div and `space-y-4` section stack |
| 2 | At least two visually distinct section treatments exist beyond the standard SectionCard | VERIFIED | Dark block (`bg-stone-900 dark:bg-stone-950`) at lines 378-389; `WhyThisFirmCallout` with `bg-stone-50` at lines 151-196; standard `SectionCard` throughout |
| 3 | "Why This Firm?" uses editorial numbered callouts with large faint background numbers | VERIFIED | `opacity-[0.05]` span at line 179; `font-mono text-[72px]` zero-padded numbers (`01`, `02`...) absolutely positioned behind each point |
| 4 | Interview questions use typographic `{i + 1}.` numbering in `font-serif`, no Q1/Q2 chip | VERIFIED | Line 749-750: `font-serif text-[15px] font-semibold text-stone-400` span with `{i + 1}.`; grep for `Q{i` returns zero matches |

**Score:** 4/4 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/firms/[slug]/page.tsx` | StatStrip component, WhyThisFirmCallout component, typographic question numbering, dark Interview Focus block | VERIFIED | All four components/patterns present and substantive — not stubs |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `StatStrip` | `firm.trainingContract` | `nqSalaryNote`, `tcSalaryNote`, `intakeSizeNote`, `seats` | VERIFIED | Lines 123-143: all four fields accessed and rendered |
| `StatStrip` | page render | `<StatStrip trainingContract={firm.trainingContract} tierText={tierText} />` | VERIFIED | Line 347, between hero and section stack |
| `WhyThisFirmCallout` | `interviewPack.whyThisFirm` | `.map()` over points array | VERIFIED | Lines 175-190: `points.map((bullet, i) => ...)` renders each point |
| Large background number | Callout item | `absolute right-0 ... opacity-[0.05]` | VERIFIED | Line 178-181: aria-hidden span with absolute positioning and opacity-[0.05] |
| Interview question list | Typographic number | `{i + 1}.` in `font-serif` span | VERIFIED | Lines 749-750: correct pattern, no Q-chip span anywhere in file |
| Dark Interview Focus block | `firm.interviewFocus` | `text-stone-100` paragraph | VERIFIED | Lines 378-389: `bg-stone-900` block renders `firm.interviewFocus` in `text-stone-100` |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FIRM-01 | 17-01 | Stat strip with NQ salary, TC salary, intake, seats below firm name | SATISFIED | `StatStrip` at line 114; rendered at line 347 |
| FIRM-02 | 17-02 | Visually differentiated section treatments — not all identical | SATISFIED | Three distinct treatments: SectionCard (white/stone-900), dark block (stone-900/950), WhyThisFirmCallout (stone-50 + background numbers) |
| FIRM-03 | 17-02 | "Why This Firm?" uses editorial numbered callout style with large background numbers | SATISFIED | `opacity-[0.05] font-mono text-[72px]` background numbers confirmed at line 179 |
| FIRM-04 | 17-01 | Interview questions use typographic numbering — no Q1/Q2 chip | SATISFIED | `{i + 1}.` in `font-serif text-stone-400` at line 749-750; zero Q-chip instances in file |

---

## Anti-Patterns Found

None detected. Specific checks run:

- No `TODO`, `FIXME`, `PLACEHOLDER` comments in the modified file
- No `return null` or empty implementations in the new components
- `StatStrip` renders live data from `trainingContract` props — not hardcoded
- `WhyThisFirmCallout` maps over the real `points` array — not a stub
- Interview question `<ol>` has a fallback state (loading message) — not a silent failure

---

## TypeScript

`npx tsc --noEmit` exits with zero errors. Confirmed in this session.

---

## Human Verification Required

The following items cannot be verified programmatically and should be spot-checked in the browser before shipping:

### 1. Stat strip visual prominence at viewport top

**Test:** Open any firm profile page (e.g. `/firms/linklaters`). Without scrolling, verify the four-stat strip (NQ Salary, TC Salary, Annual Intake, Seats) is immediately visible below the firm name — not hidden below the fold on desktop.
**Expected:** All four stats visible in a 2-col (mobile) / 4-col (desktop) grid with clear label/value hierarchy.
**Why human:** Cannot verify scroll position or viewport rendering programmatically.

### 2. WhyThisFirmCallout background numbers — visual calibration

**Test:** Open a firm profile with a cached interview pack. Scroll to "Why This Firm?". Verify the large `01`, `02`, `03` numbers are visible as a faint watermark — present but not competing with the foreground text.
**Expected:** Numbers are clearly decorative at `opacity-[0.05]`, foreground bullet text readable without distraction.
**Why human:** Opacity rendering and visual balance requires eyeballing — a value that looks right in CSS can appear too faint or too prominent depending on screen/OS rendering.

### 3. Dark Interview Focus block — light mode contrast

**Test:** In light mode, scroll to the "Interview Focus" section. Verify the `bg-stone-900` block on a light page background looks intentional (dark editorial block) rather than a rendering error.
**Expected:** Dark block with `text-stone-100` text is clearly legible; the contrast with surrounding white SectionCards reads as deliberate visual hierarchy.
**Why human:** Contrast and visual intent require human judgement.

### 4. Dark mode — all three section treatments

**Test:** Toggle to dark mode. Verify: (a) SectionCard uses `dark:bg-stone-900`; (b) Interview Focus block uses `dark:bg-stone-950` (slightly darker than SectionCard); (c) WhyThisFirmCallout uses `dark:bg-stone-900/50` (semi-transparent).
**Expected:** All three treatments remain visually distinct in dark mode.
**Why human:** Dark mode colour relationships need visual confirmation — semi-transparent `stone-900/50` may collapse against `stone-900` on some monitors.

---

## Summary

Phase 17 achieved its goal. All four requirements (FIRM-01 through FIRM-04) are implemented and wired in `app/firms/[slug]/page.tsx`:

- **FIRM-01 (StatStrip):** A genuine, data-wired horizontal strip component surfaces NQ salary, TC salary, intake, and seats immediately below the hero — not a placeholder.
- **FIRM-02 (Visual variety):** Three distinct section types are present: standard SectionCard, dark stone-900 Interview Focus block, and the stone-50 WhyThisFirmCallout. The monotony of identical left-border cards is broken.
- **FIRM-03 (Callout background numbers):** The `opacity-[0.05] font-mono text-[72px]` absolutely-positioned span is confirmed in the JSX — the watermark number pattern is real, not described in a comment.
- **FIRM-04 (Typographic numbering):** The Q-chip pattern (`Q{i+1}`) is absent from the file. The replacement `{i + 1}.` in `font-serif text-stone-400` is confirmed at line 749-750.

TypeScript compiles clean. No anti-patterns found. Four browser-based checks flagged for human confirmation (visual calibration items — not blockers).

---

_Verified: 2026-03-12T21:30:00Z_
_Verifier: Claude (gsd-verifier)_
