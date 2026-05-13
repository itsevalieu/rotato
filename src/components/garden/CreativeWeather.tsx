"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { WEATHER_OPTIONS } from "@/lib/constants";
import type { CreativeWeather as WeatherType } from "@/lib/types";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

export default function CreativeWeather() {
  const { state, dispatch } = useGarden();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = WEATHER_OPTIONS.find((w) => w.id === state.creativeWeather)!;
  const CurrentIcon = (LucideIcons as Record<string, unknown>)[
    current.icon
  ] as LucideIconComponent;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
          bg-white/60 border border-warm-gray-light/30 text-sm text-soft-brown
          hover:bg-parchment transition-colors duration-200"
        aria-label={`Creative weather: ${current.label}`}
      >
        {CurrentIcon && <CurrentIcon size={16} />}
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-30 bg-cream rounded-xl shadow-warm-lg
              border border-warm-gray-light/30 p-2 min-w-[160px]"
          >
            <p className="text-xs text-warm-gray px-2 py-1 font-accent text-base">
              How&apos;s your creative weather?
            </p>
            {WEATHER_OPTIONS.map((w) => {
              const Icon = (LucideIcons as Record<string, unknown>)[
                w.icon
              ] as LucideIconComponent;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    dispatch({ type: "SET_WEATHER", weather: w.id });
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm
                    transition-colors duration-200
                    ${state.creativeWeather === w.id ? "bg-parchment text-soft-brown font-medium" : "text-warm-gray hover:bg-parchment hover:text-soft-brown"}`}
                >
                  {Icon && <Icon size={16} />}
                  {w.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
