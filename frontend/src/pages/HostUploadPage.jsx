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
      // Find open flag or use default flag ID
      await submitDisputeEvidence(1, evidenceText);
      setEvidenceSubmitted(true);
    } catch (err) {
      alert('Failed to submit evidence: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Host Media Upload Flow (Story A Entry Point)</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Upload listing photos to run real-time Evidence Engine exact hash, pHash & embedding similarity check.
      </p>

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={{
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
            Target Listing ID
          </label>
          <select
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', width: '100%', maxWidth: '350px' }}
          >
            <option value="WY-1044">Wayzyy #WY-1044 (Sunset Heritage Villa Anjuna)</option>
            <option value="WY-0921">Wayzyy #WY-0921 (Grand Goan Luxury Villa Siolim)</option>
            <option value="OYO-4012">OYO Rooms #OYO-4012 (OYO Flagship Suite Calangute)</option>
            <option value="OYO-8921">OYO Rooms #OYO-8921 (OYO Townhouse Executive Stay)</option>
            <option value="MMT-7701">MakeMyTrip #MMT-7701 (MMT Select Luxury Resort Spa)</option>
            <option value="MMT-9920">MakeMyTrip #MMT-9920 (Taj Exotica Resort & Spa)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
            Select Listing Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ fontSize: '0.9rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0f766e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Processing Image & Calculating Hashes...' : 'Upload & Run Evidence Check'}
        </button>
      </form>

      {/* Upload & Evidence Results */}
      {result && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
            Evidence Engine Analysis Result
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
            <div><strong>SHA-256 Exact Hash:</strong> <code style={{ fontSize: '0.75rem' }}>{result.exact_hash}</code></div>
            <div><strong>Perceptual Hash (dHash):</strong> <code style={{ fontSize: '0.75rem' }}>{result.phash}</code></div>
          </div>

          <MediaSimilarityAlert
            status={result.evidence_status.status}
            message={result.evidence_status.message}
            matchedListingId={result.evidence_status.matched_listing_id}
          />

          {/* Story A Step 3: Host Evidence Submission Form if Flagged */}
          {result.evidence_status.flagged && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
              backgroundColor: '#fefce8',
              borderRadius: '8px',
              border: '1px solid #fef08a'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontSize: '0.95rem' }}>
                Story A Step 3: Submit Host Documentation
              </h4>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#a16207' }}>
                If you are an authorized manager or co-owner of this photo, submit your evidence rationale below.
              </p>

              {evidenceSubmitted ? (
                <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  ✓ Evidence submitted successfully! Appended to tamper-evident history. Reviewer will inspect on Reviewer Page.
                </div>
              ) : (
                <form onSubmit={handleSubmitEvidence}>
                  <textarea
                    rows={3}
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    placeholder="e.g. I am the authorized property manager for both Listing #WY-0921 and Listing #WY-1044 under West Coast Stays LLC."
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '0.85rem', marginBottom: '0.75rem' }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#854d0e',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Host Evidence
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
