import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MissedData {
  missedCount: number;
  totalAssessments: number;
  missedPercentage: number;
  missedApplications: any[];
}

export default function MissedTracker({ data }: { data: MissedData }) {
  const [dismissed, setDismissed] = useState(false);

  if (!data || data.missedCount === 0 || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-red-500/10 border border-red-500/25 rounded-2xl p-5 mb-8 relative overflow-hidden group"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={20} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-red-100 flex items-center gap-2">
                Missed Opportunities Detected
                <span className="bg-red-500 text-[#C9D1D9] text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {data.missedCount} MISSED
                </span>
              </h3>
              <button 
                onClick={() => setDismissed(true)}
                className="text-red-500/40 hover:text-red-500 p-1 rounded-lg transition-colors"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-xs text-red-200/60 leading-relaxed mb-4 max-w-2xl">
              You've missed <span className="font-bold text-red-200">{data.missedCount}</span> online assessments or interviews. 
              This represents <span className="font-bold text-red-200">{data.missedPercentage}%</span> of your important rounds.
              Consistency is key — try to update your status as soon as you get a result.
            </p>

            <div className="flex flex-wrap gap-2">
              {data.missedApplications.slice(0, 3).map((app, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-medium text-red-100/80">
                  <span className="font-black text-red-500">{app.companyName}</span>
                  <span className="w-1 h-1 rounded-full bg-red-500/30" />
                  <span>{app.jobTitle}</span>
                </div>
              ))}
              {data.missedCount > 3 && (
                <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-medium text-red-100/80">
                  +{data.missedCount - 3} more
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center border-l border-red-500/20 pl-6 ml-2 text-center shrink-0">
            <div className="text-2xl font-black text-red-400 leading-none">{data.missedPercentage}%</div>
            <div className="text-[9px] text-red-500/60 font-black uppercase tracking-tighter mt-1">Miss Rate</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
