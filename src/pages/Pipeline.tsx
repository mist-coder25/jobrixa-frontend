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
import { Zap, Link2, Plus } from "lucide-react";
import FilterPanel, { DEFAULT_FILTERS } from '../components/FilterPanel';
import type { FilterState } from '../components/FilterPanel';
import { trackEvent } from "../utils/analytics";

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

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialUrl, setQuickAddInitialUrl] = useState("");
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const FREE_LIMIT = 30;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedUrl = params.get("url") || params.get("text");
    if (sharedUrl && sharedUrl.startsWith("http")) {
      setQuickAddInitialUrl(sharedUrl);
      setIsQuickAddOpen(true);
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
        setShowUpgradeBanner(p === "FREE" && apps.length >= 25);
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
      trackEvent('card_dragged', { from: source.droppableId, to: destination.droppableId });
    } catch (error) {
      toast.error("Failed to update status. Reverting...");
      setApplications(originalApps);
    }
  };

  const handleAddClick = (status: string) => {
    setPrefillData(undefined);
    setAddStatus(status);
    setIsAddModalOpen(true);
  };

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

  const totalApps = applications.length;
  const activeApps = applications.filter(a => !['REJECTED', 'GHOSTED'].includes(a.status)).length;
  const interviewCount = applications.filter(a => a.status === 'INTERVIEW').length;

  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden">
      <TopBar
        title="My Pipeline"
        subtitle="Your job hunt, organized"
        showSearch
        onFilterClick={() => setFilterOpen(true)}
        activeFilterCount={filters.status.length + filters.source.length + (filters.dateRange !== 'all' ? 1 : 0)}
      >
        <div className="flex items-center gap-3">
          <div className="text-right mr-4 hidden md:block">
            <div className="flex gap-4 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
               <span>{totalApps} Total</span>
               <span>{activeApps} Active</span>
               <span>{interviewCount} Interviews</span>
            </div>
          </div>
          <button
            onClick={() => { setQuickAddInitialUrl(""); setIsQuickAddOpen(true); }}
            className="btn-outline px-4 py-2 text-xs"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">From URL</span>
          </button>
          
          <button
            onClick={() => handleAddClick("APPLIED")}
            className="btn-primary px-4 py-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Add Application</span>
          </button>
        </div>
      </TopBar>

      {/* Progress indicators Header */}
      <div className="px-6 py-2 border-b border-[var(--border)] bg-[var(--bg-main)]/50">
          <div className="flex gap-1">
              {['SAVED','APPLIED','OA','INTERVIEW','OFFER'].map((s) => (
                  <div key={s} className="flex-1 h-1 rounded-full bg-[var(--border)] overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] transition-all duration-500"
                        style={{ width: applications.some(a => a.status === s) ? '100%' : '0%' }}
                      />
                  </div>
              ))}
          </div>
      </div>

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <div className="mx-6 mt-4 flex items-center justify-between gap-3 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 rounded-xl px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[var(--accent-orange)]" />
            <span className="text-white font-medium">
              You've used <strong>{applications.length}/{FREE_LIMIT}</strong> free applications.
            </span>
          </div>
          <Link to="/pricing" className="text-[var(--accent-orange)] font-bold hover:underline">Upgrade to Pro →</Link>
        </div>
      )}
      
      {loading ? (
        <KanbanBoard 
          applications={[]} 
          onDragEnd={onDragEnd} 
          onCardClick={(app) => setSelectedApp(app)} 
          onAddClick={handleAddClick} 
          loading={true}
        />
      ) : applications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-main)]">
           <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-6">
              <Plus size={48} className="text-[var(--border)]" />
           </div>
           <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
           <p className="text-[var(--text-secondary)] max-w-sm mb-8">
             Add your first job application and start tracking. You'll never lose another OA link.
           </p>
           <button
             onClick={() => handleAddClick("APPLIED")}
             className="btn-primary px-8 py-4"
           >
             <Plus className="w-5 h-5" />
             Add First Application
           </button>
        </div>
      ) : (
        <KanbanBoard 
          applications={applications.filter(app => {
            if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
            if (filters.source.length > 0 && (!app.source || !filters.source.includes(app.source))) return false;
            return true;
          })} 
          onDragEnd={onDragEnd} 
          onCardClick={(app) => setSelectedApp(app)} 
          onAddClick={handleAddClick} 
          loading={false}
        />
      )}

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <ApplicationDetailPanel 
        app={selectedApp} 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        onUpdate={() => { fetchApplications(); setSelectedApp(null); }}
      />
      
      <AddApplicationModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setPrefillData(undefined); }}
        onAdded={fetchApplications} 
        initialStatus={addStatus}
        prefill={prefillData}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => { setIsQuickAddOpen(false); setQuickAddInitialUrl(""); }}
        initialUrl={quickAddInitialUrl}
        onPrefill={handleQuickAddPrefill}
      />
    </div>
  );
}
