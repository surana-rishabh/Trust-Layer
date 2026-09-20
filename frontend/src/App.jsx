import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FeeCalculator from './components/FeeCalculator';
import InteractiveGridBackground from './components/InteractiveGridBackground';
import DemoGuideBanner from './components/DemoGuideBanner';

const ListingPage = lazy(() => import('./pages/ListingPage'));
const HostUploadPage = lazy(() => import('./pages/HostUploadPage'));
const ReviewerPage = lazy(() => import('./pages/ReviewerPage'));

export default function App() {
  const [activeTab, setActiveTab] = useState('WY-0921');

  return (
    <div style={{
      backgroundColor: '#010102',
      minHeight: '100vh',
      color: '#f7f8f8',
      fontFamily: "Linear Text, SF Pro Text, Inter, -apple-system, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      position: 'relative'
    }}>
      {/* 60fps Interactive Grid Canvas Component in full background */}
      <InteractiveGridBackground />

      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero & Workspace Container */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <HeroBanner onSelectTab={setActiveTab} />

        {/* Dedicated Judge Walkthrough & Proof of Concept Step Guide */}
        <DemoGuideBanner activeStep={activeTab} setStep={setActiveTab} />

        {/* Commission Arbitrage Fee Comparison Calculator */}
        <FeeCalculator />

        {/* Main Workspace Area */}
        <main style={{ paddingBottom: '5rem' }}>
          <Suspense fallback={
            <div style={{
              padding: '4rem',
              textAlign: 'center',
              color: '#8a8f98',
              backgroundColor: '#0f1011',
              borderRadius: '16px',
              border: '1px solid #23252a'
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
    </div>
  );
}
