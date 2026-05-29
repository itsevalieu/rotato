"use client";

import { useState, useCallback } from "react";
import { useConfetti } from "@/hooks/useConfetti";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { useGarden } from "@/context/GardenContext";
import { SECTION_ORDER } from "@/lib/constants";
import { getProjectsBySection, filterProjects } from "@/lib/utils";
import type { Project, SectionId } from "@/lib/types";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import SeedCard from "./SeedCard";
import GalleryCard from "./GalleryCard";
import ProjectForm from "./ProjectForm";
import KanbanView from "./KanbanView";
import QuadrantView from "./QuadrantView";
import RiverView from "./RiverView";
import DeckView from "./DeckView";
import ThreePanelView from "./ThreePanelView";

interface SortableProjectProps {
  project: Project;
  onEdit: (project: Project) => void;
  onMove: (id: string, to: SectionId) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onGrow?: (id: string) => void;
}

function SortableProject({
  project,
  onEdit,
  onMove,
  onArchive,
  onDelete,
  onGrow,
}: SortableProjectProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  if (project.section === "seeds") {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        layout="position"
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <SeedCard
          project={project}
          onEdit={onEdit}
          onGrow={onGrow || (() => {})}
          onDelete={onDelete}
          isDragging={isDragging}
          dragHandleProps={dragHandleProps}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout="position"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <ProjectCard
        project={project}
        onEdit={onEdit}
        onMove={onMove}
        onArchive={onArchive}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
      />
    </motion.div>
  );
}

function DroppableSection({
  sectionId,
  children,
  footer,
  ...sectionProps
}: {
  sectionId: SectionId;
  children: React.ReactNode;
  footer?: React.ReactNode;
  count: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onShuffle: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: sectionId });

  return (
    <div ref={setNodeRef}>
      <Section
        sectionId={sectionId}
        isOver={isOver}
        footer={footer}
        {...sectionProps}
      >
        {children}
      </Section>
    </div>
  );
}

function SeedQuickAdd({ onCreate }: { onCreate: (title: string) => void }) {
  const [value, setValue] = useState("");

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); commit(); }}
      className="flex items-center gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Jot down a seed idea…"
        className="flex-1 text-sm bg-white/60 border border-warm-gray-light/30 rounded-xl px-3 py-2
          text-soft-brown placeholder:text-warm-gray/50 focus:outline-none focus:ring-2
          focus:ring-sage/30 focus:border-sage/40 transition-all"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="p-2 rounded-xl bg-sage/80 text-cream disabled:opacity-30 disabled:cursor-not-allowed
          hover:bg-sage transition-colors shrink-0"
        aria-label="Plant seed"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V12" /><path d="M5 3a14.7 14.7 0 0 0 7 9 14.7 14.7 0 0 0 7-9" /><path d="M2 8h20" />
        </svg>
      </button>
    </form>
  );
}

interface GardenBoardProps {
  searchQuery: string;
  tagFilter?: string;
}

export default function GardenBoard({
  searchQuery,
  tagFilter,
}: GardenBoardProps) {
  const { state, dispatch, createProject } = useGarden();
  const { celebrate } = useConfetti();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState<SectionId>("currently-playing");
  const [activeId, setActiveId] = useState<string | null>(null);

  const viewMode = state.viewMode;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filtered = filterProjects(state.projects, searchQuery, tagFilter);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const projectId = active.id as string;
      const overId = over.id as string;

      // Check if dropped on a section
      if (SECTION_ORDER.includes(overId as SectionId)) {
        const project = state.projects.find((p) => p.id === projectId);
        if (project && project.section !== overId) {
          dispatch({
            type: "MOVE_PROJECT",
            id: projectId,
            to: overId as SectionId,
          });
          if (overId === "finished-worlds") celebrate();
        }
        return;
      }

      // Dropped on another card — reorder within section or move to a different one
      const overProject = state.projects.find((p) => p.id === overId);
      const project = state.projects.find((p) => p.id === projectId);
      if (overProject && project) {
        if (project.section !== overProject.section) {
          dispatch({
            type: "MOVE_PROJECT",
            id: projectId,
            to: overProject.section,
          });
          if (overProject.section === "finished-worlds") celebrate();
        } else {
          const sectionProjects = state.projects.filter(
            (p) => p.section === project.section
          );
          const oldIndex = sectionProjects.findIndex((p) => p.id === projectId);
          const newIndex = sectionProjects.findIndex((p) => p.id === overId);
          if (oldIndex !== newIndex) {
            dispatch({
              type: "REORDER_PROJECTS",
              sectionId: project.section,
              projectIds: arrayMove(sectionProjects, oldIndex, newIndex).map(
                (p) => p.id
              ),
            });
          }
        }
      }
    },
    [state.projects, dispatch, celebrate]
  );

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  }, []);

  const handleMove = useCallback(
    (id: string, to: SectionId) => {
      dispatch({ type: "MOVE_PROJECT", id, to });
      if (to === "finished-worlds") celebrate();
    },
    [dispatch, celebrate]
  );

  const handleArchive = useCallback(
    (id: string) => {
      dispatch({ type: "ARCHIVE_PROJECT", id });
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE_PROJECT", id });
    },
    [dispatch]
  );

  const handleGrow = useCallback(
    (id: string) => {
      dispatch({ type: "MOVE_PROJECT", id, to: "currently-playing" });
    },
    [dispatch]
  );

  const handleGrowWithToast = useCallback(
    (id: string) => {
      handleGrow(id);
      const project = state.projects.find((p) => p.id === id);
      if (project) {
        // tiny confetti burst for sprouting
        import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ["#8B9E82", "#7FA86A", "#90BE78", "#A0C88A", "#C4956A"],
            scalar: 0.75,
          });
        });
      }
    },
    [handleGrow, state.projects]
  );

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingProject(null);
  }, []);

  const activeProject = activeId
    ? state.projects.find((p) => p.id === activeId)
    : null;

  if (viewMode === "kanban") {
    return <KanbanView searchQuery={searchQuery} tagFilter={tagFilter} filtered={filtered} />;
  }

  if (viewMode === "quadrant") {
    return <QuadrantView filtered={filtered} />;
  }

  if (viewMode === "river") {
    return <RiverView filtered={filtered} />;
  }

  if (viewMode === "deck") {
    return <DeckView filtered={filtered} />;
  }

  if (viewMode === "three-panel") {
    return <ThreePanelView filtered={filtered} />;
  }

  if (viewMode === "gallery") {
    const allVisible = filtered.filter((p) => !p.archived);
    const sorted = [...allVisible].sort(
      (a, b) => new Date(b.lastTouchedAt).getTime() - new Date(a.lastTouchedAt).getTime()
    );

    return (
      <>
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((project, i) => (
              <GalleryCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                index={i}
              />
            ))}
            {sorted.length === 0 && (
              <p className="col-span-full text-center text-warm-gray italic font-accent text-lg py-12">
                Nothing to show yet.
              </p>
            )}
          </div>
        </AnimatePresence>

        <ProjectForm
          open={formOpen}
          onClose={handleCloseForm}
          project={editingProject}
          defaultSection={formSection}
        />
      </>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {SECTION_ORDER.map((sectionId) => {
            const sectionProjects = getProjectsBySection(filtered, sectionId);
            const projectIds = sectionProjects.map((p) => p.id);
            const collapsed = state.collapsedSections.includes(sectionId);

            return (
              <SortableContext
                key={sectionId}
                items={projectIds}
                strategy={verticalListSortingStrategy}
              >
                <DroppableSection
                  sectionId={sectionId}
                  count={sectionProjects.length}
                  collapsed={collapsed}
                  onToggleCollapse={() =>
                    dispatch({
                      type: "TOGGLE_SECTION_COLLAPSE",
                      sectionId,
                    })
                  }
                  onShuffle={() =>
                    dispatch({ type: "SHUFFLE_SECTION", sectionId })
                  }
                  footer={
                    sectionId === "seeds" ? (
                      <SeedQuickAdd
                        onCreate={(title) =>
                          createProject({
                            title,
                            description: "",
                            section: "seeds",
                            tags: [],
                            journalEntries: [],
                            checklistItems: [],
                          })
                        }
                      />
                    ) : undefined
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {sectionProjects.map((project) => (
                      <SortableProject
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onMove={handleMove}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        onGrow={handleGrowWithToast}
                      />
                    ))}
                  </AnimatePresence>
                </DroppableSection>
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeProject && (
            <div className="opacity-90 rotate-2">
              {activeProject.section === "seeds" ? (
                <SeedCard
                  project={activeProject}
                  onEdit={() => {}}
                  onGrow={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              ) : (
                <ProjectCard
                  project={activeProject}
                  onEdit={() => {}}
                  onMove={() => {}}
                  onArchive={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ProjectForm
        open={formOpen}
        onClose={handleCloseForm}
        project={editingProject}
        defaultSection={formSection}
      />
    </>
  );
}

export { type GardenBoardProps };
