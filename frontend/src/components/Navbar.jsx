import React from 'react';

export default function Navbar({ activeTab, onSelectTab }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.875rem 1.75rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('WY-0921')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ff6b00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 0 15px rgba(255, 107, 0, 0.5)'
          }}>
            🛡️
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Wayzyy <span style={{ color: '#ff6b00' }}>+ TrustLayer</span>
            </span>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Zero-Commission Stays · Cryptographic Audit Engine</div>
          </div>
        </div>

        {/* Navigation Tabs & Platform Selection */}
        <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => onSelectTab('WY-0921')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'WY-0921' ? '#ff6b00' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'WY-0921' ? '#ffffff' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
          >
            Wayzyy (#WY-0921)
          </button>

          <button
            onClick={() => onSelectTab('WY-1044')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'WY-1044' ? '#ff6b00' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'WY-1044' ? '#ffffff' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
          >
            Wayzyy (#WY-1044)
          </button>

          <button
            onClick={() => onSelectTab('OYO-4012')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'OYO-4012' ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'OYO-4012' ? '#ffffff' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
          >
            OYO Rooms (#OYO-4012)
          </button>

          <button
            onClick={() => onSelectTab('MMT-7701')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'MMT-7701' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'MMT-7701' ? '#ffffff' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
          >
            MakeMyTrip (#MMT-7701)
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />

          <button
            onClick={() => onSelectTab('host-upload')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'host-upload' ? '#0f766e' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'host-upload' ? '#ffffff' : '#cbd5e1'
            }}
          >
            Story A: Media Upload
          </button>

          <button
            onClick={() => onSelectTab('reviewer')}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'reviewer' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'reviewer' ? '#ffffff' : '#cbd5e1'
            }}
          >
            Reviewer Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}
