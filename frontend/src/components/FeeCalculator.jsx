import React, { useState } from 'react';

export default function FeeCalculator() {
  const [nightlyRate, setNightlyRate] = useState(6500);
  const [nights, setNights] = useState(3);

  const totalBooking = nightlyRate * nights;
  const legacyCommission = Math.round(totalBooking * 0.18); // ~18% OTA commission tax
  const wayzyyFee = Math.round(totalBooking * 0.02); // ~2% Trust subscription
  const hostSavings = legacyCommission - wayzyyFee;

  return (
    <div style={{
      backgroundColor: 'rgba(15, 16, 17, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2rem 2.5rem',
      marginBottom: '2rem',
      color: '#f7f8f8'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#5e6ad2', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Commission Arbitrage Engine
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', letterSpacing: '-0.4px', color: '#f7f8f8' }}>
            Direct-Host Fee Comparison Calculator
          </h2>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: '9999px', backgroundColor: '#141516', border: '1px solid #23252a', fontSize: '13px', color: '#8a8f98' }}>
          Wayzyy Zero-Tax Architecture
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
        {/* Interactive Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '14px', color: '#d0d6e0' }}>
              <span>Nightly Stay Rate</span>
              <strong style={{ color: '#f7f8f8', fontFamily: 'monospace' }}>₹{nightlyRate.toLocaleString()} / night</strong>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={nightlyRate}
              onChange={(e) => setNightlyRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#5e6ad2', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '14px', color: '#d0d6e0' }}>
              <span>Duration of Stay</span>
              <strong style={{ color: '#f7f8f8', fontFamily: 'monospace' }}>{nights} Nights</strong>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#5e6ad2', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Calculation Summary Panels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          backgroundColor: '#141516',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #23252a'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#8a8f98', marginBottom: '0.25rem' }}>Traditional OTA (~18%)</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#62666d', textDecoration: 'line-through' }}>
              ₹{legacyCommission.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#8a8f98', marginBottom: '0.25rem' }}>Wayzyy Direct (~2%)</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#27a644' }}>
              ₹{wayzyyFee.toLocaleString()}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', paddingTop: '0.75rem', borderTop: '1px solid #23252a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#d0d6e0' }}>Direct Traveler Savings</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#5e6ad2', fontFamily: 'monospace' }}>
              +₹{hostSavings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
