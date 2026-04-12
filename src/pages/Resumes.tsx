import { useState, useRef } from "react";
import { FileText, Upload, Eye, Trash2, X, CheckCircle2, Loader2, Plus } from "lucide-react";
import TopBar from "../components/TopBar";
import { toast } from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeEntry {
  id: string;
  label: string;
  version: string;
  filename: string;
  uploadedAt: string;
  fileUrl: string;
  fileObj?: File;
}

export default function Resumes() {
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("v1");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setLabel("");
    setVersion("v1");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) { toast.error("Please enter a label"); return; }
    if (!selectedFile) { toast.error("Please select a PDF file"); return; }

    setUploading(true);
    await new Promise(res => setTimeout(res, 800));

    const entry: ResumeEntry = {
      id: crypto.randomUUID(),
      label: label.trim(),
      version: version.trim() || "v1",
      filename: selectedFile.name,
      uploadedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      fileUrl: URL.createObjectURL(selectedFile),
      fileObj: selectedFile,
    };
    setResumes(prev => [entry, ...prev]);
    setUploading(false);
    setIsModalOpen(false);
    toast.success("✅ Resume uploaded successfully");
  };

  const handleDelete = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    setDeleteTarget(null);
    toast.success("Resume deleted");
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <TopBar 
        title="Resume Library" 
        subtitle="Manage and track your resume versions"
      >
        <button
          onClick={openModal}
          className="btn-primary py-2 px-4 shadow-none text-xs"
        >
          <Upload size={14} /> Upload Resume
        </button>
      </TopBar>

      <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-6">
              <FileText size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No resumes yet</h3>
            <p className="text-[var(--text-secondary)] max-w-sm mb-8 leading-relaxed">
              Upload your resume versions to track which one gets the best callbacks from recruiters.
            </p>
            <button
              onClick={openModal}
              className="btn-primary py-4 px-10"
            >
              <Plus size={18} /> Upload Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[var(--text-tertiary)] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[var(--accent-red)]/5 border border-[var(--accent-red)]/10 flex items-center justify-center shrink-0">
                    <FileText size={28} className="text-[var(--accent-red)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white truncate">{resume.label}</h3>
                      <span className="px-2 py-0.5 bg-[var(--primary)] text-white text-[9px] font-black rounded-full uppercase tracking-tighter">
                        {resume.version}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 truncate font-medium">{resume.filename}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest mt-2">Added {resume.uploadedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Eye size={14} /> Preview
                  </a>
                  <button
                    onClick={() => setDeleteTarget(resume.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:border-[var(--accent-red)] text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Upload Resume</h2>
                        <p className="text-xs text-[var(--text-tertiary)] font-bold uppercase tracking-wider">PDF files only</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleUpload} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Resume Label</label>
                        <input
                            required value={label} onChange={e => setLabel(e.target.value)}
                            className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                            placeholder="e.g. SDE Resume v2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Version</label>
                        <input
                            value={version} onChange={e => setVersion(e.target.value)}
                            className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                            placeholder="e.g. v2"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Select File</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                selectedFile ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]/50"
                            }`}
                        >
                            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                            {selectedFile ? (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 size={32} className="text-[var(--primary)]" />
                                    <span className="text-sm font-bold truncate max-w-full px-4">{selectedFile.name}</span>
                                </div>
                            ) : (
                                <div>
                                    <Upload size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Click to browse PDF</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Cancel</button>
                        <button
                            type="submit" disabled={uploading}
                            className="flex-1 btn-primary py-4 shadow-lg shadow-[var(--primary)]/20"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : "Upload Now"}
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
          {deleteTarget && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-md" />
                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={24} className="text-[var(--accent-red)]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Delete Resume?</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-8">This action is permanent and cannot be undone. Are you sure?</p>
                    <div className="flex gap-4">
                        <button onClick={() => setDeleteTarget(null)} className="flex-1 font-bold text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Cancel</button>
                        <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-3 bg-[var(--accent-red)] hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Delete</button>
                    </div>
                </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
}
