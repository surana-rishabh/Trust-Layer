import React from 'react';

const ReconciliationView = React.memo(function ReconciliationView({ reconciliationData, onAnchorBatch, anchorResult }) {
  if (!reconciliationData) return null;

  const { status, mismatch_detected, message, checkpoints } = reconciliationData;

  return (
    <div style={{
      padding: '1.25rem 1.5rem',
      borderRadius: '12px',
      backgroundColor: mismatch_detected ? 'rgba(239, 68, 68, 0.05)' : 'rgba(39, 166, 68, 0.05)',
      border: `1px solid ${mismatch_detected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(39, 166, 68, 0.25)'}`,
      marginBottom: '1.5rem',
      color: '#f7f8f8'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: mismatch_detected ? '#f87171' : '#4ade80' }}>
            {mismatch_detected ? 'Reconciliation Discrepancy Flagged' : 'Reconciliation Verified Clean'}
          </h3>
        </div>
        <span style={{
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: mismatch_detected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(39, 166, 68, 0.15)',
          color: mismatch_detected ? '#f87171' : '#4ade80'
        }}>
          {status}
        </span>
      </div>

      <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#8a8f98' }}>
        {message}
      </p>

      {/* Checkpoints table */}
      {checkpoints && checkpoints.length > 0 && (
        <div style={{
          backgroundColor: '#0f1011',
          borderRadius: '8px',
          border: '1px solid #23252a',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #23252a', textAlign: 'left', color: '#8a8f98' }}>
                <th style={{ padding: '8px 12px', fontWeight: '500' }}>Event Source</th>
                <th style={{ padding: '8px 12px', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '8px 12px', fontWeight: '500' }}>SHA-256 Hash</th>
                <th style={{ padding: '8px 12px', fontWeight: '500' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((cp, idx) => {
                const isDiscrepancy = mismatch_detected && cp.type === 'PAYMENT';
                return (
                  <tr key={idx} style={{
                    borderBottom: idx < checkpoints.length - 1 ? '1px solid #141516' : 'none'
                  }}>
                    <td style={{ padding: '8px 12px', fontWeight: '500', color: '#f7f8f8' }}>{cp.type}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: isDiscrepancy ? '#f87171' : '#f7f8f8' }}>
                      {cp.amount !== null ? `₹${cp.amount.toLocaleString()}` : 'Pending'}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#8a8f98' }}>
                      {cp.event_hash ? cp.event_hash.slice(0, 16) + '...' : 'N/A'}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {cp.found ? (
                        <span style={{ color: isDiscrepancy ? '#f87171' : '#27a644', fontWeight: '500' }}>
                          {isDiscrepancy ? 'Mismatched' : 'Verified'}
                        </span>
                      ) : (
                        <span style={{ color: '#62666d' }}>Waiting</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Anchoring Section */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        paddingTop: '0.75rem',
        borderTop: '1px solid #23252a'
      }}>
        <div style={{ fontSize: '12px', color: '#8a8f98' }}>
          Tamper-Evident Batch Root Hash Anchoring
        </div>

        <button
          onClick={onAnchorBatch}
          style={{
            padding: '5px 12px',
            backgroundColor: '#5e6ad2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Anchor Batch
        </button>
      </div>

      {anchorResult && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: '#0f1011',
          borderRadius: '8px',
          border: '1px solid #23252a',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Root Hash: {anchorResult.root_hash}</div>
          {anchorResult.explorer_url && (
            <div style={{ marginTop: '0.25rem' }}>
              Explorer: <a href={anchorResult.explorer_url} target="_blank" rel="noopener noreferrer" style={{ color: '#5e6ad2' }}>{anchorResult.tx_hash}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ReconciliationView;
