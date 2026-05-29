"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sprout, Filter } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { SECTION_META, SECTION_ORDER, SECTION_COLORS } from "@/lib/constants";
import { buildActivityFeed } from "@/lib/utils";
import type { Project, SectionId, ActivityEvent } from "@/lib/types";
import ProjectForm from "./ProjectForm";

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function groupByDay(events: ActivityEvent[]): { label: string; events: ActivityEvent[] }[] {
  const groups: Map<string, ActivityEvent[]> = new Map();
  for (const e of events) {
    const label = dayLabel(e.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(e);
  }
  return Array.from(groups.entries()).map(([label, events]) => ({ label, events }));
}

function EventRow({
  event,
  onProjectClick,
}: {
  event: ActivityEvent;
  onProjectClick: (projectId: string) => void;
}) {
  const accentColor = event.projectColor ?? SECTION_COLORS[event.projectSection];
  const time = new Date(event.date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex gap-3 items-start group"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="w-px flex-1 bg-warm-gray-light/30 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-start gap-2">
          <div
            className="p-1 rounded-md shrink-0 mt-0.5"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            {event.type === "journal" && <BookOpen size={12} style={{ color: accentColor }} />}
            {event.type === "move"    && <ArrowRight size={12} style={{ color: accentColor }} />}
            {event.type === "created" && <Sprout size={12} style={{ color: accentColor }} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onProjectClick(event.projectId)}
                className="text-sm font-medium text-soft-brown hover:underline truncate"
              >
                {event.projectTitle}
              </button>
              <span className="text-xs text-warm-gray shrink-0">{time}</span>
            </div>

            {event.type === "created" && (
              <p className="text-xs text-warm-gray mt-0.5">was planted in {SECTION_META[event.projectSection].label}</p>
            )}
            {event.type === "move" && event.from && event.to && (
              <p className="text-xs text-warm-gray mt-0.5">
                moved from <span className="text-soft-brown">{SECTION_META[event.from].label}</span>
                {" → "}
                <span className="text-soft-brown">{SECTION_META[event.to].label}</span>
              </p>
            )}
            {event.type === "journal" && event.text && (
              <p className="text-sm text-warm-gray mt-0.5 italic line-clamp-3">
                &ldquo;{event.text}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface RiverViewProps {
  filtered: Project[];
}

export default function RiverView({ filtered }: RiverViewProps) {
  const { state } = useGarden();
  const [mounted, setMounted] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<SectionId | "all">("all");

  useEffect(() => { setMounted(true); }, []);

  const visible = sectionFilter === "all" ? filtered : filtered.filter((p) => p.section === sectionFilter);
  const feed = useMemo(() => buildActivityFeed(visible), [visible]);
  const groups = useMemo(() => groupByDay(feed), [feed]);

  const handleProjectClick = (projectId: string) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) { setEditingProject(project); setFormOpen(true); }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={14} className="text-warm-gray shrink-0" />
        <button
          onClick={() => setSectionFilter("all")}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            sectionFilter === "all"
              ? "bg-soft-brown/10 border-soft-brown/30 text-soft-brown"
              : "bg-white/40 border-warm-gray-light/20 text-warm-gray hover:bg-parchment"
          }`}
        >
          All
        </button>
        {SECTION_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setSectionFilter(s)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              sectionFilter === s
                ? "bg-soft-brown/10 border-soft-brown/30 text-soft-brown"
                : "bg-white/40 border-warm-gray-light/20 text-warm-gray hover:bg-parchment"
            }`}
          >
            {SECTION_META[s].label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {groups.length === 0 ? (
        <p className="text-center text-warm-gray italic font-accent text-lg py-12">No activity yet.</p>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {groups.map(({ label, events }) => (
            <div key={label}>
              <h3 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-3">{label}</h3>
              <div>
                {events.map((event) => (
                  <EventRow key={event.id} event={event} onProjectClick={handleProjectClick} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        project={editingProject}
        defaultSection="currently-playing"
      />
    </>
  );
}
