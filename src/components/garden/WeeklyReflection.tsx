"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloudMoon, Trash2, Sprout, X } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { getIcon } from "@/components/ui/IconPicker";
import { SECTION_COLORS } from "@/lib/constants";
import type { Project } from "@/lib/types";

const REFLECTION_KEY = "rotato-last-reflection";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function WeeklyReflection() {
  const { state, dispatch } = useGarden();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!state.hydrated || !mounted) return;

    const last = localStorage.getItem(REFLECTION_KEY);
    const now = Date.now();
    if (last && now - parseInt(last) < ONE_WEEK_MS) return;

    // Pick the resting project that hasn't been touched the longest
    const resting = state.projects
      .filter((p) => p.section === "resting" && !p.archived)
      .sort(
        (a, b) =>
          new Date(a.lastTouchedAt).getTime() - new Date(b.lastTouchedAt).getTime()
      );

    if (resting.length > 0) {
      // Delay so it doesn't appear on top of onboarding
      const timer = setTimeout(() => setProject(resting[0]), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.hydrated, state.projects, mounted]);

  function dismiss() {
    localStorage.setItem(REFLECTION_KEY, String(Date.now()));
    setProject(null);
  }

  function handleKeep() {
    dismiss();
  }

  function handleArchive() {
    if (!project) return;
    dispatch({ type: "ARCHIVE_PROJECT", id: project.id });
    dismiss();
  }

  function handleRevive() {
    if (!project) return;
    dispatch({ type: "MOVE_PROJECT", id: project.id, to: "currently-playing" });
    dismiss();
  }

  const Icon = project?.icon ? getIcon(project.icon) : null;
  const accentColor = project
    ? (project.color ?? SECTION_COLORS[project.section])
    : undefined;

  const content = (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 right-6 z-[65] w-72 max-w-[calc(100vw-3rem)]"
        >
          <div className="rounded-2xl shadow-warm-lg border border-warm-gray-light/30 dark:border-white/[0.12]
            bg-cream/95 dark:bg-[#2a1f18]/95 backdrop-blur-md p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <CloudMoon size={16} className="text-dusty-blue shrink-0" />
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">
                  Weekly check-in
                </span>
              </div>
              <button
                onClick={dismiss}
                className="p-0.5 rounded text-warm-gray/60 hover:text-warm-gray transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>

            {/* Project */}
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon size={15} style={{ color: accentColor }} className="shrink-0" />}
              <p className="font-medium text-soft-brown dark:text-[#F0E4DA] text-sm truncate">
                {project?.title}
              </p>
            </div>
            <p className="text-warm-gray text-xs mb-4 leading-relaxed">
              Still want this one? It&apos;s been resting for a while.
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleRevive}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl
                  bg-terracotta/10 text-terracotta hover:bg-terracotta/20
                  text-xs font-medium transition-colors cursor-pointer"
              >
                <Sprout size={13} />
                Revive it
              </button>
              <button
                onClick={handleKeep}
                className="flex-1 py-1.5 px-3 rounded-xl
                  bg-parchment dark:bg-white/[0.08] text-warm-gray hover:text-soft-brown dark:hover:text-[#F0E4DA]
                  text-xs font-medium transition-colors cursor-pointer border border-warm-gray-light/30 dark:border-white/[0.10]"
              >
                Keep resting
              </button>
              <button
                onClick={handleArchive}
                className="p-1.5 rounded-xl bg-parchment dark:bg-white/[0.08] text-warm-gray
                  hover:text-terracotta hover:bg-terracotta/10 transition-colors cursor-pointer
                  border border-warm-gray-light/30 dark:border-white/[0.10]"
                aria-label="Archive project"
                title="Archive"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
