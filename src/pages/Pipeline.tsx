import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DropResult } from "@hello-pangea/dnd";
import api from "../api/axios";
import TopBar from "../components/TopBar";
import KanbanBoard from "../components/KanbanBoard";
import ApplicationDetailPanel from "../components/ApplicationDetailPanel";
import AddApplicationModal from "../components/AddApplicationModal";
import { toast } from "../components/Toast";
import type { JobApplication } from "../components/ApplicationCard";
import { Zap, X } from "lucide-react";

export default function Pipeline() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStatus, setAddStatus] = useState("APPLIED");
  const [_plan, setPlan] = useState("FREE");
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const FREE_LIMIT = 30;
  const WARN_AT = 25;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      const apps = response.data as JobApplication[];
      setApplications(apps);
      // Check upgrade banner
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
    
    // Check if dragging inside the same column
    if (destination.droppableId === source.droppableId) {
      // Reordering logic optional, currently backend doesn't store rank/index so we skip reordering
      return;
    }
    
    // Store original apps for rollback
    const originalApps = [...applications];

    // Optimistic UI update
    setApplications(apps => apps.map(app => 
      app.id === draggableId ? { ...app, status: newStatus } : app
    ));

    try {
      await api.patch(`/applications/${draggableId}/status`, { status: newStatus });
      toast.success(`✅ Moved to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status. Reverting...");
      setApplications(originalApps); // Rollback
      console.error("Pipeline Drag Error:", error);
    }
  };

  const handleAddClick = (status: string) => {
    setAddStatus(status);
    setIsAddModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden bg-primary">
      <TopBar title="My Pipeline" onAddApplication={() => handleAddClick("APPLIED")} />

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
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={fetchApplications} 
        initialStatus={addStatus}
      />
    </div>
  );
}
