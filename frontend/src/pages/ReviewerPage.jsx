import React, { useState, useEffect } from 'react';
import { getOpenFlags, resolveDispute } from '../api/client';

export default function ReviewerPage() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [notes, setNotes] = useState('');

  const loadFlags = async () => {
    try {
      setLoading(true);
      const data = await getOpenFlags();
      setFlags(data);
    } catch (err) {
      console.error('Error loading flags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleResolve = async (flagId, decision) => {
    try {
      setResolvingId(flagId);
      await resolveDispute(flagId, decision, notes || 'Verified property manager documentation.');
      alert('Dispute resolved! Resolution appended as new event to tamper-evident log.');
      await loadFlags();
    } catch (err) {
      alert('Failed to resolve dispute: ' + err.message);
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Reviewer Dashboard...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Reviewer Resolution Dashboard</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#64748b' }}>
            Story A Step 4: Inspect evidence and resolve open reconciliation flags
          </p>
        </div>
        <button
          onClick={loadFlags}
          style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          🔄 Refresh Flags
        </button>
      </div>

      {flags.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          ✓ No open reconciliation flags requiring review.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {flags.map((flag) => {
            const details = flag.details || {};
            return (
              <div key={flag.id} style={{
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#fef3c7', color: '#92400e' }}>
                      {flag.flag_type}
                    </span>
                    <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.05rem', color: '#0f172a' }}>
                      Target ID: {flag.booking_id}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Flag ID #{flag.id}
                  </span>
                </div>

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#334155',
                  marginBottom: '1rem'
                }}>
                  <div><strong>Status Label:</strong> {details.status_label || 'Additional verification required'}</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Details:</strong> {details.message || JSON.stringify(details)}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>
                    Reviewer Notes / Evidence Verification
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Verified authorization documentation from host."
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleResolve(flag.id, 'RESOLVED_AUTHORIZED_MANAGER')}
                    disabled={resolvingId === flag.id}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Resolve: Authorized Property Manager
                  </button>

                  <button
                    onClick={() => handleResolve(flag.id, 'RESOLVED_ADDITIONAL_DOCS_VERIFIED')}
                    disabled={resolvingId === flag.id}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Resolve: Additional Docs Verified
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
