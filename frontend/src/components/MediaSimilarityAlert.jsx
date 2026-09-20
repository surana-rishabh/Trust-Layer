import React from 'react';

const MediaSimilarityAlert = React.memo(function MediaSimilarityAlert({ status, message, matchedListingId }) {
  if (status === 'No significant concern') {
    return (
      <div style={{
        padding: '0.875rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(39, 166, 68, 0.05)',
        border: '1px solid rgba(39, 166, 68, 0.25)',
        color: '#4ade80',
        fontSize: '13px',
        margin: '1rem 0'
      }}>
        <div style={{ fontWeight: '500' }}>Media Verification: No significant concern</div>
        <div style={{ marginTop: '0.25rem', color: '#8a8f98' }}>{message || 'Media verified unique across database.'}</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '0.875rem 1.25rem',
      borderRadius: '8px',
      backgroundColor: 'rgba(234, 179, 8, 0.05)',
      border: '1px solid rgba(234, 179, 8, 0.25)',
      color: '#facc15',
      fontSize: '13px',
      margin: '1rem 0'
    }}>
      <div style={{ fontWeight: '500' }}>Similar media detected — additional verification required</div>
      <div style={{ marginTop: '0.25rem', color: '#8a8f98' }}>
        {message || `Matches existing media from Listing #${matchedListingId || 'prior listing'}.`}
      </div>
    </div>
  );
});

export default MediaSimilarityAlert;
