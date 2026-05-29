"use client";

import { useGarden } from "@/context/GardenContext";
import { useAmbientSound } from "@/hooks/useAmbientSound";

export default function AmbientBackground() {
  const { state } = useGarden();

  // Ambient sound follows ambient mode toggle and weather selection
  useAmbientSound(state.ambientMode, state.creativeWeather, 0.45);

  if (!state.ambientMode) return null;

  return (
    <div
      className={`fixed inset-0 -z-10 ambient-bg weather-${state.creativeWeather} pointer-events-none transition-all duration-[3000ms]`}
      aria-hidden
    />
  );
}
