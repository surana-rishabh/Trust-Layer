import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FeeCalculator from './components/FeeCalculator';
import CursorSpotlight from './components/CursorSpotlight';

const ListingPage = lazy(() => import('./pages/ListingPage'));
const HostUploadPage = lazy(() => import('./pages/HostUploadPage'));
const ReviewerPage = lazy(() => import('./pages/ReviewerPage'));

export default function App() {
  const [activeTab, setActiveTab] = useState('WY-0921');
  const [platformFilter, setPlatformFilter] = useState('all');

  return (
    <div style={{
      backgroundColor: '#090d16',
      minHeight: '100vh',
      color: '#f8fafc',
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* 60fps Radial Cursor Spotlight & Particle Cloud */}
      <CursorSpotlight />

      {/* Glassmorphic Cyberpunk Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
      />

      {/* Hero Section with Interactive 3D Wireframe Polygon Gem & Protocol Telemetry */}
      <HeroBanner />

      {/* Fee Savings Calculator Comparison */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <FeeCalculator />
      </div>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem' }}>
        <Suspense fallback={
          <div style={{
            padding: '4rem',
            textAlign: 'center',
            color: '#94a3b8',
            backdropFilter: 'blur(12px)',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            Loading TrustLayer workspace...
          </div>
        }>
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
