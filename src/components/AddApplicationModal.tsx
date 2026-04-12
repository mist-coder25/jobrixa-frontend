import React, { useState } from 'react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialStatus?: string;
  prefill?: any;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  initialStatus = 'SAVED',
  prefill = {},
}: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    companyName: prefill.companyName || '',
    jobRole: prefill.jobTitle || prefill.jobRole || '',
    jobLink: prefill.jobUrl || prefill.jobLink || '',
    status: initialStatus,
    appliedDate: new Date().toISOString().split('T')[0],
  });

  // Update form if prefill changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        companyName: prefill.companyName || '',
        jobRole: prefill.jobTitle || prefill.jobRole || '',
        jobLink: prefill.jobUrl || prefill.jobLink || '',
        status: initialStatus,
        appliedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, prefill, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
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
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
          }}
        >
          Add Job Application
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
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
              required
            />
          </div>

          {/* Job Role */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Job Role
            </label>
            <input
              type="text"
              value={formData.jobRole}
              onChange={(e) =>
                setFormData({ ...formData, jobRole: e.target.value })
              }
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

          {/* Job Link */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Job Link
            </label>
            <input
              type="url"
              value={formData.jobLink}
              onChange={(e) =>
                setFormData({ ...formData, jobLink: e.target.value })
              }
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
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
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
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Applied Date
            </label>
            <input
              type="date"
              value={formData.appliedDate}
              onChange={(e) =>
                setFormData({ ...formData, appliedDate: e.target.value })
              }
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
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#5B9FFF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Add Application
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#5B9FFF',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                cursor: 'pointer',
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
