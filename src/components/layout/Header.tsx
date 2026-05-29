"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Volume2, VolumeX, Moon, Sun, MoreHorizontal,
  Shuffle, Download, FileText, FileJson,
} from "lucide-react";
import PotatoLogo from "@/components/ui/PotatoLogo";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { WEATHER_OPTIONS, SECTION_META, SECTION_ORDER } from "@/lib/constants";
import { randomPick, getProjectsBySection, timeAgo } from "@/lib/utils";
import type { CreativeWeather as WeatherType, Project } from "@/lib/types";
import CreativeWeatherWidget from "@/components/garden/CreativeWeather";
import SurpriseMe from "@/components/garden/SurpriseMe";
import ExportMenu from "@/components/garden/ExportMenu";
import ViewModePicker from "@/components/garden/ViewModePicker";
import SeedCapture from "@/components/garden/SeedCapture";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

// ── Inline export helpers (duplicated from ExportMenu for mobile use) ─────────
function projectToMarkdown(project: Project): string {
  const lines = [`### ${project.title}`];
  if (project.description) lines.push(`\n${project.description}`);
  if (project.nextTinyStep) lines.push(`\n**Next:** ${project.nextTinyStep}`);
  if (project.tags.length) lines.push(`\n**Tags:** ${project.tags.join(", ")}`);
  const entries = project.journalEntries ?? [];
  if (entries.length) {
    lines.push("\n#### Captain's Log");
    for (const e of entries) lines.push(`\n- ${e.text}`);
  }
  return lines.join("\n");
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Mobile overflow menu ──────────────────────────────────────────────────────
function MobileOverflowMenu() {
  const { state, dispatch } = useGarden();
  const { dark, toggle: toggleDark, mounted } = useDarkMode();
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

  const handleSurprise = () => {
    const dormant = [
      ...getProjectsBySection(state.projects, "resting"),
      ...getProjectsBySection(state.projects, "seeds"),
    ];
    const picked = randomPick(dormant);
    if (picked) {
      dispatch({ type: "MOVE_PROJECT", id: picked.id, to: "currently-playing" });
    }
    setOpen(false);
  };

  const handleExportJSON = () => {
    triggerDownload(
      JSON.stringify({ exportedAt: new Date().toISOString(), projects: state.projects }, null, 2),
      `rotato-${new Date().toISOString().slice(0, 10)}.json`,
      "application/json"
    );
    setOpen(false);
  };

  const handleExportMD = () => {
    const lines = ["# My Creative Garden\n"];
    for (const sid of SECTION_ORDER) {
      const ps = state.projects.filter((p) => p.section === sid && !p.archived);
      if (!ps.length) continue;
      lines.push(`\n## ${SECTION_META[sid].label}\n`);
      for (const p of ps) { lines.push(projectToMarkdown(p)); lines.push("\n---\n"); }
    }
    triggerDownload(lines.join("\n"), `rotato-${new Date().toISOString().slice(0, 10)}.md`, "text/markdown");
    setOpen(false);
  };

  const currentWeather = WEATHER_OPTIONS.find((w) => w.id === state.creativeWeather)!;

  return (
    <div className="relative sm:hidden" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-2 rounded-xl border transition-colors ${
          open
            ? "bg-parchment border-warm-gray-light/40 text-soft-brown"
            : "bg-white/60 border-warm-gray-light/30 text-warm-gray hover:text-soft-brown hover:bg-parchment"
        }`}
        aria-label="More options"
      >
        <MoreHorizontal size={16} />
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
            {/* Weather */}
            <div className="px-3 py-2">
              <p className="text-[10px] font-medium text-warm-gray/60 uppercase tracking-wider mb-2">
                Creative Weather
              </p>
              <div className="flex gap-1.5">
                {WEATHER_OPTIONS.map((w) => {
                  const Icon = (LucideIcons as Record<string, unknown>)[w.icon] as LucideIconComponent;
                  const active = w.id === state.creativeWeather;
                  return (
                    <button
                      key={w.id}
                      onClick={() => dispatch({ type: "SET_WEATHER", weather: w.id as WeatherType })}
                      title={w.label}
                      className={`p-1.5 rounded-lg transition-colors ${
                        active
                          ? "bg-parchment text-soft-brown"
                          : "text-warm-gray hover:text-soft-brown hover:bg-parchment/60"
                      }`}
                    >
                      {Icon && <Icon size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="my-1 border-warm-gray-light/20" />

            {/* Surprise Me */}
            <button
              onClick={handleSurprise}
              className="w-full px-3 py-2.5 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2.5 transition-colors"
            >
              <Shuffle size={15} />
              Surprise Me
            </button>

            <hr className="my-1 border-warm-gray-light/20" />

            {/* Export */}
            <button
              onClick={handleExportJSON}
              className="w-full px-3 py-2.5 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2.5 transition-colors"
            >
              <FileJson size={15} />
              Export JSON
            </button>
            <button
              onClick={handleExportMD}
              className="w-full px-3 py-2.5 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2.5 transition-colors"
            >
              <FileText size={15} />
              Export Markdown
            </button>

            <hr className="my-1 border-warm-gray-light/20" />

            {/* Ambient + Dark mode */}
            <button
              onClick={() => { dispatch({ type: "TOGGLE_AMBIENT" }); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left text-sm text-soft-brown hover:bg-parchment
                flex items-center gap-2.5 transition-colors"
            >
              {state.ambientMode ? <Volume2 size={15} /> : <VolumeX size={15} />}
              {state.ambientMode ? "Disable ambient" : "Enable ambient"}
            </button>
            {mounted && (
              <button
                onClick={() => { toggleDark(); setOpen(false); }}
                className="w-full px-3 py-2.5 text-left text-sm text-soft-brown hover:bg-parchment
                  flex items-center gap-2.5 transition-colors"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
                {dark ? "Light mode" : "Dark mode"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  const { state, dispatch } = useGarden();
  const { dark, toggle: toggleDark, mounted } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-warm-gray-light/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <PotatoLogo size={28} />
          <span className="font-accent text-2xl text-soft-brown hidden sm:inline">rotato</span>
        </Link>

        <div className="flex-1" />

        {/* Desktop-only: weather, surprise, export */}
        <div className="hidden sm:flex items-center gap-2">
          <CreativeWeatherWidget />
          <SurpriseMe />
          <ExportMenu />
        </div>

        {/* Always visible */}
        <SeedCapture />
        <ViewModePicker />

        {/* Desktop-only: ambient + dark mode */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_AMBIENT" })}
          className="hidden sm:flex p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
            text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
          aria-label={state.ambientMode ? "Disable ambient mode" : "Enable ambient mode"}
        >
          {state.ambientMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        {mounted && (
          <button
            onClick={toggleDark}
            className="hidden sm:flex p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
              text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
            aria-label={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        {/* Mobile: everything else behind ··· */}
        <MobileOverflowMenu />
      </div>
    </header>
  );
}
