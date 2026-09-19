import React from 'react';
import ThreeDTrustGem from './ThreeDTrustGem';

export default function HeroBanner({ onSelectTab }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      backgroundColor: '#090d16',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255, 107, 0, 0.12), transparent 70%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2.5rem 2rem',
      marginBottom: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '20px', backgroundColor: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255, 107, 0, 0.3)', marginBottom: '1rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff6b00', boxShadow: '0 0 10px #ff6b00' }} />
            <span style={{ fontSize: '0.775rem', fontWeight: '700', color: '#ff6b00', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Wayzyy + TrustLayer Protocol
            </span>
          </div>

          <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.15', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Cozy Stays. Honest Pricing. <br />
            <span style={{ background: 'linear-gradient(90deg, #ff6b00, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              0% Booking Tax. Verified Trust.
            </span>
          </h1>

          <p style={{ margin: '0 0 1.75rem 0', fontSize: '1rem', color: '#94a3b8', maxWidth: '640px', lineHeight: '1.6' }}>
            India’s zero-commission vacation rental marketplace connecting travelers directly with verified local hosts—protected by independent media verification and multi-source event reconciliation.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectTab('WY-0921')}
              style={{
                padding: '12px 24px',
                borderRadius: '30px',
                backgroundColor: '#ff6b00',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(255, 107, 0, 0.35)',
                transition: 'transform 0.2s ease'
              }}
            >
              Explore Wayzyy Goa Stays 🏖️
            </button>

            <button
              onClick={() => onSelectTab('host-upload')}
              style={{
                padding: '12px 24px',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              Host Media Upload Sandbox 📸
            </button>
          </div>
        </div>

        {/* Interactive 3D Canvas Gem */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <ThreeDTrustGem width={170} height={170} />
          <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '600', marginTop: '0.5rem', fontFamily: 'monospace' }}>
            Polygon Amoy 3D Node
          </span>
        </div>
      </div>
    </div>
  );
}
