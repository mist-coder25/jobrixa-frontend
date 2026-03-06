import { useEffect, useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import api from "../api/axios";
import TopBar from "../components/TopBar";
import KanbanBoard from "../components/KanbanBoard";
import ApplicationDetailPanel from "../components/ApplicationDetailPanel";
import AddApplicationModal from "../components/AddApplicationModal";
import { toast } from "../components/Toast";
import type { JobApplication } from "../components/ApplicationCard";

export default function Pipeline() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStatus, setAddStatus] = useState("APPLIED");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
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
