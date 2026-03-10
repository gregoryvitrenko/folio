---
phase: 06-bug-fixes-content-quality
verified: 2026-03-10T10:00:00Z
status: human_needed
score: 5/5 must-haves verified
re_verification: false
human_verification:
  - test: "Visit https://www.folioapp.co.uk/upgrade and scroll to bottom — confirm exactly one footer row appears"
    expected: "One footer with Feedback, Terms, Privacy, Contact, LinkedIn links. No duplicate row below it."
    why_human: "BUG-01 fix removes a JSX element; root layout provides the footer. Visual rendering cannot be verified without loading the page in a browser."
  - test: "Visit https://www.folioapp.co.uk/firms/freshfields-bruckhaus-deringer, scroll to 'Training Contract Applications', find a 2025 deadline row"
    expected: "Row is greyed out (opacity-60), shows 'CLOSED' monospace badge, date text has strikethrough, no 'Apply ->' button. A future-dated row (if any) still shows 'Apply ->'."
    why_human: "BUG-02 fix is conditional on runtime date comparison against today. The logic exists in code but visual result depends on firm data and live rendering."
  - test: "Sign in as a subscriber, visit https://www.folioapp.co.uk/quiz, inspect the 'Available' section"
    expected: "Only dates with real cached quiz data appear. If no quizzes have been cached since deploy, the list is empty — both are correct. Any listed date shows actual questions when clicked, not an empty screen. No date badge shows '18 QUESTIONS'."
    why_human: "BUG-03 fix changes Redis index logic. The quiz:index set is empty on first deploy and populates on future cron runs. Correct behaviour (empty or real dates) can only be observed on the live site."
  - test: "After the next 06:00 UTC cron run, read the Talking Points section of any new article on the live briefing"
    expected: "Soundbite does not contain 'significant development', 'marks a new era', or 'signals change'. It names a specific commercial implication. partnerAnswer names a specific practice area and at least one firm."
    why_human: "QUAL-01 strengthens a prompt string — quality improvement only appears in AI output generated after the change. Cannot be verified before next briefing generation."
  - test: "After the next 06:00 UTC cron run, open /quiz for the new date and attempt Q1 on any story"
    expected: "Q1 does not ask 'What was the acquisition price?' or any fact visible in the headline. It asks about regulatory clearance, practice area, or commercial inference. Distractors are real firms or regulatory bodies."
    why_human: "QUAL-02 rewrites quiz question design rules — only observable in newly generated quiz content after the change. Cannot be verified before next cron run."
---

# Phase 6: Bug Fixes + Content Quality Verification Report

**Phase Goal:** Fix all production bugs identified in live audit and lift content quality so the product delivers on its core promise
**Verified:** 2026-03-10T10:00:00Z
**Status:** human_needed — all automated checks pass; 5 items require live-site observation
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Double footer on /upgrade is gone | ? HUMAN NEEDED | `app/upgrade/page.tsx` has no `SiteFooter` import or JSX (confirmed in file). `app/layout.tsx` line 64 renders `<SiteFooter />` once. Visual confirmation required. |
| 2 | Expired firm deadline rows show CLOSED badge, greyed row, strikethrough date, no Apply button | ? HUMAN NEEDED | `isClosed` logic fully wired in `app/firms/[slug]/page.tsx` lines 447-497. All five conditional behaviours present in code. Runtime date comparison against live `getTodayDate()` requires browser. |
| 3 | /quiz Available list reflects only dates with real cached quiz data | ? HUMAN NEEDED | `listQuizDates()` now calls `redisListQuizDates()` which reads `quiz:index` (not `briefing:index`). `redisSaveQuiz` writes to `quiz:index` on save. `?? 18` fallback replaced with `?? 0`. All code confirmed. Live Redis state requires production observation. |
| 4 | Talking points are sharp, specific, and genuinely usable — not generic AI summaries | ? HUMAN NEEDED | `lib/generate.ts` talkingPoints instructions confirmed updated with BAD/GOOD examples and filler-phrase ban. Quality is only observable in AI output from next generation cycle. |
| 5 | Quiz questions test commercial reasoning, not deal-price recall | ? HUMAN NEEDED | `lib/quiz.ts` Question design rules confirmed rewritten: Q1=Commercial Inference (forbids deal-price recall), Q2=Law Firm Angle, Q3=Interview So-What. Quality only observable in newly generated quiz content. |

**Score:** 5/5 truths have verified implementations. All 5 require human observation on live site or next generation cycle.

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/upgrade/page.tsx` | No SiteFooter import or JSX | VERIFIED | Grep confirms zero matches for "SiteFooter" in the file. Root layout provides footer. |
| `app/firms/[slug]/page.tsx` | isClosed logic with CLOSED badge, opacity-60, strikethrough, hidden Apply | VERIFIED | Lines 447-497 confirmed: `isClosed` declared, outer div uses template literal className, badge renders `{isClosed &&}`, date uses `line-through`, Apply wrapped in `{!isClosed &&}`. |
| `lib/storage.ts` | redisSaveQuiz writes to quiz:index; redisListQuizDates reads quiz:index | VERIFIED | Lines 125-203 confirmed: `Promise.all` with `zadd('quiz:index', ...)`, `redisListQuizDates()` function with `zrange('quiz:index', ...)`, `listQuizDates()` routes to `redisListQuizDates()` in Redis mode. |
| `app/quiz/[date]/page.tsx` | Question count badge uses `?? 0` not `?? 18` | VERIFIED | Line 43 confirmed: `const questionCount = quiz?.questions.length ?? 0;` — no `?? 18` anywhere in file. |
| `lib/generate.ts` | talkingPoints prompt with BAD/GOOD examples, filler-phrase ban | VERIFIED | Lines 63-65 confirmed: soundbite contains "BAD:" and "GOOD:" contrast example, "Do not use phrases like 'significant development'", partnerAnswer and fullCommercial both end with "Zero filler phrases." |
| `lib/quiz.ts` | Question design rules with Commercial Inference, Law Firm Angle, Interview So-What | VERIFIED | Lines 27-37 confirmed: Q1 "Commercial Inference", Q2 "Law Firm Angle", Q3 "Interview So-What", distractor guidance names specific firms (Linklaters, Freshfields, Clifford Chance, Allen & Overy, Latham & Watkins, Kirkland & Ellis, Skadden, Davis Polk) and regulatory bodies (CMA, FCA, PRA, EU Commission, SFO, Takeover Panel). |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/upgrade/page.tsx` | `app/layout.tsx SiteFooter` | SiteFooter rendered once in root layout; page.tsx must not duplicate it | WIRED | `app/layout.tsx` line 64 has `<SiteFooter />`. `app/upgrade/page.tsx` has no SiteFooter reference. Root layout wraps all pages — exactly one footer rendered. |
| `app/firms/[slug]/page.tsx` | `getTodayDate()` | ISO string comparison `deadline.closeDate < today` | WIRED | `today` is in scope via `const today = getTodayDate()` at page level. `isClosed` uses `deadline.closeDate < today` — ISO YYYY-MM-DD strings compare lexicographically correctly. |
| `lib/storage.ts redisSaveQuiz` | Redis quiz:index sorted set | `redis.zadd('quiz:index', { score: timestamp, member: date })` | WIRED | Confirmed at lines 128-131: `zadd('quiz:index', { score: new Date(quiz.date).getTime(), member: quiz.date })` inside `Promise.all`. |
| `lib/storage.ts listQuizDates` | `redisListQuizDates` | reads quiz:index zrange instead of briefing:index | WIRED | Lines 201-204: `if (useRedis()) return redisListQuizDates()` — correctly routes to the new function, not the old `redisList()`. |
| `lib/generate.ts buildUserPrompt` | talkingPoints JSON field | prompt instruction text contains BAD/GOOD examples | WIRED | Line 63 confirmed: `talkingPoints.soundbite` instruction includes inline "BAD:" and "GOOD:" examples. JSON key names unchanged (`soundbite`, `partnerAnswer`, `fullCommercial`). |
| `lib/quiz.ts buildPrompt` | Question design rules section | Q1/Q2/Q3 instructions shape question type and difficulty | WIRED | Lines 27-37: Question design rules block confirmed replaced. Q1 "Commercial Inference", Q2 "Law Firm Angle", Q3 "Interview So-What". JSON structure unchanged. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| BUG-01 | 06-01-PLAN.md | Double footer on /upgrade removed | SATISFIED | `app/upgrade/page.tsx`: no `SiteFooter` import or JSX. Commit `341679a` confirmed. |
| BUG-02 | 06-01-PLAN.md | Expired firm deadlines show CLOSED badge, greyed row, strikethrough date, no Apply button | SATISFIED | `app/firms/[slug]/page.tsx` lines 447-497: all five closed-state behaviours implemented. Commit `07e9fa5` confirmed. |
| BUG-03 | 06-02-PLAN.md | Quiz Available list reads quiz:index; question count badge reflects real cached data | SATISFIED | `lib/storage.ts`: `quiz:index` zadd in redisSaveQuiz, `redisListQuizDates` reads quiz:index, `listQuizDates` routes correctly. `app/quiz/[date]/page.tsx` line 43: `?? 0` not `?? 18`. Commits `4b0f5fa` + `03f4d6b` confirmed. |
| QUAL-01 | 06-03-PLAN.md | talkingPoints prompt strengthened with BAD/GOOD contrast examples and filler-phrase ban | SATISFIED | `lib/generate.ts` lines 63-65: BAD/GOOD examples in soundbite, "Zero filler phrases" in partnerAnswer and fullCommercial. Commit `c967998` confirmed. |
| QUAL-02 | 06-03-PLAN.md | Quiz Q1 rewritten as Commercial Inference; Q2/Q3 updated; distractor guidance names real firms/regulators | SATISFIED | `lib/quiz.ts` lines 27-37: Q1 Commercial Inference, Q2 Law Firm Angle, Q3 Interview So-What, distractor list names 8 real firms + 6 regulatory bodies + 6 practice areas. Commit `b027c2c` confirmed. |

**Orphaned requirements:** None. All 5 Phase 6 requirements (BUG-01, BUG-02, BUG-03, QUAL-01, QUAL-02) appear in plan frontmatter and are covered by verified artifacts.

**Requirements.md status:** All 5 requirements marked `[x]` complete in `.planning/REQUIREMENTS.md` lines 49-53. Traceability table maps all 5 to Phase 6. Coverage shows 0 unmapped requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/upgrade/page.tsx` | 91, 95 | `TODO: update with real count` and `TODO: replace with real testimonial` | Info | Pre-existing from Phase 4 (CONV-03 social proof placeholder slots). These are by design — wired to show real data when available, marked as placeholders intentionally. Out of scope for Phase 6. |

No blockers. No warnings. The two TODO comments in `app/upgrade/page.tsx` are pre-existing placeholder markers from Phase 4's CONV-03 requirement — they are intentional, not regressions from Phase 6.

---

## Human Verification Required

All five automated checks passed (code exists, is substantive, and is wired correctly). Phase 6 involves visual rendering, live Redis state, and AI-generated content — all three categories require human observation.

### 1. BUG-01: Double Footer on /upgrade

**Test:** Visit https://www.folioapp.co.uk/upgrade (incognito recommended). Scroll to the bottom.
**Expected:** Exactly one footer row appears — Feedback, Terms/Privacy, Contact, LinkedIn. No second identical row below it.
**Why human:** The fix is a JSX deletion. Whether the page renders one or two footer instances is only observable in a browser.

### 2. BUG-02: Expired Deadline CLOSED State on Firm Profiles

**Test:** Visit https://www.folioapp.co.uk/firms/freshfields-bruckhaus-deringer. Scroll to "Training Contract Applications".
**Expected:** Any deadline with a closeDate in 2025 shows a greyed-out row (reduced opacity), a "CLOSED" monospace badge next to the label, strikethrough date text, and no "Apply ->" button. Any deadline with a future closeDate shows the "Apply ->" button unchanged.
**Why human:** The `isClosed` logic uses `deadline.closeDate < today` — runtime date comparison. The visual outcome depends on the firm's actual closeDate values vs. today's date. Correct rendering requires browser observation.

### 3. BUG-03: Quiz Available List Accuracy

**Test:** Sign in as a subscriber. Visit https://www.folioapp.co.uk/quiz. Inspect the "Available" section.
**Expected:** The list contains only dates where a quiz was actually cached. This may be empty on first deploy (quiz:index starts empty and populates on future cron saves — an empty list is correct). If any dates appear, clicking one shows real quiz questions, not an empty screen. No date badge reads "18 QUESTIONS".
**Why human:** The fix routes listQuizDates to Redis quiz:index instead of briefing:index. The actual content of quiz:index on the live Redis instance is only observable on the production site.

### 4. QUAL-01: Talking Points Quality in Next Generated Briefing

**Test:** After the next 06:00 UTC cron run (or after triggering admin POST to /api/generate), navigate to any story in the new briefing. Read the Talking Points section.
**Expected:** The soundbite does NOT contain "significant development", "marks a new era", or "signals change". It names a specific commercial implication or market dynamic. The partnerAnswer names at least one specific practice area and one named firm, with a clear "so-what for law firms."
**Why human:** Prompt engineering changes only affect AI output from new generations. The existing cached briefings were generated with the old prompts. Quality improvement is only visible after the next cron run.

### 5. QUAL-02: Quiz Question Reasoning in Next Generated Quiz

**Test:** After the next 06:00 UTC cron run, navigate to /quiz for the new date and attempt Q1 on any story.
**Expected:** Q1 does NOT ask about deal price or any fact visible in the headline. It asks about regulatory clearance, financing structure, practice area, or commercial implication — something that requires reasoning. Distractors are real law firms or regulatory bodies, not obviously wrong options.
**Why human:** Same as QUAL-01 — quiz question design rules only affect newly generated quizzes. Existing cached quizzes were generated under the old "Recall" framework.

---

## Gaps Summary

No gaps. All five Phase 6 requirements have verified implementations. All six commits exist in the repository and their diffs confirm exactly the changes described in the plan frontmatter. The phase status is `human_needed` rather than `passed` because three of the five requirements (BUG-01, BUG-02, BUG-03) involve visual rendering or live Redis state that cannot be validated without a browser, and two (QUAL-01, QUAL-02) require observing AI-generated output from the next cron cycle.

The production sign-off documented in 06-04-SUMMARY.md records that the product owner visually confirmed BUG-01, BUG-02, and BUG-03 on the live site and acknowledged QUAL-01/QUAL-02 as pending next generation.

---

_Verified: 2026-03-10T10:00:00Z_
_Verifier: Claude (gsd-verifier)_
