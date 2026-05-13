"use client";

import { motion } from "framer-motion";
import { GripVertical, MoreHorizontal, ArrowRight, Archive, Trash2, ChevronDown, BookOpen, Target, CheckSquare } from "lucide-react";
import type { Project, SectionId } from "@/lib/types";
import { SECTION_META, SECTION_ORDER, SECTION_COLORS } from "@/lib/constants";
import { timeAgo, getDormancyStatus } from "@/lib/utils";
import { getIcon } from "@/components/ui/IconPicker";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProjectTimeline from "./ProjectTimeline";
import ProjectJournal from "./ProjectJournal";
import ProjectChecklist from "./ProjectChecklist";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useGarden } from "@/context/GardenContext";

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
  const { state, dispatch: gardenDispatch } = useGarden();
  const isFocused = state.focusProjectId === project.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [showTimeline, setShowTimeline] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const Icon = project.icon ? getIcon(project.icon) : null;
  const accentColor = project.color ?? SECTION_COLORS[project.section];
  const dormancy = getDormancyStatus(project.lastTouchedAt);
  const journalCount = (project.journalEntries ?? []).length;
  const checklistItems = project.checklistItems ?? [];
  const checklistDone = checklistItems.filter((i) => i.done).length;

  const openMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuTriggerRef.current) {
      const rect = menuTriggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(e.target as Node) &&
        menuTriggerRef.current &&
        !menuTriggerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleScroll = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [menuOpen]);

  const otherSections = SECTION_ORDER.filter((s) => s !== project.section);

  return (
    <motion.div
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: isDragging ? 1.03 : 1,
        rotate: isDragging ? 1.5 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={isDragging ? undefined : { scale: 1.01, y: -2 }}
    >
      <Card accentColor={accentColor} className="p-4">
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
                  style={{ color: accentColor }}
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
                <Badge key={tag} color={accentColor}>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xs text-warm-gray">
                Touched {timeAgo(project.lastTouchedAt)}
              </p>
              {dormancy && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    dormancy.level === "alert"
                      ? "bg-terracotta/10 text-terracotta"
                      : "bg-muted-gold/15 text-muted-gold"
                  }`}
                >
                  {dormancy.label}
                </span>
              )}
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

            {/* Captain's Log + Milestones — compact pill row */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowJournal(!showJournal); }}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-colors
                  ${showJournal
                    ? "bg-parchment border-warm-gray-light/40 text-soft-brown"
                    : "bg-white/40 border-warm-gray-light/20 text-warm-gray hover:text-soft-brown hover:bg-parchment"
                  }`}
              >
                <BookOpen size={11} />
                <span>Log</span>
                {journalCount > 0 && <span className="text-[10px] opacity-70">{journalCount}</span>}
                <ChevronDown size={10} className={`transition-transform ${showJournal ? "rotate-180" : ""}`} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setShowChecklist(!showChecklist); }}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-colors
                  ${showChecklist
                    ? "bg-parchment border-warm-gray-light/40 text-soft-brown"
                    : "bg-white/40 border-warm-gray-light/20 text-warm-gray hover:text-soft-brown hover:bg-parchment"
                  }`}
              >
                <CheckSquare size={11} />
                <span>Milestones</span>
                {checklistItems.length > 0 && (
                  <span className="text-[10px] opacity-70">{checklistDone}/{checklistItems.length}</span>
                )}
                <ChevronDown size={10} className={`transition-transform ${showChecklist ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showJournal && (
              <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                <ProjectJournal project={project} />
              </div>
            )}

            {showChecklist && (
              <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                <ProjectChecklist project={project} />
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="shrink-0">
            <button
              ref={menuTriggerRef}
              onClick={openMenu}
              className="p-1 rounded-lg text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
              aria-label="Project actions"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {menuOpen && typeof document !== "undefined" && createPortal(
            <motion.div
              ref={menuDropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              style={{ top: menuPos.top, right: menuPos.right }}
              className="fixed z-50 bg-cream rounded-xl shadow-warm-lg border border-warm-gray-light/30 py-1 min-w-[190px]"
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
                  isFocused
                    ? gardenDispatch({ type: "CLEAR_FOCUS" })
                    : gardenDispatch({ type: "SET_FOCUS", id: project.id });
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-soft-brown hover:bg-parchment flex items-center gap-2 transition-colors"
              >
                <Target size={14} />
                {isFocused ? "Clear Focus" : "Set as Today's Focus"}
              </button>
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
            </motion.div>,
            document.body
          )}
        </div>
      </Card>
    </motion.div>
  );
}
