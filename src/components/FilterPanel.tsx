import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface FilterState {
  status: string[];
  source: string[];
  dateRange: 'all' | '7days' | '30days' | '3months';
  hasInterview: boolean;
  hasOffer: boolean;
  // Discover specific
  location?: string;
  roleType?: string;
  experience?: string;
}

export const DEFAULT_FILTERS: FilterState = {
  status: [],
  source: [],
  dateRange: 'all',
  hasInterview: false,
  hasOffer: false,
  location: '',
  roleType: '',
  experience: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  mode?: 'pipeline' | 'discover';
}

const STATUSES = ['SAVED','APPLIED','OA','INTERVIEW','OFFER','REJECTED','GHOSTED'];
const SOURCES = ['LinkedIn','Naukri','Internshala','Wellfound','Indeed','Referral','Company Website','Other'];
const DATE_RANGES = [
  { value: 'all', label: 'All time' },
  { value: '7days', label: 'Last 7 days' },
  { value: '30days', label: 'Last 30 days' },
  { value: '3months', label: 'Last 3 months' },
];

export default function FilterPanel({ open, onClose, filters, onChange, onReset, mode = 'pipeline' }: Props) {
  const toggle = (key: 'status' | 'source', val: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
    });
  };

  const activeCount = filters.status.length + filters.source.length +
    (filters.dateRange !== 'all' ? 1 : 0) +
    (filters.hasInterview ? 1 : 0) + (filters.hasOffer ? 1 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[60]"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-[#ffffff] border-l border-[#d0d7de] z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d0d7de]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1c2128] text-lg">Filters</span>
                {activeCount > 0 && (
                  <span className="text-[10px] bg-[#4F8EF7] text-[#1c2128] px-2 py-0.5 rounded-full font-black animate-pulse">
                    {activeCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 text-[#57606a] hover:text-[#1c2128] hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
              
              {mode === 'discover' ? (
                <>
                  {/* Discover Experience */}
                  <div>
                    <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Experience Level</p>
                    <div className="flex flex-wrap gap-2">
                      {["Fresher", "0-2 years", "2-5 years", "5+ years"].map(exp => (
                        <button key={exp}
                          onClick={() => onChange({ ...filters, experience: filters.experience === exp ? '' : exp })}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            filters.experience === exp
                              ? 'bg-[#4F8EF7]/10 border-[#4F8EF7] text-[#4F8EF7]'
                              : 'bg-[#ffffff] border-[#d0d7de] text-[#57606a]'
                          }`}>
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Discover Role Type */}
                  <div>
                    <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Employment Type</p>
                    <div className="flex flex-wrap gap-2">
                      {["Full-time", "Internship", "Contract", "Remote"].map(type => (
                        <button key={type}
                          onClick={() => onChange({ ...filters, roleType: filters.roleType === type ? '' : type })}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            filters.roleType === type
                              ? 'bg-[#2da44e]/10 border-[#2da44e] text-[#2da44e]'
                              : 'bg-[#ffffff] border-[#d0d7de] text-[#57606a]'
                          }`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Status */}
                  <div>
                    <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Pipeline Stage</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button key={s}
                          onClick={() => toggle('status', s)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            filters.status.includes(s)
                              ? 'bg-[#4F8EF7]/10 border-[#4F8EF7] text-[#4F8EF7] shadow-[0_0_15px_rgba(79,142,247,0.1)]'
                              : 'bg-[#ffffff] border-[#d0d7de] text-[#57606a] hover:border-[#8c959f]'
                          }`}>
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Application Source</p>
                    <div className="flex flex-wrap gap-2">
                      {SOURCES.map(s => (
                        <button key={s}
                          onClick={() => toggle('source', s)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            filters.source.includes(s)
                              ? 'bg-[#2da44e]/10 border-[#2da44e] text-[#2da44e] shadow-[0_0_15px_rgba(63,185,80,0.1)]'
                              : 'bg-[#ffffff] border-[#d0d7de] text-[#57606a] hover:border-[#8c959f]'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Date range - Common */}
              <div>
                <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Time Period</p>
                <div className="space-y-1.5">
                  {DATE_RANGES.map(d => (
                    <button key={d.value}
                      onClick={() => onChange({ ...filters, dateRange: d.value as any })}
                      className={`w-full text-left text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        filters.dateRange === d.value
                          ? 'bg-[#f6f8fa] text-[#1c2128] font-bold border border-[#d0d7de]'
                          : 'text-[#57606a] hover:bg-[#ffffff] hover:text-[#1c2128]'
                      }`}>
                      <span>{d.label}</span>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                        filters.dateRange === d.value ? 'bg-[#4F8EF7] shadow-[0_0_8px_#4F8EF7]' : 'bg-[#d0d7de] group-hover:bg-[#8c959f]'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick toggles - Only for pipeline */}
              {mode !== 'discover' && (
                <div>
                  <p className="text-[11px] font-black text-[#8c959f] uppercase tracking-[0.2em] mb-4">Quick Filters</p>
                  <div className="space-y-3">
                    {[
                      { key: 'hasInterview', label: '🎙️ Scheduled Interview' },
                      { key: 'hasOffer', label: '🎉 Received Offer' },
                    ].map(({ key, label }) => (
                      <button key={key}
                        onClick={() => onChange({ ...filters, [key]: !filters[key as keyof FilterState] })}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          filters[key as keyof FilterState]
                            ? 'bg-[#4F8EF7]/10 border-[#4F8EF7]/40 text-[#1c2128] font-bold'
                            : 'bg-[#ffffff] border-[#d0d7de] text-[#57606a]'
                        }`}>
                        <span className="text-xs">{label}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          filters[key as keyof FilterState] ? 'bg-[#4F8EF7] border-[#4F8EF7] shadow-lg shadow-[#4F8EF7]/20' : 'border-[#8c959f]'
                        }`}>
                          {filters[key as keyof FilterState] && <span className="text-[#1c2128] text-[10px] font-black">✓</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#d0d7de] bg-[#ffffff]/50 backdrop-blur-xl flex gap-3">
              <button 
                onClick={onReset}
                className="flex-1 py-3 border border-[#d0d7de] text-[#57606a] hover:text-[#1c2128] hover:bg-white/5 rounded-xl text-xs font-bold transition-all"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-[#1c2128] rounded-xl text-xs font-black transition-all shadow-lg shadow-[#4F8EF7]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
