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
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#8a8f98', backgroundColor: '#0f1011', borderRadius: '12px', border: '1px solid #23252a' }}>
        Loading listing workspace...
      </div>
    );
  }

  return (
    <div style={{ color: '#f7f8f8', fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header Container */}
      <div style={{
        backgroundColor: '#0f1011',
        borderRadius: '16px',
        border: '1px solid #23252a',
        padding: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#5e6ad2', marginBottom: '0.25rem' }}>
            PROPERTY ID: {listing?.id} • VERIFIED HOST
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '28px', fontWeight: '600', letterSpacing: '-0.6px', color: '#f7f8f8' }}>
            {listing?.title}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#8a8f98' }}>
            📍 {listing?.location || 'Siolim, North Goa'} • {listing?.type || 'Luxury Villa'}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#f7f8f8', fontFamily: 'monospace' }}>
            ₹{listing?.price_per_night?.toLocaleString() || '10,000'} <span style={{ fontSize: '13px', color: '#8a8f98', fontWeight: '400' }}>/ night</span>
          </div>
          <button
            onClick={handleTriggerStoryB}
            disabled={bookingInProgress}
            style={{
              marginTop: '0.75rem',
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#5e6ad2',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: bookingInProgress ? 'not-allowed' : 'pointer'
            }}
          >
            {bookingInProgress ? 'Simulating Booking...' : 'Test Booking Flow (Story B)'}
          </button>
        </div>
      </div>

      {/* Media Gallery Grid */}
      {media && media.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {media.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#0f1011',
              borderRadius: '12px',
              border: '1px solid #23252a',
              overflow: 'hidden',
              height: '160px',
              position: 'relative'
            }}>
              <img
                src={item.file_path.startsWith('/') ? item.file_path : `/${item.file_path}`}
                alt="Listing media"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                display: 'none',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justify: 'center',
                backgroundColor: '#141516',
                color: '#8a8f98',
                fontSize: '13px'
              }}>
                📷 Media Specimen #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reconciliation Event View */}
      {reconciliation && (
        <ReconciliationView
          reconciliationData={reconciliation}
          onAnchorBatch={handleAnchorBatch}
          anchorResult={anchorResult}
        />
      )}

      {/* Trust Layer Verification Engine Panel */}
      <TrustLayerPanel
        evidenceStatus={evidenceStatus}
        events={events}
        loading={loading}
      />
    </div>
  );
}
