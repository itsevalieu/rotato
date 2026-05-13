"use client";

import Hero from "@/components/landing/Hero";
import PhilosophySection from "@/components/landing/PhilosophySection";
import CallToAction from "@/components/landing/CallToAction";
import { Flower2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream paper-texture">
      <Hero />
      <PhilosophySection />
      <CallToAction />

      <footer className="py-8 text-center border-t border-warm-gray-light/20">
        <div className="flex items-center justify-center gap-2 text-warm-gray text-sm">
          <Flower2 size={14} />
          <span>rotato — tend your creative garden</span>
        </div>
      </footer>
    </div>
  );
}
