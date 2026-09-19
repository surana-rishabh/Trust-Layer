import React, { useState } from 'react';
import TiltCard from './TiltCard';

// Interactive Fee Calculator comparing Airbnb ~18% commission vs Wayzyy ~2% Subscription + TrustLayer Protection
export default function FeeCalculator() {
  const [annualBookings, setAnnualBookings] = useState(500000);

  const airbnbFee = Math.round(annualBookings * 0.18);
  const wayzyyFee = Math.round(annualBookings * 0.02);
  const hostSavings = airbnbFee - wayzyyFee;

  return (
    <div style={{
      marginTop: '2.5rem',
      padding: '2rem',
      borderRadius: '16px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff6b00' }}>
            Interactive Earnings Calculator
          </span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', color: '#ffffff' }}>
            Why Indian Villa Hosts Pick Wayzyy + TrustLayer
          </h3>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255, 107, 0, 0.15)', border: '1px solid rgba(255, 107, 0, 0.3)', color: '#ff6b00', fontSize: '0.85rem', fontWeight: '700' }}>
          0% Booking Tax · Flat Credit Subscription
        </div>
      </div>

      {/* Slider Input */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: '#94a3b8' }}>Annual Booking Volume:</span>
          <strong style={{ color: '#38bdf8', fontSize: '1.2rem' }}>₹{annualBookings.toLocaleString('en-IN')}</strong>
        </div>
        <input
          type="range"
          min={100000}
          max={3000000}
          step={50000}
          value={annualBookings}
          onChange={(e) => setAnnualBookings(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: '#334155',
            outline: 'none',
            cursor: 'pointer',
            accentColor: '#ff6b00'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
          <span>₹1,00,000</span>
          <span>₹15,00,000</span>
          <span>₹30,00,000</span>
        </div>
      </div>

      {/* Comparison Grid with 3D Tilt Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Legacy Airbnb Card */}
        <TiltCard maxTilt={8}>
          <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            height: '100%'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', textTransform: 'uppercase' }}>Legacy Platforms (Airbnb/Vrbo)</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f87171', margin: '0.5rem 0' }}>
              -₹{airbnbFee.toLocaleString('en-IN')}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              ~18% commission tax skimmed per booking. Scales endlessly as your villa succeeds.
            </p>
          </div>
        </TiltCard>

        {/* Wayzyy + TrustLayer Card */}
        <TiltCard maxTilt={8}>
          <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            height: '100%'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Wayzyy + TrustLayer</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#34d399', margin: '0.5rem 0' }}>
              ₹{wayzyyFee.toLocaleString('en-IN')}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              ~2% effective credit subscription fee. Includes automated media & transaction auditing.
            </p>
          </div>
        </TiltCard>

        {/* Net Host Savings */}
        <TiltCard maxTilt={8}>
          <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justify: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>Net Host Savings</span>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#38bdf8', margin: '0.25rem 0' }}>
              +₹{hostSavings.toLocaleString('en-IN')}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', fontWeight: '600' }}>
              Keep 100% of your earnings with zero hidden markups.
            </p>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
