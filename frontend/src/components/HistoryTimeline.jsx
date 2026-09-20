import React, { useState } from 'react';

const HistoryTimeline = React.memo(function HistoryTimeline({ events }) {
  const [pageSize] = useState(5);
  const [page, setPage] = useState(1);

  if (!events || events.length === 0) {
    return (
      <div style={{ color: '#8a8f98', fontSize: '13px', fontStyle: 'italic', padding: '1rem 0' }}>
        No events recorded in append-only log yet.
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / pageSize);
  const displayedEvents = events.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#d0d6e0' }}>
          Append-Only Event Ledger ({events.length} records)
        </h4>
        <span style={{ fontSize: '12px', color: '#8a8f98', fontFamily: 'monospace' }}>
          SHA-256 Hash Chained
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {displayedEvents.map((ev) => {
          let parsedPayload = ev.payload;
          if (typeof ev.payload === 'string') {
            try { parsedPayload = JSON.parse(ev.payload); } catch (e) {}
          }

          return (
            <div key={ev.id || ev.event_hash} style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#141516',
              border: '1px solid #23252a',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: '#f7f8f8', fontWeight: '500' }}>{ev.event_type}</strong>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#18191a',
                    border: '1px solid #23252a',
                    color: '#8a8f98',
                    fontSize: '11px'
                  }}>
                    {ev.actor}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#62666d', fontFamily: 'monospace' }}>
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>

              {parsedPayload && (
                <div style={{
                  backgroundColor: '#0f1011',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#8a8f98',
                  marginBottom: '0.4rem',
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(parsedPayload, null, 2)}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', fontSize: '11px', color: '#62666d', fontFamily: 'monospace' }}>
                <div>Prev: {ev.previous_hash ? ev.previous_hash.slice(0, 12) + '...' : 'GENESIS'}</div>
                <div>Hash: {ev.event_hash ? ev.event_hash.slice(0, 12) + '...' : ''}</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: '3px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #23252a', backgroundColor: '#141516', color: '#d0d6e0', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Prev
          </button>
          <span style={{ fontSize: '12px', color: '#8a8f98' }}>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '3px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #23252a', backgroundColor: '#141516', color: '#d0d6e0', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default HistoryTimeline;
