"use client";

import { useGarden } from "@/context/GardenContext";

export default function AmbientBackground() {
  const { state } = useGarden();

  if (!state.ambientMode) return null;

  return (
    <div
      className="fixed inset-0 -z-10 ambient-bg pointer-events-none"
      aria-hidden
    />
  );
}
