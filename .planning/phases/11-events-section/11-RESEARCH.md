# Phase 11: Events Section - Research

**Researched:** 2026-03-11
**Domain:** AI-curated events page — Tavily search, Claude Haiku synthesis, Redis cache, .ics generation, city filter tabs, Next.js App Router
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Event card design:** Compact cards on listing page — event name, date, city, organiser. Coloured event type tags (Networking, Panel, Workshop, Social, Career Fair) with distinct colour per type. Eligibility tag per event. Tapping a card navigates to `/events/[id]` (not inline expand).
- **Event detail page:** Full event info (name, date/time, city, venue, organiser, description, event type, eligibility). .ics download button on detail page. External registration link on detail page. No external links on listing card.
- **Event types and targeting:** Primary: firm-hosted student social events (run clubs, pilates, drinks evenings, networking dinners) — NOT TC open days, vac schemes, or application deadlines. Secondary fill: Law Society events, legal charity events, bar association student events.
- **Each event must have an eligibility field.**
- **Tavily search strategy:** 6-8 queries per weekly refresh (~32/month, well within 1,000/month cap). Weekly cron at Monday 07:00 UTC refreshes Redis `events:current`. When firm socials are sparse, broaden to general legal student events.
- **AI synthesis:** Claude Haiku extracts structured event data. Also generates a 1-2 sentence "Why attend" editorial note per event. Model: claude-haiku (cost-efficient for structured extraction).
- **Free tier:** `/events` accessible without subscription — `requireSubscription()` must NOT be called.

### Claude's Discretion

- Exact Tavily query wording and strategy
- Event type colour assignments
- Detail page layout and typography
- Empty state design when no events are found
- How to handle events with incomplete data (missing venue, missing time)
- Redis cache structure and TTL strategy

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EVT-01 | `/events` page lists upcoming UK legal networking and professional events (free tier, no paywall) | Next.js App Router page with no `requireSubscription()` call; past events filtered at render time |
| EVT-02 | Events AI-curated weekly via Tavily search + Claude synthesis and cached in Redis — stale/past events filtered out automatically | Tavily parallel-query pattern from `lib/generate.ts`; Haiku synthesis; Redis `events:current` key; Monday 07:00 UTC cron in `vercel.json` |
| EVT-03 | City filter tabs on events page (All, London, Manchester, Edinburgh, Bristol) | Client-side URL param filter using `useSearchParams`; tab derived from event data not hardcoded; pattern follows `TabBar.tsx` |
| EVT-04 | Each event has a `.ics` download button for calendar export (RFC 5545, generated as TypeScript template string — no npm package) | RFC 5545 iCalendar spec; Europe/London TZID; Next.js Response with `text/calendar` content-type; `DTSTART;TZID=Europe/London:` format |
</phase_requirements>

---

## Summary

Phase 11 builds a net-new `/events` section — a free-tier, AI-curated listing of UK legal student events. The surface has three technical layers: (1) a weekly background job that queries Tavily and calls Claude Haiku to synthesise structured event JSON into Redis; (2) a listing page with client-side city filter tabs derived from event data; and (3) an `.ics` calendar export endpoint that produces a valid iCalendar file per event.

All four layers map cleanly onto established Folio patterns. The Tavily search loop is a direct port of `lib/generate.ts`'s `searchNews()` function. Redis storage follows the exact `useRedis()` dual-backend pattern in `lib/storage.ts`. The city filter tab is a stateless URL-param version of `TabBar.tsx`. The `.ics` file is a TypeScript template string with no external dependency — RFC 5545 iCalendar format is straightforward for single-event exports.

The main research questions were: (a) correct iCalendar TZID format for Europe/London, (b) how to handle events without complete data from Tavily, and (c) where to derive city tabs from. All three are resolved below.

**Primary recommendation:** Build `lib/events.ts` (types + generation + storage), `app/api/events/route.ts` (cron endpoint + .ics download), `app/events/page.tsx` (listing), and `app/events/[id]/page.tsx` (detail). Add one cron entry to `vercel.json`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@anthropic-ai/sdk` | existing | Claude Haiku synthesis | Already installed; `claude-haiku-4-5-20251001` used for quiz/firm packs — same model for events |
| `@upstash/redis` | existing | Events cache (`events:current`) | Established dual-backend pattern; no new dependency |
| Tavily API (fetch) | existing | Event discovery queries | Direct fetch pattern used in `lib/generate.ts`; 6-8 queries/week = ~32/month vs 1,000/month cap |
| Next.js App Router | existing | Pages + API routes | All routing is App Router |
| `jsonrepair` | existing | Repair Claude JSON output | Already used in `lib/generate.ts` for resilient JSON parsing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | existing | Calendar icon for page heading, Download icon for .ics button | Icons already imported in Header |
| `next-themes` | existing | Dark mode aware components | Already in layout |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript template string for .ics | `ical-generator` npm package | REQUIREMENTS.md EVT-04 explicitly says "no npm package" — template string is correct |
| `useSearchParams` for city filter | Server-side filtering via URL segment `/events/[city]` | URL segment adds routing complexity; `useSearchParams` on a client wrapper keeps the listing page Server Component with only a thin client filter shell |

**Installation:** No new packages required. All dependencies already present.

---

## Architecture Patterns

### Recommended File Structure
```
lib/
├── events.ts              # Event interface, Tavily queries, Haiku synthesis, Redis storage
app/
├── api/
│   └── events/
│       └── route.ts       # GET: .ics download  |  POST: cron-triggered generation
├── events/
│   ├── page.tsx           # Listing page (Server Component + client CityFilter wrapper)
│   ├── CityFilter.tsx     # Client component — useSearchParams for city tab state
│   └── [id]/
│       └── page.tsx       # Detail page (Server Component)
lib/
└── types.ts               # Add Event interface here (follows existing pattern)
vercel.json                # Add Monday 07:00 UTC cron
```

### Pattern 1: Event TypeScript Interface
**What:** Extend `lib/types.ts` with the `Event` and `EventsStore` interfaces — follows the existing pattern of all types living in `lib/types.ts`.

**Fields required by downstream features:**
- `id` (string, slug or uuid) — used in `/events/[id]` URL
- `title` (string)
- `date` (string, ISO date `YYYY-MM-DD`) — used for past-event filtering
- `time` (string | undefined) — e.g. `"18:30"` — optional when not reported
- `city` (string) — one of `London | Manchester | Edinburgh | Bristol | Other`
- `venue` (string | undefined) — optional when not known
- `organiser` (string)
- `eventType` (`'Networking' | 'Panel' | 'Workshop' | 'Social' | 'Career Fair'`)
- `eligibility` (string) — e.g. `"Open to all students"`
- `description` (string) — sourced from Tavily content
- `whyAttend` (string) — Haiku-generated 1-2 sentence editorial note
- `sourceUrl` (string) — registration/source link shown only on detail page

```typescript
// lib/types.ts — add after existing interfaces

export type EventType = 'Networking' | 'Panel' | 'Workshop' | 'Social' | 'Career Fair';
export type EventCity = 'London' | 'Manchester' | 'Edinburgh' | 'Bristol' | 'Other';

export interface LegalEvent {
  id: string;              // URL-safe slug, e.g. "linklaters-run-club-2026-04-15"
  title: string;
  date: string;            // YYYY-MM-DD
  time?: string;           // "18:30" | undefined when not known
  city: EventCity;
  venue?: string;          // undefined when not reported
  organiser: string;
  eventType: EventType;
  eligibility: string;     // e.g. "Open to all students"
  description: string;
  whyAttend: string;       // Haiku-generated editorial note
  sourceUrl: string;       // registration link — shown only on detail page
}

export interface EventsStore {
  events: LegalEvent[];
  generatedAt: string;     // ISO 8601 — shown as "last updated" on page
}
```

### Pattern 2: Tavily + Haiku Events Generation (lib/events.ts)
**What:** Direct port of `searchNews()` from `lib/generate.ts`. 6-8 parallel queries, 12s timeout, 800 char content limit, AbortController, fail-open on timeout. Claude Haiku extracts structured array.

**Tavily queries (Claude's discretion — recommended set):**
```typescript
// Source: lib/generate.ts pattern — verified in codebase
const queries = [
  `UK law firm student social events networking ${year}`,
  `Linklaters Freshfields Clifford Chance student event ${year}`,
  `law society student networking event London ${year}`,
  `legal networking event Manchester Edinburgh Bristol students ${year}`,
  `UK legal careers student event workshop panel ${year}`,
  `bar association law society student social UK ${year}`,
];
```

**Claude Haiku prompt structure:**
- System: extraction-focused, output raw JSON array only
- User: paste Tavily results, ask for `LegalEvent[]` array
- Model: `claude-haiku-4-5-20251001` (matches existing usage in `lib/quiz.ts`, `lib/firm-pack.ts`)
- JSON repair with `jsonrepair` (already used in `lib/generate.ts`)
- Incomplete data handling: if `venue` or `time` unknown, output `null` — TypeScript optional fields `undefined`

**ID generation:** Build a URL-safe slug from organiser + title + date:
```typescript
function buildEventId(organiser: string, title: string, date: string): string {
  return `${organiser}-${title}-${date}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
```

### Pattern 3: Redis Storage (events:current)
**What:** Single Redis key `events:current` storing the full `EventsStore` JSON. No sorted set needed (unlike briefings/quizzes) — only one live snapshot exists at a time.

```typescript
// lib/events.ts
async function redisGetEvents(): Promise<EventsStore | null> {
  const redis = getRedis();
  const data = await redis.get('events:current');
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

async function redisSaveEvents(store: EventsStore): Promise<void> {
  const redis = getRedis();
  await redis.set('events:current', JSON.stringify(store));
  // No TTL — events are manually refreshed weekly by cron.
  // Past events are filtered at render time, not by expiry.
}

// Filesystem fallback for dev
const EVENTS_FILE = path.join(process.cwd(), 'data', 'briefings', 'events-current.json');
```

**TTL decision (Claude's discretion):** No TTL on the Redis key. The cron refreshes every Monday. If the cron misses a week (e.g. Vercel outage), the old data is still better than an empty page. Past events are filtered at render time using `event.date >= todayDateString`.

### Pattern 4: Monday 07:00 UTC Cron
**What:** Add a third entry to `vercel.json`. The cron hits `GET /api/events` with `Authorization: Bearer {CRON_SECRET}` — same security pattern as the existing cron routes.

```json
{
  "crons": [
    { "path": "/api/generate",  "schedule": "0 6 * * *"   },
    { "path": "/api/digest",    "schedule": "0 8 * * 0"   },
    { "path": "/api/events",    "schedule": "0 7 * * 1"   }
  ]
}
```

Cron day: `1` = Monday. Time: `0 7` = 07:00 UTC. This is AFTER the daily briefing cron (06:00) so there is no resource contention.

### Pattern 5: .ics Download Endpoint
**What:** `GET /api/events?id={eventId}&format=ics` returns a `text/calendar` response. No npm package — pure TypeScript template string.

**RFC 5545 iCalendar format for a single event (Europe/London timezone):**
```typescript
// Source: RFC 5545 spec; verified against Apple Calendar import requirements
function generateIcs(event: LegalEvent): string {
  // DTSTART with TZID for named timezone (avoids UTC offset ambiguity around DST)
  const dtstart = event.time
    ? `DTSTART;TZID=Europe/London:${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00`
    : `DTSTART;VALUE=DATE:${event.date.replace(/-/g, '')}`;

  const dtend = event.time
    ? `DTEND;TZID=Europe/London:${event.date.replace(/-/g, '')}T${addHour(event.time).replace(':', '')}00`
    : `DTEND;VALUE=DATE:${event.date.replace(/-/g, '')}`;

  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Folio//Legal Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@folioapp.co.uk`,
    `DTSTAMP:${now}`,
    dtstart,
    dtend,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    event.venue ? `LOCATION:${escapeIcs(event.venue + ', ' + event.city)}` : `LOCATION:${event.city}`,
    `URL:${event.sourceUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function escapeIcs(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function addHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
```

**API route response:**
```typescript
// app/api/events/route.ts (GET handler for .ics)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const format = searchParams.get('format');

  if (format === 'ics' && id) {
    const store = await getEvents();
    const event = store?.events.find(e => e.id === id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const ics = generateIcs(event);
    return new Response(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.id}.ics"`,
      },
    });
  }
  // ... cron handler
}
```

### Pattern 6: City Filter (Client Component)
**What:** A thin `'use client'` wrapper `CityFilter.tsx` that reads `searchParams` and filters the events array. The parent listing `page.tsx` remains a Server Component that fetches events from Redis.

**Why URL param not URL segment:** A URL segment `/events/london` would require a nested layout or dynamic route for filtering — unnecessary complexity for a simple filter. `?city=london` keeps the listing page as one route.

**City tabs derived from events data (not hardcoded list):**
```typescript
// CityFilter.tsx — client component
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const CITY_ORDER: EventCity[] = ['London', 'Manchester', 'Edinburgh', 'Bristol', 'Other'];

export function CityFilter({ events }: { events: LegalEvent[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCity = (searchParams.get('city') as EventCity) ?? null;

  // Derive available cities from data — only show tabs for cities with events
  const availableCities = CITY_ORDER.filter(c => events.some(e => e.city === c));

  const filtered = activeCity ? events.filter(e => e.city === activeCity) : events;

  return (
    <>
      {/* Tab bar — same visual pattern as TabBar.tsx */}
      {/* Event card grid */}
    </>
  );
}
```

**Note on EVT-03 wording:** "tab derived from available events data rather than hardcoded" means the tab bar should not show a city tab if zero events exist in that city. The success criterion is satisfied by `availableCities` above.

### Pattern 7: Past-Event Filtering
**What:** Filter out events whose `date` is before today at render time. String comparison works because dates are `YYYY-MM-DD` — same lexicographic trick as `isClosed` in the firms deadline logic (documented in STATE.md).

```typescript
// app/events/page.tsx
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const upcoming = store.events.filter(e => e.date >= today);
```

### Anti-Patterns to Avoid
- **Calling `requireSubscription()`:** Events are free tier. Do not import or call this function in `app/events/page.tsx` or `app/events/[id]/page.tsx`.
- **Putting registration links on listing cards:** User decision — links only on detail page.
- **Hardcoding city tabs:** Tabs must be derived from event data. If Manchester has no events, no Manchester tab.
- **Using a TTL to expire events:** Past events must be filtered at render time, not by Redis expiry. The key `events:current` has no TTL.
- **Using `ical-generator` or any npm package for .ics:** EVT-04 explicitly requires TypeScript template string.
- **Using `rounded-xl` or `rounded-lg`:** Use `rounded-card` (2px) for cards, `rounded-chrome` (4px) for buttons. See design spec.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON repair on Claude output | Custom regex | `jsonrepair` (already installed) | Handles unclosed strings, trailing commas, smart quotes — used in `lib/generate.ts` |
| Timezone-aware date parsing | Custom DST logic | TZID in .ics template (`DTSTART;TZID=Europe/London:`) | RFC 5545 lets the importing calendar app handle DST — no JS Date arithmetic needed |
| HTTP timeout for Tavily | `setTimeout` + re-throw | `AbortController` + `clearTimeout` (existing pattern from `lib/generate.ts`) | Already battle-tested; fail-open on timeout returns empty results |
| Slug generation | UUID | Deterministic slug from organiser+title+date | Stable across refreshes; same event gets same ID |

**Key insight:** This phase is almost entirely a composition of existing patterns. The only genuinely new logic is the `.ics` template string and the events-specific Haiku prompt.

---

## Common Pitfalls

### Pitfall 1: iCalendar Line Length Limit
**What goes wrong:** RFC 5545 mandates lines must not exceed 75 octets. Long `DESCRIPTION` or `SUMMARY` values will break strict parsers (Outlook).
**Why it happens:** The spec is strict; most JS generators handle this automatically but a template string does not.
**How to avoid:** Apple Calendar and Google Calendar are lenient — they accept long lines. Since the target is iOS Calendar (stated in EVT-04 success criteria), no line-folding is needed. If Outlook is ever a target, add a fold function.
**Warning signs:** Outlook desktop refuses to import the file.

### Pitfall 2: DTSTART Without Time Zone
**What goes wrong:** `DTSTART:20260415T183000` (floating time with no TZID) behaves as UTC in some calendar apps, displaying the event 1 hour early in British Summer Time.
**Why it happens:** The iCalendar spec treats time values without TZID as "floating" (local time), but apps interpret this inconsistently.
**How to avoid:** Always use `DTSTART;TZID=Europe/London:20260415T183000` for timed events. For all-day events, use `DTSTART;VALUE=DATE:20260415`.
**Warning signs:** iOS Calendar shows the event at 17:30 when source says 18:30.

### Pitfall 3: Claude Returning Markdown Fences Around JSON
**What goes wrong:** Haiku sometimes wraps its JSON output in ` ```json ``` ` fences even when instructed not to.
**Why it happens:** Instruction following is imperfect on Haiku.
**How to avoid:** Use the `extractJSON()` helper already in `lib/generate.ts` — it strips fences and finds the JSON object.
**Warning signs:** `JSON.parse` throws on the raw Haiku response.

### Pitfall 4: Events with No Date
**What goes wrong:** Tavily results sometimes describe events without a specific date ("coming soon", "register your interest"). These cannot be filtered or sorted.
**Why it happens:** Event pages are sometimes published before dates are finalised.
**How to avoid:** In the Haiku prompt, instruct: "If no specific date is found, omit the event entirely — do not include events without a confirmed date." Validate output: any event missing `date` is dropped before saving.
**Warning signs:** `e.date >= today` throws because `date` is undefined.

### Pitfall 5: Vercel Cron Hitting the Route During Build
**What goes wrong:** Vercel's cron can fire during or immediately after a deployment if the deployment lands close to the scheduled time.
**Why it happens:** Cron fires based on schedule regardless of deployment state.
**How to avoid:** The `isCronAuthorized()` check (existing pattern) already requires `CRON_SECRET`. No extra guard needed.

### Pitfall 6: City Filter Breaking SSR
**What goes wrong:** `useSearchParams()` requires Suspense boundary in Next.js 15 App Router — without it, the entire page falls back to client-side rendering and may show a loading flash.
**Why it happens:** Next.js 15 requires `<Suspense>` around any component using `useSearchParams()`.
**How to avoid:** Wrap `<CityFilter>` in `<Suspense fallback={<EventsGrid events={allEvents} />}>` in the Server Component parent. The fallback renders all events (no filter) while the client hydrates.
**Warning signs:** Console warning: "useSearchParams() should be wrapped in a suspense boundary".

---

## Code Examples

Verified patterns from existing codebase:

### Tavily Search Pattern (from lib/generate.ts)
```typescript
// Source: /lib/generate.ts — searchNews() function (lines 167-218)
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 12_000);
return fetch('https://api.tavily.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  signal: controller.signal,
  body: JSON.stringify({
    api_key: apiKey,
    query: q,
    search_depth: 'basic',
    max_results: 5,
    include_answer: false,
  }),
})
  .then(r => r.json())
  .catch(() => ({ results: [] }))
  .finally(() => clearTimeout(timer));
```

### Redis Dual-Backend Pattern (from lib/storage.ts)
```typescript
// Source: /lib/storage.ts — useRedis(), getRedis(), dual-backend pattern (lines 11-21)
function useRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}
```

### Cron Auth Pattern (from app/api/generate/route.ts)
```typescript
// Source: /app/api/generate/route.ts — isCronAuthorized() (lines 44-54)
function isCronAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}
```

### JSON Extraction + Repair (from lib/generate.ts)
```typescript
// Source: /lib/generate.ts — extractJSON() + repairJSON() (lines 97-109)
function extractJSON(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  throw new Error('No JSON object found in model response');
}
// For arrays, extend: text.match(/\[[\s\S]*\]/) as fallback
```

### Past-Event Date Filtering (from STATE.md decision)
```typescript
// Source: STATE.md — "isClosed uses ISO string comparison" decision
// YYYY-MM-DD strings compare lexicographically — no Date parsing needed
const today = new Date().toISOString().split('T')[0];
const upcoming = events.filter(e => e.date >= today);
```

### TabBar Visual Pattern (from components/TabBar.tsx)
```typescript
// Source: /components/TabBar.tsx — active tab border + colour pattern (lines 27-66)
// Active: border-stone-900 dark:border-stone-100 text-stone-900
// Inactive: border-transparent text-stone-400 hover:text-stone-700
// Scroll container: overflow-x-auto no-scrollbar border-b border-stone-200
```

### Design Token Usage (from docs/design.md)
```
// Source: docs/design.md
// Cards:    rounded-card (2px) + bg-white dark:bg-stone-900 + border-stone-200 dark:border-stone-800
// Buttons:  rounded-chrome (4px) + bg-stone-900 hover:bg-stone-800
// Labels:   .section-label utility class (font-mono text-label uppercase tracking-widest)
// Page heading: lucide icon (size-4, text-stone-400) + bold title + count badge
```

---

## Event Type Colour Assignments (Claude's Discretion)

Following the TOPIC_STYLES pattern in `lib/types.ts` — one accent colour per event type, stored as a constant map:

| Event Type | Label class | Dot/chip class |
|------------|-------------|----------------|
| Networking | `text-blue-800 dark:text-blue-300` | `bg-blue-700 dark:bg-blue-400` |
| Panel | `text-violet-800 dark:text-violet-300` | `bg-violet-700 dark:bg-violet-400` |
| Workshop | `text-emerald-800 dark:text-emerald-300` | `bg-emerald-700 dark:bg-emerald-400` |
| Social | `text-orange-800 dark:text-orange-300` | `bg-orange-700 dark:bg-orange-400` |
| Career Fair | `text-amber-800 dark:text-amber-300` | `bg-amber-700 dark:bg-amber-400` |

These reuse existing Tailwind colour slots — no new classes needed.

---

## Redis Cache Structure Decision (Claude's Discretion)

**Recommended:** Single key `events:current` with no TTL.

Rationale: Unlike briefings (one per day, archival) or quizzes (one per day, archival), events are a rolling "current" snapshot. There is no need for an index or history. The entire store is replaced on each Monday cron. Past events are hidden at render time, not by deletion.

Dev filesystem path: `data/briefings/events-current.json` (consistent with existing dual-backend pattern).

---

## Incomplete Data Handling (Claude's Discretion)

**Recommended approach for missing fields:**

| Missing field | Strategy |
|---------------|----------|
| `venue` | Set to `undefined`. Listing card omits venue. Detail page shows "Venue TBC". |
| `time` | Set to `undefined`. Listing card shows date only. .ics uses `VALUE=DATE` (all-day). |
| `date` | Drop event entirely — do not include in output. |
| `sourceUrl` | Set to `"https://www.lawsociety.org.uk"` as fallback (Law Society homepage). Never undefined — detail page always needs a link. |
| `city` | Default to `"Other"` if city is UK but unrecognised. |

---

## Empty State Design (Claude's Discretion)

**Recommended:** A minimal empty state in the same newspaper style:
- Icon: `Calendar` (lucide, size 16, text-stone-400)
- Heading: "No upcoming events" (text-heading, font-serif)
- Body: "We refresh events every Monday. Check back after the next update." (text-caption, text-stone-500)
- Show last updated timestamp: "Last updated [date]" (section-label)

This matches the "last updated" success criterion in EVT-02.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| npm ical-generator package | RFC 5545 TypeScript template string | Per EVT-04 requirements — template string is simpler for single-event export |
| Hardcoded city list in tabs | Derived from events data | Per EVT-03 success criteria |
| UTC timestamps in .ics | `TZID=Europe/London` named timezone | Correct for DST-sensitive UK events |

---

## Open Questions

1. **Tavily result quality for firm social events**
   - What we know: Tavily indexes public web content. Linklaters run club / pilates events may be posted on LinkedIn, firm websites, or Eventbrite. Tavily searches these.
   - What's unclear: How frequently do law firms publicly post informal student social events vs. only sharing via direct invites/email lists. Sparse results are possible.
   - Recommendation: The CONTEXT.md already addresses this — "When results are sparse for firm socials, broaden to general legal student events." The Haiku prompt should explicitly instruct: "If fewer than 5 firm-hosted events are found, include Law Society and bar association events to reach at least 5 total."

2. **Event ID stability across weekly refreshes**
   - What we know: Using a deterministic slug (organiser+title+date) means the same event gets the same ID on re-generation.
   - What's unclear: If Haiku varies the title slightly between weeks ("Linklaters Run Club" vs "Linklaters Running Club"), the ID will change and any bookmarked `/events/[id]` URLs will 404.
   - Recommendation: Accept this tradeoff — events are ephemeral (past events are filtered anyway). Return a 404 with a redirect suggestion to `/events` for unknown IDs.

---

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json`. However, this project has no test framework installed — no jest, vitest, pytest, or test runner found in the project root (only node_modules test files from dependencies).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed — project has no test runner |
| Config file | None |
| Quick run command | N/A — manual smoke test on production |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EVT-01 | `/events` accessible without subscription | manual-only | Visit `folioapp.co.uk/events` while signed out | ❌ no test runner |
| EVT-02 | Events refreshed by cron, past events filtered | manual-only | Trigger `GET /api/events` with `CRON_SECRET`; verify Redis `events:current`; check no past events rendered | ❌ no test runner |
| EVT-03 | City filter tabs derived from data | manual-only | Visit `/events?city=London`; verify only London events shown | ❌ no test runner |
| EVT-04 | `.ics` download imports correctly to iOS Calendar | manual-only | Download `.ics` for a test event; import to iOS Calendar; verify date, time, timezone | ❌ no test runner |

### Sampling Rate
- **Per task commit:** Manual browser check on `localhost:3001`
- **Per wave merge:** Manual production smoke test (deploy to Vercel, verify live)
- **Phase gate:** All 4 manual checks pass before `/gsd:verify-work`

### Wave 0 Gaps
No automated test framework exists in this project. All validation is manual. This is consistent with all previous phases (no test infrastructure was added in phases 7-10).

---

## Sources

### Primary (HIGH confidence)
- `/lib/generate.ts` — Tavily parallel search pattern, AbortController, content limit, JSON extraction
- `/lib/storage.ts` — Redis dual-backend pattern, useRedis(), getRedis(), filesystem fallback
- `/lib/types.ts` — Interface conventions, TOPIC_STYLES colour map pattern
- `/app/api/generate/route.ts` — Cron auth pattern (isCronAuthorized), CRON_SECRET check
- `/components/TabBar.tsx` — Tab bar visual pattern, overflow-x-auto, active/inactive states
- `/vercel.json` — Cron schedule format: `"0 7 * * 1"` = Monday 07:00 UTC
- `docs/design.md` — Design tokens (rounded-card, rounded-chrome, section-label, type scale)
- `.planning/phases/11-events-section/11-CONTEXT.md` — All locked user decisions

### Secondary (MEDIUM confidence)
- RFC 5545 (iCalendar spec) — `DTSTART;TZID=Europe/London:` format, `VALUE=DATE` for all-day events, VCALENDAR/VEVENT structure. Well-established spec, behaviourally verified against iOS Calendar import requirements in EVT-04 success criteria.
- STATE.md decision: "isClosed uses ISO string comparison" — confirms YYYY-MM-DD lexicographic comparison works without Date parsing.

### Tertiary (LOW confidence — not needed for this phase)
- N/A

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies already in project; no new packages
- Architecture: HIGH — direct application of established `lib/generate.ts` and `lib/storage.ts` patterns
- .ics generation: HIGH — RFC 5545 is a stable spec; template string approach is straightforward for single-event export
- City filter: HIGH — `useSearchParams` + Suspense boundary is standard Next.js 15 App Router pattern
- Tavily result quality: MEDIUM — depends on public event posting behaviour of law firms; sparse results are possible

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable libraries, no fast-moving dependencies)
