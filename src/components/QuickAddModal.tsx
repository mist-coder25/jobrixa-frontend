import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Loader2, CheckCircle2, AlertCircle, Building2, Briefcase, MapPin, Globe } from "lucide-react";
import api from "../api/axios";

interface ParsedJob {
  companyName: string;
  jobTitle: string;
  location: string;
  source: string;
  jobUrl: string;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  onPrefill: (data: ParsedJob) => void;
}

const SOURCE_ICONS: Record<string, string> = {
  LINKEDIN: "🔵",
  INTERNSHALA: "🟢",
  NAUKRI: "🟠",
  WELLFOUND: "🟣",
  INDEED: "🔷",
  GLASSDOOR: "🟤",
  OTHER: "🌐",
};

export default function QuickAddModal({ isOpen, onClose, initialUrl = "", onPrefill }: QuickAddModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedJob | null>(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!url.trim() || !url.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setError("");
    setLoading(true);
    setParsed(null);
    try {
      const res = await api.post("/applications/parse-url", { url: url.trim() });
      setParsed(res.data);
    } catch (err) {
      setError("Couldn't fetch details. The site may block scrapers — you can still fill manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!parsed) return;
    onPrefill(parsed);
    handleClose();
  };

  const handleClose = () => {
    setUrl(initialUrl);
    setParsed(null);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="quick-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0d1117]/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            key="quick-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-[#0d1117]  border border-[#30363D] rounded-2xl w-full max-w-lg  overflow-hidden">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#30363D] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-semibold text-[#C9D1D9]">Quick Add from URL</h2>
                    <p className="text-xs text-[#8B949E] mt-0.5">Paste any job listing URL to auto-fill details</p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 text-[#8B949E] hover:text-danger hover:bg-danger/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-medium text-[#8B949E] block">Job Listing URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                      <input
                        type="url"
                        value={url}
                        onChange={e => { setUrl(e.target.value); setError(""); setParsed(null); }}
                        onKeyDown={e => e.key === "Enter" && handleFetch()}
                        className="w-full pl-9 pr-3 py-3 bg-[#0d1117] border border-[#30363D] rounded-xl text-sm text-[#C9D1D9] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        placeholder="https://linkedin.com/jobs/view/..."
                        autoFocus
                      />
                    </div>
                    <motion.button
                      onClick={handleFetch}
                      disabled={loading || !url.trim()}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-3 bg-accent hover:bg-[#5A52E8] text-white rounded-xl text-sm font-semibold flex items-center gap-2  transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                    </motion.button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 px-3 py-2.5 bg-danger/10 border border-danger/25 rounded-lg text-xs text-danger/90"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Parsed Result Preview */}
                <AnimatePresence>
                  {parsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#0d1117] border border-[#30363D] rounded-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-accent/5 border-b border-[#30363D] flex items-center gap-2 text-xs font-medium text-accent">
                        <CheckCircle2 className="w-4 h-4" />
                        Details extracted — confirm to prefill the form
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-[#8B949E] shrink-0" />
                          <div>
                            <p className="text-[10px] text-[#8B949E] uppercase tracking-wider">Company</p>
                            <p className="text-sm font-semibold text-[#C9D1D9]">{parsed.companyName || <span className="text-[#8B949E] italic">Not detected</span>}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-[#8B949E] shrink-0" />
                          <div>
                            <p className="text-[10px] text-[#8B949E] uppercase tracking-wider">Job Title</p>
                            <p className="text-sm font-semibold text-[#C9D1D9]">{parsed.jobTitle || <span className="text-[#8B949E] italic">Not detected</span>}</p>
                          </div>
                        </div>
                        {parsed.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[#8B949E] shrink-0" />
                            <div>
                              <p className="text-[10px] text-[#8B949E] uppercase tracking-wider">Location</p>
                              <p className="text-sm text-[#C9D1D9]">{parsed.location}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-lg">{SOURCE_ICONS[parsed.source] || "🌐"}</span>
                          <span className="text-xs font-medium text-[#8B949E]">Source detected: <span className="text-[#C9D1D9]">{parsed.source}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Supported platforms hint */}
                {!parsed && !loading && (
                  <p className="text-xs text-[#8B949E]/60 text-center">
                    Works with LinkedIn · Naukri · Internshala · Wellfound · Indeed · and more
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#30363D] bg-[#0d1117]/30 flex justify-end gap-3">
                <button onClick={handleClose} className="px-4 py-2 text-sm text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#0d1117]/5 rounded-lg transition-colors">
                  Cancel
                </button>
                {parsed && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-sm font-semibold flex items-center gap-2  transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Add to Tracker
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
