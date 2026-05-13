"use client";

import { useState, useCallback } from "react";
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
  ...sectionProps
}: {
  sectionId: SectionId;
  children: React.ReactNode;
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
        {...sectionProps}
      >
        {children}
      </Section>
    </div>
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
  const { state, dispatch } = useGarden();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState<SectionId>("currently-playing");
  const [activeId, setActiveId] = useState<string | null>(null);

  const isGallery = state.viewMode === "gallery";

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
    [state.projects, dispatch]
  );

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  }, []);

  const handleMove = useCallback(
    (id: string, to: SectionId) => {
      dispatch({ type: "MOVE_PROJECT", id, to });
    },
    [dispatch]
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

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingProject(null);
  }, []);

  const activeProject = activeId
    ? state.projects.find((p) => p.id === activeId)
    : null;

  if (isGallery) {
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
                        onGrow={handleGrow}
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
