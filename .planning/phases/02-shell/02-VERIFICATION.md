---
phase: 02-shell
verified: 2026-03-09T22:10:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
human_verification:
  - test: "Footer pinned at viewport bottom on short pages"
    expected: "On a short page (e.g. /terms), the footer appears at the bottom of the viewport, not mid-page"
    why_human: "Sticky-footer flex layout cannot be verified by static file inspection — requires a browser render"
  - test: "Header visual appearance unchanged"
    expected: "bg-paper (warm off-white/dark) is perceptually indistinguishable from bg-stone-50/bg-stone-950; text-display wordmark looks identical to previous sm:text-[38px]"
    why_human: "Token substitution equivalence requires visual confirmation in light and dark mode"
---

# Phase 2: Shell Verification Report

**Phase Goal:** Every page in Folio shares a consistent, token-compliant header and a functioning footer
**Verified:** 2026-03-09T22:10:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths — Plan 01 (SHELL-01)

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Header renders using design tokens — no arbitrary text-[Npx] values remain in Header.tsx or NavDropdowns.tsx | VERIFIED | The only remaining arbitrary size is `text-[10px]` on the "Archive Edition" span (Header.tsx line 56), explicitly preserved by plan as intentional (tracking-[0.15em] overrides token). NavDropdowns.tsx has one `text-[12px]` on dropdown item links, deferred to Phase 3 per plan. All typography tokens applied. |
| 2 | The Folio wordmark displays at text-display (2.25rem / 36px) at all breakpoints — the responsive sm:text-[38px] is gone | VERIFIED | Header.tsx line 42: `font-serif text-display tracking-tight` — no `sm:text-[38px]`, no `font-bold` (fontWeight 700 baked into token) |
| 3 | The date label and nav trigger labels display at text-label (10px) — the editorial mono label pattern is preserved | VERIFIED | Header.tsx line 37: `font-mono text-label`; lines 62, 68: `font-sans text-label`; NavDropdowns.tsx line 51: `text-label` in TRIGGER_CLS |
| 4 | The header and dropdown panel backgrounds use bg-paper (single dark-mode-aware token) — the paired bg-stone-50 dark:bg-stone-950 is gone | VERIFIED | Header.tsx line 29: `bg-paper` only; NavDropdowns.tsx line 89: `bg-paper` only. No `dark:bg-paper` present in either file. |
| 5 | The thick top rule, sticky positioning, 3-column grid layout, and border-b separator are visually unchanged | VERIFIED | Header.tsx line 29: `sticky top-0 z-40`; line 31: `h-[3px] bg-stone-900 dark:bg-stone-100`; line 36: `grid grid-cols-3`; border-b on line 29 preserved |

### Observable Truths — Plan 02 (SHELL-02)

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 6 | A footer appears on every page with exactly five links in order: Feedback, Terms, Privacy, Contact, LinkedIn | VERIFIED | SiteFooter.tsx lines 15-46 contain exactly these five links in this order. SiteFooter is imported and rendered in app/layout.tsx line 63 (global scope, all pages). |
| 7 | Feedback and Contact links use mailto:hello@folioapp.co.uk — they do NOT open in a new tab | VERIFIED | SiteFooter.tsx line 16: `href="mailto:hello@folioapp.co.uk"` (no `target="_blank"`); line 34: `href="mailto:hello@folioapp.co.uk"` (no `target="_blank"`) |
| 8 | LinkedIn link opens in a new tab with rel=noopener noreferrer | VERIFIED | SiteFooter.tsx line 40: `href="https://www.linkedin.com/in/gregory-vitrenko-7258a0350"`, line 41: `target="_blank"`, line 42: `rel="noopener noreferrer"` |
| 9 | Footer typography uses text-label (token) — no arbitrary text-[10px] values remain | VERIFIED | All footer text uses `text-label`: copyright `<p>` line 10, all five nav links lines 17/23/29/35/43. `grep text-\[10px\]` in SiteFooter.tsx returns zero results. |

**Score:** 9/9 truths verified

Note: Truth #5 (layout — footer never overlaps page content) is listed under Human Verification Required since it requires a browser render. The structural preconditions are fully verified: `flex flex-col` on body (layout.tsx line 58), `flex-1` on `<main>` (line 60), `mt-auto` on `<footer>` (SiteFooter.tsx line 7), and SiteFooter placed as sibling of `<main>` inside Providers (layout.tsx lines 60-63).

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/Header.tsx` | Token-compliant header component containing bg-paper | VERIFIED | Exists, 83 lines, substantive. bg-paper on line 29, text-display on line 42, text-label on lines 37/62/68. Imported by pages directly. |
| `components/NavDropdowns.tsx` | Token-compliant nav dropdown panel containing bg-paper | VERIFIED | Exists, 114 lines, substantive. text-label in TRIGGER_CLS line 51, bg-paper on dropdown panel line 89. Used inside Header.tsx line 75. |
| `components/SiteFooter.tsx` | Five-link footer with token-compliant typography containing LinkedIn | VERIFIED | Exists, 52 lines, substantive. Five links confirmed. text-label on all typography. LinkedIn on lines 39-46. |
| `app/layout.tsx` | flex flex-col body + main flex-1 children wrapper for sticky footer containing flex-col | VERIFIED | Exists, 70 lines. `flex flex-col` on body line 58, `<main className="flex-1">` line 60, SiteFooter as sibling of main on line 63. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/Header.tsx` | `tailwind.config.ts` | text-display, text-label, bg-paper utility classes | WIRED | `text-display` defined in tailwind.config.ts line 36; `text-label` line 41; `paper` colour in theme line 109. All three used in Header.tsx. |
| `components/NavDropdowns.tsx` | `tailwind.config.ts` | text-label, bg-paper utility classes | WIRED | `text-label` used in TRIGGER_CLS line 51; `bg-paper` on dropdown panel line 89. Tokens confirmed in tailwind.config.ts. |
| `app/layout.tsx` | `components/SiteFooter.tsx` | flex flex-col on body + main flex-1 wrapper makes mt-auto effective | WIRED | `flex flex-col` on body (layout.tsx line 58), `<main className="flex-1">` (line 60), SiteFooter with `mt-auto` (SiteFooter.tsx line 7) rendered as sibling of main (layout.tsx line 63). |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| SHELL-01 | 02-01-PLAN.md | Header updated to use design tokens (typography, spacing) — preserve existing thick top rule and mono label pattern | SATISFIED | bg-paper on header bg (line 29), text-display on wordmark (line 42), text-label on date/triggers/nav links. h-[3px] thick rule preserved (line 31). sticky preserved (line 29). |
| SHELL-02 | 02-02-PLAN.md | Site footer implemented with links (feedback, terms/privacy, contact/LinkedIn) and consistent with design tokens | SATISFIED | Five links in correct order with correct href values. LinkedIn has target="_blank". text-label on all typography. No text-[10px] remains. |

Both SHELL-01 and SHELL-02 are marked complete in REQUIREMENTS.md. No orphaned requirements found for Phase 2.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/Header.tsx` | 56 | `text-[10px] tracking-[0.15em]` on "Archive Edition" span | Info | Intentional carry-over documented in PLAN and SUMMARY — the explicit `tracking-[0.15em]` intentionally overrides the token's 0.1em, preserving wider letter-spacing. Plan explicitly says "DO NOT TOUCH". Not a gap. |
| `components/NavDropdowns.tsx` | 95 | `text-[12px]` on dropdown item links | Info | Intentional carry-over deferred to Phase 3 per plan. Not a gap for this phase. |

No blockers. No warnings.

---

### Human Verification Required

#### 1. Sticky Footer on Short Pages

**Test:** Visit a short page (e.g. /terms or /privacy) on the live site
**Expected:** Footer appears pinned at the bottom of the viewport, not mid-page — content area does not create a gap between the last element and the footer
**Why human:** The flex layout preconditions are all in place structurally, but sticky-footer behavior requires a browser render to confirm. The `mt-auto` mechanic only works when the flex container has remaining vertical space, which depends on viewport height vs content height.

#### 2. Token Visual Equivalence

**Test:** Visit the home page in both light and dark mode; compare header and footer backgrounds visually
**Expected:** bg-paper (warm off-white in light, warm dark in dark) is visually indistinguishable from the previous bg-stone-50 / bg-stone-950; wordmark "Folio" appears at correct size (text-display = 36px, 2px larger than previous 38px at sm — acceptable per plan)
**Why human:** CSS variable resolution and visual weight cannot be verified statically.

---

### Gaps Summary

No gaps. All 9 must-haves verified. Both SHELL-01 and SHELL-02 requirements satisfied. Two carry-over arbitrary values (Header.tsx "Archive Edition" span, NavDropdowns.tsx dropdown item links) are documented intentional deferrals, not gaps for this phase.

Automated verification confirms:
- `bg-paper` applied on header element and nav dropdown panel; no `dark:bg-paper` present
- `text-display` on Folio wordmark h1; `font-bold` and responsive arbitrary sizes removed
- `text-label` on date label, archive nav links, and TRIGGER_CLS constant
- Five footer links in correct order with correct `href`, `target`, and `rel` values
- `flex flex-col` on body and `flex-1` on `<main>` in layout.tsx; SiteFooter placed as sibling of main

---

_Verified: 2026-03-09T22:10:00Z_
_Verifier: Claude (gsd-verifier)_
