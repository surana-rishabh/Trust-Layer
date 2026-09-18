# TrustLayer — Project Plan

Team AaluSamosa · Geeks2Code 2026 · Wayzyy Special Track

## 0. What we are building (one line)

A small stage on top of a minimal Wayzyy-style listing page, on which TrustLayer catches
two things that shouldn't be trusted blindly:
1. Reused/similar listing media
2. A price that silently changed between two independent event sources

We are **not** building a rental marketplace. The listing UI exists only to give
TrustLayer something to sit on top of.

## 1. Non-negotiable design rules

These come directly from red-teaming this concept across multiple passes. Any
implementation decision that conflicts with these rules is wrong, even if it looks
more impressive.

| Rule | Why |
|---|---|
| Blockchain anchors a periodic **root/batch hash**, never every individual event | Anchoring every event is expensive, slow, and demo-irrelevant. A judge asking "why anchor every checkpoint?" has no good answer if we do. |
| Blockchain is framed as **"additional tamper-evident timestamp witness,"** never as "verifies the booking" | Polygon cannot prove ₹ amounts are correct, only that a hash existed at a point in time. Overclaiming here is the single most attackable part of the whole pitch. |
| Booking Service and Payment Webhook must be **architecturally separate** mock services (separate modules/processes), not one function returning two numbers | If both numbers come from the same code path, "reconciliation" is theater — a judge asking "where did those two numbers come from?" will destroy it in one question. |
| Media similarity match is always labeled **"Similar media detected — additional verification required,"** never "fake" or "fraud" | Two hosts can legitimately share a professional photo (same building, same owner, multiple authorized hosts). Match ≠ fraud. |
| AI-generation detection is an **optional secondary signal**, never the centerpiece | Deepfake/AI-image detection is an active research arms race with real false-positive rates. Don't let this become the thing judges remember or attack. |
| Coverage checks are simplified to **"required categories present,"** not "property completeness" | We cannot define what "complete" means for every property type. Avoid scope creep and unfalsifiable claims. |
| Change-detection triggers are **deterministic rules** (media changed, price changed, description changed, host ID changed → reverification flag), not ML | No need for a model here. Deterministic is demoable and defensible. |
| Corrections follow **Flag → Evidence submitted → Reviewer decision → New event appended** | The original flag is never deleted, only appended to. This closes the "who resolves it and how do we trust that" gap. |
| No numeric "Trust Score," ever | A single number becomes a liability magnet ("your system said 94% safe"). Always show categorical status (Media / Price / History) instead. |
| Auth is simple demo roles (Host / Guest / Reviewer / System) | Do not build real OAuth/Aadhaar/DigiLocker. Out of scope for a hackathon prototype. |
| UI is a **minimal listing shell**: photos, price, Book Now — plus the TrustLayer panel underneath | Anything more is a rental marketplace, which is not what's being judged. |
| Pitch/demo narrative order: **Reconciliation → Evidence → Immutable history → Blockchain anchoring last** | If blockchain is what a judge remembers, we've lost the actual idea. |

## 2. The two demo stories (and nothing else)

### Story A — Similar Media Detected
1. Host uploads a listing photo that closely matches an existing listing's photo (exact hash / perceptual hash / embedding similarity)
2. TrustLayer flags it: `🟡 Similar media detected — additional verification required` (never "fake")
3. Host submits evidence (e.g., ownership doc, or "I am the authorized manager for this property")
4. Reviewer resolves the flag
5. History panel shows all 4 steps, in order, nothing deleted:
   ```
   15 Sep — Similar media detected (92% similarity, Listing #WY-0921)
   16 Sep — Host submitted evidence
   17 Sep — Reviewer decision: resolved
   ```

### Story B — Price Reconciliation Failure
1. Guest requests a quote → **Booking Service** emits `QUOTE_CREATED` event: ₹10,000
2. Guest proceeds to book → Booking Service emits `BOOKING_CREATED`: ₹10,000
3. A separate, independent **Payment Webhook service** emits `PAYMENT_CONFIRMED`: ₹12,000 (simulating a real payment gateway test-mode webhook — architecturally its own module, not reachable from the Booking Service's code)
4. Reconciliation Engine, which only ever reads from the event log (never told which source is "correct"), compares amounts across `QUOTE_CREATED → BOOKING_CREATED → PAYMENT_CONFIRMED` and raises:
   ```
   ⚠️ Transaction inconsistency detected
   QUOTE    ₹10,000
   BOOKING  ₹10,000
   PAYMENT  ₹12,000
   ```
5. Click "View Evidence" → shows each event's SHA-256 hash, the append-only chain, and a "Verify on Polygon Amoy" link showing the anchored root transaction

## 3. Architecture

```
                 ┌─────────────────────┐
                 │   WAYZYY-LIKE UI    │   (minimal shell only)
                 └──────────┬──────────┘
                            │
             ┌──────────────┴──────────────┐
             ↓                             ↓
      MEDIA EVIDENCE                 BOOKING EVENTS
             │                             │
      ┌──────┴──────┐            ┌─────────┴─────────────┐
      ↓             ↓            ↓         ↓             ↓
  exact/pHash   Embeddings   Booking    Payment       Payout
                (similarity)  Service   Webhook      (mocked,
                              (module)  (separate     optional)
                                         module)
             │                             │
      EVIDENCE ENGINE              RECONCILIATION ENGINE
      (independent signals)   (reads event log only, no direct
             │                 access to either source's internals)
             └───────────┬────────────────┘
                         ↓
                TRUSTLAYER EVENT LOG (append-only, DB table)
                         ↓
              SHA-256 HASH CHAIN (per event, chained via previous_hash)
                         ↓
              PERIODIC ROOT/BATCH HASH (e.g. every N events or every job run)
                         ↓
                 POLYGON AMOY TESTNET (root anchor only)
```

### Component responsibilities

- **Booking Service** — owns quote/booking creation. Writes `QUOTE_CREATED`, `BOOKING_CREATED` events to the event log. Has zero knowledge of the Payment Webhook module.
- **Payment Webhook Service** — simulates an external payment processor. Writes `PAYMENT_CONFIRMED` events independently. In a real integration this would be a Stripe/Razorpay test-mode webhook receiver; for the prototype it's a separate mock module with its own (possibly deliberately fuzzed) amount.
- **Evidence Engine** — receives uploaded media, computes exact hash + perceptual hash + embedding similarity against the existing media index, returns a categorical signal (not a score).
- **Reconciliation Engine** — a scheduled/triggered job that reads the event log for a given booking and cross-checks amounts across event types. Never receives "which one is correct" as input.
- **TrustLayer Event Log** — single source of truth, append-only. Every write is hashed and chained to the previous event's hash.
- **Anchoring Job** — periodically (e.g. every N new events, or every few minutes) computes a root hash over unanchored events and submits it to Polygon Amoy. Stores the tx hash against the batch.
- **Frontend** — minimal listing page + TrustLayer panel (Evidence Status display, reconciliation view, history timeline, "Verify on Polygon" link).

## 4. Tech stack

- **Frontend:** React (Vite), plain CSS or Tailwind — kept minimal
- **Backend:** FastAPI (Python) — chosen for straightforward image-hashing/embedding library support
- **Database:** SQLite for the prototype (single file, zero setup, sufficient for a hackathon demo) — schema designed so a swap to Postgres later is trivial
- **Media hashing:** `imagehash` (perceptual hash), a lightweight embedding model (e.g. CLIP via `sentence-transformers` or `open_clip`) for similarity
- **Blockchain:** Polygon Amoy testnet, `web3.py`, a funded test wallet (test MATIC from a faucet)
- **Event hashing:** Python `hashlib.sha256`, canonicalized JSON records

## 5. Project structure

```
trustlayer/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entrypoint
│   │   ├── config.py                # env/config loading
│   │   ├── db.py                    # SQLite connection/session setup
│   │   ├── models.py                # SQLAlchemy models: Listing, MediaAsset,
│   │   │                            #   EventLog, ReconciliationFlag, Dispute
│   │   ├── schemas.py                # Pydantic request/response schemas
│   │   │
│   │   ├── services/
│   │   │   ├── booking_service.py    # owns quote/booking creation + events
│   │   │   ├── payment_webhook.py    # simulated independent payment source
│   │   │   ├── evidence_engine.py    # media hashing + similarity checks
│   │   │   ├── reconciliation_engine.py  # cross-source amount comparison
│   │   │   ├── event_log.py          # append-only log + hash chaining
│   │   │   └── anchoring_job.py      # batches + anchors root hash to Polygon Amoy
│   │   │
│   │   ├── routers/
│   │   │   ├── listings.py           # CRUD-lite for demo listings
│   │   │   ├── media.py              # upload endpoint → evidence_engine
│   │   │   ├── booking.py            # quote/booking endpoints → booking_service
│   │   │   ├── payments.py           # simulated webhook receiver endpoint
│   │   │   ├── trustlayer.py         # evidence status, history, reconciliation views
│   │   │   └── disputes.py           # flag → evidence → reviewer decision flow
│   │   │
│   │   └── blockchain/
│   │       ├── amoy_client.py        # web3.py wrapper, submit/verify root hash
│   │       └── wallet.py             # test wallet loading (env-based, never commit keys)
│   │
│   ├── tests/
│   │   ├── test_evidence_engine.py
│   │   ├── test_reconciliation_engine.py
│   │   ├── test_event_log_chain.py
│   │   └── test_anchoring_job.py
│   │
│   ├── seed_data/
│   │   ├── sample_listings.json
│   │   └── sample_media/             # a few sample images incl. 1 intentional near-duplicate pair
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── ListingPage.jsx       # minimal listing shell (photos, price, Book Now)
│   │   │   ├── HostUploadPage.jsx    # host media upload flow (Story A entry point)
│   │   │   └── ReviewerPage.jsx      # reviewer resolves flagged disputes
│   │   ├── components/
│   │   │   ├── TrustLayerPanel.jsx   # Evidence Status display (Media/Price/History)
│   │   │   ├── ReconciliationView.jsx # Story B mismatch drill-down + hash chain + Polygon link
│   │   │   ├── HistoryTimeline.jsx   # append-only event timeline
│   │   │   └── MediaSimilarityAlert.jsx # "Similar media detected" component
│   │   └── api/
│   │       └── client.js             # fetch wrapper for backend calls
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── PROJECT_PLAN.md               # this file
│   ├── DEMO_SCRIPT.md                # step-by-step for Story A and Story B live demo
│   └── ARCHITECTURE_DECISIONS.md     # short log of any deviations from the plan + why
│
└── README.md                         # setup instructions, run commands
```

## 6. Build phases

### Phase 1 — Foundation
- Repo scaffolding (backend + frontend skeletons, both running "hello world")
- DB models + SQLite setup
- Event log module with hash chaining (write event → compute hash → chain to previous)
- Unit tests proving the chain breaks detectably if an event is altered after the fact

**Done when:** you can POST a fake event via a test script and see it appear correctly hashed and chained in the DB.

### Phase 2 — Evidence Engine (Story A backbone)
- Media upload endpoint
- Exact hash + perceptual hash + embedding similarity computation
- Similarity threshold logic → categorical output (not a score)
- Seed data includes one deliberately near-duplicate image pair for demo purposes

**Done when:** uploading the seeded "duplicate" image against the seeded listing set correctly returns "Similar media detected," and uploading a genuinely unique image returns "No significant concern."

### Phase 3 — Booking Service + Payment Webhook (Story B backbone)
- Booking Service module: quote creation, booking creation, writes to event log
- Payment Webhook module: **separate file/process**, simulates receiving a payment confirmation, writes to event log independently
- Confirm via code review (not just testing) that Payment Webhook has no import/reference to Booking Service's internal state — only the event log connects them

**Done when:** triggering a quote+booking, then independently triggering a payment webhook call with a different amount, produces two separate, correctly hashed events in the log with no shared state.

### Phase 4 — Reconciliation Engine
- Reads event log for a given booking_id
- Compares amounts across QUOTE_CREATED / BOOKING_CREATED / PAYMENT_CONFIRMED
- Raises a flag record when mismatched, with both values and their event hashes referenced (not recalculated/guessed)

**Done when:** running the engine against a booking with mismatched events produces a flag; running it against a consistent booking produces none.

### Phase 5 — Anchoring Job
- Wallet setup on Polygon Amoy (testnet MATIC from faucet)
- Batch unanchored events → compute root hash → submit as a transaction to Amoy
- Store the returned tx hash against the batch
- "Verify on Polygon" link in the frontend that opens the tx on a testnet block explorer

**Done when:** a real, inspectable transaction exists on Polygon Amoy containing our root hash, and the frontend can link to it.

### Phase 6 — Dispute / Correction Flow
- Flag → host submits evidence (simple text/file) → reviewer marks resolved
- All steps appended as new events, original flag never deleted/edited

**Done when:** the full Story A sequence (flag → evidence → resolution) is visible as an ordered, append-only history in the UI.

### Phase 7 — Frontend Assembly
- Listing shell page
- TrustLayer panel (categorical Evidence Status, not a score)
- Reconciliation drill-down view (Story B)
- History timeline component (Story A)
- Reviewer page for resolving disputes

**Done when:** both Story A and Story B can be demoed end-to-end by clicking through the actual UI, no manual DB edits needed mid-demo.

### Phase 8 — Demo Hardening
- Write `docs/DEMO_SCRIPT.md` — exact click-by-click steps for both stories
- Rehearse: does anything require internet during the demo besides the Polygon Amoy call? If so, have a pre-recorded fallback (screenshot/video of a successful anchor) in case of flaky wifi at the venue
- Confirm the "What TrustLayer protects against / does NOT guarantee" framing is consistent between the PPT and what the working prototype actually shows

## 7. What we are explicitly NOT building

- Real Aadhaar/DigiLocker integration (mocked/described only)
- Real payment gateway integration (Payment Webhook is simulated, not connected to real Stripe/Razorpay — though structured so it *could* be later)
- Sybil resistance / trust-graph weighting logic (mention as future work in the pitch, don't implement)
- AI-generation detection beyond an optional, clearly-labeled secondary signal
- A real listing marketplace (search, filters, multiple listings, reviews, etc.)
- Any smart contract, token, NFT, DAO, or ZK-proof component

## 8. Success criteria for the prototype

1. Story A and Story B both run end-to-end through the actual UI, not a script
2. At least one real, verifiable transaction exists on Polygon Amoy
3. Booking Service and Payment Webhook are demonstrably separate code paths
4. No numeric trust score appears anywhere in the UI
5. The correction/dispute flow shows appended history, not edited/deleted records
6. The demo can survive a mentor asking "what exactly does the blockchain prove here?" with an answer that matches Section 1 of this plan
