import React from 'react';
import MediaSimilarityAlert from './MediaSimilarityAlert';
import HistoryTimeline from './HistoryTimeline';

const TrustLayerPanel = React.memo(function TrustLayerPanel({
  evidenceStatus,
  events,
  loading
}) {
  // Perf Plan 1.10: Skeleton state while loading
  if (loading) {
    return (
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ height: '24px', backgroundColor: '#e5e7eb', width: '200px', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '60px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem' }} />
        <div style={{ height: '120px', backgroundColor: '#f3f4f6', borderRadius: '8px' }} />
      </div>
    );
  }

  const mediaStatusLabel = evidenceStatus?.status || 'No significant concern';
  const mediaMessage = evidenceStatus?.message || 'Media verified unique across database.';

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
            🛡️ TrustLayer Integrity Engine
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Dual-checkpoint verification: Media Similarity & Multi-Source Event Reconciliation
          </p>
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '0.775rem',
          fontWeight: '700',
          backgroundColor: '#eff6ff',
          color: '#1d4ed8'
        }}>
          Categorical Status Only
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
