"use client";

import Link from "next/link";
import { Flower2, Volume2, VolumeX, Moon, Sun } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import CreativeWeather from "@/components/garden/CreativeWeather";
import SurpriseMe from "@/components/garden/SurpriseMe";
import ExportMenu from "@/components/garden/ExportMenu";
import ViewModePicker from "@/components/garden/ViewModePicker";

export default function Header() {
  const { state, dispatch } = useGarden();
  const { dark, toggle: toggleDark, mounted } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-warm-gray-light/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Flower2 size={24} className="text-terracotta" />
          <span className="font-accent text-2xl text-soft-brown hidden sm:inline">
            rotato
          </span>
        </Link>

        <div className="flex-1" />

        <CreativeWeather />
        <SurpriseMe />
        <ExportMenu />
        <ViewModePicker />

        <button
          onClick={() => dispatch({ type: "TOGGLE_AMBIENT" })}
          className="p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
            text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
          aria-label={state.ambientMode ? "Disable ambient mode" : "Enable ambient mode"}
        >
          {state.ambientMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {mounted && (
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
              text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>
    </header>
  );
}
