"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "rotato-dark-mode";

export function useDarkMode() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored !== null ? stored === "true" : prefersDark;
    setDark(enabled);
    setMounted(true);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return { dark, toggle, mounted };
}
