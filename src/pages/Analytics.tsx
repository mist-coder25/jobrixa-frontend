import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Lightbulb, Info } from "lucide-react";

export default function Analytics() {
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
        <TopBar title="Analytics" subtitle="Know your numbers" />
        <div className="flex-1 flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // Construct funnel data safely from backend map
  const byStatus = stats?.byStatus || {};
  const funnelData = [
    { name: 'Applied', value: byStatus['APPLIED'] || 0, color: '#6C63FF' },
    { name: 'Assessments', value: byStatus['OA'] || 0, color: '#FF4F40' },
    { name: 'Interviews', value: byStatus['INTERVIEW'] || 0, color: '#F59E0B' },
    { name: 'Offers', value: byStatus['OFFER'] || 0, color: '#00D4AA' }
  ];

  const sourceData = [
    { name: 'LinkedIn', rate: 45 }, { name: 'Referral', rate: 85 },
    { name: 'Wellfound', rate: 30 }, { name: 'Naukri', rate: 10 }
  ];

  // Mock Github-style heatmap grid (7 rows x ~52 cols)
  const heatmapCells = Array.from({ length: 364 }, () => {
    const intensity = Math.random() > 0.8 ? Math.floor(Math.random() * 4) + 1 : 0;
    return intensity;
  });

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar text-textPrimary">
      <TopBar title="Advanced Analytics" subtitle="Know your numbers" />

      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        
        {/* Smart Insights */}
        <div className="bg-gradient-to-r from-accent/20 to-surface border border-accent/30 rounded-xl p-6 relative overflow-hidden flex items-start gap-4 shadow-[0_4px_30px_rgba(108,99,255,0.1)]">
           <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
             <Lightbulb className="w-6 h-6 text-accent" />
           </div>
           <div>
             <h3 className="text-lg font-display font-semibold mb-1">Smart Insights & Suggestions</h3>
             <ul className="space-y-2 text-sm text-textSecondary font-medium leading-relaxed">
               <li><span className="text-textPrimary">💡 High conversion potential:</span> Your response rate from <b>Referrals</b> is 4x higher than standard applications. Focus your energy on networking this week.</li>
               <li><span className="text-textPrimary">💡 Pipeline bottleneck:</span> You have {byStatus['OA'] || 0} pending assessments. Prioritize completing them to unblock the interview phase.</li>
               <li><span className="text-textPrimary">💡 Consistency check:</span> You applied to {stats?.totalApplications || 0} roles in total. Keep building momentum!</li>
             </ul>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Funnel Chart */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold">Conversion Funnel</h3>
              <div title="Dropoff from initial application to final offer"><Info className="w-4 h-4 text-textSecondary" /></div>
            </div>
            <div className="h-[300px] w-full mt-4">
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                   <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Response Rates by Source */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold mb-4">Response Rate by Source (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B8BA8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#2A2A38', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px' }}
                  />
                  <Bar dataKey="rate" fill="#6C63FF" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Heatmap Area Component */}
        <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-display font-semibold mb-4">Activity Heatmap</h3>
            <div className="w-full overflow-x-auto custom-scrollbar pb-2">
               <div className="flex gap-1" style={{ minWidth: '800px' }}>
                 {/* Split array into columns of 7 for weeks */}
                 {Array.from({ length: 52 }).map((_, colIndex) => (
                   <div key={colIndex} className="flex flex-col gap-1">
                     {heatmapCells.slice(colIndex * 7, (colIndex + 1) * 7).map((intensity, rowIndex) => (
                       <div 
                         key={rowIndex} 
                         className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-textPrimary
                           ${intensity === 0 ? 'bg-primary' : 
                             intensity === 1 ? 'bg-[#00D4AA]/20' : 
                             intensity === 2 ? 'bg-[#00D4AA]/50' : 
                             intensity === 3 ? 'bg-[#00D4AA]/80' : 
                             'bg-[#00D4AA]'}`}
                         title={`${intensity} applications`}
                       ></div>
                     ))}
                   </div>
                 ))}
               </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium text-textSecondary">
               <span>Less</span>
               <div className="w-3.5 h-3.5 rounded-sm bg-primary"></div>
               <div className="w-3.5 h-3.5 rounded-sm bg-[#00D4AA]/20"></div>
               <div className="w-3.5 h-3.5 rounded-sm bg-[#00D4AA]/50"></div>
               <div className="w-3.5 h-3.5 rounded-sm bg-[#00D4AA]/80"></div>
               <div className="w-3.5 h-3.5 rounded-sm bg-[#00D4AA]"></div>
               <span>More</span>
            </div>
        </div>

      </div>
    </div>
  );
}
