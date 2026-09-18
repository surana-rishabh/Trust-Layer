import React, { useState, Suspense, lazy } from 'react';

// Perf Plan 1.3: Code splitting using React.lazy + Suspense for route chunks
const ListingPage = lazy(() => import('./pages/ListingPage'));
const HostUploadPage = lazy(() => import('./pages/HostUploadPage'));
const ReviewerPage = lazy(() => import('./pages/ReviewerPage'));

export default function App() {
  const [activeTab, setActiveTab] = useState('WY-0921');
  const [selectedCategory, setSelectedCategory] = useState('wayzyy');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      {/* Top Navbar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <div>
              <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>TrustLayer <span style={{ color: '#2563eb' }}>Multi-Platform Demo</span></strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Independent Verification Engine for Wayzyy, OYO Rooms & MakeMyTrip</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {/* Wayzyy */}
            <button
              onClick={() => setActiveTab('WY-0921')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'WY-0921' ? '#2563eb' : '#f1f5f9',
                color: activeTab === 'WY-0921' ? '#ffffff' : '#475569'
              }}
            >
              Wayzyy (#WY-0921)
            </button>

            <button
              onClick={() => setActiveTab('WY-1044')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'WY-1044' ? '#2563eb' : '#f1f5f9',
                color: activeTab === 'WY-1044' ? '#ffffff' : '#475569'
              }}
            >
              Wayzyy (#WY-1044)
            </button>

            {/* OYO Rooms */}
            <button
              onClick={() => setActiveTab('OYO-4012')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'OYO-4012' ? '#dc2626' : '#f1f5f9',
                color: activeTab === 'OYO-4012' ? '#ffffff' : '#475569'
              }}
            >
              OYO Rooms (#OYO-4012)
            </button>

            {/* MakeMyTrip */}
            <button
              onClick={() => setActiveTab('MMT-7701')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'MMT-7701' ? '#059669' : '#f1f5f9',
                color: activeTab === 'MMT-7701' ? '#ffffff' : '#475569'
              }}
            >
              MakeMyTrip (#MMT-7701)
            </button>

            {/* Actions */}
            <button
              onClick={() => setActiveTab('host-upload')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'host-upload' ? '#0f766e' : '#f1f5f9',
                color: activeTab === 'host-upload' ? '#ffffff' : '#475569'
              }}
            >
              Story A: Media Upload
            </button>

            <button
              onClick={() => setActiveTab('reviewer')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'reviewer' ? '#7c3aed' : '#f1f5f9',
                color: activeTab === 'reviewer' ? '#ffffff' : '#475569'
              }}
            >
              Reviewer Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area with React.Suspense fallback */}
      <main style={{ paddingBottom: '3rem' }}>
        <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading chunk...</div>}>
          {activeTab === 'host-upload' && <HostUploadPage />}
          {activeTab === 'reviewer' && <ReviewerPage />}
          {activeTab !== 'host-upload' && activeTab !== 'reviewer' && (
            <ListingPage listingId={activeTab} />
          )}
        </Suspense>
      </main>
    </div>
  );
}
