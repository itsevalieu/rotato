"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rows3,
  LayoutGrid,
  Columns3,
  LayoutPanelLeft,
  Grid2x2,
  GitBranch,
  Layers,
  Check,
} from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import type { ViewMode } from "@/lib/types";

const MODES: { id: ViewMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: "board",       label: "Board",       icon: Rows3,           description: "Collapsible swimlanes" },
  { id: "gallery",     label: "Gallery",     icon: LayoutGrid,      description: "Time-sorted grid" },
  { id: "kanban",      label: "Kanban",      icon: Columns3,        description: "Horizontal columns" },
  { id: "quadrant",    label: "Quadrant",    icon: Grid2x2,         description: "2×2 section grid" },
  { id: "river",       label: "River",       icon: GitBranch,       description: "Chronological activity" },
  { id: "deck",        label: "Deck",        icon: Layers,          description: "One card at a time" },
  { id: "three-panel", label: "Three-Panel", icon: LayoutPanelLeft, description: "Nav · List · Detail" },
];

export default function ViewModePicker() {
  const { state, dispatch } = useGarden();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = MODES.find((m) => m.id === state.viewMode) ?? MODES[0];
  const CurrentIcon = current.icon;

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
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/60 border border-warm-gray-light/30
          text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors text-xs font-medium"
        aria-label="Change view mode"
        title="View mode"
      >
        <CurrentIcon size={15} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-11 z-50 bg-cream rounded-2xl shadow-warm-lg
              border border-warm-gray-light/30 py-2 w-52"
          >
            <p className="text-[10px] font-medium text-warm-gray/60 uppercase tracking-wider px-3 pb-1.5">
              View Mode
            </p>
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const active = state.viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    dispatch({ type: "SET_VIEW_MODE", mode: mode.id });
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-3 transition-colors rounded-lg mx-0
                    ${active
                      ? "text-soft-brown bg-parchment"
                      : "text-warm-gray hover:text-soft-brown hover:bg-parchment/60"
                    }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-0.5">{mode.label}</p>
                    <p className="text-[10px] opacity-60 leading-none">{mode.description}</p>
                  </div>
                  {active && <Check size={13} className="shrink-0 text-terracotta" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
