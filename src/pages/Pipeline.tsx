import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { DropResult } from "@hello-pangea/dnd";
import api from "../api/axios";
import TopBar from "../components/TopBar";
import KanbanBoard from "../components/KanbanBoard";
import ApplicationDetailPanel from "../components/ApplicationDetailPanel";
import AddApplicationModal from "../components/AddApplicationModal";
import QuickAddModal from "../components/QuickAddModal";
import { toast } from "../components/Toast";
import type { JobApplication } from "../components/ApplicationCard";
import { Zap, X, Link2 } from "lucide-react";

export default function Pipeline() {
  const location = useLocation();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStatus, setAddStatus] = useState("APPLIED");
  const [prefillData, setPrefillData] = useState<{
    companyName?: string; jobTitle?: string; jobUrl?: string; location?: string; source?: string;
  } | undefined>(undefined);
  const [_plan, setPlan] = useState("FREE");
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  // Quick Add from URL state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialUrl, setQuickAddInitialUrl] = useState("");

  const FREE_LIMIT = 30;
  const WARN_AT = 25;

  // Detect Android/desktop share-sheet URL via query params (?url=... or ?text=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedUrl = params.get("url") || params.get("text");
    if (sharedUrl && sharedUrl.startsWith("http")) {
      setQuickAddInitialUrl(sharedUrl);
      setIsQuickAddOpen(true);
      // Clean the URL so refreshing doesn't re-open it
      window.history.replaceState({}, "", "/pipeline");
    }
  }, [location.search]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      const apps = response.data as JobApplication[];
      setApplications(apps);
      try {
        const statusRes = await api.get("/payments/status");
        const p = (statusRes.data as { plan: string; isActive: boolean }).plan;
        setPlan(p);
        const isFree = p === "FREE";
        setShowUpgradeBanner(isFree && apps.length >= WARN_AT);
      } catch { /* ignore */ }
    } catch (error) {
      toast.error("Failed to load pipeline data");
      console.error("Pipeline load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    if (destination.droppableId === source.droppableId) return;

    const originalApps = [...applications];
    setApplications(apps =>
      apps.map(app => app.id === draggableId ? { ...app, status: newStatus } : app)
    );

    try {
      await api.patch(`/applications/${draggableId}/status`, { status: newStatus });
      toast.success(`✅ Moved to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status. Reverting...");
      setApplications(originalApps);
      console.error("Pipeline Drag Error:", error);
    }
  };

  const handleAddClick = (status: string) => {
    setPrefillData(undefined);
    setAddStatus(status);
    setIsAddModalOpen(true);
  };

  // Called when QuickAddModal confirms parsed data → open AddApplicationModal pre-filled
  const handleQuickAddPrefill = (data: {
    companyName: string; jobTitle: string; location: string; source: string; jobUrl: string;
  }) => {
    setPrefillData({
      companyName: data.companyName,
      jobTitle:    data.jobTitle,
      jobUrl:      data.jobUrl,
      source:      data.source,
    });
    setAddStatus("APPLIED");
    setIsAddModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden bg-primary">
      <TopBar
        title="My Pipeline"
        subtitle="Your job hunt, organized"
        onAddApplication={() => handleAddClick("APPLIED")}
        onQuickAdd={() => { setQuickAddInitialUrl(""); setIsQuickAddOpen(true); }}
      />

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <div className="mx-4 mt-3 flex items-center justify-between gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-400 shrink-0" />
            <span className="text-yellow-300 font-medium">
              You've used <strong>{applications.length}/{FREE_LIMIT}</strong> free applications.
            </span>
            <span className="text-yellow-400/70 hidden sm:inline">Upgrade to Pro for unlimited tracking.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/pricing"
              className="flex items-center gap-1 px-3 py-1.5 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-xs font-semibold transition-all"
            >
              <Zap size={11} /> Upgrade Now
            </Link>
            <button
              onClick={() => setShowUpgradeBanner(false)}
              className="text-yellow-400/60 hover:text-yellow-400 transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      <KanbanBoard 
        applications={applications} 
        onDragEnd={onDragEnd} 
        onCardClick={setSelectedApp} 
        onAddClick={handleAddClick} 
        loading={loading}
      />

      <ApplicationDetailPanel 
        app={selectedApp} 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        onUpdate={() => {
          fetchApplications();
          setSelectedApp(null);
        }}
      />
      
      <AddApplicationModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setPrefillData(undefined); }}
        onAdded={fetchApplications} 
        initialStatus={addStatus}
        prefill={prefillData}
      />

      {/* Quick Add from URL modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => { setIsQuickAddOpen(false); setQuickAddInitialUrl(""); }}
        initialUrl={quickAddInitialUrl}
        onPrefill={handleQuickAddPrefill}
      />

      {/* Floating Quick Add button for mobile */}
      <button
        onClick={() => { setQuickAddInitialUrl(""); setIsQuickAddOpen(true); }}
        className="md:hidden fixed bottom-32 right-4 w-12 h-12 bg-surface border border-border text-accent rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-40"
        title="Quick Add from URL"
      >
        <Link2 className="w-5 h-5" />
      </button>
    </div>
  );
}
