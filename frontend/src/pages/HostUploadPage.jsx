import React, { useState } from 'react';
import { uploadHostMedia, submitDisputeEvidence } from '../api/client';
import MediaSimilarityAlert from '../components/MediaSimilarityAlert';

export default function HostUploadPage() {
  const [listingId, setListingId] = useState('WY-1044');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceSubmitted, setEvidenceSubmitted] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image file to upload.');
      return;
    }
    try {
      setUploading(true);
      const res = await uploadHostMedia(listingId, file);
      setResult(res);
      setEvidenceSubmitted(false);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceText.trim()) return;
    try {
      await submitDisputeEvidence(1, evidenceText);
      setEvidenceSubmitted(true);
    } catch (err) {
      alert('Failed to submit evidence: ' + err.message);
    }
  };

  return (
    <div style={{ color: '#f7f8f8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        backgroundColor: '#0f1011',
        borderRadius: '16px',
        border: '1px solid #23252a',
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: '#f7f8f8', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.4px', margin: '0 0 0.5rem 0' }}>
          Host Media Evidence Console
        </h2>
        <p style={{ color: '#8a8f98', fontSize: '14px', margin: 0 }}>
          Upload property media to trigger automated perceptual hashing (dHash) and embedding similarity checks.
        </p>
      </div>

      <form onSubmit={handleUpload} style={{
        padding: '1.5rem',
        backgroundColor: '#0f1011',
        borderRadius: '16px',
        border: '1px solid #23252a',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#d0d6e0', marginBottom: '0.5rem' }}>
            Target Listing ID
          </label>
          <select
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #23252a',
              backgroundColor: '#141516',
              color: '#f7f8f8',
              fontSize: '14px',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <option value="WY-1044">Wayzyy #WY-1044 (Sunset Heritage Villa Anjuna)</option>
            <option value="WY-0921">Wayzyy #WY-0921 (Grand Goan Luxury Villa Siolim)</option>
            <option value="OYO-4012">OYO Rooms #OYO-4012 (OYO Flagship Suite Calangute)</option>
            <option value="MMT-7701">MakeMyTrip #MMT-7701 (MMT Select Luxury Resort Spa)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#d0d6e0', marginBottom: '0.5rem' }}>
            Property Photo File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ fontSize: '14px', color: '#8a8f98' }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#5e6ad2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Processing Evidence Engine...' : 'Run Media Verification'}
        </button>
      </form>

      {result && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#0f1011',
          borderRadius: '16px',
          border: '1px solid #23252a'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', fontWeight: '600', color: '#f7f8f8' }}>
            Evidence Engine Result
          </h3>
          <MediaSimilarityAlert
            status={result.status}
            message={result.message}
            matchedListingId={result.matched_listing_id}
          />
        </div>
      )}
    </div>
  );
}
