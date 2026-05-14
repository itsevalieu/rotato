"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit2, BookOpen, CheckSquare } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { SECTION_ORDER, SECTION_META, SECTION_COLORS } from "@/lib/constants";
import { getProjectsBySection, timeAgo } from "@/lib/utils";
import type { Project, SectionId } from "@/lib/types";
import { getIcon } from "@/components/ui/IconPicker";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProjectJournal from "./ProjectJournal";
import ProjectChecklist from "./ProjectChecklist";
import ProjectTimeline from "./ProjectTimeline";
import ProjectForm from "./ProjectForm";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

function CardContent({ project, accentColor, onEdit }: {
  project: Project;
  accentColor: string;
  onEdit: () => void;
}) {
  const ProjectIcon = project.icon ? getIcon(project.icon) : null;

  return (
    <Card accentColor={accentColor} className="p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        {ProjectIcon && (
          <ProjectIcon size={20} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-accent text-xl text-soft-brown">{project.title}</h2>
          <p className="text-xs text-warm-gray mt-0.5">Touched {timeAgo(project.lastTouchedAt)}</p>
        </div>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors shrink-0"
          aria-label="Edit project"
        >
          <Edit2 size={14} />
        </button>
      </div>

      {project.description && (
        <p className="text-sm text-warm-gray mb-3">{project.description}</p>
      )}
      {project.nextTinyStep && (
        <div className="mb-3 bg-terracotta/5 border border-terracotta/15 rounded-lg px-3 py-2">
          <p className="text-xs text-warm-gray mb-0.5 uppercase tracking-wide font-medium">Next step</p>
          <p className="text-sm font-accent text-terracotta italic">{project.nextTinyStep}</p>
        </div>
      )}
      {project.inspirationText && (
        <div className="mb-3 bg-muted-gold/5 border border-muted-gold/15 rounded-lg px-3 py-2">
          <p className="text-xs text-warm-gray mb-0.5 uppercase tracking-wide font-medium">Inspiration</p>
          <p className="text-sm text-soft-brown italic">{project.inspirationText}</p>
        </div>
      )}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => <Badge key={tag} color={accentColor}>{tag}</Badge>)}
        </div>
      )}
      {project.timeline.length > 0 && (
        <div className="mb-3"><ProjectTimeline timeline={project.timeline} /></div>
      )}

      <div className="mt-3 border-t border-warm-gray-light/20 pt-3">
        <div className="flex items-center gap-1.5 mb-2 text-xs text-warm-gray font-medium uppercase tracking-wide">
          <BookOpen size={12} />
          <span>Captain&apos;s Log</span>
          <span className="opacity-60">({project.journalEntries.length})</span>
        </div>
        <ProjectJournal project={project} hideHeader />
      </div>

      <div className="mt-3 border-t border-warm-gray-light/20 pt-3">
        <div className="flex items-center gap-1.5 mb-2 text-xs text-warm-gray font-medium uppercase tracking-wide">
          <CheckSquare size={12} />
          <span>Milestones</span>
          {project.checklistItems.length > 0 && (
            <span className="opacity-60">({project.checklistItems.filter(i => i.done).length}/{project.checklistItems.length})</span>
          )}
        </div>
        <ProjectChecklist project={project} hideHeader />
      </div>
    </Card>
  );
}

interface DeckViewProps {
  filtered: Project[];
}

export default function DeckView({ filtered }: DeckViewProps) {
  const { state } = useGarden();
  const [activeSection, setActiveSection] = useState<SectionId>("currently-playing");
  const [cardIndex, setCardIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const sectionProjects = getProjectsBySection(filtered, activeSection);
  const project = sectionProjects[cardIndex] ?? null;

  useEffect(() => { setCardIndex(0); }, [activeSection]);
  useEffect(() => {
    if (cardIndex >= sectionProjects.length && sectionProjects.length > 0) {
      setCardIndex(sectionProjects.length - 1);
    }
  }, [cardIndex, sectionProjects.length]);

  const prev = useCallback(() => {
    if (cardIndex > 0) { setDirection(-1); setCardIndex((i) => i - 1); }
  }, [cardIndex]);
  const next = useCallback(() => {
    if (cardIndex < sectionProjects.length - 1) { setDirection(1); setCardIndex((i) => i + 1); }
  }, [cardIndex, sectionProjects.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const accentColor = project ? (project.color ?? SECTION_COLORS[project.section]) : "#A8998A";

  const NavButton = ({ dir }: { dir: "prev" | "next" }) => (
    <button
      onClick={dir === "prev" ? prev : next}
      disabled={dir === "prev" ? cardIndex === 0 : cardIndex >= sectionProjects.length - 1}
      className="p-2 rounded-full bg-white/60 border border-warm-gray-light/30 text-warm-gray
        hover:text-soft-brown hover:bg-parchment transition-colors disabled:opacity-30 disabled:cursor-default shrink-0"
      aria-label={dir === "prev" ? "Previous card" : "Next card"}
    >
      {dir === "prev" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );

  const DotIndicators = () => (
    sectionProjects.length > 1 ? (
      <div className="flex gap-1.5 justify-center">
        {sectionProjects.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > cardIndex ? 1 : -1); setCardIndex(i); }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === cardIndex ? "bg-soft-brown scale-125" : "bg-warm-gray-light/40 hover:bg-warm-gray/40"
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    ) : null
  );

  return (
    <>
      {/* Section tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTION_ORDER.map((s) => {
          const meta = SECTION_META[s];
          const Icon = (LucideIcons as Record<string, unknown>)[meta.icon] as LucideIconComponent;
          const count = getProjectsBySection(filtered, s).length;
          const active = s === activeSection;
          return (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active
                  ? "bg-soft-brown/10 border-soft-brown/30 text-soft-brown font-medium"
                  : "bg-white/40 border-warm-gray-light/20 text-warm-gray hover:bg-parchment"
              }`}
            >
              {Icon && <Icon size={13} />}
              <span className="hidden sm:inline">{meta.label}</span>
              <span className="sm:hidden">{meta.label.split(" ")[0]}</span>
              <span className="text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {sectionProjects.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-warm-gray italic font-accent text-lg">{SECTION_META[activeSection].emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-warm-gray">{cardIndex + 1} / {sectionProjects.length}</p>

          {/* Desktop: side arrows */}
          <div className="hidden sm:flex items-center gap-4 w-full max-w-2xl">
            <NavButton dir="prev" />
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait" custom={direction}>
                {project && (
                  <motion.div key={project.id} custom={direction}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  >
                    <CardContent project={project} accentColor={accentColor} onEdit={() => { setEditingProject(project); setFormOpen(true); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavButton dir="next" />
          </div>

          {/* Mobile: full-width card, arrows below */}
          <div className="sm:hidden w-full">
            <AnimatePresence mode="wait" custom={direction}>
              {project && (
                <motion.div key={project.id} custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                  <CardContent project={project} accentColor={accentColor} onEdit={() => { setEditingProject(project); setFormOpen(true); }} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between items-center mt-3 px-1">
              <NavButton dir="prev" />
              <DotIndicators />
              <NavButton dir="next" />
            </div>
          </div>

          {/* Desktop dot indicators */}
          <div className="hidden sm:block">
            <DotIndicators />
          </div>
        </div>
      )}

      <ProjectForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        project={editingProject}
        defaultSection={activeSection}
      />
    </>
  );
}
