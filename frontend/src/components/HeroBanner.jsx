import React from 'react';
import PhoenixBird3D from './PhoenixBird3D';

export default function HeroBanner({ onSelectTab }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      backgroundColor: '#070a12',
      backgroundImage: `
        radial-gradient(circle at 80% 20%, rgba(255, 107, 0, 0.25) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
        linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 10, 18, 0.95) 100%)
      `,
      border: '1px solid rgba(255, 165, 0, 0.25)',
      padding: '3rem 2.5rem',
      marginBottom: '2.5rem',
      boxShadow: '0 30px 60px -15px rgba(255, 107, 0, 0.15), 0 0 40px rgba(0, 0, 0, 0.8)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 16px',
            borderRadius: '30px',
            backgroundColor: 'rgba(255, 107, 0, 0.12)',
            border: '1px solid rgba(255, 165, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            marginBottom: '1.25rem'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff6b00', boxShadow: '0 0 12px #ff6b00' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ff9d42', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Phoenix Engine • Wayzyy Trust Protocol
            </span>
          </div>

          <h1 style={{ margin: '0 0 1.25rem 0', fontSize: '2.8rem', fontWeight: '900', lineHeight: '1.1', color: '#ffffff', letterSpacing: '-0.03em' }}>
            Rise Above Fraud. <br />
            <span style={{ background: 'linear-gradient(90deg, #ff6b00, #ffaa00, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Zero Commission. Pure Trust.
            </span>
          </h1>

          <p style={{ margin: '0 0 2rem 0', fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '600px', lineHeight: '1.65' }}>
            India’s premium direct-host booking protocol backed by real-time media verification, dual-ledger reconciliation, and high-performance 3D flight animation.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectTab && onSelectTab('WY-0921')}
              style={{
                padding: '14px 28px',
                borderRadius: '30px',
                backgroundColor: '#ff6b00',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(255, 107, 0, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              Explore Wayzyy Goa Stays 🏖️
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('host-upload')}
              style={{
                padding: '14px 28px',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)'
              }}
            >
              Host Verification Studio 📸
            </button>
          </div>
        </div>

        {/* 3D Phoenix Bird Flight Canvas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          position: 'relative'
        }}>
          <PhoenixBird3D modelUrl="/models/phoenix_bird.glb" />
          <div style={{
            marginTop: '-1rem',
            padding: '4px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.75rem',
            color: '#38bdf8',
            fontWeight: '700',
            letterSpacing: '0.05em'
          }}>
            ✦ 3D Phoenix Interactive Cursor Flight ✦
          </div>
        </div>
      </div>
    </div>
  );
}
