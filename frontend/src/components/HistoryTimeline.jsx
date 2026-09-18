import React, { useState } from 'react';

const HistoryTimeline = React.memo(function HistoryTimeline({ events }) {
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  if (!events || events.length === 0) {
    return (
      <div style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic', padding: '1rem 0' }}>
        No events recorded in append-only log yet.
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / pageSize);
  const displayedEvents = events.slice((page - 1) * pageSize, page * pageSize);

  const getActorBadge = (actor) => {
    switch (actor) {
      case 'booking_service': return { bg: '#e0f2fe', color: '#0369a1', label: 'Booking Service' };
      case 'payment_gateway_webhook': return { bg: '#fef3c7', color: '#b45309', label: 'Payment Webhook (Independent)' };
      case 'evidence_engine': return { bg: '#f3e8ff', color: '#6b21a8', label: 'Evidence Engine' };
      case 'reconciliation_engine': return { bg: '#fee2e2', color: '#b91c1c', label: 'Reconciliation Engine' };
      case 'anchoring_job': return { bg: '#ecfdf5', color: '#047857', label: 'Anchoring Job' };
      case 'host': return { bg: '#e0e7ff', color: '#4338ca', label: 'Host' };
      case 'reviewer': return { bg: '#fae8ff', color: '#86198f', label: 'Reviewer' };
      default: return { bg: '#f3f4f6', color: '#374151', label: actor || 'System' };
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}>
          Append-Only Event History ({events.length} records)
        </h4>
        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
          🔒 SHA-256 Hash Chained
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayedEvents.map((ev) => {
          const badge = getActorBadge(ev.actor);
          let parsedPayload = ev.payload;
          if (typeof ev.payload === 'string') {
            try { parsedPayload = JSON.parse(ev.payload); } catch (e) {}
          }

          return (
            <div key={ev.id || ev.event_hash} style={{
              padding: '0.875rem',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: '#111827', fontSize: '0.9rem' }}>{ev.event_type}</strong>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: badge.bg,
                    color: badge.color,
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {badge.label}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>

              {parsedPayload && (
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.775rem',
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(parsedPayload, null, 2)}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                <div><strong>Prev:</strong> {ev.previous_hash ? ev.previous_hash.slice(0, 12) + '...' : 'GENESIS'}</div>
                <div><strong>Hash:</strong> {ev.event_hash ? ev.event_hash.slice(0, 12) + '...' : ''}</div>
                {ev.batch_id && <div style={{ color: '#047857' }}><strong>Batch:</strong> {ev.batch_id}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination control (Perf Plan 1.7) */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #d1d5db', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #d1d5db', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default HistoryTimeline;
