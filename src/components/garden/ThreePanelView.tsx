"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { BookOpen, CheckSquare, ChevronRight, Save, X } from "lucide-react";
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
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

// ─── Left Nav ────────────────────────────────────────────────────────────────

function LeftNav({
  filtered,
  activeSection,
  onSelect,
}: {
  filtered: Project[];
  activeSection: SectionId;
  onSelect: (s: SectionId) => void;
}) {
  return (
    <nav className="w-48 shrink-0 flex flex-col gap-1 py-1">
      {SECTION_ORDER.map((s) => {
        const meta = SECTION_META[s];
        const Icon = (LucideIcons as Record<string, unknown>)[meta.icon] as LucideIconComponent;
        const count = getProjectsBySection(filtered, s).length;
        const active = s === activeSection;
        const accentHex = SECTION_COLORS[s];
        return (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors group ${
              active ? "bg-parchment/80 text-soft-brown" : "text-warm-gray hover:text-soft-brown hover:bg-white/40"
            }`}
          >
            <div
              className="p-1 rounded-md shrink-0"
              style={{ backgroundColor: `${accentHex}${active ? "30" : "18"}` }}
            >
              {Icon && <Icon size={14} className="shrink-0" style={{ color: accentHex }} />}
            </div>
            <span className="text-sm font-medium flex-1 truncate">{meta.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
              active ? "bg-soft-brown/10 text-soft-brown" : "bg-warm-gray-light/30 text-warm-gray"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Middle List ─────────────────────────────────────────────────────────────

function MiddleList({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string | null;
  onSelect: (p: Project) => void;
}) {
  return (
    <div className="w-80 shrink-0 overflow-y-auto flex flex-col gap-1.5 pr-1">
      {projects.length === 0 && (
        <p className="text-warm-gray italic text-sm text-center py-8 font-accent">Nothing here yet.</p>
      )}
      {projects.map((project) => {
        const accentColor = project.color ?? SECTION_COLORS[project.section];
        const Icon = project.icon ? getIcon(project.icon) : null;
        const selected = project.id === selectedId;
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card accentColor={accentColor} className={`p-3 cursor-pointer transition-shadow ${selected ? "outline outline-2 outline-offset-1" : ""}`}
              style={selected ? { outlineColor: accentColor } : undefined}
              onClick={() => onSelect(project)}
            >
              <div className="flex items-start gap-2">
                {Icon && <Icon size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${selected ? "text-soft-brown" : "text-soft-brown/90"}`}>
                    {project.title}
                  </p>
                  {project.nextTinyStep && (
                    <p className="text-[11px] font-accent text-terracotta italic mt-0.5 truncate">{project.nextTinyStep}</p>
                  )}
                  {project.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} color={accentColor}>{tag}</Badge>
                  ))}
                  <p className="text-[10px] text-warm-gray mt-1">{timeAgo(project.lastTouchedAt)}</p>
                </div>
                {selected && <ChevronRight size={13} className="text-warm-gray shrink-0 mt-1" />}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Right Detail Panel ───────────────────────────────────────────────────────

function DetailPanel({ project }: { project: Project }) {
  const { dispatch } = useGarden();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [nextTinyStep, setNextTinyStep] = useState(project.nextTinyStep ?? "");
  const [inspirationText, setInspirationText] = useState(project.inspirationText ?? "");
  const [dirty, setDirty] = useState(false);

  // Reset when project changes
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description);
    setNextTinyStep(project.nextTinyStep ?? "");
    setInspirationText(project.inspirationText ?? "");
    setDirty(false);
  }, [project.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    dispatch({
      type: "UPDATE_PROJECT",
      project: {
        ...project,
        title: title.trim() || project.title,
        description: description.trim(),
        nextTinyStep: nextTinyStep.trim() || undefined,
        inspirationText: inspirationText.trim() || undefined,
        lastTouchedAt: new Date().toISOString(),
      },
    });
    setDirty(false);
  };

  const handleDiscard = () => {
    setTitle(project.title);
    setDescription(project.description);
    setNextTinyStep(project.nextTinyStep ?? "");
    setInspirationText(project.inspirationText ?? "");
    setDirty(false);
  };

  const accentColor = project.color ?? SECTION_COLORS[project.section];
  const Icon = project.icon ? getIcon(project.icon) : null;

  return (
    <div className="flex-1 overflow-y-auto min-w-0 pl-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="space-y-4"
        >
          {/* Title row */}
          <div className="flex items-start gap-3">
            {Icon && <Icon size={20} className="shrink-0 mt-1" style={{ color: accentColor }} />}
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
              className="flex-1 font-accent text-2xl text-soft-brown bg-transparent border-b border-transparent
                focus:border-warm-gray-light/40 outline-none pb-0.5 transition-colors w-full"
            />
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} color={accentColor}>{tag}</Badge>
              ))}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-warm-gray uppercase tracking-wide block mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
                placeholder="What is this project about?"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-warm-gray uppercase tracking-wide block mb-1">Next tiny step</label>
              <Input
                value={nextTinyStep}
                onChange={(e) => { setNextTinyStep(e.target.value); setDirty(true); }}
                placeholder="What's one small move?"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-warm-gray uppercase tracking-wide block mb-1">Inspiration</label>
              <Textarea
                value={inspirationText}
                onChange={(e) => { setInspirationText(e.target.value); setDirty(true); }}
                placeholder="What excites you about this?"
                rows={2}
              />
            </div>
          </div>

          {/* Save bar */}
          <AnimatePresence>
            {dirty && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex gap-2"
              >
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-soft-brown text-cream rounded-lg
                    hover:bg-soft-brown/90 transition-colors"
                >
                  <Save size={13} />
                  Save
                </button>
                <button
                  onClick={handleDiscard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-warm-gray hover:text-soft-brown
                    bg-white/40 rounded-lg border border-warm-gray-light/20 hover:bg-parchment transition-colors"
                >
                  <X size={13} />
                  Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline */}
          {project.timeline.length > 0 && (
            <div className="border-t border-warm-gray-light/20 pt-4">
              <p className="text-xs font-medium text-warm-gray uppercase tracking-wide mb-2">Journey</p>
              <ProjectTimeline timeline={project.timeline} />
            </div>
          )}

          {/* Captain's Log */}
          <div className="border-t border-warm-gray-light/20 pt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen size={13} className="text-warm-gray" />
              <p className="text-xs font-medium text-warm-gray uppercase tracking-wide">Captain&apos;s Log</p>
              <span className="text-[10px] text-warm-gray/60">({project.journalEntries.length})</span>
            </div>
            <ProjectJournal project={project} hideHeader />
          </div>

          {/* Milestones */}
          <div className="border-t border-warm-gray-light/20 pt-4 pb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckSquare size={13} className="text-warm-gray" />
              <p className="text-xs font-medium text-warm-gray uppercase tracking-wide">Milestones</p>
              {project.checklistItems.length > 0 && (
                <span className="text-[10px] text-warm-gray/60">
                  ({project.checklistItems.filter(i => i.done).length}/{project.checklistItems.length})
                </span>
              )}
            </div>
            <ProjectChecklist project={project} hideHeader />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Three-Panel Root ─────────────────────────────────────────────────────────

interface ThreePanelViewProps {
  filtered: Project[];
}

type MobileStep = "nav" | "list" | "detail";

export default function ThreePanelView({ filtered }: ThreePanelViewProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("currently-playing");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileStep, setMobileStep] = useState<MobileStep>("nav");

  const sectionProjects = getProjectsBySection(filtered, activeSection);

  useEffect(() => {
    setSelectedProject(sectionProjects[0] ?? null);
  }, [activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncedProject = selectedProject
    ? filtered.find((p) => p.id === selectedProject.id) ?? null
    : null;

  const sectionMeta = SECTION_META[activeSection];

  // ── Mobile breadcrumb bar ─────────────────────────────────────────────────
  const MobileBreadcrumb = () => (
    <div className="sm:hidden flex items-center gap-1.5 mb-3 text-xs text-warm-gray">
      <button
        onClick={() => setMobileStep("nav")}
        className={mobileStep === "nav" ? "text-soft-brown font-medium" : "hover:text-soft-brown"}
      >
        Sections
      </button>
      {mobileStep !== "nav" && (
        <>
          <ChevronRight size={12} />
          <button
            onClick={() => setMobileStep("list")}
            className={mobileStep === "list" ? "text-soft-brown font-medium" : "hover:text-soft-brown"}
          >
            {sectionMeta.label}
          </button>
        </>
      )}
      {mobileStep === "detail" && syncedProject && (
        <>
          <ChevronRight size={12} />
          <span className="text-soft-brown font-medium truncate">{syncedProject.title}</span>
        </>
      )}
    </div>
  );

  // ── Mobile: one panel at a time ───────────────────────────────────────────
  const mobileContent = () => {
    if (mobileStep === "nav") {
      return (
        <LeftNav
          filtered={filtered}
          activeSection={activeSection}
          onSelect={(s) => {
            setActiveSection(s);
            setSelectedProject(null);
            setMobileStep("list");
          }}
        />
      );
    }
    if (mobileStep === "list") {
      return (
        <MiddleList
          projects={sectionProjects}
          selectedId={syncedProject?.id ?? null}
          onSelect={(p) => { setSelectedProject(p); setMobileStep("detail"); }}
        />
      );
    }
    return syncedProject ? (
      <DetailPanel project={syncedProject} />
    ) : (
      <p className="text-warm-gray italic font-accent text-lg text-center py-12">Select a project</p>
    );
  };

  return (
    <>
      {/* ── Mobile layout (< sm) ─────────────────────────────────────── */}
      <div className="sm:hidden">
        <MobileBreadcrumb />
        <div className="rounded-2xl border border-warm-gray-light/20 bg-white/20 p-4 min-h-[60vh]">
          {mobileContent()}
        </div>
      </div>

      {/* ── Desktop layout (sm+) ─────────────────────────────────────── */}
      <div className="hidden sm:flex gap-0 h-[calc(100vh-10rem)] rounded-2xl border border-warm-gray-light/20 bg-white/20 overflow-hidden">
        <div className="border-r border-warm-gray-light/20 p-2">
          <LeftNav
            filtered={filtered}
            activeSection={activeSection}
            onSelect={(s) => { setActiveSection(s); setSelectedProject(null); }}
          />
        </div>
        <div className="border-r border-warm-gray-light/20 p-3 overflow-y-auto">
          <MiddleList
            projects={sectionProjects}
            selectedId={syncedProject?.id ?? null}
            onSelect={setSelectedProject}
          />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {syncedProject ? (
            <DetailPanel project={syncedProject} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-warm-gray italic font-accent text-lg">Select a project</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
