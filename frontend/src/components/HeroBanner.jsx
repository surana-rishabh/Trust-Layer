import React from 'react';

export default function HeroBanner({ onSelectTab }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      backgroundColor: 'rgba(15, 16, 17, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3.5rem 3rem',
      marginBottom: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
    }}>
      {/* Background Ambient Video/Lighting simulation */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(94, 106, 210, 0.15) 0%, rgba(1, 1, 2, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Column: Headlines & High-Impact Copy */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: '#141516',
            border: '1px solid #23252a',
            marginBottom: '1.5rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5e6ad2' }} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#d0d6e0', letterSpacing: '0.4px', fontFamily: 'system-ui, sans-serif' }}>
              TrustLayer Protocol • Wayzyy Engine
            </span>
          </div>

          <h1 style={{
            margin: '0 0 1.25rem 0',
            fontSize: '48px',
            fontWeight: '600',
            lineHeight: '1.08',
            color: '#f7f8f8',
            letterSpacing: '-1.5px',
            fontFamily: "Linear Display, SF Pro Display, Inter, -apple-system, sans-serif"
          }}>
            Verification built for high-trust travel.
          </h1>

          <p style={{
            margin: '0 0 2.25rem 0',
            fontSize: '18px',
            fontWeight: '400',
            color: '#8a8f98',
            lineHeight: '1.5',
            maxWidth: '520px',
            letterSpacing: '-0.1px'
          }}>
            Eliminate double bookings, pricing manipulation, and photo spoofing with automated perceptual media matching and tamper-evident event logs.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectTab && onSelectTab('WY-0921')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#5e6ad2',
                color: '#ffffff',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#828fff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5e6ad2'}
            >
              Inspect Active Stays
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('host-upload')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#141516',
                color: '#f7f8f8',
                border: '1px solid #23252a',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#34343a'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#23252a'}
            >
              Upload Media Evidence
            </button>
          </div>
        </div>

        {/* Right Column: High-Fidelity Product Screenshot Frame (Linear style) */}
        <div style={{
          backgroundColor: '#0f1011',
          borderRadius: '16px',
          border: '1px solid #23252a',
          padding: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          {/* Header Bar mock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            paddingBottom: '0.875rem',
            borderBottom: '1px solid #23252a',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#23252a' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#23252a' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#23252a' }} />
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#8a8f98' }}>trustlayer.audit.log</span>
          </div>

          {/* Telemetry rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: '#141516',
              borderRadius: '8px',
              border: '1px solid #23252a'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#f7f8f8' }}>Media Hash Verification</div>
                <div style={{ fontSize: '11px', color: '#8a8f98', fontFamily: 'monospace' }}>pHash: e3b0c44298fc1c14</div>
              </div>
              <span style={{ fontSize: '12px', color: '#27a644', backgroundColor: 'rgba(39, 166, 68, 0.1)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '500' }}>Verified Unique</span>
            </div>

            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: '#141516',
              borderRadius: '8px',
              border: '1px solid #23252a'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#f7f8f8' }}>Payment Reconciliation</div>
                <div style={{ fontSize: '11px', color: '#8a8f98', fontFamily: 'monospace' }}>Booking Service ↔ Webhook</div>
              </div>
              <span style={{ fontSize: '12px', color: '#5e6ad2', backgroundColor: 'rgba(94, 106, 210, 0.1)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '500' }}>Matched (₹10,000)</span>
            </div>

            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: '#141516',
              borderRadius: '8px',
              border: '1px solid #23252a'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#f7f8f8' }}>Append-Only Ledger</div>
                <div style={{ fontSize: '11px', color: '#8a8f98', fontFamily: 'monospace' }}>SHA-256 Hash Chain</div>
              </div>
              <span style={{ fontSize: '12px', color: '#8a8f98', backgroundColor: '#18191a', padding: '2px 8px', borderRadius: '9999px' }}>Immutable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
