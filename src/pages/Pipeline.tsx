import { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import AddApplicationModal from '../components/AddApplicationModal';
import api from '../api/axios';
import { toast } from '../components/Toast';

export default function Pipeline() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState('SAVED');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = async (formData: any) => {
    try {
      // Map frontend fields (jobRole, jobLink) to backend fields (jobTitle, jobUrl)
      const backendData = {
        companyName: formData.companyName,
        jobTitle: formData.jobRole,
        jobUrl: formData.jobLink,
        status: formData.status,
        appliedDate: formData.appliedDate
      };

      const response = await api.post('/applications', backendData);
      if (response.data) {
        setApplications([...applications, response.data]);
        setIsModalOpen(false);
        toast.success("✅ Application added successfully!");
      }
    } catch (error) {
      console.error('Failed to add application:', error);
      toast.error("❌ Failed to add application.");
    }
  };

  const openModal = (status = 'SAVED') => {
    setInitialStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div style={{
      backgroundColor: '#0A0E27',
      color: '#FFFFFF',
      padding: '32px',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
          }}>
            My Pipeline
          </h1>
          <p style={{
            color: '#A0AEC0',
            margin: 0,
            fontSize: '14px',
          }}>
            Your job hunt, organized
          </p>
        </div>
        <button
          onClick={() => openModal()}
          style={{
            padding: '12px 20px',
            backgroundColor: '#5B9FFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 10px 15px -3px rgba(91, 159, 255, 0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          + Add Application
        </button>
      </div>

      {/* Top Bar (Search + Filter placeholder) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search applications..."
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: '#0F1419',
              border: '1px solid #1E293B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard 
        applications={applications} 
        loading={loading} 
        onAddClick={(status) => openModal(status)}
        onCardClick={(app) => console.log('Card clicked:', app)}
      />

      {/* Empty State Overlay (only if absolutely empty) */}
      {applications.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: '#0F1419',
          border: '1px dashed #1E293B',
          borderRadius: '16px',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏁</div>
          <h2 style={{
            fontSize: '20px',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            No applications yet
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#A0AEC0',
            marginBottom: '24px',
            maxWidth: '300px',
            margin: '0 auto 24px'
          }}>
            Your future starts here. Add your first job application to start tracking.
          </p>
          <button
            onClick={() => openModal()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#5B9FFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            + Add First Application
          </button>
        </div>
      )}

      {/* Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddApplication}
        initialStatus={initialStatus}
      />
    </div>
  );
}
