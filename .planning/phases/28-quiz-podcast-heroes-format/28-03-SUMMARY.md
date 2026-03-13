---
phase: 28
plan: "03"
subsystem: quiz
tags: [feature, daily-filter, deep-practice, routing]
dependency_graph:
  requires: [28-02]
  provides: [daily-8-question-filter, deep-practice-route]
  affects: [app/quiz/page.tsx, app/quiz/practice/[topic]/page.tsx]
tech_stack:
  added: []
  patterns: [server-component, topic-filter, await-params]
key_files:
  modified: [app/quiz/page.tsx]
  created: [app/quiz/practice/[topic]/page.tsx]
decisions:
  - selectDailyQuestions picks one question per topic in canonical TOPIC_ORDER
  - dailyQuiz replaces the full quiz set passed to QuizInterface
  - Practice route is paywall-gated (requireSubscription)
  - params awaited as Promise<{topic}> per Next.js 15 App Router requirement
  - Graceful empty state when no questions available for a topic
metrics:
  duration: 10m
  completed: "2026-03-12"
---

# Phase 28 Plan 03: 8-Question Daily Filter + Deep Practice Route Summary

Added `selectDailyQuestions()` to the quiz page to limit the daily quiz to exactly one question per topic (8 total), and created a new `/quiz/practice/[topic]` server route that shows all questions for a specific practice area from the current briefing.

## Changes

- `app/quiz/page.tsx`: Added `QuizQuestion` type import; added `selectDailyQuestions()` helper function; compute `dailyQuiz` from filtered questions; pass `dailyQuiz` to `QuizInterface`
- `app/quiz/practice/[topic]/page.tsx` (new): Full Next.js 15 server component; `SLUG_TO_TOPIC` mapping for all 8 practice areas; filters briefing stories and quiz questions by topic; paywall-gated; graceful empty-state; `params` awaited as Promise

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `app/quiz/page.tsx` updated with selectDailyQuestions and dailyQuiz
- `app/quiz/practice/[topic]/page.tsx` created
- Commit 64c59aa exists
- `npx tsc --noEmit` passes with zero errors
