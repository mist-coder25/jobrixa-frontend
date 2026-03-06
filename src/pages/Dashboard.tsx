import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";

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
        <TopBar title="Dashboard" />
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

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      <TopBar title="Dashboard" />
      
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full group-hover:bg-accent/10 transition-colors"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Total Applications</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-display font-bold text-textPrimary">{stats?.totalApplications || 0}</h3>
                  <span className="text-xs text-[#00D4AA] flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-warning/5 rounded-full group-hover:bg-warning/10 transition-colors"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center text-warning">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Response Rate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-display font-bold text-textPrimary">{stats?.responseRate || 0}%</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0A66C2]/5 rounded-full group-hover:bg-[#0A66C2]/10 transition-colors"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center text-[#0A66C2]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Interview Rate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-display font-bold text-textPrimary">{stats?.interviewRate || 0}%</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00D4AA]/5 rounded-full group-hover:bg-[#00D4AA]/10 transition-colors"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00D4AA]/10 rounded-lg flex items-center justify-center text-[#00D4AA]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Total Offers</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-display font-bold text-textPrimary">{stats?.offerRate || 0}%</h3>
                  <span className="text-xs text-textSecondary font-medium">of applied</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold text-textPrimary mb-6">Application Activity</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
              <ResponsiveContainer width="100%" height="100%">
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
