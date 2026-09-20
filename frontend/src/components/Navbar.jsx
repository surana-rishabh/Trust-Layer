import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#010102',
      borderBottom: '1px solid #23252a',
      padding: '0 2rem',
      height: '56px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Mark */}
        <div
          onClick={() => setActiveTab('WY-0921')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <img
            src="/logo.png"
            alt="TrustLayer Logo"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              objectFit: 'contain'
            }}
          />
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#f7f8f8', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif' }}>
            TrustLayer <span style={{ color: '#8a8f98', fontWeight: '400' }}>for Wayzyy</span>
          </span>
        </div>

        {/* Linear Style Tab Switcher */}
        <nav style={{ display: 'flex', gap: '4px', backgroundColor: '#0f1011', padding: '3px', borderRadius: '8px', border: '1px solid #23252a' }}>
          <button
            onClick={() => setActiveTab('WY-0921')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === 'WY-0921' ? '#141516' : 'transparent',
              color: activeTab === 'WY-0921' ? '#f7f8f8' : '#8a8f98',
              transition: 'all 0.15s ease'
            }}
          >
            Wayzyy #WY-0921
          </button>

          <button
            onClick={() => setActiveTab('WY-1044')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === 'WY-1044' ? '#141516' : 'transparent',
              color: activeTab === 'WY-1044' ? '#f7f8f8' : '#8a8f98',
              transition: 'all 0.15s ease'
            }}
          >
            Wayzyy #WY-1044
          </button>

          <button
            onClick={() => setActiveTab('OYO-4012')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === 'OYO-4012' ? '#141516' : 'transparent',
              color: activeTab === 'OYO-4012' ? '#f7f8f8' : '#8a8f98',
              transition: 'all 0.15s ease'
            }}
          >
            OYO #OYO-4012
          </button>

          <button
            onClick={() => setActiveTab('MMT-7701')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === 'MMT-7701' ? '#141516' : 'transparent',
              color: activeTab === 'MMT-7701' ? '#f7f8f8' : '#8a8f98',
              transition: 'all 0.15s ease'
            }}
          >
            MMT #MMT-7701
          </button>
        </nav>

        {/* Secondary Action Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('host-upload')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: activeTab === 'host-upload' ? '#141516' : 'transparent',
              color: activeTab === 'host-upload' ? '#f7f8f8' : '#8a8f98',
              border: '1px solid #23252a',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Host Upload
          </button>

          <button
            onClick={() => setActiveTab('reviewer')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: activeTab === 'reviewer' ? '#5e6ad2' : '#141516',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Reviewer Console
          </button>
        </div>
      </div>
    </header>
  );
}
