# TrustLayer — Live Hackathon Demo Script

This script walks through the exact click-by-click steps to present **Story A** and **Story B** during the live demo.

---

## 1. Setup & Pre-flight Check (30 seconds before presentation)

1. **Seed Database:**
   ```bash
   cd backend
   python seed_data/seed_db.py
   ```
2. **Start Backend Server:**
   ```bash
   python -m uvicorn app.main:app --port 8000
   ```
3. **Start Frontend Production Preview:**
   ```bash
   cd frontend
   npm run build
   npm run preview -- --port 3000
   ```
4. Open browser to `http://localhost:3000`.

---

## 2. Story A — Similar Media Detected (90 seconds)

### Narrative:
"A new host tries to create Listing #WY-1044 using photos uploaded by an existing host on Listing #WY-0921. TrustLayer catches this instantly using perceptual hashing and embedding similarity, flagging it for categorical review without falsely declaring it 'fraud'."

### Demo Steps:
1. Click tab **"Story A: Host Media Upload"**.
2. Select **Target Listing #WY-1044**.
3. Upload the sample photo `villa_goa_pool.jpg` (which matches Listing #WY-0921).
4. Click **"Upload & Run Evidence Check"**.
5. **Show the yellow TrustLayer alert:**
   ```
   🟡 Similar media detected — additional verification required
   Details: Similar media detected — matching prior Listing #WY-0921 (Perceptual similarity match)
   ```
6. **Show Host Documentation Submission (Step 3):**
   - Type in host evidence: *"I am the authorized property manager for both Listing #WY-0921 and Listing #WY-1044 under West Coast Stays LLC."*
   - Click **"Submit Host Evidence"**.
   - Show success notification: Event appended to append-only log.
7. **Show Reviewer Resolution (Step 4):**
   - Click tab **"Reviewer Dashboard"**.
   - Show open flag for `LISTING-WY-1044`.
   - Click **"✓ Resolve: Authorized Property Manager"**.
   - Show notification: Resolution appended to append-only log without altering historical records.
8. **Show History Timeline:**
   - Click tab **"Guest View (#WY-1044)"**.
   - Point out the append-only event log:
     ```
     1. MEDIA_SIMILARITY_FLAGGED (Evidence Engine)
     2. DISPUTE_EVIDENCE_SUBMITTED (Host)
     3. DISPUTE_RESOLVED (Reviewer)
     ```
   - Highlight that nothing was deleted or overwritten.

---

## 3. Story B — Price Reconciliation Failure (90 seconds)

### Narrative:
"A guest requests a quote and confirms a booking at ₹10,000. However, an independent, separate Payment Webhook fires with ₹12,000. TrustLayer's Reconciliation Engine reads the append-only log, detects the discrepancy across sources, and anchors a periodic batch root hash to Polygon Amoy testnet for tamper-evident timestamping."

### Demo Steps:
1. Click tab **"Guest View (#WY-0921)"**.
2. Click button **"⚡ Demo Story B: Reserve & Trigger Payment Mismatch"**.
3. **Show the red Reconciliation Flag:**
   ```
   ⚠️ Reconciliation Flag Raised: Transaction Inconsistency
   Status: Additional verification required
   Message: Transaction inconsistency detected across event sources (Quote: ₹10,000, Booking: ₹10,000, Payment: ₹12,000)
   ```
4. **Inspect the Checkpoints Table:**
   - `QUOTE`: ₹10,000 (SHA-256 Hash verified)
   - `BOOKING`: ₹10,000 (SHA-256 Hash verified)
   - `PAYMENT`: ₹12,000 (Highlighted in red — Mismatched event source)
5. **Anchor Batch & Verify on Polygon Amoy:**
   - Click **"Anchor Batch & Verify on Polygon"**.
   - Show returned Batch Root Hash and inspectable Polygon Amoy explorer link:
     ```
     Batch Root Hash: 7f8a9b...
     Polygon Amoy Explorer: https://amoy.polygonscan.com/tx/0x...
     ```
6. Click link to open Polygon Amoy testnet block explorer in browser to demonstrate on-chain root hash timestamp witness.

---

## 4. Judges' Q&A Quick Reference

- **Q: "Why anchor a batch root hash instead of every event on-chain?"**
  - **A:** Anchoring every event is slow, expensive, and unscalable. Anchoring a periodic Merkle batch root hash provides 100% cryptographic tamper-evidence for all events in the batch with a single lightweight transaction.
- **Q: "Does the blockchain prove the ₹ amount is correct?"**
  - **A:** No. Blockchain is strictly an additional tamper-evident timestamp witness proving the hash existed at that point in time. Amount correctness is established by our cross-source Reconciliation Engine.
- **Q: "Are Booking Service and Payment Webhook really separate?"**
  - **A:** Yes, they are decoupled modules with zero shared imports or shared memory, communicating exclusively through append-only log records.
