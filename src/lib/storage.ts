import { get, set } from "idb-keyval";
import { STORAGE_KEY } from "./constants";
import type { GardenState } from "./types";

type PersistedState = Omit<GardenState, "hydrated">;

export async function loadState(): Promise<PersistedState | null> {
  try {
    const data = await get<PersistedState>(STORAGE_KEY);
    if (data) return data;
  } catch {
    // IndexedDB unavailable, try localStorage
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // localStorage also unavailable
  }

  return null;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: GardenState): void {
  if (saveTimer) clearTimeout(saveTimer);

  // Debounce writes by 300ms to avoid thrashing
  saveTimer = setTimeout(() => {
    const { hydrated: _, ...persistable } = state;

    try {
      set(STORAGE_KEY, persistable).catch(() => {
        fallbackToLocalStorage(persistable);
      });
    } catch {
      fallbackToLocalStorage(persistable);
    }
  }, 300);
}

function fallbackToLocalStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently fail
  }
}
