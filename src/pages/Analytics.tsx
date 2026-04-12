const THEME = {
  bg: '#0A0E27',
  cardBg: '#0F1419',
  border: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  primary: '#5B9FFF',
};

export default function Analytics() {
  return (
    <div style={{
      backgroundColor: THEME.bg,
      color: THEME.text,
      minHeight: '100vh',
      padding: '32px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 4px 0',
        }}>
          Advanced Analytics
        </h1>
        <p style={{
          color: THEME.textSecondary,
          margin: 0,
          fontSize: '13px',
        }}>
          Know your numbers
        </p>
      </div>

      {/* Smart Insights */}
      <div style={{
        backgroundColor: THEME.cardBg,
        border: `1px solid ${THEME.border}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <h3 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Smart Insights & Suggestions
          </h3>
        </div>

        <div style={{ color: THEME.textSecondary, fontSize: '12px' }}>
          <div style={{ marginBottom: '10px', lineHeight: '1.4' }}>
            <span style={{ marginRight: '6px' }}>📌</span>
            <strong style={{ color: THEME.text }}>High conversion potential:</strong> Response rate from Referrals is 4x higher.
          </div>
          <div style={{ marginBottom: '10px', lineHeight: '1.4' }}>
            <span style={{ marginRight: '6px' }}>📌</span>
            <strong style={{ color: THEME.text }}>Pipeline bottleneck:</strong> You have 0 pending assessments.
          </div>
          <div style={{ lineHeight: '1.4' }}>
            <span style={{ marginRight: '6px' }}>📌</span>
            <strong style={{ color: THEME.text }}>Consistency check:</strong> Keep building momentum!
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {/* Conversion Funnel */}
        <div style={{
          backgroundColor: THEME.cardBg,
          border: `1px solid ${THEME.border}`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Conversion Funnel
          </h3>
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0E27',
            borderRadius: '6px',
            color: THEME.textSecondary,
            fontSize: '12px',
          }}>
            No data
          </div>
        </div>

        {/* Response Rate */}
        <div style={{
          backgroundColor: THEME.cardBg,
          border: `1px solid ${THEME.border}`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Response Rate by Source (%)
          </h3>
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0E27',
            borderRadius: '6px',
            color: THEME.textSecondary,
            fontSize: '12px',
          }}>
            No data
          </div>
        </div>
      </div>

      {/* Missed Opportunities */}
      <div style={{
        backgroundColor: THEME.cardBg,
        border: `1px solid ${THEME.border}`,
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <h3 style={{
          margin: '0 0 6px 0',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          Missed Opportunities
        </h3>
        <p style={{
          color: THEME.textSecondary,
          margin: '0 0 12px 0',
          fontSize: '12px',
        }}>
          Assessments you didn't respond to
        </p>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#00D084',
          marginBottom: '6px',
        }}>
          0%
        </div>
        <p style={{
          color: THEME.textSecondary,
          margin: 0,
          fontSize: '12px',
        }}>
          👻 No missed opportunities!
        </p>
      </div>
    </div>
  );
}
