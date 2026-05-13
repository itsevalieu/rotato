"use client";

import Link from "next/link";
import { Flower2, Volume2, VolumeX, LayoutGrid, List } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import CreativeWeather from "@/components/garden/CreativeWeather";
import SurpriseMe from "@/components/garden/SurpriseMe";

export default function Header() {
  const { state, dispatch } = useGarden();

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-warm-gray-light/20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Flower2 size={24} className="text-terracotta" />
          <span className="font-accent text-2xl text-soft-brown">
            rotato
          </span>
        </Link>

        <div className="flex-1" />

        <CreativeWeather />

        <SurpriseMe />

        <button
          onClick={() =>
            dispatch({
              type: "SET_VIEW_MODE",
              mode: state.viewMode === "board" ? "gallery" : "board",
            })
          }
          className="p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
            text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
          aria-label={`Switch to ${state.viewMode === "board" ? "gallery" : "board"} view`}
        >
          {state.viewMode === "board" ? (
            <LayoutGrid size={16} />
          ) : (
            <List size={16} />
          )}
        </button>

        <button
          onClick={() => dispatch({ type: "TOGGLE_AMBIENT" })}
          className="p-2 rounded-xl bg-white/60 border border-warm-gray-light/30
            text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors"
          aria-label={
            state.ambientMode ? "Disable ambient mode" : "Enable ambient mode"
          }
        >
          {state.ambientMode ? (
            <Volume2 size={16} />
          ) : (
            <VolumeX size={16} />
          )}
        </button>
      </div>
    </header>
  );
}
