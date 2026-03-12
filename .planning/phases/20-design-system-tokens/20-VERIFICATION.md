---
phase: 20-design-system-tokens
verified: 2026-03-12T22:30:00Z
status: gaps_found
score: 5/6 must-haves verified
re_verification: false
gaps:
  - truth: "All CTA buttons, active navigation states, and accent highlights render in Oxford blue (#002147) — amber is no longer present as an action colour anywhere on the site"
    status: partial
    reason: "Oxford blue replaces amber in action roles (BookmarkButton, QuizInterface) where amber was previously used. However, the ROADMAP success criterion 3 literally states 'All CTA buttons, active navigation states, and accent highlights render in Oxford blue' — primary CTA buttons (Subscribe in MidGridNudge, upgrade page Subscribe button) use stone-900, not oxford-blue. Navigation active states also use stone colours. The plan scoped COL-01 to amber-to-oxford-blue replacement only; CTAs were never amber. Depending on interpretation, this is either a scope gap or a success-criterion overreach."
    artifacts:
      - path: "components/StoryGrid.tsx"
        issue: "MidGridNudge CTA 'Subscribe — £4/mo' button uses bg-stone-900 — not oxford-blue"
      - path: "app/upgrade/page.tsx"
        issue: "Upgrade page Subscribe CTA uses stone border/text styling — not oxford-blue"
    missing:
      - "Decision needed: should primary CTA buttons (Subscribe, upgrade) switch to oxford-blue, or does 'replaces amber as primary action colour' mean only amber-in-action-role instances?"
      - "If oxford-blue CTAs are intended: update MidGridNudge CTA, upgrade page button, and any other stone-900 action buttons to use bg-oxford-blue"
human_verification:
  - test: "Visual check — rounded corners sitewide"
    expected: "Cards and panels across all pages visibly show 24px rounded corners (softly rounded, not sharp). The editorial flat look is gone."
    why_human: "CSS variable propagation to all rounded-card elements is structurally verified but visual regression across all 16 pages requires human eyes."
  - test: "Dark mode colour regression check"
    expected: "Oxford blue bookmark active state and quiz accents render correctly in dark mode. No contrast issues with dark:text-oxford-blue-light on dark backgrounds."
    why_human: "Dark mode colour accuracy requires visual inspection. oxford-blue-light (#1a3a5c) on dark stone backgrounds is borderline for contrast."
  - test: "Oxford blue CTA intent confirmation"
    expected: "Owner decides whether the primary Subscribe/upgrade CTAs should switch from stone-900 to oxford-blue, given the success criterion literally says 'All CTA buttons render in Oxford blue'"
    why_human: "This is a product/design decision — the plan deliberately left stone CTAs unchanged (they were never amber), but the success criterion is broader."
---

# Phase 20: Design System Tokens Verification Report

**Phase Goal:** The design system radius and accent colour tokens are updated sitewide — all cards and panels adopt the new rounded-3xl aesthetic, chrome elements soften to rounded-full/rounded-2xl, and Oxford blue replaces amber as the primary action colour
**Verified:** 2026-03-12T22:30:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Cards and panels across all pages have visibly rounded corners (24px) | VERIFIED | `--radius-card: 1.5rem` in globals.css; `var(--radius-card)` wired in tailwind.config.ts; 16+ files use `rounded-card` |
| 2 | Chrome elements (buttons, badges) use 16px radius — softened from 4px | VERIFIED | `--radius-chrome: 1rem` in globals.css; 20+ chrome elements use `rounded-chrome` |
| 3 | The oxford-blue colour (#002147) is available as a Tailwind utility class | VERIFIED | `oxford-blue` with DEFAULT/light/dark variants in tailwind.config.ts theme.extend.colors |
| 4 | The bookmark active state (saved/bookmarked) renders in Oxford blue | VERIFIED | `border-oxford-blue/30`, `bg-oxford-blue/5`, `text-oxford-blue` in BookmarkButton.tsx lines 45, 61 |
| 5 | The quiz high-score trophy icon and streak label accent render in Oxford blue | VERIFIED | `text-oxford-blue` on Trophy (line 756), streak label (line 578), progress bar 60-79% band (line 498) in QuizInterface.tsx |
| 6 | All CTA buttons, active navigation states, and accent highlights render in Oxford blue (ROADMAP SC3) | PARTIAL | Amber-in-action-roles is replaced, but primary CTA buttons (MidGridNudge Subscribe, upgrade page) use stone-900, not oxford-blue. Navigation active states use stone colours. |

**Score:** 5/6 truths verified (Truth 6 is partial — interpretation-dependent)

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/globals.css` | Updated `--radius-card` (1.5rem) and `--radius-chrome` (1rem) CSS variables | VERIFIED | Line 38: `--radius-card: 1.5rem; /* 24px — rounded-3xl, premium soft cards */` Line 39: `--radius-chrome: 1rem; /* 16px — rounded-2xl, softened chrome */` |
| `tailwind.config.ts` | oxford-blue colour token with DEFAULT/light/dark variants | VERIFIED | Lines 111-115: `'oxford-blue': { DEFAULT: '#002147', light: '#1a3a5c', dark: '#001530' }` |

### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/BookmarkButton.tsx` | Oxford blue bookmark active state in both card and article variants | VERIFIED | Article variant (line 45): `border-oxford-blue/30 dark:border-oxford-blue/50 bg-oxford-blue/5 dark:bg-oxford-blue/10 text-oxford-blue dark:text-oxford-blue-light`. Card variant (line 61): `text-oxford-blue dark:text-oxford-blue-light`. No amber remaining. |
| `components/QuizInterface.tsx` | Oxford blue trophy, streak label, and 60-79% progress bar | VERIFIED | Line 498: `bg-oxford-blue/70 dark:bg-oxford-blue-light`. Line 578: `text-oxford-blue dark:text-oxford-blue-light`. Line 756: `text-oxford-blue dark:text-oxford-blue-light` on Trophy. No action-context amber remaining. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/globals.css` | `tailwind.config.ts` | CSS variable `--radius-card` referenced by `borderRadius.card` | WIRED | tailwind.config.ts line 64: `card: 'var(--radius-card)'` — note inline comment is stale (says "2px") but the variable reference is correct; value resolves to 1.5rem from globals.css |
| `app/globals.css` | `tailwind.config.ts` | CSS variable `--radius-chrome` referenced by `borderRadius.chrome` | WIRED | tailwind.config.ts line 65: `chrome: 'var(--radius-chrome)'` — resolves to 1rem |
| `tailwind.config.ts` | all components using `rounded-card` | Tailwind JIT class generation | WIRED | `rounded-card` found in: components/LandingHero.tsx (4 uses), app/upgrade/page.tsx (5 uses), app/events/[id]/page.tsx (3 uses), app/archive/page.tsx (2 uses), and 8+ more files |
| `components/BookmarkButton.tsx` | `tailwind.config.ts` | `text-oxford-blue`, `bg-oxford-blue/5`, `border-oxford-blue/30` classes | WIRED | Classes reference registered colour; confirmed in tailwind.config.ts |
| `components/QuizInterface.tsx` | `tailwind.config.ts` | `text-oxford-blue`, `bg-oxford-blue/70` classes | WIRED | Classes reference registered colour; confirmed in tailwind.config.ts |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| ROUND-01 | 20-01 | `rounded-card` token updated to 24px — all cards/panels adopt rounded-3xl sitewide | SATISFIED | `--radius-card: 1.5rem` in globals.css; wired via `var(--radius-card)` in tailwind.config.ts; propagates to all 16+ files using `rounded-card` without component edits |
| ROUND-02 | 20-01 | Chrome elements use `rounded-full` or `rounded-2xl` — softened from 4px | SATISFIED | `--radius-chrome: 1rem` (16px = rounded-2xl equivalent) in globals.css; propagates to all 20+ components/pages using `rounded-chrome` |
| COL-01 | 20-01, 20-02 | Oxford blue replaces amber as primary action/accent colour sitewide | PARTIAL | Oxford blue token registered and deployed in BookmarkButton (active state) and QuizInterface (trophy, streak, progress bar). All amber-in-action-roles replaced. However ROADMAP success criterion 3 also names CTA buttons and navigation active states — those remain stone-900, never were amber. |

**Orphaned requirements check:** REQUIREMENTS.md lists ROUND-01, ROUND-02, COL-01 under Phase 20. All three are claimed by the plans. No orphaned requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `tailwind.config.ts` | 64-65 | Inline comments say "2px — nearly flat editorial" and "4px — badges, UI chrome" after radius update | Info | Comments are stale — values resolve to 1.5rem and 1rem via CSS variables, but comments mislead developers reading the file |

No TODO/FIXME/placeholder comments found in any modified file. No empty implementations. No console.log stubs.

---

## Human Verification Required

### 1. Rounded corners visual regression

**Test:** Visit the home page (`/`), quiz page (`/quiz`), firms page (`/firms`), upgrade page (`/upgrade`), and archive page (`/archive`) in both light and dark mode.
**Expected:** Cards and panels have visibly rounded corners (24px). The site reads as softer and more premium than the previous flat editorial aesthetic.
**Why human:** CSS variable propagation is structurally verified but visual regression across all 16 pages requires human eyes.

### 2. Dark mode contrast — oxford-blue-light

**Test:** In dark mode, bookmark a story (article view) and check the saved-state bookmark button. Also visit `/quiz` and observe streak score and trophy icon.
**Expected:** `text-oxford-blue-light` (#1a3a5c) is legible on dark stone backgrounds (stone-900 / stone-950). No contrast issues.
**Why human:** oxford-blue-light (#1a3a5c) is a dark navy — on dark backgrounds this may have insufficient contrast. Automated contrast ratio calculation not performed.

### 3. COL-01 scope decision

**Test:** Review the upgrade page CTA button and MidGridNudge Subscribe button.
**Expected:** Owner decides whether stone-900 CTAs should switch to oxford-blue, or whether "oxford blue replaces amber as action colour" means only the amber-specific instances were in scope.
**Why human:** This is a product/design decision. The plan scoped COL-01 narrowly (amber-to-oxford-blue only); the success criterion says broadly "All CTA buttons...render in Oxford blue." Both interpretations are defensible.

---

## Gaps Summary

One gap is flagged, though it is interpretation-dependent:

**COL-01 scope gap:** The ROADMAP success criterion 3 says "All CTA buttons, active navigation states, and accent highlights render in Oxford blue (#002147) — amber is no longer present as an action colour anywhere on the site." The plans executed a narrower version: replacing amber-in-action-roles (BookmarkButton, QuizInterface) with oxford-blue. This is correct and complete. However, primary CTA buttons — the MidGridNudge "Subscribe — £4/mo" button and the upgrade page "Subscribe" button — use `bg-stone-900`, not `bg-oxford-blue`. These were never amber, so they were never in the amber-replacement scope. Navigation active states similarly use stone colours.

The gap requires a product decision: was the intent (a) replace amber-as-action-colour with oxford-blue (done), or (b) make oxford-blue the universal CTA colour replacing stone-900 buttons too (not done)?

If the intent is (b), the following changes are needed:
- `components/StoryGrid.tsx` MidGridNudge: `bg-stone-900` → `bg-oxford-blue`
- `app/upgrade/page.tsx` Subscribe button: stone border/text → oxford-blue
- Any other stone-900 primary action buttons sitewide

**Note on stale comment:** `tailwind.config.ts` inline comments on `borderRadius.card` and `borderRadius.chrome` still say "2px" and "4px" respectively. These are cosmetic only — the variable references are correct and values resolve from globals.css. This is an info-level item, not a blocker.

---

## Commit Verification

All four phase commits confirmed in git history:

| Commit | Plan | Description |
|--------|------|-------------|
| `2f8a01b` | 20-01 | feat(20-01): update radius tokens to premium rounded aesthetic |
| `e094dfc` | 20-01 | feat(20-01): register oxford-blue colour token in Tailwind config |
| `98055b8` | 20-02 | feat(20-02): replace amber bookmark active state with oxford-blue |
| `600dbbd` | 20-02 | feat(20-02): replace amber quiz accents with oxford-blue |

---

_Verified: 2026-03-12T22:30:00Z_
_Verifier: Claude (gsd-verifier)_
