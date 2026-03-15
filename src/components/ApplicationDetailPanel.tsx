import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyLogo from "./CompanyLogo";
import { X, ExternalLink, Calendar, MapPin, Target, Globe, FileText, CheckCircle2 } from "lucide-react";
import type { JobApplication } from "./ApplicationCard";
import api from "../api/axios";
import { toast } from "./Toast";
import { format, parseISO } from "date-fns";

interface DetailPanelProps {
  app: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ApplicationDetailPanel({ app, isOpen, onClose, onUpdate }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Editable states for overview
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (app && isOpen) {
      setCompanyName(app.companyName || "");
      setJobTitle(app.jobTitle || "");
      setStatus(app.status || "SAVED");
      setJobUrl(app.jobUrl || "");
      setLocation(app.location || "");
      setSource(app.source || "Other");
      setPriority(app.priority || "MEDIUM");
      setDeadline(app.deadline || "");
      setIsRemote(app.isRemote || false);
      setNotes(app.notes || "");
      if (activeTab === "timeline") {
        fetchEvents(app.id);
      }
    }
  }, [app, isOpen, activeTab]);

  const fetchEvents = async (id: string) => {
    setLoadingEvents(true);
    try {
      const res = await api.get(`/applications/${id}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const saveChanges = async () => {
    if (!app) return;
    try {
      await api.put(`/applications/${app.id}`, {
        ...app,
        companyName,
        jobTitle,
        status,
        jobUrl,
        location,
        source,
        priority,
        deadline,
        isRemote
      });
      toast.success("Application updated");
      onUpdate();
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    if (!app) return;
    if (window.confirm("Are you sure you want to remove this application?")) {
      try {
        await api.delete(`/applications/${app.id}`);
        toast.success("Application removed");
        onClose();
        onUpdate();
      } catch (err) {
        toast.error("Failed to delete application");
      }
    }
  };

  const saveNotes = async () => {
    if (!app) return;
    setSavingNotes(true);
    try {
      await api.put(`/applications/${app.id}`, { 
        ...app, 
        notes: notes 
      });
      toast.success("Notes saved!");
      onUpdate();
    } catch (err) {
      toast.error("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  if (!isOpen || !app) {
    return null;
  }



  const tagList = typeof app.tags === 'string' 
    ? app.tags.split(',').filter(Boolean) 
    : (app.tags || []);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide Out Panel */}
      <motion.div
        key="panel"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed top-0 right-0 z-50 h-full w-full md:w-[450px] bg-surface shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col border-l border-border"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-border relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-textSecondary transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 mt-2">
            <CompanyLogo companyName={companyName} size={64} className="border border-border/50 shadow-sm" containerPadding="p-2" />
            <div className="flex-1 pr-6 space-y-2">
              <input 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-xl font-display font-bold text-textPrimary leading-tight focus:ring-0 placeholder:text-textSecondary/30"
                placeholder="Company Name"
              />
              <input 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm text-textSecondary focus:ring-0 placeholder:text-textSecondary/30"
                placeholder="Job Title"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <select 
              className="bg-primary border border-border text-sm text-textPrimary rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                // auto-save status change could go here, or rely on manual save
              }}
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="OA">OA / Assessment</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="GHOSTED">Ghosted</option>
            </select>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex items-center px-6 py-3 border-b border-border bg-primary/30 text-xs text-textSecondary overflow-x-auto gap-6 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4" />
            <select 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Internshala">Internshala</option>
              <option value="Naukri">Naukri</option>
              <option value="Wellfound">Wellfound</option>
              <option value="Referral">Referral</option>
              <option value="Campus">Campus</option>
              <option value="Direct">Direct</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="w-4 h-4" />
            <span>{app.appliedAt ? format(parseISO(app.appliedAt), 'MMM d, yyyy') : "Not applied"}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Target className="w-4 h-4" />
            <span>{priority}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6 pt-4 shrink-0 overflow-x-auto">
          {["overview", "timeline", "notes"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? "border-accent text-accent" : "border-transparent text-textSecondary hover:text-textPrimary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Job URL</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="flex-1 bg-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    placeholder="https://"
                  />
                  {jobUrl && (
                    <a href={jobUrl} target="_blank" rel="noreferrer" className="p-2 bg-primary border border-border rounded-lg hover:border-accent hover:text-accent transition-colors flex items-center">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-accent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Remote?</label>
                  <label className="flex items-center gap-2 cursor-pointer h-[38px] px-3 border border-border rounded-lg bg-primary hover:border-accent transition-colors">
                    <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="accent-accent" />
                    <span className="text-sm">Yes</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Deadline / Event</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                    <input 
                      type="date" 
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-primary border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-accent [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Priority</label>
                  <select 
                    className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="DREAM">DREAM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              {tagList.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-textSecondary font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagList.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-surface border border-border rounded-md text-xs font-medium text-textPrimary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={saveChanges}
                  className="flex-1 bg-accent hover:bg-[#5A52E8] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="Delete Application"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
              {loadingEvents ? (
                <div className="text-center text-textSecondary text-sm py-8">Loading history...</div>
              ) : events.length === 0 ? (
                <div className="text-center text-textSecondary text-sm py-8">No history recorded yet.</div>
              ) : (
                <div className="relative border-l-2 border-border ml-3 space-y-8">
                  {events.map((ev) => (
                    <div key={ev.id} className="relative pl-6">
                      <span className="absolute -left-[11px] top-1 w-5 h-5 bg-surface border-2 border-accent rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                      </span>
                      <h4 className="text-sm font-semibold text-textPrimary">{ev.description}</h4>
                      {ev.oldValue && ev.newValue && (
                        <p className="text-xs text-textSecondary mt-1">
                          Changed from <span className="text-textPrimary">{ev.oldValue}</span> to <span className="text-accent">{ev.newValue}</span>
                        </p>
                      )}
                      {!ev.oldValue && ev.newValue && (
                        <p className="text-xs text-textSecondary mt-1">
                          Status: <span className="text-accent">{ev.newValue}</span>
                        </p>
                      )}
                      <span className="text-[10px] text-textSecondary/70 mt-2 block uppercase tracking-wider">
                        {format(new Date(ev.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300 h-full flex flex-col">
               <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full flex-1 bg-primary border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent resize-none placeholder:text-textSecondary/50 font-sans leading-relaxed"
                  placeholder="Record your thoughts, interview questions, research links..."
               ></textarea>
               <button 
                 onClick={saveNotes}
                 disabled={savingNotes}
                 className="w-full bg-[#21262D] hover:bg-[#30363D] text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
               >
                  {savingNotes ? "Saving..." : "Save Notes"}
               </button>

               {!notes && (
                 <div className="flex flex-col items-center justify-center text-textSecondary py-10 opacity-60">
                    <FileText className="w-8 h-8 mb-2" />
                    <p className="text-sm">No notes added yet</p>
                 </div>
               )}
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
