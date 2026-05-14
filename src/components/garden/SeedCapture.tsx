"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout } from "lucide-react";
import { useGarden } from "@/context/GardenContext";

export default function SeedCapture() {
  const { createProject } = useGarden();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setValue("");
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    createProject({
      title: trimmed,
      description: "",
      section: "seeds",
      tags: [],
      journalEntries: [],
      checklistItems: [],
    });
    setValue("");
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-2 rounded-xl border transition-colors ${
          open
            ? "bg-sage/15 border-sage/30 text-sage"
            : "bg-white/60 border-warm-gray-light/30 text-warm-gray hover:text-soft-brown hover:bg-parchment"
        }`}
        aria-label="Plant a seed idea"
        title="Plant a seed"
      >
        <Sprout size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-11 z-50 bg-cream rounded-2xl shadow-warm-lg
              border border-warm-gray-light/30 p-3 w-64"
          >
            <p className="text-[10px] font-medium text-warm-gray/60 uppercase tracking-wider mb-2">
              Plant a seed
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); commit(); }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                placeholder="A tiny idea…"
                className="flex-1 text-sm bg-white/70 dark:bg-white/[0.06] border border-warm-gray-light/30 rounded-xl px-3 py-2
                  text-soft-brown placeholder:text-warm-gray/50 focus:outline-none focus:ring-2
                  focus:ring-sage/30 focus:border-sage/40 transition-all"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="p-2 rounded-xl bg-sage text-cream disabled:opacity-30 disabled:cursor-not-allowed
                  hover:bg-sage/90 transition-colors shrink-0"
                aria-label="Plant seed"
              >
                <Sprout size={14} />
              </button>
            </form>
            <p className="text-[10px] text-warm-gray/50 mt-1.5">Press Enter to plant</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
