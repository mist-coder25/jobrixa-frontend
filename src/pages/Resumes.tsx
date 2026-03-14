import { useState, useRef } from "react";
import { FileText, Upload, Eye, Trash2, FileUp, X, CheckCircle2, Loader2 } from "lucide-react";
import TopBar from "../components/TopBar";
import { toast } from "../components/Toast";

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

  // Form state
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
    await new Promise(res => setTimeout(res, 800)); // simulate upload

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
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      <TopBar 
        title="My Resumes" 
        subtitle="Store different resume versions and track which one gets the most callbacks."
      >
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,142,247,0.3)]"
        >
          <Upload size={15} /> 
          <span className="hidden md:inline">Upload Resume</span>
        </button>
      </TopBar>

      <div className="p-6 md:p-8 flex-1">
        {resumes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(108,99,255,0.05)]">
              <FileText size={40} className="text-textSecondary opacity-50" />
            </div>
            <h3 className="text-xl font-display font-semibold text-textPrimary mb-2">No resumes yet</h3>
            <p className="text-textSecondary text-sm max-w-xs leading-relaxed mb-6">
              Upload your resume versions to track which one gets the best callbacks
            </p>
            <button
              onClick={openModal}
              className="flex items-center gap-2 bg-accent hover:bg-[#5A52E8] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_20px_rgba(108,99,255,0.3)]"
            >
              <Upload size={16} /> Upload Resume
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-textPrimary">{resumes.length} {resumes.length === 1 ? "resume" : "resumes"} uploaded</h2>
                <p className="text-sm text-textSecondary">Manage your resume library</p>
              </div>
              <button
                onClick={openModal}
                className="flex items-center gap-2 bg-accent hover:bg-[#5A52E8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)]"
              >
                <Upload size={15} /> Upload Resume
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-accent/40 transition-all group hover:shadow-[0_4px_24px_rgba(108,99,255,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <FileText size={28} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold text-textPrimary truncate">{resume.label}</h3>
                        <span className="px-2 py-0.5 bg-accent/15 text-accent text-xs font-bold rounded-full border border-accent/25 shrink-0">
                          {resume.version}
                        </span>
                      </div>
                      <p className="text-xs text-textSecondary mt-1 truncate">{resume.filename}</p>
                      <p className="text-xs text-textSecondary/60 mt-0.5">Uploaded {resume.uploadedAt}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-textSecondary hover:text-textPrimary hover:border-accent/40 hover:bg-accent/5 text-sm font-medium transition-all"
                    >
                      <Eye size={14} /> Preview
                    </a>
                    <button
                      onClick={() => setDeleteTarget(resume.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-textSecondary hover:text-danger hover:border-danger/40 hover:bg-danger/5 text-sm font-medium transition-all"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <FileUp size={18} className="text-accent" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-textPrimary">Upload Resume</h2>
                  <p className="text-xs text-textSecondary">PDF files only</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full text-textSecondary hover:text-danger transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-medium text-textSecondary tracking-wider">Resume Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. Backend Resume v2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-medium text-textSecondary tracking-wider">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. v2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-medium text-textSecondary tracking-wider">PDF File *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    selectedFile ? "border-accent/50 bg-accent/5" : "border-border hover:border-accent/40 hover:bg-accent/3"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-accent">
                      <CheckCircle2 size={20} />
                      <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-textSecondary">
                      <Upload size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Click to choose PDF</p>
                      <p className="text-xs mt-1 opacity-60">or drag & drop here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-sm font-medium transition-all disabled:opacity-70"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-danger/15 border border-danger/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-danger" />
              </div>
              <h3 className="font-display font-semibold text-textPrimary mb-1">Delete Resume?</h3>
              <p className="text-sm text-textSecondary mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTarget)}
                  className="flex-1 py-2.5 bg-danger hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
