"use client";

import { motion } from "framer-motion";
import { GripVertical, MoreHorizontal, ArrowRight, Archive, Trash2, ChevronDown } from "lucide-react";
import type { Project, SectionId } from "@/lib/types";
import { SECTION_META, SECTION_ORDER } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { getIcon } from "@/components/ui/IconPicker";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProjectTimeline from "./ProjectTimeline";
import { useState, useRef, useEffect } from "react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onMove: (id: string, to: SectionId) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export default function ProjectCard({
  project,
  onEdit,
  onMove,
  onArchive,
  onDelete,
  isDragging,
  dragHandleProps,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const Icon = project.icon ? getIcon(project.icon) : null;

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const otherSections = SECTION_ORDER.filter((s) => s !== project.section);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: isDragging ? 1.03 : 1,
        rotate: isDragging ? 1.5 : 0,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={isDragging ? undefined : { scale: 1.01, y: -2 }}
    >
      <Card accentColor={project.color} className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            className="mt-1 text-warm-gray hover:text-soft-brown cursor-grab active:cursor-grabbing shrink-0"
            aria-label="Drag to reorder"
            {...dragHandleProps}
          >
            <GripVertical size={16} />
          </button>

          {/* Main content */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onEdit(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit(project);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {Icon && (
                <Icon
                  size={16}
                  className="shrink-0"
                  style={{ color: project.color || "#6B5B4E" }}
                />
              )}
              <h3 className="font-medium text-soft-brown truncate">
                {project.title}
              </h3>
            </div>

            {project.description && (
              <p className="text-sm text-warm-gray line-clamp-2 mb-2">
                {project.description}
              </p>
            )}

            {project.nextTinyStep && (
              <p className="text-sm font-accent text-terracotta mb-2 italic">
                Next: {project.nextTinyStep}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-2">
              {project.tags.map((tag) => (
                <Badge key={tag} color={project.color}>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-warm-gray">
                Touched {timeAgo(project.lastTouchedAt)}
              </p>
              {project.timeline.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTimeline(!showTimeline);
                  }}
                  className="text-xs text-warm-gray hover:text-soft-brown flex items-center gap-0.5"
                >
                  <ChevronDown size={10} className={`transition-transform ${showTimeline ? "rotate-180" : ""}`} />
                  journey
                </button>
              )}
            </div>

            {showTimeline && <ProjectTimeline timeline={project.timeline} />}
          </div>

          {/* Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
              aria-label="Project actions"
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 z-20 bg-cream rounded-xl shadow-warm-lg border border-warm-gray-light/30 py-1 min-w-[180px]"
              >
                {otherSections.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onMove(project.id, s);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-soft-brown hover:bg-parchment flex items-center gap-2 transition-colors"
                  >
                    <ArrowRight size={14} />
                    Move to {SECTION_META[s].label}
                  </button>
                ))}
                <hr className="my-1 border-warm-gray-light/30" />
                <button
                  onClick={() => {
                    onArchive(project.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-warm-gray hover:bg-parchment flex items-center gap-2 transition-colors"
                >
                  <Archive size={14} />
                  Archive
                </button>
                <button
                  onClick={() => {
                    onDelete(project.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-terracotta hover:bg-parchment flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
