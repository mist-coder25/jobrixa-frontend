import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyLogo from "./CompanyLogo";
import { X, Building2, Briefcase, Link, MapPin, DollarSign, Calendar, Tags, CheckCircle2, Loader2, Globe } from "lucide-react";
import api from "../api/axios";
import { toast } from "./Toast";

interface PrefillData {
  companyName?: string;
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
    jobTitle: "",
    jobUrl: "",
    source: "LinkedIn",
    status: "APPLIED",
    appliedAt: new Date().toISOString().split('T')[0],
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
      // Tags comma separated to array
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        tags: tagsArray
      };

      await api.post("/applications", payload);
      toast.success(`✅ Application added to ${formData.status}`);
      onAdded();
      onClose();
      // Reset form could go here
    } catch (err) {
      toast.error("Failed to add application");
    } finally {
      setLoading(false);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal container */}
          <motion.div
            key="modal-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
          <div className="pointer-events-auto bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30 text-accent relative overflow-hidden">
                 {formData.companyName ? (
                   <CompanyLogo companyName={formData.companyName} size={40} containerPadding="p-0" />
                 ) : (
                     <Building2 className="w-5 h-5" />
                 )}
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-textPrimary leading-tight">Add Application</h2>
              <p className="text-xs text-textSecondary uppercase tracking-wider font-medium mt-0.5">Track a new opportunity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="add-app-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                  <input 
                    type="text" required
                    value={formData.companyName} onChange={e => handleChange("companyName", e.target.value)}
                    className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all text-textPrimary placeholder:text-textSecondary/50"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Role / Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                  <input 
                    type="text" required
                    value={formData.jobTitle} onChange={e => handleChange("jobTitle", e.target.value)}
                    className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all text-textPrimary placeholder:text-textSecondary/50"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Status</label>
                <select 
                  value={formData.status} onChange={e => handleChange("status", e.target.value)}
                  className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:border-accent text-textPrimary"
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
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Date Applied</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                  <input 
                    type="date" 
                    value={formData.appliedAt} onChange={e => handleChange("appliedAt", e.target.value)}
                    className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent text-textPrimary [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Job URL (Optional)</label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input 
                  type="url" 
                  value={formData.jobUrl} onChange={e => handleChange("jobUrl", e.target.value)}
                  className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent transition-all text-textPrimary placeholder:text-textSecondary/50"
                  placeholder="https://..."
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* Extra Details toggleable or direct */}
            <h3 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
               <Globe className="w-4 h-4 text-accent" /> Opportunity Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Source</label>
                <select 
                  value={formData.source} onChange={e => handleChange("source", e.target.value)}
                  className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:border-accent text-textPrimary"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Internshala">Internshala</option>
                  <option value="Naukri">Naukri</option>
                  <option value="Wellfound">Wellfound (AngelList)</option>
                  <option value="Referral">Referral</option>
                  <option value="Campus">Campus / TPO</option>
                  <option value="Direct">Direct Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Priority Level</label>
                 <select 
                   value={formData.priority} onChange={e => handleChange("priority", e.target.value)}
                   className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:border-accent text-textPrimary"
                 >
                   <option value="DREAM">Dream (Top Choice)</option>
                   <option value="HIGH">High (Strong Match)</option>
                   <option value="MEDIUM">Medium (Standard)</option>
                   <option value="LOW">Low (Backup)</option>
                 </select>
               </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Location</label>
                <div className="flex gap-2 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary z-10" />
                  <input 
                    type="text" 
                    value={formData.location} onChange={e => handleChange("location", e.target.value)}
                    className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent text-textPrimary placeholder:text-textSecondary/50"
                    placeholder="City, Country"
                  />
                  <label className="flex items-center gap-2 shrink-0 bg-primary border border-border rounded-lg px-3 text-sm cursor-pointer hover:border-accent transition-colors">
                     <input type="checkbox" checked={formData.isRemote} onChange={e => handleChange("isRemote", e.target.checked)} className="accent-accent" />
                     <span className="text-textSecondary">Remote</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Salary Range</label>
                <div className="flex items-center gap-2 relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary z-10" />
                  <input 
                    type="number" 
                    value={formData.salaryMin} onChange={e => handleChange("salaryMin", e.target.value)}
                    className="w-1/2 bg-primary border border-border rounded-lg pl-9 pr-2 py-2.5 text-sm focus:border-accent text-textPrimary placeholder:text-textSecondary/50"
                    placeholder="Min"
                  />
                  <span className="text-textSecondary">-</span>
                  <input 
                    type="number" 
                    value={formData.salaryMax} onChange={e => handleChange("salaryMax", e.target.value)}
                    className="w-1/2 bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:border-accent text-textPrimary placeholder:text-textSecondary/50"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Tags</label>
               <div className="relative">
                 <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                 <input 
                   type="text" 
                   value={formData.tags} onChange={e => handleChange("tags", e.target.value)}
                   className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent transition-all text-textPrimary placeholder:text-textSecondary/50"
                   placeholder="React, Backend, High Salary (comma separated)"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs uppercase tracking-wider font-medium text-textSecondary block">Notes</label>
               <textarea 
                  value={formData.jobDescription} onChange={e => handleChange("jobDescription", e.target.value)}
                  className="w-full h-24 bg-primary border border-border rounded-lg p-3 text-sm focus:border-accent resize-none text-textPrimary placeholder:text-textSecondary/50"
                  placeholder="Paste job description or quick thoughts..."
               ></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-app-form"
            disabled={loading}
            className="px-6 py-2 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Tracking</>}
          </button>
        </div>

          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
