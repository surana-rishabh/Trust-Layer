import React from 'react';

const ReconciliationView = React.memo(function ReconciliationView({ reconciliationData, onAnchorBatch, anchorResult }) {
  if (!reconciliationData) return null;

  const { status, mismatch_detected, message, checkpoints } = reconciliationData;

  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '8px',
      backgroundColor: mismatch_detected ? '#fff1f2' : '#f0fdf4',
      border: `1px solid ${mismatch_detected ? '#fecdd3' : '#bbf7d0'}`,
      margin: '1rem 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{mismatch_detected ? '⚠️' : '✅'}</span>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: mismatch_detected ? '#9f1239' : '#166534' }}>
            {mismatch_detected ? 'Reconciliation Flag Raised: Transaction Inconsistency' : 'Reconciliation Verified'}
          </h3>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.775rem',
          fontWeight: '600',
          backgroundColor: mismatch_detected ? '#ffe4e6' : '#dcfce7',
          color: mismatch_detected ? '#9f1239' : '#15803d'
        }}>
          {status}
        </span>
      </div>

      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: mismatch_detected ? '#881337' : '#166534' }}>
        {message}
      </p>

      {/* Checkpoint breakdown */}
      {checkpoints && checkpoints.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Event Source</th>
                <th style={{ padding: '8px 12px' }}>Amount</th>
                <th style={{ padding: '8px 12px' }}>SHA-256 Event Hash</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((cp, idx) => {
                const isDiscrepancy = mismatch_detected && cp.type === 'PAYMENT';
                return (
                  <tr key={idx} style={{
                    borderBottom: idx < checkpoints.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: isDiscrepancy ? '#fff1f2' : 'transparent'
                  }}>
                    <td style={{ padding: '8px 12px', fontWeight: '600' }}>{cp.type}</td>
                    <td style={{ padding: '8px 12px', fontWeight: '700', color: isDiscrepancy ? '#e11d48' : '#111827' }}>
                      {cp.amount !== null ? `₹${cp.amount.toLocaleString()}` : 'Pending'}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.775rem', color: '#6b7280' }}>
                      {cp.event_hash ? cp.event_hash.slice(0, 16) + '...' : 'N/A'}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {cp.found ? (
                        <span style={{ color: isDiscrepancy ? '#e11d48' : '#16a34a', fontWeight: '600' }}>
                          {isDiscrepancy ? 'Mismatched' : 'Verified'}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Waiting</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Blockchain Anchoring Section */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        paddingTop: '0.75rem',
        borderTop: '1px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
          <strong>Tamper-Evident Timestamp Witness:</strong> Periodic batch root hash anchored to Polygon Amoy.
        </div>

        <button
          onClick={onAnchorBatch}
          style={{
            padding: '6px 14px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Anchor Batch & Verify on Polygon
        </button>
      </div>

      {anchorResult && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontSize: '0.8rem'
        }}>
          <div><strong>Batch Root Hash:</strong> <code style={{ fontSize: '0.75rem' }}>{anchorResult.root_hash}</code></div>
          <div style={{ marginTop: '0.25rem' }}>
            <strong>Polygon Amoy Explorer: </strong>
            <a
              href={anchorResult.explorer_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }}
            >
              Verify Tx {anchorResult.tx_hash ? anchorResult.tx_hash.slice(0, 14) + '...' : ''} 🔗
            </a>
          </div>
        </div>
      )}
    </div>
  );
});

export default ReconciliationView;
