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
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

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
      trackEvent('card_dragged', { from: source.droppableId, to: destination.droppableId });
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

  // Calculate health stats
  const totalApps = applications.length;
  const activeApps = applications.filter(a => !['REJECTED', 'GHOSTED'].includes(a.status)).length;
  const interviewCount = applications.filter(a => a.status === 'INTERVIEW').length;

  const counts: Record<string, number> = {};
  applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });

  const COLUMN_COLORS: Record<string, string> = {
    SAVED: '#7D8590',
    APPLIED: '#4F8EF7',
    OA: '#D29922',
    INTERVIEW: '#A371F7',
    OFFER: '#3FB950',
    GHOSTED: '#484F58'
  };

  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden bg-primary">
      <TopBar
        title="My Pipeline"
        subtitle="Your job hunt, organized"
        showSearch
        onFilterClick={() => setFilterOpen(true)}
        activeFilterCount={filters.status.length + filters.source.length + (filters.dateRange !== 'all' ? 1 : 0) + (filters.hasInterview ? 1 : 0) + (filters.hasOffer ? 1 : 0)}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setQuickAddInitialUrl(""); setIsQuickAddOpen(true); }}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-sm font-medium text-[#7D8590] hover:text-[#4F8EF7] hover:border-[#4F8EF7]/50 transition-all"
            title="Quick Add from URL"
          >
            <Link2 className="w-4 h-4" />
            <span>From URL</span>
          </button>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-[#4F8EF7] rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
            <button
              onClick={() => handleAddClick("APPLIED")}
              className="relative bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(79,142,247,0.4)] transition-all"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden md:inline">Add Application</span>
            </button>
          </div>
        </div>
      </TopBar>

      {/* Application progress bar — shows how active the job hunt is */}
      <div className="px-6 py-3 border-b border-[#21262D] flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-[#0D1117]">
        {/* Stage progress */}
        <div className="flex items-center gap-1.5 flex-1 w-full max-w-xl">
          {['SAVED','APPLIED','OA','INTERVIEW','OFFER'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-1.5 flex-1">
              <div 
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{ 
                  background: counts[stage] > 0 ? COLUMN_COLORS[stage] : '#21262D'
                }} 
              />
              {i < 4 && <div className="w-1 h-1 rounded-full bg-[#30363D]" />}
            </div>
          ))}
        </div>
        {/* Quick stats */}
        <div className="flex items-center justify-between md:justify-start gap-4 text-xs font-medium">
          <span className="text-[#7D8590]">
            <span className="text-[#E6EDF3]">{totalApps}</span> total
          </span>
          <span className="text-[#7D8590]">
            <span className="text-[#3FB950]">{activeApps}</span> active
          </span>
          <span className="text-[#7D8590]">
            <span className="text-[#D29922]">{interviewCount}</span> interviews
          </span>
        </div>
      </div>

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
        applications={applications.filter(app => {
          if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
          if (filters.source.length > 0 && (!app.source || !filters.source.includes(app.source))) return false;
          if (filters.dateRange === '7days' && app.appliedAt) {
            const d = new Date(); d.setDate(d.getDate() - 7);
            if (new Date(app.appliedAt!) < d) return false;
          }
          if (filters.dateRange === '30days' && app.appliedAt) {
            const d = new Date(); d.setDate(d.getDate() - 30);
            if (new Date(app.appliedAt!) < d) return false;
          }
          if (filters.dateRange === '3months' && app.appliedAt) {
            const d = new Date(); d.setMonth(d.getMonth() - 3);
            if (new Date(app.appliedAt!) < d) return false;
          }
          if (filters.hasOffer && app.status !== 'OFFER') return false;
          if (filters.hasInterview && app.status !== 'INTERVIEW') return false;
          return true;
        })} 
        onDragEnd={onDragEnd} 
        onCardClick={setSelectedApp} 
        onAddClick={handleAddClick} 
        loading={loading}
      />

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
