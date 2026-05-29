"use client";

import { motion } from "framer-motion";
import PotatoLogo from "@/components/ui/PotatoLogo";

const floatingCards = [
  { label: "Watercolor Journal", sub: "Currently Playing", color: "#C67B5C", style: { top: "12%",   left: "4%" },   delay: 0   },
  { label: "Ambient EP",         sub: "Resting",           color: "#7E9BB0", style: { top: "8%",    right: "5%" },  delay: 0.2 },
  { label: "Ceramics",           sub: "Seeds",             color: "#A8998A", style: { top: "52%",   left: "3%" },   delay: 0.4 },
  { label: "Short Stories",      sub: "Finished Worlds",   color: "#C9A96E", style: { top: "55%",   right: "4%" },  delay: 0.6 },
  { label: "Herb Zine",          sub: "Seeds",             color: "#8B9E82", style: { bottom: "8%", left: "44%" },  delay: 0.8 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Floating project cards — anchored to edges, never overlap the title */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute w-36 sm:w-44 bg-white/60 backdrop-blur-sm rounded-2xl p-3.5 shadow-warm border border-warm-gray-light/25"
            style={card.style}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{
              delay: card.delay + 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-2/3 h-1 rounded-full mb-2.5"
                style={{ backgroundColor: card.color }}
              />
              <p className="text-sm text-soft-brown font-accent truncate leading-tight">{card.label}</p>
              <p className="text-[10px] mt-1 truncate" style={{ color: card.color }}>{card.sub}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <PotatoLogo size={72} className="mx-auto drop-shadow-md" />
        </motion.div>

        <h1 className="font-accent text-5xl sm:text-7xl text-soft-brown mb-4">
          rotato
        </h1>
        <p className="text-lg sm:text-xl text-warm-gray max-w-md mx-auto leading-relaxed">
          Tend your creative garden. No deadlines, no pressure — just play.
        </p>
      </motion.div>
    </section>
  );
}
