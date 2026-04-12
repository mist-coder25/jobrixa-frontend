import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import ApplicationCard from "./ApplicationCard";
import type { JobApplication } from "./ApplicationCard";
import { Plus, Rocket, Clipboard, Laptop, Mic, Trophy, ThumbsDown, Ghost } from "lucide-react";

const COLUMN_SPECS: Record<string, { title: string; icon: React.ReactNode; desc: string; hint: string; color: string }> = {
  SAVED: {
    title: "Saved",
    icon: <Rocket size={16} />,
    desc: "Jobs you're eyeing",
    hint: "Paste a URL to quick add",
    color: "var(--accent-gray)"
  },
  APPLIED: {
    title: "Applied",
    icon: <Clipboard size={16} />,
    desc: "Applied jobs show here",
    hint: "Track every application you send",
    color: "var(--primary)"
  },
  OA: {
    title: "OA/Assessment",
    icon: <Laptop size={16} />,
    desc: "Got an OA? Add it here",
    hint: "Online assessments & coding rounds",
    color: "var(--accent-orange)"
  },
  INTERVIEW: {
    title: "Interview",
    icon: <Mic size={16} />,
    desc: "Interview stage",
    hint: "You're close — prep hard!",
    color: "var(--accent-purple)"
  },
  OFFER: {
    title: "Offer",
    icon: <Trophy size={16} />,
    desc: "Offers land here",
    hint: "This is what we're working toward",
    color: "var(--accent-green)"
  },
  REJECTED: {
    title: "Rejected",
    icon: <ThumbsDown size={16} />,
    desc: "Every no is closer to yes",
    hint: "Track rejections to spot patterns",
    color: "var(--accent-red)"
  },
  GHOSTED: {
    title: "Ghosted",
    icon: <Ghost size={16} />,
    desc: "Ghosted companies appear here",
    hint: "No response after 14 days = ghosted",
    color: "var(--accent-gray)"
  },
};

const STATUS_COLUMNS = ["SAVED", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED"];

interface KanbanBoardProps {
  applications: JobApplication[];
  onDragEnd: (result: DropResult) => void;
  onCardClick: (app: JobApplication) => void;
  onAddClick: (status: string) => void;
  loading?: boolean;
}

export default function KanbanBoard({ applications, onDragEnd, onCardClick, onAddClick, loading }: KanbanBoardProps) {
  const getAppsForStatus = (status: string) => applications.filter(app => app.status === status);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden h-full pb-6 pt-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 px-6 h-full items-start min-w-max">
          {STATUS_COLUMNS.map((colId) => {
            const spec = COLUMN_SPECS[colId];
            const columnApps = getAppsForStatus(colId);
            
            return (
              <div
                key={colId}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/50 w-72 h-full max-h-[calc(100vh-220px)]"
              >
                {/* Column Header */}
                <div className="px-4 py-4 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ color: spec.color, backgroundColor: `${spec.color}15` }}>
                            {spec.icon}
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{spec.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--bg-main)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                        {columnApps.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium">{spec.desc}</p>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto custom-scrollbar p-1 pb-4 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? "bg-[var(--primary)]/5" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="p-3 space-y-3">
                          {[1,2,3].map(i => <div key={i} className="h-24 bg-[var(--bg-main)]/50 rounded-xl animate-pulse border border-[var(--border)]" />)}
                        </div>
                      ) : columnApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center opacity-40">
                           <div className="mb-4 text-[var(--text-tertiary)]">
                                {spec.icon}
                           </div>
                           <p className="text-[10px] text-white font-bold uppercase tracking-widest mb-1">{spec.title} IS EMPTY</p>
                           <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">{spec.hint}</p>
                        </div>
                      ) : (
                        <div className="pt-3">
                          <AnimatePresence mode="popLayout">
                            {columnApps.map((app, index) => (
                              <Draggable key={app.id} draggableId={app.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={provided.draggableProps.style}
                                  >
                                    <ApplicationCard
                                      app={app}
                                      onClick={() => onCardClick(app)}
                                      innerRef={() => {}} // Not needed here as dnd handles ref
                                      draggableProps={{}}
                                      dragHandleProps={{}}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      {provided.placeholder}
                      
                      {/* Add Button */}
                      {(colId === 'SAVED' || colId === 'APPLIED') && (
                          <button
                            onClick={() => onAddClick(colId)}
                            className="mx-3 mt-1 py-3 w-[calc(100%-24px)] rounded-xl border border-dashed border-[var(--border)] text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-1.5 group"
                          >
                            <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                            Add Application
                          </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
