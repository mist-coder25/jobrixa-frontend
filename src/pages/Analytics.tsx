import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Lightbulb, Info } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missedData, setMissedData] = useState<{
    missed: Array<{
      id: string;
      company: string;
      role: string;
      status: string;
      deadline: string;
      missedAt: string;
      source: string;
    }>;
    missedCount: number;
    totalOaAndInterviews: number;
    missedPercent: number;
  } | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [res, missedRes] = await Promise.all([
          api.get("/applications/analytics"),
          api.get("/applications/missed")
        ]);
        setStats(res.data);
        setMissedData(missedRes.data);
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
    { name: 'Applied', value: byStatus['APPLIED'] || 0 },
    { name: 'Assessments', value: byStatus['OA'] || 0 },
    { name: 'Interviews', value: byStatus['INTERVIEW'] || 0 },
    { name: 'Offers', value: byStatus['OFFER'] || 0 }
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

  const HEAT_COLORS = ['#21262D', '#1a3a5c', '#1d5a9e', '#2470d4', '#4F8EF7'];

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar text-textPrimary">
      <TopBar title="Advanced Analytics" subtitle="Know your numbers" />

      <div className="p-8 space-y-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        
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
                   <Bar dataKey="value" fill="#4F8EF7" radius={[0, 4, 4, 0]} barSize={32} />
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
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={40}>
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={['#4F8EF7','#3FB950','#D29922','#A371F7'][i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

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
                         className="w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-textPrimary"
                         style={{ backgroundColor: HEAT_COLORS[intensity] }}
                         title={`${intensity} applications`}
                       ></div>
                     ))}
                   </div>
                 ))}
               </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium text-textSecondary">
               <span>Less</span>
               <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: HEAT_COLORS[0] }}></div>
               <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: HEAT_COLORS[1] }}></div>
               <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: HEAT_COLORS[2] }}></div>
               <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: HEAT_COLORS[3] }}></div>
               <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: HEAT_COLORS[4] }}></div>
               <span>More</span>
            </div>
        </div>

        {/* Missed Opportunities Section */}
        <div className="mx-0 mb-6">
          
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold text-[#E6EDF3]">Missed Opportunities</h2>
              <p className="text-xs text-[#7D8590] mt-0.5">
                Assessments and interviews you didn't respond to
              </p>
            </div>
            {missedData && (
              <div className="flex items-center gap-6">
                {/* Miss rate stat */}
                <div className="text-right">
                  <div className="text-2xl font-bold"
                    style={{ color: missedData.missedPercent > 50 ? '#F85149' : missedData.missedPercent > 25 ? '#D29922' : '#3FB950' }}>
                    {missedData.missedPercent}%
                  </div>
                  <div className="text-[10px] text-[#7D8590] uppercase tracking-wider font-semibold">miss rate</div>
                </div>
                {/* Count stat */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#E6EDF3]">{missedData.missedCount}</div>
                  <div className="text-[10px] text-[#7D8590] uppercase tracking-wider font-semibold">missed</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#E6EDF3]">{missedData.totalOaAndInterviews}</div>
                  <div className="text-[10px] text-[#7D8590] uppercase tracking-wider font-semibold">total OA/interviews</div>
                </div>
              </div>
            )}
          </div>

          {/* No missed — good state */}
          {missedData && missedData.missedCount === 0 && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-base font-bold text-[#E6EDF3]">No missed opportunities!</p>
              <p className="text-sm text-[#7D8590] mt-1.5 max-w-xs leading-relaxed">
                You've responded to every assessment and interview on time. Keep this winning streak alive!
              </p>
            </div>
          )}

          {/* Missed list */}
          {missedData && missedData.missedCount > 0 && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-700">
              
              {/* Summary bar */}
              <div className="px-6 py-4 border-b border-[#21262D] bg-[#1C2128] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F85149] shadow-[0_0_8px_#F85149]" />
                  <span className="text-sm font-semibold text-[#E6EDF3]">
                    {missedData.missedCount} missed out of {missedData.totalOaAndInterviews} assessments
                  </span>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${missedData.missedPercent}%`,
                        background: missedData.missedPercent > 50 ? '#F85149' :
                                    missedData.missedPercent > 25 ? '#D29922' : '#3FB950'
                      }} />
                  </div>
                  <span className="text-xs font-medium text-[#7D8590]">{missedData.missedPercent}% miss rate</span>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-5 px-6 py-3 border-b border-[#21262D] bg-[#0D1117]/50">
                {['Company', 'Role', 'Type', 'Deadline', 'Missed At'].map(h => (
                  <span key={h} className="text-[10px] font-bold text-[#484F58] uppercase tracking-widest">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#21262D]">
                {missedData.missed.map((item) => (
                  <div key={item.id}
                    className="grid grid-cols-5 px-6 py-4 items-center hover:bg-[#1C2128]/50 transition-colors group">
                    
                    {/* Company */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F85149]/10 border border-[#F85149]/20 flex items-center justify-center text-xs font-bold text-[#F85149] flex-shrink-0 group-hover:scale-110 transition-transform">
                        {item.company.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-[#E6EDF3] truncate">{item.company}</span>
                    </div>

                    {/* Role */}
                    <span className="text-sm text-[#7D8590] truncate pr-4">{item.role}</span>

                    {/* Type badge */}
                    <div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                        item.status === 'OA'
                          ? 'bg-[#D29922]/10 text-[#D29922] border-[#D29922]/20'
                          : 'bg-[#A371F7]/10 text-[#A371F7] border-[#A371F7]/20'
                      }`}>
                        {item.status === 'OA' ? 'Assessment' : 'Interview'}
                      </span>
                    </div>

                    {/* Deadline */}
                    <span className="text-sm font-medium text-[#F85149]">
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'No deadline'}
                    </span>

                    {/* Missed on */}
                    <span className="text-sm text-[#484F58]">
                      {new Date(item.missedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer tip */}
              <div className="px-6 py-4 border-t border-[#21262D] bg-[#0D1117]/80">
                <p className="text-xs text-[#7D8590] flex items-center gap-2">
                  <span className="text-accent underline decoration-accent/30 font-semibold">Pro Tip</span>
                  Always set a deadline when adding OA/Interview cards so Jobrixa can automatically track completion status.
                </p>
              </div>
            </div>
          )}

          {/* Loading state for Missed section specifically */}
          {loading && !missedData && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-12 bg-[#21262D] rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
