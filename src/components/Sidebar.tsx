import { Link, useLocation, useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { label: 'Pipeline', icon: '📋', path: '/pipeline' },
  { label: 'Discover', icon: '🔍', path: '/discover' },
  { label: 'Analytics', icon: '📈', path: '/analytics' },
  { label: 'Pricing', icon: '💰', path: '/pricing' },
  { label: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jobrixa_token");
    localStorage.removeItem("jobrixa_user");
    localStorage.removeItem("jobrixa_plan");
    navigate("/login");
  };

  return (
    <div style={{
      width: '200px',
      backgroundColor: '#0F1419',
      borderRight: '1px solid #1E293B',
      padding: '24px 16px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '32px',
        color: '#FFFFFF',
      }}>
        Jobrixa
      </div>

      {/* Menu Label */}
      <div style={{
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        color: '#A0AEC0',
        marginBottom: '12px',
        letterSpacing: '0.5px',
      }}>
        Menu
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, marginBottom: '24px' }}>
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: location.pathname === item.path ? '#5B9FFF' : '#A0AEC0',
              backgroundColor: location.pathname === item.path ? '#1a1f35' : 'transparent',
              marginBottom: '6px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Upgrade Box */}
      <div style={{
        padding: '12px',
        backgroundColor: '#0A0E27',
        border: '1px solid #1E293B',
        borderRadius: '6px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '4px',
          color: '#FFFFFF',
        }}>
          Free Plan
        </div>
        <div style={{
          fontSize: '11px',
          color: '#A0AEC0',
          marginBottom: '10px',
        }}>
          0/30 applications
        </div>
        <button 
          onClick={() => navigate('/pricing')}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#5B9FFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          UPGRADE →
        </button>
      </div>

      {/* Feedback */}
      <div style={{
        padding: '10px 12px',
        marginBottom: '16px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        color: '#A0AEC0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span>💬</span>
        Send Feedback
      </div>

      {/* User Profile Box */}
      <div 
        onClick={handleLogout}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: '#0A0E27',
          border: '1px solid #1E293B',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
        title="Click to Logout"
      >
        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          minWidth: '32px',
          backgroundColor: '#5B9FFF',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: '600',
          fontSize: '12px',
        }}>
          A
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#FFFFFF',
            margin: '0 0 2px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            admin
          </div>
          <div style={{
            fontSize: '11px',
            color: '#A0AEC0',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Free Plan
          </div>
        </div>
      </div>
    </div>
  );
}
