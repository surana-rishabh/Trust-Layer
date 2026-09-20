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
      alert('Dispute resolved! Resolution appended to ledger.');
      await loadFlags();
    } catch (err) {
      alert('Failed to resolve dispute: ' + err.message);
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#8a8f98', backgroundColor: '#0f1011', borderRadius: '12px', border: '1px solid #23252a' }}>
        Loading reviewer console...
      </div>
    );
  }

  return (
    <div style={{ color: '#f7f8f8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        backgroundColor: '#0f1011',
        borderRadius: '16px',
        border: '1px solid #23252a',
        padding: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.4px', color: '#f7f8f8' }}>
            Reviewer Resolution Console
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#8a8f98' }}>
            Inspect flagged evidence and commit authoritative audit decisions.
          </p>
        </div>
        <button
          onClick={loadFlags}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: '6px',
            border: '1px solid #23252a',
            backgroundColor: '#141516',
            color: '#d0d6e0',
            cursor: 'pointer'
          }}
        >
          Refresh Flags
        </button>
      </div>

      {flags.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#0f1011', borderRadius: '16px', border: '1px solid #23252a', color: '#8a8f98' }}>
          ✓ No open reconciliation flags requiring review.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {flags.map((flag) => {
            const details = flag.details || {};
            return (
              <div key={flag.id} style={{
                padding: '1.5rem',
                backgroundColor: '#0f1011',
                borderRadius: '16px',
                border: '1px solid #23252a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}>
                      {flag.flag_type}
                    </span>
                    <h3 style={{ margin: '0.5rem 0 0', fontSize: '18px', fontWeight: '600', color: '#f7f8f8' }}>
                      Target: {flag.booking_id}
                    </h3>
                  </div>
                  <span style={{ fontSize: '12px', color: '#8a8f98', fontFamily: 'monospace' }}>
                    FLAG #{flag.id}
                  </span>
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: '#141516',
                  borderRadius: '8px',
                  border: '1px solid #23252a',
                  fontSize: '13px',
                  color: '#d0d6e0',
                  marginBottom: '1rem'
                }}>
                  <div><strong>Status:</strong> {details.status_label || 'Additional verification required'}</div>
                  <div style={{ marginTop: '0.4rem', color: '#8a8f98' }}>{details.message || JSON.stringify(details)}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleResolve(flag.id, 'APPROVED')}
                    disabled={resolvingId === flag.id}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#27a644',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Approve Listing
                  </button>

                  <button
                    onClick={() => handleResolve(flag.id, 'REJECTED')}
                    disabled={resolvingId === flag.id}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#141516',
                      color: '#f87171',
                      border: '1px solid #23252a',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Reject Listing
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
