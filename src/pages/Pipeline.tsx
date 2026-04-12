import { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import api from '../api/axios'; // Added to ensure auth works

export default function Pipeline() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // Using api.get instead of fetch to ensure baseURL and headers are handled correctly
        const response = await api.get('/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={{
      backgroundColor: '#0A0E27',
      color: '#FFFFFF',
      padding: '32px',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 4px 0',
        }}>
          My Pipeline
        </h1>
        <p style={{
          color: '#A0AEC0',
          margin: 0,
          fontSize: '13px',
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
            fontSize: '13px',
          }}
        />
        <button style={{
          padding: '10px 16px',
          backgroundColor: '#5B9FFF',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          + Add Application
        </button>
      </div>

      {/* ALWAYS SHOW KANBAN BOARD - NEVER HIDE IT */}
      <KanbanBoard 
        applications={applications} 
        loading={loading} 
        onDragEnd={() => {}} 
        onCardClick={() => {}} 
        onAddClick={() => {}} 
      />

      {/* Only show empty state BELOW kanban if no data */}
      {applications.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#A0AEC0',
        }}>
          <h2 style={{
            fontSize: '18px',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            No applications yet
          </h2>
          <p style={{
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            Add your first job application to start tracking.
          </p>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#5B9FFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            + Add First Application
          </button>
        </div>
      )}
    </div>
  );
}
