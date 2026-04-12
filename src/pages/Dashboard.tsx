import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Target, CheckCircle2, Plus, Layout, ArrowUpRight, BarChart3, PieChart as PieIcon } from "lucide-react";
import { trackEvent, identifyUser } from "../utils/analytics";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [hasAnyApp, setHasAnyApp] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [_isEarlyAdopter, setIsEarlyAdopter] = useState(false);

  useEffect(() => {
    trackEvent('dashboard_viewed');
    
    // Fetch apps to check if empty
    api.get('/applications')
      .then(r => {
        const data = r.data;
        let count = 0;
        if (Array.isArray(data)) count = data.length;
        else if (data?.content) count = data.content.length;
        else if (data?.totalElements !== undefined) count = data.totalElements;
        setHasAnyApp(count > 0);
      })
      .catch(() => setHasAnyApp(false));

    // Stats
    api.get('/applications/analytics')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    // User check
    api.get('/users/me')
      .then(r => {
        const user = r.data;
        setIsEarlyAdopter(user.isEarlyAdopter || user.earlyAdopter);
        identifyUser(user.id.toString(), {
          email: user.email,
          name: user.name,
          plan: user.plan,
        });
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <TopBar title="Dashboard" subtitle="Here's how your search is going" showSearch />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Applications",
      value: stats?.totalApplications || 0,
      suffix: "",
      icon: <Target size={18} />,
      color: "var(--primary)",
      secondary: null
    },
    {
      label: "Response Rate",
      value: stats?.responseRate || 0,
      suffix: "%",
      icon: <Users size={18} />,
      color: "var(--accent-green)",
      secondary: null
    },
    {
      label: "Interview Rate",
      value: stats?.interviewRate || 0,
      suffix: "%",
      icon: <TrendingUp size={18} />,
      color: "var(--accent-orange)",
      secondary: <div className="flex items-center gap-1 text-[var(--accent-green)] text-[10px] bg-[var(--accent-green)]/10 px-1.5 py-0.5 rounded-full mt-1.5">
        <ArrowUpRight size={10} />
        <span>+4%</span>
      </div>
    },
    {
      label: "Offer Rate",
      value: stats?.offerRate || 0,
      suffix: "%",
      icon: <CheckCircle2 size={18} />,
      color: "var(--accent-purple)",
      secondary: <p className="text-[10px] text-[var(--text-tertiary)] mt-1">of applied</p>
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <TopBar title="Dashboard" subtitle="Here's how your search is going" showSearch />
      
      <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        
        {/* Welcome Card */}
        {hasAnyApp === false && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-[var(--primary)]/20"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 underline decoration-white/20 underline-offset-8">Welcome to Jobrixa! 👋</h2>
                <p className="text-white/80 text-lg max-w-xl">
                  Start tracking your applications and never miss an opportunity again. Your dream role is one organized search away.
                </p>
              </div>
              <button
                onClick={() => navigate('/pipeline')}
                className="bg-white text-[var(--primary)] hover:bg-white/90 font-bold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add First Application
              </button>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
          </motion.div>
        )}

        {/* Total Stats Row */}
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest">Total</span>
                    <span className="text-xl font-bold">{stats?.totalApplications || 0}</span>
                </div>
                <div className="w-px h-8 bg-[var(--border)]" />
                <div className="flex flex-col">
                    <span className="text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest">Active</span>
                    <span className="text-xl font-bold">{stats?.activeApplications || 0}</span>
                </div>
                <div className="w-px h-8 bg-[var(--border)]" />
                <div className="flex flex-col">
                    <span className="text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest">Interviews</span>
                    <span className="text-xl font-bold">{stats?.interviewCount || 0}</span>
                </div>
            </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--text-tertiary)] transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: card.color }} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-tertiary)] text-xs font-bold uppercase tracking-wider">{card.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] shadow-inner">
                  {card.icon}
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{card.value}</span>
                <span className="text-lg font-medium text-[var(--text-secondary)]">{card.suffix}</span>
              </div>
              
              {card.secondary}
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                        <BarChart3 size={20} />
                    </div>
                    <h3 className="text-lg font-bold">Application Activity</h3>
                </div>
            </div>

            <div className="h-[300px] w-full flex items-center justify-center">
              {hasAnyApp ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[{name:'Mon', apps:2},{name:'Tue', apps:5},{name:'Wed', apps:3},{name:'Thu', apps:8},{name:'Fri', apps:12},{name:'Sat', apps:6},{name:'Sun', apps:9}]}>
                    <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="apps" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <Layout size={48} className="text-[var(--border)] mb-4" />
                  <p className="text-sm text-[var(--text-tertiary)] font-medium">No activity data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center text-[var(--accent-purple)]">
                        <PieIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold">Applications by Source</h3>
                </div>
            </div>

            <div className="h-[300px] w-full flex items-center justify-center">
              {hasAnyApp ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{name:'LinkedIn', value:14}, {name:'Naukri', value:8}, {name:'Referral', value:4}, {name:'Other', value:6}]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'var(--border)', opacity: 0.1}}
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <PieIcon size={48} className="text-[var(--border)] mb-4" />
                  <p className="text-sm text-[var(--text-tertiary)] font-medium">No source data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
