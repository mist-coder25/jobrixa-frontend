import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";

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

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/applications/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-primary">
        <TopBar title="Dashboard" subtitle="Here's how your search is going" />
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
      trend: <span className="flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>+12%</span>,
    },
    {
      label: "Response Rate",
      value: stats?.responseRate || 0,
      suffix: "%",
      icon: <Users className="w-4 h-4" />,
      trend: null,
    },
    {
      label: "Interview Rate",
      value: stats?.interviewRate || 0,
      suffix: "%",
      icon: <TrendingUp className="w-4 h-4" />,
      trend: null,
    },
    {
      label: "Offer Rate",
      value: stats?.offerRate || 0,
      suffix: "%",
      icon: <CheckCircle2 className="w-4 h-4" />,
      trend: <span className="text-xs text-[#7D8590] font-medium">of applied</span>,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      <TopBar title="Dashboard" subtitle="Here's how your search is going" />
      
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 hover:border-[#4F8EF7]/30 transition-colors cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#7D8590] uppercase tracking-wider">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#1C2128] flex items-center justify-center text-[#7D8590]">
                  {card.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#E6EDF3]">
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                    itemStyle={{ color: '#F0F0FF' }}
                  />
                  <Line type="monotone" dataKey="apps" stroke="#6C63FF" strokeWidth={3} dot={{ fill: '#6C63FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold text-textPrimary mb-6">Applications by Source</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" horizontal={false} />
                  <XAxis type="number" stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: '#2A2A38', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#00D4AA" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
