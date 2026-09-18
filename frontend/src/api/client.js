const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch('/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function getListings() {
  const res = await fetch(`${BASE_URL}/listings/`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function getListing(id) {
  const res = await fetch(`${BASE_URL}/listings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
}

export async function getListingMedia(listingId) {
  const res = await fetch(`${BASE_URL}/media/listings/${listingId}`);
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function uploadHostMedia(listingId, file) {
  const formData = new FormData();
  formData.append('listing_id', listingId);
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Media upload failed');
  return res.json();
}

export async function triggerStoryBBooking(bookingId, listingId, quoteAmount, paymentAmount) {
  // 1. Issue quote
  await fetch(`${BASE_URL}/bookings/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking_id: bookingId, listing_id: listingId, amount: quoteAmount })
  });

  // 2. Confirm booking
  await fetch(`${BASE_URL}/bookings/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking_id: bookingId, listing_id: listingId, amount: quoteAmount })
  });

  // 3. Payment Webhook fires independently (simulating mismatch if paymentAmount != quoteAmount)
  await fetch(`${BASE_URL}/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      booking_id: bookingId,
      listing_id: listingId,
      amount_paid: paymentAmount,
      gateway_txn_id: `GATEWAY-TXN-${Date.now().toString().slice(-6)}`
    })
  });
}

export async function getReconciliationStatus(bookingId) {
  const res = await fetch(`${BASE_URL}/trustlayer/reconciliation/${bookingId}`);
  if (!res.ok) throw new Error('Failed to fetch reconciliation status');
  return res.json();
}

export async function getBookingHistory(bookingId) {
  const res = await fetch(`${BASE_URL}/trustlayer/history/${bookingId}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function getEvidenceStatus(listingId) {
  const res = await fetch(`${BASE_URL}/trustlayer/evidence/${listingId}`);
  if (!res.ok) throw new Error('Failed to fetch evidence status');
  return res.json();
}

export async function getOpenFlags() {
  const res = await fetch(`${BASE_URL}/trustlayer/flags`);
  if (!res.ok) throw new Error('Failed to fetch flags');
  return res.json();
}

export async function submitDisputeEvidence(flagId, evidenceText) {
  const res = await fetch(`${BASE_URL}/disputes/${flagId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host_evidence: evidenceText })
  });
  if (!res.ok) throw new Error('Failed to submit evidence');
  return res.json();
}

export async function resolveDispute(flagId, decision, notes = '') {
  const res = await fetch(`${BASE_URL}/disputes/${flagId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewer_decision: decision, reviewer_notes: notes })
  });
  if (!res.ok) throw new Error('Failed to resolve dispute');
  return res.json();
}

export async function triggerAnchoring(sync = true) {
  const res = await fetch(`${BASE_URL}/anchoring/trigger?sync=${sync}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger anchoring job');
  return res.json();
}

export async function verifyChainIntegrity() {
  const res = await fetch(`${BASE_URL}/events/integrity`);
  if (!res.ok) throw new Error('Failed to verify chain integrity');
  return res.json();
}
