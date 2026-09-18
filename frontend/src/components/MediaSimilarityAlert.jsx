import React from 'react';

const MediaSimilarityAlert = React.memo(function MediaSimilarityAlert({ status, message, matchedListingId }) {
  if (status === 'No significant concern') {
    return (
      <div style={{
        padding: '0.875rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '1rem 0'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🟢</span>
        <div>
          <strong>Media Verification: No significant concern</strong>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.85, fontSize: '0.85rem' }}>{message || 'Media verified unique across database.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem 1.25rem',
      borderRadius: '8px',
      backgroundColor: '#fefce8',
      border: '1px solid #fef08a',
      color: '#854d0e',
      fontSize: '0.9rem',
      margin: '1rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
        <span style={{ fontSize: '1.2rem' }}>🟡</span>
        <span>Similar media detected — additional verification required</span>
      </div>
      <p style={{ margin: '0.5rem 0 0 2rem', fontSize: '0.85rem', color: '#a16207' }}>
        {message || `Matches existing media from Listing #${matchedListingId || 'prior listing'}.`}
      </p>
      <div style={{ margin: '0.5rem 0 0 2rem', fontSize: '0.8rem', fontStyle: 'italic', color: '#854d0e' }}>
        Note: Similar media detection indicates shared photos (e.g. authorized property managers), requiring documentation review.
      </div>
    </div>
  );
});

export default MediaSimilarityAlert;
