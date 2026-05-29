"use client";

import { useCallback } from "react";

export function useConfetti() {
  const celebrate = useCallback(async () => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;

    // Warm, earthy confetti palette matching app colours
    const colors = ["#C67B5C", "#C9A96E", "#8B9E82", "#7E9BB0", "#D4957A", "#A8B8A0"];

    // First pop
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      scalar: 0.9,
    });

    // Second pop slightly delayed for a bloom effect
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
        scalar: 0.85,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
        scalar: 0.85,
      });
    }, 150);
  }, []);

  return { celebrate };
}
