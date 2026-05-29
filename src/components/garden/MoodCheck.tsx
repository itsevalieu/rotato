"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Wind, CloudRain, CloudFog, Star } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import type { CreativeWeather } from "@/lib/types";

const MOOD_KEY = "rotato-last-mood-check";
// Show once per session (tab open) — we use sessionStorage for this
const moods: { id: CreativeWeather; icon: React.ElementType; label: string; vibe: string }[] = [
  { id: "sunny",      icon: Sun,       label: "Sunny",      vibe: "energised & clear" },
  { id: "breezy",     icon: Wind,      label: "Breezy",     vibe: "light & playful" },
  { id: "cozy-rain",  icon: CloudRain, label: "Cozy Rain",  vibe: "slow & introspective" },
  { id: "foggy",      icon: CloudFog,  label: "Foggy",      vibe: "gentle & uncertain" },
  { id: "starry",     icon: Star,      label: "Starry",     vibe: "dreamy & expansive" },
];

export default function MoodCheck() {
  const { dispatch } = useGarden();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show once per browser session (sessionStorage resets on tab close)
    if (!sessionStorage.getItem(MOOD_KEY)) {
      // Small delay so it appears after the page settles
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function pick(weather: CreativeWeather) {
    dispatch({ type: "SET_WEATHER", weather });
    sessionStorage.setItem(MOOD_KEY, "done");
    setVisible(false);
  }

  function skip() {
    sessionStorage.setItem(MOOD_KEY, "done");
    setVisible(false);
  }

  const content = (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-6 z-[65] w-72 max-w-[calc(100vw-3rem)]"
        >
          <div className="rounded-2xl shadow-warm-lg border border-warm-gray-light/30 dark:border-white/[0.12]
            bg-cream/95 dark:bg-[#2a1f18]/95 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-soft-brown dark:text-[#F0E4DA]">
                What&apos;s your creative weather today?
              </p>
              <button
                onClick={skip}
                className="text-xs text-warm-gray/60 hover:text-warm-gray transition-colors cursor-pointer ml-2 shrink-0"
              >
                skip
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {moods.map(({ id, icon: Icon, label, vibe }) => (
                <button
                  key={id}
                  onClick={() => pick(id)}
                  title={vibe}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                    bg-parchment dark:bg-white/[0.08] text-warm-gray hover:text-soft-brown dark:hover:text-[#F0E4DA]
                    border border-warm-gray-light/30 dark:border-white/[0.10]
                    hover:border-warm-gray/40 dark:hover:border-white/20
                    transition-all duration-150 cursor-pointer"
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
