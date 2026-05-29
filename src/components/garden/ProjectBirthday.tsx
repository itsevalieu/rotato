"use client";

import { useEffect, useRef } from "react";
import { useGarden } from "@/context/GardenContext";
import { useToast } from "@/context/ToastContext";

export default function ProjectBirthday() {
  const { state } = useGarden();
  const { showToast } = useToast();
  const shownRef = useRef(false);

  useEffect(() => {
    if (!state.hydrated || shownRef.current) return;

    const today = new Date();
    const todayMD = `${today.getMonth()}-${today.getDate()}`;

    const birthdays = state.projects.filter((p) => {
      if (p.archived) return false;
      const created = new Date(p.createdAt);
      // Must be at least 1 year old
      const ageMs = today.getTime() - created.getTime();
      if (ageMs < 365 * 24 * 60 * 60 * 1000) return false;
      const createdMD = `${created.getMonth()}-${created.getDate()}`;
      return createdMD === todayMD;
    });

    if (birthdays.length > 0) {
      shownRef.current = true;
      // Stagger toasts so they don't all pop at once
      birthdays.forEach((p, i) => {
        setTimeout(() => {
          showToast(`${p.title} is turning ${new Date().getFullYear() - new Date(p.createdAt).getFullYear()} today 🎂`, "🌱", 4000);
        }, i * 700 + 2500);
      });
    }
  }, [state.hydrated, state.projects, showToast]);

  return null;
}
