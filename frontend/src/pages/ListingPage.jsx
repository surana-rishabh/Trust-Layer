import React, { useState, useEffect } from 'react';
import {
  getListing,
  getListingMedia,
  getEvidenceStatus,
  getBookingHistory,
  getReconciliationStatus,
  triggerStoryBBooking,
  triggerAnchoring
} from '../api/client';
import TrustLayerPanel from '../components/TrustLayerPanel';
import ReconciliationView from '../components/ReconciliationView';

export default function ListingPage({ listingId = 'WY-0921' }) {
  const [listing, setListing] = useState(null);
  const [media, setMedia] = useState([]);
  const [evidenceStatus, setEvidenceStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [reconciliation, setReconciliation] = useState(null);
  const [anchorResult, setAnchorResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);

  const loadListingData = async (bId = currentBookingId) => {
    try {
      setLoading(true);
      const lData = await getListing(listingId);
      setListing(lData);

      const mData = await getListingMedia(listingId);
      setMedia(mData);

      const eStatus = await getEvidenceStatus(listingId);
      setEvidenceStatus(eStatus);

      if (bId) {
        const hist = await getBookingHistory(bId);
        setEvents(hist);

        const rec = await getReconciliationStatus(bId);
        setReconciliation(rec);
      } else {
        const hist = await getBookingHistory(`LISTING-${listingId}`);
        setEvents(hist);
      }
    } catch (err) {
      console.error('Error loading listing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListingData();
  }, [listingId]);

  const handleTriggerStoryB = async () => {
    try {
      setBookingInProgress(true);
      const newBookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      setCurrentBookingId(newBookingId);

      // Trigger Quote ₹10,000 -> Booking ₹10,000 -> Mismatched Payment Webhook ₹12,000
      await triggerStoryBBooking(newBookingId, listingId, 10000, 12000);

      // Reload reconciliation and history
      await loadListingData(newBookingId);
    } catch (err) {
      alert('Failed to trigger Story B booking: ' + err.message);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleAnchorBatch = async () => {
    try {
      const res = await triggerAnchoring(true);
      setAnchorResult(res.result);
      if (currentBookingId) {
        await loadListingData(currentBookingId);
      }
    } catch (err) {
      alert('Failed to anchor batch: ' + err.message);
    }
  };

  if (loading && !listing) {
    return <div style={{ padding: '2rem' }}>Loading Wayzyy Listing...</div>;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Wayzyy Minimal Shell Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>WAYZYY LISTING #{listing?.id}</span>
          <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', color: '#0f172a' }}>{listing?.title}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>₹{listing?.price_per_night.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ night</span></div>
          <button
            onClick={handleTriggerStoryB}
            disabled={bookingInProgress}
            style={{
              marginTop: '0.5rem',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: bookingInProgress ? 'not-allowed' : 'pointer'
            }}
          >
            {bookingInProgress ? 'Booking in Progress...' : '⚡ Demo Story B: Reserve & Trigger Payment Mismatch'}
          </button>
        </div>
      </div>

      {/* Listing Images Gallery (Native loading="lazy" per Perf Plan 1.2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', height: '320px', marginBottom: '1.5rem' }}>
        {media.length > 0 ? (
          <img
            src={`/api/media/assets/${media[0].id}/file`}
            alt={listing?.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
          />
        ) : (
          <div style={{ backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            No listing photos uploaded
          </div>
        )}
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Property Details</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
            {listing?.description}
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#475569' }}>
            Host ID: <strong>{listing?.host_id}</strong>
          </div>
        </div>
      </div>

      {/* Story B Mismatch View if booking active */}
      {reconciliation && (
        <ReconciliationView
          reconciliationData={reconciliation}
          onAnchorBatch={handleAnchorBatch}
          anchorResult={anchorResult}
        />
      )}

      {/* TrustLayer Integrity Panel */}
      <TrustLayerPanel
        evidenceStatus={evidenceStatus}
        events={events}
        loading={loading}
      />
    </div>
  );
}
