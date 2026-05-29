"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Sparkles } from "lucide-react";
import PotatoLogo from "@/components/ui/PotatoLogo";
import { useGarden } from "@/context/GardenContext";
import { ONBOARDING_KEY } from "@/lib/constants";

export default function OnboardingModal() {
  const { state, dispatch } = useGarden();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show when the app has hydrated with demo data and the user
    // hasn't already made a choice.
    if (typeof window !== "undefined" && !localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true);
    }
  }, []);

  // If state was loaded from saved storage (isDemoData not set), never show.
  const shouldShow = visible && state.hydrated && state.isDemoData;

  function handleStartFresh() {
    dispatch({ type: "CLEAR_DEMO_DATA" });
    localStorage.setItem(ONBOARDING_KEY, "done");
    setVisible(false);
  }

  function handleExploreDemo() {
    localStorage.setItem(ONBOARDING_KEY, "demo");
    setVisible(false);
  }

  const content = (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(16px)" }}
        >
          {/* Warm backdrop */}
          <div className="absolute inset-0 bg-cream/70 dark:bg-[#1a1510]/80" />

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.05 }}
            className="relative z-10 w-full max-w-lg"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-terracotta/10 border border-terracotta/20 mb-4">
                <PotatoLogo size={44} />
              </div>
              <h1 className="text-3xl font-accent text-soft-brown dark:text-[#F0E4DA] mb-2">
                Welcome to Rotato
              </h1>
              <p className="text-warm-gray text-sm leading-relaxed max-w-sm mx-auto">
                A gentle space to tend your creative projects — no deadlines, no pressure. Just ideas growing at their own pace.
              </p>
            </div>

            {/* Option cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <OptionCard
                icon={<Sprout size={22} className="text-sage" />}
                iconBg="bg-sage/10 border-sage/20"
                title="Start fresh"
                description="Plant your first real project in a blank garden."
                buttonLabel="Start fresh"
                buttonClass="bg-soft-brown text-cream hover:bg-soft-brown/90 dark:bg-[#F0E4DA] dark:text-[#2a1f18] dark:hover:bg-[#e0d0c4]"
                onClick={handleStartFresh}
              />
              <OptionCard
                icon={<Sparkles size={22} className="text-muted-gold" />}
                iconBg="bg-muted-gold/10 border-muted-gold/20"
                title="Explore demo"
                description="Look around with sample projects before committing."
                buttonLabel="Explore demo"
                buttonClass="bg-parchment text-soft-brown border border-warm-gray-light hover:bg-cream-dark dark:bg-white/[0.08] dark:text-[#F0E4DA] dark:border-white/[0.15] dark:hover:bg-white/[0.12]"
                onClick={handleExploreDemo}
              />
            </div>

            <p className="text-center text-warm-gray/60 text-xs">
              Your data stays in your browser — nothing is sent to a server.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}

interface OptionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
  onClick: () => void;
}

function OptionCard({ icon, iconBg, title, description, buttonLabel, buttonClass, onClick }: OptionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-white/70 dark:bg-white/[0.06] border border-warm-gray-light/30 dark:border-white/[0.10] shadow-warm-sm"
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-soft-brown dark:text-[#F0E4DA] mb-1">{title}</p>
        <p className="text-xs text-warm-gray leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer ${buttonClass}`}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
