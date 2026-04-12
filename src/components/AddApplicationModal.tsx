import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyLogo from "./CompanyLogo";
import { X, Building2, Link, Loader2 } from "lucide-react";
import api from "../api/axios";
import { toast } from "./Toast";
import { trackEvent } from "../utils/analytics";

interface PrefillData {
  companyName?: string;
  companyDomain?: string;
  jobTitle?: string;
  jobUrl?: string;
  source?: string;
}

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
  initialStatus?: string;
  prefill?: PrefillData;
}

export default function AddApplicationModal({ isOpen, onClose, onAdded, initialStatus, prefill }: AddApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyDomain: "",
    jobTitle: "",
    jobUrl: "",
    source: "LinkedIn",
    status: "APPLIED",
    appliedAt: new Date().toISOString().split('T')[0],
    deadline: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    tags: "",
    priority: "MEDIUM",
    jobDescription: "",
    isRemote: false
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        status: initialStatus || "APPLIED",
        companyName: prefill?.companyName ?? "",
        companyDomain: prefill?.companyDomain ?? "",
        jobTitle: prefill?.jobTitle ?? "",
        jobUrl: prefill?.jobUrl ?? "",
        source: prefill?.source ?? "LinkedIn",
      }));
    }
  }, [isOpen, initialStatus, prefill]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        deadline: formData.deadline || null,
        tags: tagsArray
      };
      await api.post("/applications", payload);
      toast.success(`Application saved!`);
      onAdded();
      trackEvent('application_added');
      onClose();
    } catch (err) {
      toast.error("Failed to add application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl shadow-black/80"
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 text-white overflow-hidden">
                            {formData.companyName ? (
                                <CompanyLogo companyName={formData.companyName} domain={formData.companyDomain} size={48} containerPadding="p-0" />
                            ) : (
                                <Building2 size={24} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Add Application</h2>
                            <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-[0.1em]">Track a new journey</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-main)] text-[var(--text-tertiary)] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Company Name</label>
                            <input 
                                required value={formData.companyName} onChange={e => handleChange("companyName", e.target.value)}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                placeholder="Google, Amazon..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Job Title</label>
                            <input 
                                required value={formData.jobTitle} onChange={e => handleChange("jobTitle", e.target.value)}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                placeholder="SDE-1, Product Intern..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Application Status</label>
                            <select 
                                value={formData.status} onChange={e => handleChange("status", e.target.value)}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none appearance-none"
                            >
                                <option value="SAVED">Saved for later</option>
                                <option value="APPLIED">Applied</option>
                                <option value="OA">OA / Assessment</option>
                                <option value="INTERVIEW">Interviewing</option>
                                <option value="OFFER">Offer Received</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Application Date</label>
                            <input 
                                type="date" value={formData.appliedAt} onChange={e => handleChange("appliedAt", e.target.value)}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none [color-scheme:dark]" 
                            />
                        </div>
                    </div>

                    {/* Links & metadata */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Job URL</label>
                            <div className="relative">
                                <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                                <input 
                                    value={formData.jobUrl} onChange={e => handleChange("jobUrl", e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                    placeholder="https://linked.com/jobs/..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Location</label>
                                <input 
                                    value={formData.location} onChange={e => handleChange("location", e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                    placeholder="Bangalore, Hybrid..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Source</label>
                                <select 
                                    value={formData.source} onChange={e => handleChange("source", e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none appearance-none"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Naukri">Naukri</option>
                                    <option value="Wellfound">Wellfound</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Direct">Direct</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Complex details */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Job Description / Notes</label>
                        <textarea 
                            value={formData.jobDescription} onChange={e => handleChange("jobDescription", e.target.value)}
                            className="w-full h-32 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-4 text-sm focus:border-[var(--primary)] outline-none resize-none" 
                            placeholder="Key requirements, interview dates, thoughts..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-[var(--border)] bg-[var(--bg-card)]/50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest hidden sm:block">All fields are auto-saved locally</p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button type="button" onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 font-bold text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:text-white transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 sm:flex-none btn-primary px-8 py-3 shadow-xl shadow-[var(--primary)]/20"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Application"}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
