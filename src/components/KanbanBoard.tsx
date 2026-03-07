import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationCard from "./ApplicationCard";
import type { JobApplication } from "./ApplicationCard";
import { Briefcase } from "lucide-react";


const STATUS_COLUMNS = [
  { id: "SAVED", title: "Saved" },
  { id: "APPLIED", title: "Applied" },
  { id: "OA", title: "OA/Assessment" },
  { id: "INTERVIEW", title: "Interview" },
  { id: "OFFER", title: "Offer" },
  { id: "REJECTED", title: "Rejected" },
  { id: "GHOSTED", title: "Ghosted" },
];

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
    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar h-full pl-4 md:pl-8 pr-4 pb-6 pt-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Columns stagger in on load */}
        <motion.div
          className="flex gap-4 h-full min-w-max items-start"
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
                className="w-[320px] flex flex-col bg-primary/20 rounded-xl border border-border/50 max-h-full"
              >
                {/* Column Header */}
                <div className="flex justify-between items-center p-4 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      col.id === 'OFFER' ? 'bg-[#00D4AA]' : 
                      col.id === 'REJECTED' || col.id === 'GHOSTED' ? 'bg-danger' : 
                      col.id === 'INTERVIEW' ? 'bg-warning' : 
                      'bg-textSecondary'
                    }`} />
                    <h3 className="font-display font-semibold text-textPrimary text-sm tracking-wide uppercase">{col.title}</h3>
                  </div>
                  <motion.div
                    key={columnApps.length}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="bg-surface border border-border text-textSecondary text-xs font-bold px-2 py-0.5 rounded-md"
                  >
                    {loading ? "-" : columnApps.length}
                  </motion.div>
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
                        Array.from({ length: 3 }).map((_, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border/30 bg-surface/50 skeleton">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-border/40 shrink-0"></div>
                              <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-border/40 rounded w-3/4"></div>
                                <div className="h-3 bg-border/40 rounded w-1/2"></div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div className="h-4 bg-border/40 rounded w-16"></div>
                              <div className="h-4 bg-border/40 rounded w-12"></div>
                            </div>
                          </div>
                        ))
                      ) : columnApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 opacity-30">
                          <Briefcase size={24} className="floating" />
                          <p className="text-sm mt-2">No applications</p>
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
                      <motion.button
                        onClick={() => onAddClick(col.id)}
                        whileHover={{ scale: 1.02, borderColor: "rgba(108,99,255,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 mt-2 rounded-lg border border-dashed border-border text-textSecondary hover:text-textPrimary hover:bg-surface/50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        + Add Card
                      </motion.button>
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
