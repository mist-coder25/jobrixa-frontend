import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface KanbanBoardProps {
  applications: any[];
  loading?: boolean;
  onDragEnd?: (result: any) => void;
  onCardClick?: (app: any) => void;
  onAddClick?: (status: string) => void;
}

const COLUMN_CONFIG = {
  SAVED: {
    emoji: '🔖',
    title: 'SAVED',
    description: "Jobs you're eyeing",
    placeholder: 'SAVED IS EMPTY',
    placeholderText: 'Paste a URL to quick add',
  },
  APPLIED: {
    emoji: '📋',
    title: 'APPLIED',
    description: 'Applied jobs show here',
    placeholder: 'APPLIED IS EMPTY',
    placeholderText: 'Track every application you send',
  },
  'OA/ASSESSMENT': {
    emoji: '💻',
    title: 'OA/ASSESSMENT',
    description: 'Got an OA? Add it here',
    placeholder: 'OA/ASSESSMENT IS EMPTY',
    placeholderText: 'Online assessments & coding rounds',
  },
  INTERVIEW: {
    emoji: '🎤',
    title: 'INTERVIEW',
    description: 'Interview stage',
    placeholder: 'INTERVIEW IS EMPTY',
    placeholderText: "You're close — prep hard!",
  },
  OFFER: {
    emoji: '🎉',
    title: 'OFFER',
    description: 'Offers land here',
    placeholder: 'OFFER IS EMPTY',
    placeholderText: 'This is what we are working toward',
  },
  REJECTED: {
    emoji: '👎',
    title: 'REJECTED',
    description: 'Every no is closer to yes',
    placeholder: 'REJECTED IS EMPTY',
    placeholderText: 'Track rejections to spot patterns',
  },
  GHOSTED: {
    emoji: '👻',
    title: 'GHOSTED',
    description: 'Ghosted companies appear here',
    placeholder: 'GHOSTED IS EMPTY',
    placeholderText: 'No response after 14 days = ghosted',
  },
};

const columns = Object.keys(COLUMN_CONFIG);

export default function KanbanBoard({ applications, loading, onCardClick, onAddClick }: KanbanBoardProps) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#0A0E27',
      }}>
        {columns.map(col => (
          <div key={col} style={{ backgroundColor: '#0F1419', borderRadius: '12px', padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Skeleton height={32} baseColor="#1a1f35" highlightColor="#2d3748" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton height={100} count={3} baseColor="#1a1f35" highlightColor="#2d3748" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    }}>
      {columns.map(colName => {
        const config = COLUMN_CONFIG[colName as keyof typeof COLUMN_CONFIG];
        const colApplications = applications.filter(app => app.status === colName) || [];

        return (
          <div
            key={colName}
            style={{
              backgroundColor: '#0F1419',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '16px',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Column Header */}
            <div style={{
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #1E293B',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}>
                <span style={{ fontSize: '24px' }}>{config.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 2px 0',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: '#A0AEC0',
                  }}>
                    {config.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#718096',
                  }}>
                    {colApplications.length || 0} applications
                  </p>
                </div>
                <button 
                  onClick={() => onAddClick?.(colName)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    border: '1px solid #1E293B',
                    color: '#5B9FFF',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  +
                </button>
              </div>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#718096',
              }}>
                {config.description}
              </p>
            </div>

            {/* Cards Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
              minHeight: '300px',
            }}>
              {colApplications && colApplications.length > 0 ? (
                colApplications.map((app: any, idx: number) => (
                  <div
                    key={app.id || idx}
                    onClick={() => onCardClick?.(app)}
                    style={{
                      backgroundColor: '#0A0E27',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = '#5B9FFF')}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = '#1E293B')}
                  >
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      {app.companyName}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#A0AEC0',
                    }}>
                      {app.role}
                    </p>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  textAlign: 'center',
                  color: '#718096',
                }}>
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '12px',
                    opacity: 0.5,
                  }}>
                    {config.emoji}
                  </div>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#A0AEC0',
                    textTransform: 'uppercase',
                  }}>
                    {config.placeholder}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#718096',
                  }}>
                    {config.placeholderText}
                  </p>
                </div>
              )}
            </div>

            {/* Add Card Button */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #1E293B',
              textAlign: 'center',
            }}>
              <button 
                onClick={() => onAddClick?.(colName)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: '1px dashed #1E293B',
                  color: '#5B9FFF',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  width: '100%',
                }}
              >
                + Add card
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
