import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Lightbulb, Info } from "lucide-react";
import { trackEvent } from "../utils/analytics";

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
    trackEvent('analytics_viewed');
    const fetchData = async () => {
      try {
        const res = await api.get("/applications/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    api.get('/applications/missed')
      .then(r => setMissedData(r.data))
      .catch(() => {
        setMissedData({ missed: [], missedCount: 0, totalOaAndInterviews: 0, missedPercent: 0 });
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-[#ffffff]">
        <TopBar title="Analytics" subtitle="Know your numbers" />
        <div className="flex-1 flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-[#d0d7de] border-accent border-t-transparent animate-spin"></div>
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

  const HEAT_COLORS = ['#f6f8fa', '#e6f4ff', '#91caff', '#40a9ff', '#0969da'];

  return (
    <div className="h-full flex flex-col bg-[#ffffff] overflow-y-auto custom-scrollbar text-[#1c2128]">
      <TopBar title="Advanced Analytics" subtitle="Know your numbers" />

      <div className="p-8 space-y-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        
        {/* Smart Insights */}
        <div className="bg-gradient-to-r from-[#4F8EF710] to-white border border-[#4F8EF730] rounded-xl p-6 relative overflow-hidden flex items-start gap-4 shadow-sm">
           <div className="w-12 h-12 bg-[#4F8EF715] rounded-full flex items-center justify-center shrink-0">
             <Lightbulb className="w-6 h-6 text-[#4F8EF7]" />
           </div>
           <div>
             <h3 className="text-lg font-display font-semibold mb-1">Smart Insights & Suggestions</h3>
             <ul className="space-y-2 text-sm text-[#57606a] font-medium leading-relaxed">
               <li><span className="text-[#1c2128]">💡 High conversion potential:</span> Your response rate from <b>Referrals</b> is 4x higher than standard applications. Focus your energy on networking this week.</li>
               <li><span className="text-[#1c2128]">💡 Pipeline bottleneck:</span> You have {byStatus['OA'] || 0} pending assessments. Prioritize completing them to unblock the interview phase.</li>
               <li><span className="text-[#1c2128]">💡 Consistency check:</span> You applied to {stats?.totalApplications || 0} roles in total. Keep building momentum!</li>
             </ul>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Funnel Chart */}
          <div className="bg-white border border-[#d0d7de] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold">Conversion Funnel</h3>
              <div title="Dropoff from initial application to final offer"><Info className="w-4 h-4 text-[#57606a]" /></div>
            </div>
            <div className="h-[300px] w-full mt-4">
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="#57606a" fontSize={12} tickLine={false} axisLine={false} width={80} />
                   <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', borderRadius: '8px' }}
                   />
                   <Bar dataKey="value" fill="#0969da" radius={[0, 4, 4, 0]} barSize={32} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Response Rates by Source */}
          <div className="bg-white border border-[#d0d7de] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-semibold mb-4">Response Rate by Source (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f6f8fa" vertical={false} />
                  <XAxis dataKey="name" stroke="#57606a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#57606a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#eaeef2', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', borderRadius: '8px' }}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={40}>
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={['#4F8EF7','#3B7DE8','#9a6700','#A371F7'][i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] shadow-sm border border-[#d0d7de] rounded-xl p-6">
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
            <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium text-[#57606a]">
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
        <div className="mx-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#1c2128]">
                Missed Opportunities
              </h2>
              <p className="text-xs text-[#57606a] mt-0.5">
                Assessments and interviews you didn't respond to
              </p>
            </div>
            {missedData && (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-bold"
                    style={{ color: missedData.missedPercent > 50 ? '#cf222e' : missedData.missedPercent > 25 ? '#9a6700' : '#4F8EF7' }}>
                    {missedData.missedPercent}%
                  </div>
                  <div className="text-xs text-[#57606a]">miss rate</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#1c2128]">{missedData.missedCount}</div>
                  <div className="text-xs text-[#57606a]">missed</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#d0d7de] rounded-xl overflow-hidden shadow-sm">
            {!missedData ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-10 bg-[#f6f8fa] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : missedData.missedCount === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-3">🎯</span>
                <p className="text-sm font-semibold text-[#1c2128]">No missed opportunities!</p>
                <p className="text-xs text-[#57606a] mt-1 max-w-xs">
                  You've responded to every OA and interview.
                  Set deadlines on your cards so Jobrixa can track future ones.
                </p>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 border-b border-[#eaeef2] bg-[#f6f8fa] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#cf222e]" />
                    <span className="text-xs font-medium text-[#1c2128]">
                      {missedData.missedCount} missed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1.5 bg-[#eaeef2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${missedData.missedPercent}%`,
                          background: missedData.missedPercent > 50 ? '#cf222e' : missedData.missedPercent > 25 ? '#9a6700' : '#4F8EF7'
                        }} />
                    </div>
                    <span className="text-xs text-[#57606a]">{missedData.missedPercent}% miss rate</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 px-5 py-2 border-b border-[#eaeef2]">
                  {['Company','Role','Type','Deadline','Missed On'].map(h => (
                    <span key={h} className="text-[11px] font-semibold text-[#8c959f] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {missedData.missed.map((item, i) => (
                  <div key={item.id}
                    className={`grid grid-cols-5 px-5 py-3 items-center hover:bg-[#f6f8fa] transition-colors ${i < missedData.missed.length - 1 ? 'border-b border-[#eaeef2]' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#cf222e]/10 border border-[#cf222e]/20 flex items-center justify-center text-xs font-bold text-[#cf222e]">
                        {item.company.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#1c2128] truncate">{item.company}</span>
                    </div>
                    <span className="text-sm text-[#57606a] truncate pr-2">{item.role}</span>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium w-fit ${
                      item.status === 'OA' || item.status === 'OA_ASSESSMENT'
                        ? 'bg-[#9a6700]/10 text-[#9a6700] border border-[#9a6700]/20'
                        : 'bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/20'
                    }`}>
                      {(item.status === 'OA' || item.status === 'OA_ASSESSMENT') ? 'OA' : 'Interview'}
                    </span>
                    <span className="text-sm text-[#cf222e]">
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : '—'}
                    </span>
                    <span className="text-sm text-[#8c959f]">
                      {new Date(item.missedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
                <div className="px-5 py-3 border-t border-[#eaeef2] bg-white">
                  <p className="text-xs text-[#8c959f]">
                    💡 Set a deadline when adding OA/Interview cards so Jobrixa auto-marks them as missed.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
