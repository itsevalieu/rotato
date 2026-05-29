"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGarden } from "@/context/GardenContext";

export default function DemoBanner() {
  const { state, dispatch } = useGarden();
  const [dismissed, setDismissed] = useState(false);

  if (!state.isDemoData || dismissed) return null;

  function handleClear() {
    dispatch({ type: "CLEAR_DEMO_DATA" });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="flex items-center gap-3 px-4 py-2.5 mb-4 rounded-xl
          bg-muted-gold/10 border border-muted-gold/25
          dark:bg-muted-gold/[0.08] dark:border-muted-gold/20"
      >
        <Sparkles size={15} className="shrink-0 text-muted-gold" />
        <p className="flex-1 text-xs text-soft-brown dark:text-[#F0E4DA]">
          You&apos;re exploring demo data.{" "}
          <button
            onClick={handleClear}
            className="underline underline-offset-2 hover:text-terracotta dark:hover:text-terracotta transition-colors duration-150 cursor-pointer font-medium"
          >
            Clear it and start fresh
          </button>
          {" "}whenever you&apos;re ready.
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss demo notice"
          className="shrink-0 p-0.5 rounded text-warm-gray hover:text-soft-brown dark:hover:text-[#F0E4DA] transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
