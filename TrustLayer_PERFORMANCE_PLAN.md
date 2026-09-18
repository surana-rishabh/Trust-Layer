# TrustLayer — Performance & Optimization Plan

Companion to `TrustLayer_PROJECT_PLAN.md`. Every item below is scoped to what's
actually appropriate for a hackathon prototype vs. what would be theater. Where an
item doesn't fit the prototype's actual scale, that's stated explicitly rather than
silently skipped — a judge asking "why do you have a load balancer for a 3-person demo"
is exactly the kind of question this project is trying to avoid everywhere else.

## 0. Scoping principle

This prototype will run: locally, or on a single small cloud instance, for a live
demo in front of a handful of people. It is not a production system.
So the target isn't "handle 10,000 concurrent users" — it's:
**nothing lags, stutters, or breaks during a live demo, and the code doesn't have
obviously bad patterns that a technical judge would flag.**

Each optimization below is marked:
- **[BUILD]** — implement for real, it matters at this scale too
- **[LIGHT]** — implement a minimal/right-sized version
- **[DEFER]** — architecturally note it as "next step for production," don't build it now
- **[SKIP-JUSTIFY]** — actively wrong for this scale; skip and be ready to explain why

---

## 1. Frontend Performance

### 1.1 Compress images — **[BUILD]**
- All seed/demo images run through compression before being committed (use `sharp`
  or a one-time script, target WebP with JPEG fallback)
- Any user-uploaded images (host uploads for Story A) get compressed server-side
  on upload before storage — also directly useful for the Evidence Engine, since
  smaller normalized images make perceptual hashing faster and more consistent
- **File:** `backend/app/services/image_processing.py`

### 1.2 Lazy loading — **[BUILD]**
- Listing images use native `loading="lazy"` on `<img>` tags
- Only relevant for the listing shell (few images anyway) — don't over-engineer
  with intersection observers for a page with 3-5 images

### 1.3 Code splitting — **[LIGHT]**
- Vite handles this by default per-route; just ensure routes are declared as
  separate lazy-loaded components (`React.lazy` + `Suspense`) rather than one
  giant bundle
- Reviewer page (rarely visited during the guest-facing demo flow) is a good
  candidate for its own chunk
- **Don't** hand-roll a complex chunking strategy — Vite's defaults are fine here

### 1.4 Minify JS/CSS — **[BUILD, but free]**
- This is Vite's production build default (`vite build`). No custom work needed —
  just make sure the demo runs the **production build**, not `vite dev`, when
  presenting. Note this explicitly in `docs/DEMO_SCRIPT.md`.

### 1.5 Reduce unnecessary re-renders — **[BUILD]**
- `TrustLayerPanel`, `HistoryTimeline`, `ReconciliationView` wrapped in `React.memo`
  since they re-render on polling/refresh but their props often don't change
- Event log / history data fetched once per view and passed down, not re-fetched
  per child component
- Avoid inline arrow functions as props where it causes avoidable re-renders in
  memoized children (pass stable callbacks via `useCallback`)

### 1.6 Debounce input handlers — **[BUILD]**
- Applies to: host upload form (if there's any live search/filter for "which
  listing might this match"), any search/filter input in the Reviewer page
- Standard 300ms debounce, implemented once as a small `useDebounce` hook, reused
  everywhere rather than re-implemented per component

### 1.7 Paginate large lists — **[LIGHT]**
- The event/history timeline and any "all listings" view get pagination (even if
  seed data is small) — this proves the pattern is in place, which matters more
  to a judge than the actual page size right now
- Simple offset/limit is enough; no need for cursor-based pagination at this scale

### 1.8 Remove unused dependencies — **[BUILD]**
- Run `npm depcheck` (frontend) and `pip-autoremove` / manual audit (backend)
  as a final Phase 8 step, not continuously — premature removal mid-build just
  causes churn
- Final `requirements.txt` and `package.json` should contain only what's imported

### 1.9 Defer non-critical scripts — **[LIGHT]**
- If any analytics/monitoring script is added for the demo, load with `defer`
- Realistically: this prototype likely has zero third-party scripts. Note that
  as a design choice (smaller attack surface, faster load) rather than leaving
  it silently unaddressed

### 1.10 Add loading skeletons — **[BUILD]**
- `TrustLayerPanel` and `ReconciliationView` show skeleton states while
  fetching — especially important for Story B's live drill-down, since that's
  the "wow" moment of the demo and it must not show a jarring blank flash

---

## 2. Backend / API Performance

### 2.1 Cache API responses — **[LIGHT]**
- Listing data (rarely changes during a demo) gets a short in-memory cache
  (simple TTL dict, or `functools.lru_cache` for read-heavy, rarely-changing
  lookups like listing details)
- Evidence Status and Reconciliation results are **not** cached beyond a very
  short window (a few seconds) — these need to reflect live state during the
  demo, especially right after triggering Story A/B
- **File:** `backend/app/services/cache.py` — a tiny wrapper, not a Redis
  dependency (see 2.6 below for why)

### 2.2 CDN — **[SKIP-JUSTIFY]**
- Not applicable: this is a single-demo prototype, likely served from one
  instance or run locally. A CDN adds infra complexity with zero demo-day
  benefit.
- **If asked:** "For a production rollout, static assets and images would sit
  behind a CDN — out of scope for a live hackathon demo serving a handful of
  judges from one origin."

### 2.3 Add a load balancer — **[SKIP-JUSTIFY]**
- Same reasoning as CDN. One backend instance is correct for this scale.
- **If asked:** "Load balancing matters once you have multiple backend
  instances under real traffic — this prototype intentionally stays
  single-instance to keep the demo simple and debuggable."

### 2.4 Compress API payloads — **[BUILD, cheap]**
- Enable gzip/Brotli compression middleware in FastAPI
  (`GZipMiddleware` — one line). Genuinely free performance, no reason to skip.

### 2.5 Database connection pooling — **[LIGHT]**
- SQLite doesn't really have "connections" the way Postgres does, so classic
  pooling isn't meaningfully applicable here
- **However:** the DB layer (`backend/app/db.py`) is built using SQLAlchemy
  with a session-per-request pattern from day one, so that swapping the
  connection string to Postgres later (production path) automatically gets
  real pooling for free, with zero code changes elsewhere
- This is the honest way to "address" this item at prototype scale

### 2.6 Cache expensive queries — **[LIGHT]**
- The Reconciliation Engine's cross-event comparison is the only genuinely
  "expensive" query in this system (it scans a booking's full event history)
- Cache the *result* per booking_id for a few seconds after computation,
  invalidated immediately when a new event is appended for that booking —
  correctness during the demo matters more than raw speed here

### 2.7 Fix N+1 queries — **[BUILD — this one matters regardless of scale]**
- This is a correctness/code-quality issue, not just a performance one, and
  it's exactly the kind of thing that shows up in code review
- Explicit rule: any endpoint returning a listing with its media, or a booking
  with its full event history, must use a single joined/eager-loaded query
  (SQLAlchemy `joinedload`/`selectinload`), never a loop that queries per item
- Add this as a review checklist item at the end of Phase 7 (see Section 4)

### 2.8 Add server-side caching — **[LIGHT]**
- Covered by 2.1 and 2.6 — no separate infra needed. Explicitly **not**
  introducing Redis/Memcached for a prototype this size; the in-memory
  TTL cache is sufficient and removes a moving part that could fail live.

### 2.9 Defer non-critical scripts *(backend equivalent: background jobs)* — **[BUILD]**
- The **Anchoring Job** (batching + submitting to Polygon Amoy) must run as a
  background task, never inline/blocking on a user-facing request — a testnet
  transaction can take a few seconds to confirm, and nothing in the UI should
  freeze waiting for it
- Use FastAPI's `BackgroundTasks` (sufficient at this scale — no need for
  Celery/queue infra for a hackathon prototype)

---

## 3. Database

### 3.1 Index the database — **[BUILD]**
Indexes to add explicitly (not "index everything" — targeted, justified indexes):

| Table | Column(s) | Why |
|---|---|---|
| `event_log` | `booking_id` | Reconciliation Engine's core lookup |
| `event_log` | `listing_id` | History timeline lookup per listing |
| `event_log` | `previous_hash` | Chain integrity verification walks this |
| `media_assets` | `listing_id` | Evidence Engine's per-listing similarity scan |
| `reconciliation_flags` | `booking_id`, `status` | Reviewer page's "show open flags" query |

This table goes into the actual schema migration/model comments so it's
traceable, not just a chat instruction that gets forgotten.

---

## 4. Code Quality Gate (ties performance items to review, not just intent)

Add this as an explicit Phase 7.5 (between Frontend Assembly and Demo Hardening
in the main plan) — **Performance & Quality Pass**:

1. Run `npm run build` and confirm no console warnings about bundle size or
   unminified output
2. Run Lighthouse audit (see Section 5) against the production build
3. Grep backend routers for any loop containing a DB query call → flag as N+1
   candidate, fix with eager loading
4. Confirm `GZipMiddleware` is active (check response headers)
5. Confirm indexes from Section 3.1 exist (`\d event_log` equivalent check)
6. Confirm Anchoring Job runs via `BackgroundTasks`, not inline
7. Run `depcheck` / dependency audit, remove anything unused
8. Manually click through both demo stories on a throttled network profile
   (Chrome DevTools "Fast 3G") to catch anything that assumes fast wifi

---

## 5. Lighthouse Audit — **[BUILD]**

Run against the production build (`vite build && vite preview`), not dev server.

**Target thresholds for this prototype** (realistic for a content-light,
single-page-flow app — not claiming enterprise-grade numbers):
- Performance: 85+
- Accessibility: 90+
- Best Practices: 90+
- SEO: not a priority (internal demo tool), don't chase this score

**Process:**
1. Run Lighthouse in Chrome DevTools against the deployed/preview build
2. Record the report as `docs/lighthouse_report.json` (or a screenshot) —
   useful to have on hand if a judge asks about performance rigor
3. Fix anything flagged as "high impact, low effort" only — don't chase a
   perfect 100 at the cost of build time better spent on Story A/B polish

---

## 6. What's explicitly out of scope, and why (summary table)

| Item | Status | Reason |
|---|---|---|
| CDN | Skip | Single-origin demo, zero benefit at this scale |
| Load balancer | Skip | Single backend instance is correct here |
| Redis/Memcached | Skip | In-memory TTL cache is sufficient, fewer moving parts to fail live |
| Celery/task queue | Skip | `BackgroundTasks` is sufficient for one background job type |
| Full connection pooling | Deferred | SQLite doesn't need it; SQLAlchemy session pattern makes Postgres migration trivial later |
| Perfect Lighthouse 100 | Not chased | Diminishing returns vs. time better spent on core demo stories |

This table itself is worth keeping — it's the same "state limitations up front"
principle already used in the pitch deck (slide 6, "Limitations stated up
front"), applied to the engineering side too.
