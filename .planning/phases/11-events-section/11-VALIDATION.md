---
phase: 11
slug: events-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — project has no test runner |
| **Config file** | None |
| **Quick run command** | Manual: visit `localhost:3001/events` |
| **Full suite command** | Manual: all 4 smoke tests below |
| **Estimated runtime** | ~5 minutes (manual) |

---

## Sampling Rate

- **After every task commit:** Manual browser check on `localhost:3001`
- **After every plan wave:** Manual production smoke test (deploy to Vercel, verify live)
- **Before `/gsd:verify-work`:** All 4 manual checks must pass
- **Max feedback latency:** ~5 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-data-types | 01 | 1 | EVT-01 | manual | Visit `/events` signed out — page loads | ❌ no test runner | ⬜ pending |
| 11-storage | 01 | 1 | EVT-02 | manual | Check Redis `events:current` key exists after cron | ❌ no test runner | ⬜ pending |
| 11-generate | 01 | 2 | EVT-02 | manual | GET `/api/events` with CRON_SECRET — returns events JSON | ❌ no test runner | ⬜ pending |
| 11-page | 02 | 2 | EVT-01, EVT-03 | manual | City filter tabs work; past events filtered | ❌ no test runner | ⬜ pending |
| 11-ics | 02 | 2 | EVT-04 | manual | Download `.ics`; import to iOS Calendar — correct date/time/timezone | ❌ no test runner | ⬜ pending |
| 11-cron | 03 | 3 | EVT-02 | manual | Monday cron fires; `events:current` refreshed in Redis | ❌ no test runner | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework exists in this project — consistent with all previous phases. All validation is manual.

*Existing infrastructure covers all phase requirements (via manual testing).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/events` accessible without subscription | EVT-01 | No test runner | Visit `folioapp.co.uk/events` while signed out — page loads with events list |
| Past events filtered at render | EVT-02 | No test runner | Inject a past-dated event into Redis `events:current`; verify it does not appear on page |
| City filter tabs derived from data | EVT-03 | No test runner | Visit `/events?city=London`; verify only London events shown; verify tab list matches event cities |
| `.ics` imports correctly to iOS Calendar | EVT-04 | No test runner | Download `.ics` for a test event; open in iOS Calendar; verify date, time, timezone (Europe/London) |
| Weekly cron refresh | EVT-02 | No test runner | Check `vercel.json` cron schedule `"0 7 * * 1"`; verify Redis key updates after Monday 07:00 UTC |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions above
- [ ] No automated test runner available — all verification is manual
- [ ] Wave 0: N/A (no test infrastructure)
- [ ] No watch-mode flags
- [ ] `nyquist_compliant: true` set in frontmatter once all manual checks pass

**Approval:** pending
