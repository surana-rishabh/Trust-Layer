# TrustLayer — Execution Prompt for Claude Code

Paste this whole file as your starting prompt in Claude Code. It references two
companion documents that must be in the repo root before you start:
`TrustLayer_PROJECT_PLAN.md` and `TrustLayer_PERFORMANCE_PLAN.md`.

---

## Your task

Build the TrustLayer prototype exactly as specified in `TrustLayer_PROJECT_PLAN.md`,
applying every optimization marked **[BUILD]** or **[LIGHT]** in
`TrustLayer_PERFORMANCE_PLAN.md` as you go — not as an afterthought. Items marked
**[SKIP-JUSTIFY]** or **[DEFER]** should NOT be built; if you're ever tempted to add
one "because it's best practice," stop and re-read Section 6 of the performance
plan first.

This is a hackathon prototype for a live demo, not a production system. Two demo
stories (Section 2 of the project plan) are the actual deliverable. Everything
else exists only in service of making those two stories real, correct, and fast
to demo.

## Non-negotiable constraints (do not deviate from these, ever)

1. Booking Service and Payment Webhook Service must be genuinely separate
   modules with no shared imports or shared in-memory state — they only ever
   communicate through the event log. Before writing either, restate this
   constraint back to me in your own words to confirm you understand it.
2. The blockchain anchoring job anchors a periodic **batch root hash**, never
   individual events. Never write code that calls the Amoy client per-event.
3. No numeric "trust score" anywhere in backend responses or frontend UI.
   Categorical status only (e.g. "No significant concern" / "Additional
   verification required" / "Reconciliation failure").
4. Media similarity matches are never labeled "fake" or "fraud" anywhere in
   code, UI copy, or comments. Always "similar media detected" / "review
   required."
5. Every write to the event log must be immediately hashed and chained to the
   previous event's hash. There is no code path that updates or deletes an
   existing event log row — corrections are always new appended rows.
6. Never introduce Redis, Celery, a load balancer, or a CDN. Use FastAPI
   `BackgroundTasks` for the anchoring job and an in-memory TTL cache for
   the caching items in the performance plan.

If at any point a requested step would violate one of these six constraints,
stop, tell me explicitly which constraint is at risk, and propose an
alternative — do not silently work around it.

## How to work: phase by phase, with checkpoints

Work through the 8 build phases in `TrustLayer_PROJECT_PLAN.md` Section 6, in
order. Do not skip ahead to a later phase before the current one's "Done when"
criteria are met.

For **every phase**, follow this exact loop:

### Step A — Plan the phase
Before writing code, output a short plan for the phase: which files you'll
create/modify, in what order, and which performance-plan items apply to this
phase specifically. Wait for my go-ahead only if I say "confirm each phase" —
otherwise proceed automatically once the plan is stated.

### Step B — Build it
Implement the phase. Apply the relevant performance-plan items inline (e.g.
when building the event log in Phase 1, add the indexes from Performance Plan
Section 3.1 at the same time — don't leave indexing for later).

### Step C — Self-check against "Done when"
Explicitly test against the phase's "Done when" criterion from the project
plan. Show me the actual evidence (test output, a curl response, a screenshot
description, etc.) — not just "this should work now."

### Step D — Status report (mandatory, every phase)
Output a structured status block in exactly this format before moving to the
next phase:

```
## Phase N Status: [COMPLETE / BLOCKED / PARTIAL]

Done:
- [specific thing that now works, verified how]

Not done / deferred:
- [anything skipped and why]

Constraint check:
- [confirm none of the 6 non-negotiable constraints above were violated
  this phase — if uncertain about any, flag it explicitly]

Performance items applied this phase:
- [list which [BUILD]/[LIGHT] items from the performance plan were addressed]

Next phase: [N+1 — one-line description]

Anything that needs my input before proceeding: [or "none"]
```

Do not proceed past a phase marked BLOCKED without my explicit response.

## After Phase 7 (Frontend Assembly)

Run **Phase 7.5 — Performance & Quality Pass** exactly as described in
`TrustLayer_PERFORMANCE_PLAN.md` Section 4, checklist items 1–8. Report results
in the same status block format as above, with a `Quality gate: PASS/FAIL` per
checklist item.

Do not proceed to Phase 8 (Demo Hardening) until all 8 quality gate items are
PASS or explicitly justified as deferred with my sign-off.

## Phase 8 — Demo Hardening

In addition to what's in the project plan, produce:
1. `docs/lighthouse_report.json` or equivalent from the Lighthouse audit
   (Performance Plan Section 5), with actual scores reported to me
2. A final self-audit against the project plan's Section 8 "Success criteria"
   (all 6 items), reported as PASS/FAIL each, with evidence

## If something breaks mid-build

Do not silently patch around a broken constraint or a failing test by
weakening it (e.g. don't fix a failing "chain integrity" test by making the
check more lenient). Instead:
1. State clearly what broke and why
2. Propose a fix that preserves the original intent
3. Only proceed once the fix is applied and re-verified

## Ongoing running log

Maintain `docs/ARCHITECTURE_DECISIONS.md` throughout — every time you make a
judgment call not explicitly specified in the two plan documents (e.g. exact
similarity threshold for "similar media," exact debounce timing, exact TTL for
cache), log it there with a one-line reason. This becomes useful both for me
and for answering judges' questions later about why specific numbers were
chosen.

---

Begin with Phase 1. Restate the Booking Service / Payment Webhook separation
constraint back to me first, then output your Step A plan for Phase 1.
