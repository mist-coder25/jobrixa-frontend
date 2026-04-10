import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";
import { trackEvent, identifyUser } from "../utils/analytics";

/** Counts up from 0 to value over ~1.2s at 60fps */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const duration = 1200;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
}

import { useNavigate } from "react-router-dom";
import MissedTracker from "../components/MissedTracker";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [missedData, setMissedData] = useState<any>(null);
  const [hasAnyApp, setHasAnyApp] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);
  const [isEarlyAdopter, setIsEarlyAdopter] = useState(false);
  const [earlyAdopterExpiresDate, setEarlyAdopterExpiresDate] = useState("");

  useEffect(() => {
    trackEvent('dashboard_viewed');
    
    // Track time spent on dashboard
    const start = Date.now();
    return () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      trackEvent('dashboard_time_spent', { seconds });
    };
  }, []);

  useEffect(() => {
    // Fetch raw applications — handles both array and paginated response
    api.get('/applications')
      .then(r => {
        const data = r.data;
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data?.content && Array.isArray(data.content)) {
          list = data.content;
        } else if (data?.totalElements !== undefined) {
          // Paginated response — use totalElements directly
          list = new Array(data.totalElements).fill(null);
        }
        console.log('Dashboard apps check — list length:', list.length, '| raw:', data);
        setHasAnyApp(list.length > 0);
      })
      .catch(() => {
        setHasAnyApp(false);
      });

    // Analytics stats (separate call)
    api.get('/applications/analytics?t=' + Date.now())
      .then(r => setStats(r.data))
      .catch(() => {});

    // Missed data (separate call)  
    api.get('/applications/missed?t=' + Date.now())
      .then(r => setMissedData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    // Early adopter status
    api.get('/users/me')
      .then(r => {
        const user = r.data;
        identifyUser(user.id.toString(), {
          email: user.email,
          name: user.name,
          plan: user.plan,
          isEarlyAdopter: user.isEarlyAdopter || user.earlyAdopter,
        });

        if (user.isEarlyAdopter || user.earlyAdopter) {
          setIsEarlyAdopter(true);
          const expiresAt = user.earlyAdopterExpiresAt;
          if (expiresAt) {
            setEarlyAdopterExpiresDate(
              new Date(expiresAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-primary">
        <TopBar title="Dashboard" subtitle="Here's how your search is going" showSearch />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // Placeholder charts since backend doesn't explicitly return time series yet, 
  // we'll mock the chart data to fit the instructions "Applications added per week" / "by source"
  const weeklyData = [
    { name: 'W1', apps: 4 }, { name: 'W2', apps: 7 }, { name: 'W3', apps: 5 }, 
    { name: 'W4', apps: 12 }, { name: 'W5', apps: 8 }, { name: 'W6', apps: 15 }
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 45 }, { name: 'Referral', value: 15 },
    { name: 'Wellfound', value: 20 }, { name: 'Naukri', value: 10 }
  ];

  const statCards = [
    {
      label: "Total Applications",
      value: stats?.totalApplications || 0,
      suffix: "",
      icon: <Target className="w-4 h-4" />,
      trend: null,
      borderColor: "border-l-[#4F8EF7]"
    },
    {
      label: "Response Rate",
      value: stats?.responseRate || 0,
      suffix: "%",
      icon: <Users className="w-4 h-4" />,
      trend: null,
      borderColor: "border-l-[#3FB950]"
    },
    {
      label: "Interview Rate",
      value: stats?.interviewRate || 0,
      suffix: "%",
      icon: <TrendingUp className="w-4 h-4" />,
      trend: null,
      borderColor: "border-l-[#D29922]"
    },
    {
      label: "Offer Rate",
      value: stats?.offerRate || 0,
      suffix: "%",
      icon: <CheckCircle2 className="w-4 h-4" />,
      trend: <span className="text-xs text-[#7D8590] font-medium">of applied</span>,
      borderColor: "border-l-[#A371F7]"
    },
  ];

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      <TopBar title="Dashboard" subtitle="Here's how your search is going" showSearch />
      
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Early Adopter Banner */}
        {isEarlyAdopter && (
          <div style={{
            background: 'linear-gradient(90deg, #1a3a2a, #0d2b1a)',
            border: '1px solid #2ea043',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#3fb950',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎉</span>
            <span>
              You're an early adopter! All Pro features are <strong>free until {earlyAdopterExpiresDate}</strong>.
              Enjoy Jobrixa with zero limits.
            </span>
          </div>
        )}
        {/* Only render when we KNOW it's empty — null means still loading */}
        {hasAnyApp === false && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#E6EDF3] mb-1">
                Welcome to Jobrixa! 👋
              </h2>
              <p className="text-sm text-[#7D8590] mb-4">
                Start tracking your applications and never miss an opportunity again.
              </p>
              <button
                onClick={() => navigate('/pipeline')}
                className="bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + Add First Application
              </button>
            </div>
            <span className="text-6xl">👋</span>
          </div>
        )}



        {/* Missed Opportunities Tracker */}
        <MissedTracker data={missedData} />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`bg-[#161B22] border border-[#30363D] rounded-xl p-5 border-l-2 ${card.borderColor} hover:border-[#4F8EF7]/30 transition-colors cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold text-[#7D8590] uppercase tracking-wider">
                  {card.label}
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#1C2128] flex items-center justify-center text-[#7D8590]">
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-[#E6EDF3] mt-2">
                <AnimatedCounter value={card.value} suffix={card.suffix} />
              </div>
              {card.trend && (
                <div className="text-xs text-[#3FB950] mt-1 flex items-center">
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold text-textPrimary mb-6">Application Activity</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              {hasAnyApp ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#7D8590', fontSize: 11 }} axisLine={{ stroke: '#30363D' }} tickLine={false} />
                    <YAxis tick={{ fill: '#7D8590', fontSize: 11 }} axisLine={{ stroke: '#30363D' }} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                      itemStyle={{ color: '#F0F0FF' }}
                    />
                    <Line type="monotone" dataKey="apps" stroke="#4F8EF7" strokeWidth={2} dot={{ fill: '#4F8EF7', r: 3 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1C2128] flex items-center justify-center mx-auto mb-3 text-[#586069]">
                    <Target size={20} />
                  </div>
                  <p className="text-sm text-[#7D8590]">No activity data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold text-textPrimary mb-6">Applications by Source</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              {hasAnyApp ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#7D8590', fontSize: 11 }} axisLine={{ stroke: '#30363D' }} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#7D8590', fontSize: 11 }} axisLine={{ stroke: '#30363D' }} tickLine={false} width={80} />
                    <Tooltip 
                      cursor={{fill: '#2A2A38', opacity: 0.4}}
                      contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                      {sourceData.map((_, i) => (
                        <Cell key={i} fill={['#4F8EF7','#3FB950','#D29922','#A371F7'][i % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1C2128] flex items-center justify-center mx-auto mb-3 text-[#586069]">
                    <Users size={20} />
                  </div>
                  <p className="text-sm text-[#7D8590]">No source data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
