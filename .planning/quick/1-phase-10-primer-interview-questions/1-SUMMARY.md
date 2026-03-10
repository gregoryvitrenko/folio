---
phase: 10-primer-interview-questions
plan: "01"
type: quick
subsystem: content
tags: [primers, interview-questions, content-data]
dependency_graph:
  requires: []
  provides: [primer-interview-questions-5-per-primer]
  affects: [components/PrimerView.tsx]
tech_stack:
  added: []
  patterns: [static-data-authoring]
key_files:
  modified:
    - lib/primers-data.ts
  created: []
decisions:
  - "Commercial Reasoning skeleton format used for all 16 new questions: Context → Commercial implication → Legal angle → Current hook/your view"
  - "Questions are sector-specific — NSI Act and W&I for M&A; UKLR reform and green bonds for Capital Markets; syndicated loans and covenant restructuring for Banking & Finance; killer acquisitions and planning consents for Energy & Tech; AI credit scoring and SMCR for Regulation; TPLF/PACCAR and mediation/Churchill for Disputes; multi-jurisdiction coordination and BIT/Bribery Act for International; LLM professional responsibility and IP/CDPA for AI & Law"
metrics:
  duration: "~5 minutes"
  completed_date: "2026-03-10"
  tasks_completed: 1
  files_modified: 1
---

# Phase 10 Plan 01: Primer Interview Questions (16 new questions) Summary

**One-liner:** 16 new sector-specific interview questions (2 per primer) with explicit Commercial Reasoning skeletons added to lib/primers-data.ts, bringing each of the 8 primers from 3 to 5 questions.

## What Was Built

Added 2 new `PrimerInterviewQ` objects to the `interviewQs` array of each of the 8 sector primers in `lib/primers-data.ts`. Every new question's `skeleton` field explicitly follows the four-part Commercial Reasoning format:

1. **Context** — what is happening commercially right now in this sector
2. **Commercial implication** — what it means for businesses or deals
3. **Legal angle** — what specific legal issues arise
4. **Current hook/your view** — a named recent example or reasoned opinion

No UI changes were needed — the existing `PrimerView.tsx` renders any number of `interviewQs` correctly.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Author 16 new interview questions (2 per primer) | c8086df | lib/primers-data.ts |

## Questions Added (per primer)

| Primer | Q4 Topic | Q5 Topic |
|--------|----------|----------|
| M&A | NSI Act 2021 mandatory notification | W&I insurance and deal dynamics |
| Capital Markets | UKLR 2024 reforms and London IPO competitiveness | Green bonds and greenwashing liability |
| Banking & Finance | Syndicated loans and the agent role | Financial covenant breach — options for parties |
| Energy & Tech | Killer acquisitions and CMA/DMA tech regulation | Planning consents and renewable energy risk |
| Financial Regulation | AI credit scoring — regulatory intersection | SMCR personal accountability regime |
| Disputes | Third-party litigation funding and PACCAR | Mediation vs litigation — Churchill v Merthyr |
| International | Multi-jurisdiction transaction coordination | Market entry in high-risk jurisdictions — BIT and Bribery Act |
| AI & Law | LLM drafting tools and SRA professional responsibility | IP law and AI-generated content — CDPA and training data |

## Verification

- TypeScript: `npx tsc --noEmit` passes with no errors
- Question count: all 8 primers have exactly 5 `interviewQs` entries (verified programmatically)
- Format: all 16 new skeletons explicitly contain the four Commercial Reasoning labels
- Sector specificity: each question references statute, case law, or market development specific to its primer (not transferable to other primers)

## Deviations from Plan

None — plan executed exactly as written. The 16 questions were authored exactly as specified in the plan's action block, with no modifications.

## Self-Check

- [x] `lib/primers-data.ts` exists and was modified
- [x] Commit `c8086df` exists in git log
- [x] TypeScript compiles without errors
- [x] Each of the 8 primers has exactly 5 `interviewQs` entries

## Self-Check: PASSED
