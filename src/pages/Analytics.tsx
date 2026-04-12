import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const THEME = {
  bg: '#0A0E27',
  cardBg: '#0F1419',
  border: '1px solid #1E293B',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  primary: '#5B9FFF',
};

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch analytics data
    const fetchData = async () => {
      try {
        const response = await api.get('/applications/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{
      backgroundColor: THEME.bg,
      color: THEME.text,
      minHeight: '100vh',
      padding: '32px 24px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
        }}>
          Advanced Analytics
        </h1>
        <p style={{
          color: THEME.textSecondary,
          margin: 0,
        }}>
          Know your numbers
        </p>
      </div>

      {/* Smart Insights */}
      <div style={{
        backgroundColor: THEME.cardBg,
        border: THEME.border,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <span>💡</span>
          <h3 style={{ margin: 0 }}>Smart Insights & Suggestions</h3>
        </div>
        <div style={{ color: THEME.textSecondary }}>
          <div style={{ marginBottom: '12px' }}>
            📌 <strong style={{ color: THEME.text }}>High conversion potential:</strong> Your response rate from Referrals is 4x higher than standard applications. Focus your energy on networking this week.
          </div>
          <div style={{ marginBottom: '12px' }}>
            📌 <strong style={{ color: THEME.text }}>Pipeline bottleneck:</strong> You have 0 pending assessments. Prioritize completing them to unblock the interview phase.
          </div>
          <div>
            📌 <strong style={{ color: THEME.text }}>Consistency check:</strong> You applied to 0 roles in total. Keep building momentum!
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {/* Conversion Funnel */}
        <div style={{
          backgroundColor: THEME.cardBg,
          border: THEME.border,
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '18px',
            fontWeight: '600',
          }}>
            Conversion Funnel
          </h3>
          <div style={{ height: '300px' }}>
            {data?.conversionFunnel || data?.byStatus ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.conversionFunnel || [
                    { name: 'Applied', value: data.byStatus?.APPLIED || 0 },
                    { name: 'OA', value: data.byStatus?.OA || 0 },
                    { name: 'Interview', value: data.byStatus?.INTERVIEW || 0 },
                    { name: 'Offer', value: data.byStatus?.OFFER || 0 },
                ]}>
                  <CartesianGrid stroke={THEME.textSecondary} strokeDasharray="5 5" />
                  <XAxis dataKey="name" tick={{ fill: THEME.textSecondary }} />
                  <YAxis tick={{ fill: THEME.textSecondary }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.cardBg,
                      border: THEME.border,
                      borderRadius: '8px',
                      color: THEME.text,
                    }}
                  />
                  <Bar dataKey="value" fill={THEME.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                No data
              </div>
            )}
          </div>
        </div>

        {/* Response Rate */}
        <div style={{
          backgroundColor: THEME.cardBg,
          border: THEME.border,
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '18px',
            fontWeight: '600',
          }}>
            Response Rate by Source (%)
          </h3>
          <div style={{ height: '300px' }}>
            {data?.responseRate ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.responseRate}>
                  <CartesianGrid stroke={THEME.textSecondary} strokeDasharray="5 5" />
                  <XAxis dataKey="source" tick={{ fill: THEME.textSecondary }} />
                  <YAxis tick={{ fill: THEME.textSecondary }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.cardBg,
                      border: THEME.border,
                      borderRadius: '8px',
                      color: THEME.text,
                    }}
                  />
                  <Bar dataKey="rate" fill="#00D084" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                No data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Missed Opportunities */}
      <div style={{
        backgroundColor: THEME.cardBg,
        border: THEME.border,
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Missed Opportunities</h3>
        <p style={{
          color: THEME.textSecondary,
          margin: '0 0 24px 0',
        }}>
          Assessments and interviews you didn't respond to
        </p>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#00D084',
          marginBottom: '8px',
        }}>
          0%
        </div>
        <p style={{ color: THEME.textSecondary, margin: 0 }}>
          👻 No missed opportunities! You've responded to every OA and interview.
        </p>
      </div>
    </div>
  );
}
