"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as LucideIcons from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { SECTION_ORDER, SECTION_META, SECTION_COLORS } from "@/lib/constants";
import { getProjectsBySection } from "@/lib/utils";
import type { Project, SectionId } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import SeedCard from "./SeedCard";
import ProjectForm from "./ProjectForm";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

function SortableKanbanItem({
  project, onEdit, onMove, onArchive, onDelete, onGrow,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onMove: (id: string, to: SectionId) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onGrow?: (id: string) => void;
}) {
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout="position"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {project.section === "seeds" ? (
        <SeedCard project={project} onEdit={onEdit} onGrow={onGrow ?? (() => {})} onDelete={onDelete} isDragging={isDragging} dragHandleProps={dragHandleProps} />
      ) : (
        <ProjectCard project={project} onEdit={onEdit} onMove={onMove} onArchive={onArchive} onDelete={onDelete} isDragging={isDragging} dragHandleProps={dragHandleProps} />
      )}
    </motion.div>
  );
}

function KanbanColumn({
  sectionId, projects, onEdit, onMove, onArchive, onDelete, onGrow,
}: {
  sectionId: SectionId;
  projects: Project[];
  onEdit: (p: Project) => void;
  onMove: (id: string, to: SectionId) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onGrow: (id: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: sectionId });
  const meta = SECTION_META[sectionId];
  const Icon = (LucideIcons as Record<string, unknown>)[meta.icon] as LucideIconComponent;
  const accentHex = SECTION_COLORS[sectionId];

  const colorMap: Record<string, string> = {
    terracotta: "text-terracotta border-terracotta/20 bg-terracotta/5",
    "dusty-blue": "text-dusty-blue border-dusty-blue/20 bg-dusty-blue/5",
    sage: "text-sage border-sage/20 bg-sage/5",
    "muted-gold": "text-muted-gold border-muted-gold/20 bg-muted-gold/5",
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 shrink-0 rounded-2xl transition-all duration-300 ${
        isOver ? "border-2 bg-white/50" : "border border-warm-gray-light/20 bg-white/30"
      }`}
      style={isOver ? { borderColor: accentHex } : undefined}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 p-3 border-b border-warm-gray-light/20">
        <div className={`p-1.5 rounded-lg ${colorMap[meta.color]}`}>
          {Icon && <Icon size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-accent text-base text-soft-brown leading-none">{meta.label}</h3>
        </div>
        <span className="text-xs text-warm-gray bg-parchment px-2 py-0.5 rounded-full">{projects.length}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[120px]">
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <SortableKanbanItem
                key={project.id}
                project={project}
                onEdit={onEdit}
                onMove={onMove}
                onArchive={onArchive}
                onDelete={onDelete}
                onGrow={onGrow}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
        {projects.length === 0 && (
          <p className="text-xs text-warm-gray/50 italic text-center pt-6 font-accent">{meta.emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

interface KanbanViewProps {
  searchQuery: string;
  tagFilter?: string;
  filtered: Project[];
}

export default function KanbanView({ filtered }: KanbanViewProps) {
  const { state, dispatch } = useGarden();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState<SectionId>("currently-playing");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const projectId = active.id as string;
    const overId = over.id as string;
    if (SECTION_ORDER.includes(overId as SectionId)) {
      const project = state.projects.find((p) => p.id === projectId);
      if (project && project.section !== overId) dispatch({ type: "MOVE_PROJECT", id: projectId, to: overId as SectionId });
      return;
    }
    const overProject = state.projects.find((p) => p.id === overId);
    const project = state.projects.find((p) => p.id === projectId);
    if (overProject && project) {
      if (project.section !== overProject.section) {
        dispatch({ type: "MOVE_PROJECT", id: projectId, to: overProject.section });
      } else {
        const sp = state.projects.filter((p) => p.section === project.section);
        const oi = sp.findIndex((p) => p.id === projectId);
        const ni = sp.findIndex((p) => p.id === overId);
        if (oi !== ni) dispatch({ type: "REORDER_PROJECTS", sectionId: project.section, projectIds: arrayMove(sp, oi, ni).map((p) => p.id) });
      }
    }
  }, [state.projects, dispatch]);

  const handleEdit = useCallback((project: Project) => { setEditingProject(project); setFormOpen(true); }, []);
  const handleMove = useCallback((id: string, to: SectionId) => dispatch({ type: "MOVE_PROJECT", id, to }), [dispatch]);
  const handleArchive = useCallback((id: string) => dispatch({ type: "ARCHIVE_PROJECT", id }), [dispatch]);
  const handleDelete = useCallback((id: string) => dispatch({ type: "DELETE_PROJECT", id }), [dispatch]);
  const handleGrow = useCallback((id: string) => dispatch({ type: "MOVE_PROJECT", id, to: "currently-playing" }), [dispatch]);

  const activeProject = activeId ? state.projects.find((p) => p.id === activeId) : null;

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {SECTION_ORDER.map((sectionId) => (
            <KanbanColumn
              key={sectionId}
              sectionId={sectionId}
              projects={getProjectsBySection(filtered, sectionId)}
              onEdit={handleEdit}
              onMove={handleMove}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onGrow={handleGrow}
            />
          ))}
        </div>
        <DragOverlay>
          {activeProject && (
            <div className="opacity-90 rotate-2 w-72">
              {activeProject.section === "seeds"
                ? <SeedCard project={activeProject} onEdit={() => {}} onGrow={() => {}} onDelete={() => {}} isDragging />
                : <ProjectCard project={activeProject} onEdit={() => {}} onMove={() => {}} onArchive={() => {}} onDelete={() => {}} isDragging />}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ProjectForm open={formOpen} onClose={() => { setFormOpen(false); setEditingProject(null); }} project={editingProject} defaultSection={formSection} />
    </>
  );
}
