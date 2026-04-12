import { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import AddApplicationModal from '../components/AddApplicationModal';
import api from '../api/axios';

export default function Pipeline() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddApplication = (newApp: any) => {
    setApplications((prev) => [...prev, newApp]);
  };

  return (
    <div style={{
      backgroundColor: '#0A0E27',
      color: '#FFFFFF',
      padding: '32px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
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

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search..."
          style={{
            flex: 1,
            padding: '10px 14px',
            backgroundColor: '#1a1f35',
            border: '1px solid #2d3748',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '14px',
          }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#5B9FFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          + Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard 
        applications={applications} 
        loading={loading} 
        onAddClick={() => setIsModalOpen(true)}
        onCardClick={(app) => console.log('Card clicked:', app)}
      />

      {/* Empty State */}
      {applications.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#A0AEC0',
        }}>
          <h2 style={{
            fontSize: '20px',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            No applications yet
          </h2>
          <p style={{
            fontSize: '14px',
            marginBottom: '16px',
          }}>
            Add your first job application to start tracking.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
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
      />
    </div>
  );
}
