import React, { useState, useEffect } from 'react';
import api from '../api/axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  preFilledData?: { company: string; title: string; url: string } | null;
  onSubmit?: () => void;
}

export default function AddApplicationModalWithPreFill({
  isOpen,
  onClose,
  preFilledData,
  onSubmit,
}: ModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    status: 'SAVED',
    appliedAt: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pre-fill data when modal opens
  useEffect(() => {
    if (isOpen && preFilledData) {
      setFormData({
        companyName: preFilledData.company || '',
        jobTitle: preFilledData.title || '',
        jobUrl: preFilledData.url || '',
        status: 'SAVED',
        appliedAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, preFilledData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.jobTitle.trim()) {
      setError('Job title is required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/applications', {
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        jobUrl: formData.jobUrl || null,
        status: formData.status,
        appliedAt: formData.appliedAt,
      });

      setSuccess(true);

      if (onSubmit) {
        onSubmit();
      }

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0F1419',
          border: '1px solid #1E293B',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#FFFFFF',
        }}>
          Track Job Application
        </h2>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#FF4757',
            color: '#FFFFFF',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: '#00D084',
            color: '#FFFFFF',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            ✓ Job added to pipeline!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g., Google"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0A0E27',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Job Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              placeholder="e.g., Software Engineer"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0A0E27',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Job URL */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Job URL
            </label>
            <input
              type="url"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0A0E27',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0A0E27',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="OA/ASSESSMENT">OA/Assessment</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="GHOSTED">Ghosted</option>
            </select>
          </div>

          {/* Applied Date */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Applied Date
            </label>
            <input
              type="date"
              value={formData.appliedAt}
              onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0A0E27',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading || success}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#5B9FFF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading || success ? 0.6 : 1,
              }}
            >
              {loading ? 'Adding...' : success ? '✓ Added' : 'Track Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#5B9FFF',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
