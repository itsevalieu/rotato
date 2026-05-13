"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
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
      <div ref={setNodeRef} style={style}>
        <SeedCard
          project={project}
          onEdit={onEdit}
          onGrow={onGrow || (() => {})}
          onDelete={onDelete}
          isDragging={isDragging}
          dragHandleProps={dragHandleProps}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ProjectCard
        project={project}
        onEdit={onEdit}
        onMove={onMove}
        onArchive={onArchive}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
      />
    </div>
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

      // Dropped on another card — find its section and move there
      const overProject = state.projects.find((p) => p.id === overId);
      if (overProject) {
        const project = state.projects.find((p) => p.id === projectId);
        if (project && project.section !== overProject.section) {
          dispatch({
            type: "MOVE_PROJECT",
            id: projectId,
            to: overProject.section,
          });
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
