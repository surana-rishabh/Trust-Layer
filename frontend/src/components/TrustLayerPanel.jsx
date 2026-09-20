import React from 'react';
import MediaSimilarityAlert from './MediaSimilarityAlert';
import HistoryTimeline from './HistoryTimeline';

const TrustLayerPanel = React.memo(function TrustLayerPanel({
  evidenceStatus,
  events,
  loading
}) {
  if (loading) {
    return (
      <div style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #23252a',
        backgroundColor: '#0f1011'
      }}>
        <div style={{ height: '20px', backgroundColor: '#141516', width: '180px', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '60px', backgroundColor: '#141516', borderRadius: '8px' }} />
      </div>
    );
  }

  const mediaStatusLabel = evidenceStatus?.status || 'No significant concern';
  const mediaMessage = evidenceStatus?.message || 'Media verified unique across database.';

  return (
    <div style={{
      marginTop: '1.5rem',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid #23252a',
      backgroundColor: '#0f1011'
    }}>
      <div style={{ borderBottom: '1px solid #23252a', paddingBottom: '0.875rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#f7f8f8', letterSpacing: '-0.3px' }}>
            TrustLayer Verification Console
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '13px', color: '#8a8f98' }}>
            Media perceptual hashing & multi-source event reconciliation
          </p>
        </div>
        <span style={{
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: '#141516',
          border: '1px solid #23252a',
          color: '#d0d6e0'
        }}>
          Categorical Status
        </span>
      </div>

      {/* Categorical Media Status Display */}
      <MediaSimilarityAlert
        status={mediaStatusLabel}
        message={mediaMessage}
        matchedListingId={evidenceStatus?.matched_listing_id}
      />

      {/* History Timeline */}
      <HistoryTimeline events={events} />
    </div>
  );
});

export default TrustLayerPanel;
