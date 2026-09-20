import React from 'react';

export default function DemoGuideBanner({ activeStep, setStep }) {
  const steps = [
    {
      id: 'WY-0921',
      num: '1',
      title: 'Listing Integrity & Media Verification',
      desc: 'Inspect authentic stay photos verified unique via SHA-256 & perceptual dHash (no fake scores).'
    },
    {
      id: 'story-b',
      num: '2',
      title: 'Anti-Fraud Event Reconciliation',
      desc: 'Test real-time price mismatch detection between independent booking quote & payment webhook.'
    },
    {
      id: 'host-upload',
      num: '3',
      title: 'Host Media Evidence Upload',
      desc: 'Upload property photos to trigger instant similarity analysis against prior listings.'
    },
    {
      id: 'reviewer',
      num: '4',
      title: 'Reviewer Console Resolution',
      desc: 'Inspect flagged discrepancies & commit tamper-evident resolution events to the ledger.'
    }
  ];

  return (
    <div style={{
      backgroundColor: 'rgba(15, 16, 17, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.5rem 2rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#5e6ad2', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Interactive Judge Walkthrough
          </span>
          <h2 style={{ margin: '0.2rem 0 0', fontSize: '18px', fontWeight: '600', color: '#f7f8f8', letterSpacing: '-0.3px' }}>
            TrustLayer Protocol Proof-of-Concept
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: '#27a644', backgroundColor: 'rgba(39, 166, 68, 0.1)', padding: '3px 10px', borderRadius: '9999px', fontWeight: '500' }}>
          ✓ Verified Live System
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {steps.map((s) => {
          const isActive = activeStep === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setStep(s.id === 'story-b' ? 'WY-0921' : s.id)}
              style={{
                backgroundColor: isActive ? '#141516' : '#0f1011',
                borderRadius: '12px',
                border: `1px solid ${isActive ? '#5e6ad2' : '#23252a'}`,
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#5e6ad2' : '#23252a',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {s.num}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: isActive ? '#f7f8f8' : '#d0d6e0' }}>
                  {s.title}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#8a8f98', lineHeight: '1.4' }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
