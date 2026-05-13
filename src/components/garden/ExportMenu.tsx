"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileJson, ChevronDown } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { SECTION_META, SECTION_ORDER } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/lib/types";

function projectToMarkdown(project: Project): string {
  const lines: string[] = [];
  lines.push(`### ${project.title}`);
  if (project.description) lines.push(`\n${project.description}`);
  if (project.inspirationText) lines.push(`\n*Inspiration: ${project.inspirationText}*`);
  if (project.nextTinyStep) lines.push(`\n**Next:** ${project.nextTinyStep}`);
  if (project.tags.length) lines.push(`\n**Tags:** ${project.tags.join(", ")}`);
  lines.push(`\n*Created ${new Date(project.createdAt).toLocaleDateString()} · Last touched ${new Date(project.lastTouchedAt).toLocaleDateString()}*`);

  const entries = project.journalEntries ?? [];
  if (entries.length) {
    lines.push("\n#### Captain's Log");
    for (const entry of entries) {
      const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
      });
      lines.push(`\n- **${date}** — ${entry.text}`);
    }
  }

  const checks = project.checklistItems ?? [];
  if (checks.length) {
    lines.push("\n#### Milestones");
    for (const item of checks) {
      lines.push(`\n- [${item.done ? "x" : " "}] ${item.text}`);
    }
  }

  return lines.join("\n");
}

function exportMarkdown(projects: Project[]): void {
  const lines: string[] = ["# My Creative Garden\n"];
  for (const sectionId of SECTION_ORDER) {
    const sectionProjects = projects.filter(
      (p) => p.section === sectionId && !p.archived
    );
    if (!sectionProjects.length) continue;
    lines.push(`\n## ${SECTION_META[sectionId].label}\n`);
    for (const p of sectionProjects) {
      lines.push(projectToMarkdown(p));
      lines.push("\n---\n");
    }
  }
  const archived = projects.filter((p) => p.archived);
  if (archived.length) {
    lines.push("\n## Archived\n");
    for (const p of archived) {
      lines.push(projectToMarkdown(p));
      lines.push("\n---\n");
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rotato-garden-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(projects: Project[]): void {
  const data = {
    exportedAt: new Date().toISOString(),
    projects,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rotato-garden-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportMenu() {
  const { state } = useGarden();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
          text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors flex items-center gap-1"
        aria-label="Export garden"
        title="Export"
      >
        <Download size={16} />
        <ChevronDown size={12} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-10 z-50 bg-cream rounded-xl shadow-warm-lg
              border border-warm-gray-light/30 py-1 min-w-[160px]"
          >
            <button
              onClick={() => { exportMarkdown(state.projects); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2 transition-colors"
            >
              <FileText size={14} className="text-warm-gray" />
              Export Markdown
            </button>
            <button
              onClick={() => { exportJSON(state.projects); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2 transition-colors"
            >
              <FileJson size={14} className="text-warm-gray" />
              Export JSON
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
