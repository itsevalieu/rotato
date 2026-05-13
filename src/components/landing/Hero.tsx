"use client";

import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

const floatingCards = [
  { label: "Watercolor Journal", color: "#C67B5C", x: -120, y: -40, delay: 0 },
  { label: "Ambient EP", color: "#7E9BB0", x: 100, y: -60, delay: 0.2 },
  { label: "Ceramics", color: "#A8998A", x: -80, y: 50, delay: 0.4 },
  { label: "Short Stories", color: "#C9A96E", x: 140, y: 30, delay: 0.6 },
  { label: "Herb Zine", color: "#8B9E82", x: 0, y: 80, delay: 0.8 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Floating project cards in background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-32 sm:w-40 bg-white/40 backdrop-blur-sm rounded-xl p-3 shadow-warm-sm border border-warm-gray-light/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 0.6,
              scale: 1,
              x: card.x,
              y: card.y,
            }}
            transition={{
              delay: card.delay + 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-full h-1 rounded-full mb-2"
                style={{ backgroundColor: card.color }}
              />
              <p className="text-xs text-warm-gray font-accent">{card.label}</p>
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
          <Flower2 size={48} className="mx-auto text-terracotta" />
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
