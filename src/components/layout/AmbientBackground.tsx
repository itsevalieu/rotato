"use client";

import { useGarden } from "@/context/GardenContext";

export default function AmbientBackground() {
  const { state } = useGarden();

  if (!state.ambientMode) return null;

  return (
    <div
      className={`fixed inset-0 -z-10 ambient-bg weather-${state.creativeWeather} pointer-events-none transition-all duration-[3000ms]`}
      aria-hidden
    />
  );
}
