import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationCard from "./ApplicationCard";
import type { JobApplication } from "./ApplicationCard";
import { Plus } from "lucide-react";

const EMPTY_HINTS: Record<string, { emoji: string; text: string; hint: string }> = {
  SAVED: {
    emoji: '🔖',
    text: "Jobs you're eyeing",
    hint: 'Paste a job URL to quick-add'
  },
  APPLIED: {
    emoji: '📨',
    text: 'Applied jobs show here',
    hint: 'Track every application you send'
  },
  OA: {
    emoji: '💻',
    text: "Got an OA? Add it here",
    hint: 'Online assessments & coding rounds'
  },
  INTERVIEW: {
    emoji: '🎙️',
    text: 'Interview stage',
    hint: "You're close — prep hard!"
  },
  OFFER: {
    emoji: '🎉',
    text: 'Offers land here',
    hint: "This is what we're working toward"
  },
  REJECTED: {
    emoji: '💪',
    text: 'Every no is closer to yes',
    hint: 'Track rejections to spot patterns'
  },
  GHOSTED: {
    emoji: '👻',
    text: 'Ghosted companies appear here',
    hint: 'No response after 14 days = ghosted'
  },
};


const STATUS_COLUMNS = [
  { id: "SAVED", title: "Saved" },
  { id: "APPLIED", title: "Applied" },
  { id: "OA", title: "OA/Assessment" },
  { id: "INTERVIEW", title: "Interview" },
  { id: "OFFER", title: "Offer" },
  { id: "REJECTED", title: "Rejected" },
  { id: "GHOSTED", title: "Ghosted" },
];

const COLUMN_COLORS: Record<string, string> = {
  SAVED: '#7D8590',
  APPLIED: '#4F8EF7',
  OA: '#D29922',
  INTERVIEW: '#A371F7',
  TECHNICAL: '#3FB950',
  HR: '#F0883E',
  OFFER: '#3FB950',
  REJECTED: '#F85149',
  GHOSTED: '#484F58'
};

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
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll h-full pl-4 md:pl-8 pr-4 pb-6 pt-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Columns stagger in on load */}
        <motion.div
          className="flex gap-4 p-6 overflow-x-auto h-[calc(100vh-120px)] items-start"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }}
        >
          {STATUS_COLUMNS.map((col) => {
            const columnApps = getAppsForStatus(col.id);
            return (
              <motion.div
                key={col.id}
                variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                className="flex flex-col rounded-xl border border-[#21262D] bg-[#0D1117] min-w-[240px] max-w-[240px]"
                style={{ borderTop: `3px solid ${COLUMN_COLORS[col.id] || '#7D8590'}` }}
              >
                {/* Column Header */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                      style={{ 
                        color: COLUMN_COLORS[col.id] || '#7D8590', 
                        background: `${COLUMN_COLORS[col.id] || '#7D8590'}15`,
                        border: `1px solid ${COLUMN_COLORS[col.id] || '#7D8590'}30`
                      }}
                    >
                      {col.title}
                    </span>
                    <span className="text-xs text-[#484F58] font-medium">{columnApps.length}</span>
                  </div>
                  <button 
                    onClick={() => onAddClick(col.id)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[#484F58] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? "bg-accent/5" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="px-3 py-2 space-y-2">
                          {[1,2,3].map(i => <div key={i} className="h-16 bg-[#21262D] rounded-lg animate-pulse" />)}
                        </div>
                      ) : columnApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                          <span className="text-4xl mb-3 opacity-80">{EMPTY_HINTS[col.id]?.emoji}</span>
                          <p className="text-xs font-bold text-[#E6EDF3] mb-1">{EMPTY_HINTS[col.id]?.text || "No applications yet"}</p>
                          <p className="text-[10px] text-[#484F58] leading-relaxed">{EMPTY_HINTS[col.id]?.hint || "Add an application"}</p>
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {columnApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.75, y: -16 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.75, y: -16 }}
                                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                                  whileHover={!snapshot.isDragging ? { y: -5, boxShadow: "0 12px 36px rgba(108, 99, 255, 0.3)" } : {}}
                                  whileTap={{ scale: 0.96 }}
                                >
                                  <ApplicationCard
                                    app={app}
                                    onClick={() => onCardClick(app)}
                                    innerRef={provided.innerRef}
                                    draggableProps={provided.draggableProps}
                                    dragHandleProps={provided.dragHandleProps}
                                    isDragging={snapshot.isDragging}
                                  />
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                      )}
                      {provided.placeholder}
                      
                      {/* Add Card Footer */}
                      <button
                        onClick={() => onAddClick(col.id)}
                        className="mx-3 mb-3 py-2 w-[calc(100%-24px)] rounded-lg border border-dashed border-[#30363D] text-[#484F58] text-xs font-medium hover:border-[#4F8EF7]/50 hover:text-[#4F8EF7] hover:bg-[#4F8EF7]/5 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus size={12} />
                        Add card
                      </button>
                    </div>
                  )}
                </Droppable>
              </motion.div>
            );
          })}
        </motion.div>
      </DragDropContext>
    </div>
  );
}
