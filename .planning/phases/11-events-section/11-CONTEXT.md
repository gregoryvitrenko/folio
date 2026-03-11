# Phase 11: Events Section - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Build an AI-curated UK legal events page at `/events` (free tier, no paywall). Tavily searches weekly for student-targeted legal events, Claude synthesises structured event data, events are cached in Redis. City filter tabs, .ics calendar export, and individual event detail pages.

</domain>

<decisions>
## Implementation Decisions

### Event card design
- Compact cards on the listing page: event name, date, city, organiser
- Coloured event type tags per card (e.g. "Networking", "Panel", "Workshop", "Social", "Career Fair") — distinct colour per type, similar to topic dots on story cards
- Eligibility tag per event showing who can attend (e.g. "All students", "LLM only", "3rd year+", "Open to all")
- Tapping a card navigates to `/events/[id]` detail page (not inline expand)

### Event detail page
- Full event info: name, date/time, city, venue, organiser, description, event type, eligibility
- .ics download button on detail page
- External registration link on detail page (linking to source — Eventbrite, firm website, etc.)
- No external links on the listing card itself — only on the detail page

### Event types and targeting
- Primary target: firm-hosted student social events (run clubs, pilates sessions, drinks evenings, networking dinners) — NOT TC open days, vac schemes, or application deadlines
- Secondary fill: Law Society events, legal charity events, bar association student events — used to pad when firm socials are sparse
- Each event must have an eligibility field (who can attend)

### Tavily search strategy
- 6-8 Tavily queries per weekly refresh (~32/month, well within 1,000/month cap)
- Queries target: "UK law firm student events", "law society student networking", firm-specific social events, city-specific legal student events
- Weekly cron at Monday 07:00 UTC refreshes Redis cache (`events:current`)
- When results are sparse for firm socials, broaden to general legal student events

### AI synthesis role
- Claude extracts structured event data from Tavily results: title, date, time, city, venue, organiser, eligibility, event type, source URL
- Claude also generates a 1-2 sentence "Why attend" editorial note per event (e.g. "Good chance to meet Herbert Smith partners in an informal setting")
- Model: claude-haiku (cost-efficient for structured extraction)

### Claude's Discretion
- Exact Tavily query wording and strategy
- Event type colour assignments
- Detail page layout and typography
- Empty state design when no events are found
- How to handle events with incomplete data (missing venue, missing time)
- Redis cache structure and TTL strategy

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TabBar` component (`components/TabBar.tsx`): Horizontal scrollable tab bar with active state — can inform city filter tabs pattern (though cities are simpler than topics)
- `StoryCard` / `FirmCard`: Card patterns with stone palette, design tokens, border hover states — inform event card styling
- `Header` component: Already imports `Calendar` icon from lucide-react
- `lib/generate.ts` Tavily integration: Existing pattern for parallel Tavily queries (8 queries, 12s timeout, 800 char content limit, abort controller) — directly reusable for events search

### Established Patterns
- Page heading: icon (lucide, 16px, text-stone-400) + bold title + count badge — apply to /events
- `requireSubscription()` paywall — events page must NOT call this (free tier)
- Cron pattern in `vercel.json`: existing crons at 06:00 UTC daily and 08:00 UTC Sundays
- Stone palette for content, zinc for UI chrome
- `section-label` utility class for overline labels
- `rounded-card` (2px) for cards, `rounded-chrome` (4px) for buttons/chips

### Integration Points
- `vercel.json`: Add new cron entry for Monday 07:00 UTC events refresh
- `app/api/events/route.ts`: New API route for events generation + caching
- `app/events/page.tsx`: New listing page (free tier)
- `app/events/[id]/page.tsx`: New detail page (free tier)
- `lib/types.ts`: New Event interface
- `Header.tsx` / `NavDropdowns.tsx`: Add Events nav link (Calendar icon already imported)
- Redis: New `events:current` key for cached events data

</code_context>

<specifics>
## Specific Ideas

- "I want firm-hosted social events like Linklaters pilates or run club" — the defining vision for what events to surface
- Eligibility tags are important — students need to know if they're allowed to attend (LLM only, 3rd year+, open to all)
- External registration links only on detail page, not on listing cards — keeps the listing clean
- Mix firm socials with broader events to avoid empty/sparse listings

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-events-section*
*Context gathered: 2026-03-11*
