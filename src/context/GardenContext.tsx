"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { GardenState, GardenAction, Project, SectionId, JournalEntry, ChecklistItem } from "@/lib/types";
import { initialState } from "@/lib/seed-data";
import { loadState, saveState } from "@/lib/storage";
import { shuffleArray } from "@/lib/utils";
import { nanoid } from "nanoid";

function migrateProject(p: Project): Project {
  let updated = p;
  if (!updated.journalEntries || updated.journalEntries.length === 0) {
    const entries: JournalEntry[] = updated.journalEntry
      ? [{ id: nanoid(), text: updated.journalEntry, createdAt: updated.lastTouchedAt }]
      : [];
    updated = { ...updated, journalEntries: entries };
  }
  if (!updated.checklistItems) {
    updated = { ...updated, checklistItems: [] };
  }
  return updated;
}

function gardenReducer(state: GardenState, action: GardenAction): GardenState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...action.state,
        projects: action.state.projects.map(migrateProject),
        hydrated: true,
      };

    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.project],
      };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.project.id
            ? { ...action.project, lastTouchedAt: new Date().toISOString() }
            : p
        ),
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
      };

    case "MOVE_PROJECT": {
      const now = new Date().toISOString();
      return {
        ...state,
        projects: state.projects.map((p) => {
          if (p.id !== action.id) return p;
          return {
            ...p,
            section: action.to,
            lastTouchedAt: now,
            timeline: [
              ...p.timeline,
              { from: p.section, to: action.to, movedAt: now },
            ],
          };
        }),
      };
    }

    case "ARCHIVE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, archived: true } : p
        ),
      };

    case "UNARCHIVE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, archived: false } : p
        ),
      };

    case "SET_WEATHER":
      return { ...state, creativeWeather: action.weather };

    case "TOGGLE_AMBIENT":
      return { ...state, ambientMode: !state.ambientMode };

    case "TOGGLE_SECTION_COLLAPSE": {
      const collapsed = state.collapsedSections.includes(action.sectionId)
        ? state.collapsedSections.filter((s) => s !== action.sectionId)
        : [...state.collapsedSections, action.sectionId];
      return { ...state, collapsedSections: collapsed };
    }

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };

    case "SHUFFLE_SECTION": {
      const sectionProjects = state.projects.filter(
        (p) => p.section === action.sectionId
      );
      const otherProjects = state.projects.filter(
        (p) => p.section !== action.sectionId
      );
      return {
        ...state,
        projects: [...otherProjects, ...shuffleArray(sectionProjects)],
      };
    }

    case "ADD_JOURNAL_ENTRY": {
      const now = new Date().toISOString();
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id !== action.id
            ? p
            : {
                ...p,
                journalEntries: [action.entry, ...p.journalEntries],
                lastTouchedAt: now,
              }
        ),
      };
    }

    case "SET_FOCUS":
      return { ...state, focusProjectId: action.id };

    case "CLEAR_FOCUS":
      return { ...state, focusProjectId: undefined };

    case "ADD_CHECKLIST_ITEM":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id !== action.projectId
            ? p
            : { ...p, checklistItems: [...(p.checklistItems ?? []), action.item] }
        ),
      };

    case "TOGGLE_CHECKLIST_ITEM":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id !== action.projectId
            ? p
            : {
                ...p,
                checklistItems: (p.checklistItems ?? []).map((item) =>
                  item.id === action.itemId ? { ...item, done: !item.done } : item
                ),
              }
        ),
      };

    case "DELETE_CHECKLIST_ITEM":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id !== action.projectId
            ? p
            : {
                ...p,
                checklistItems: (p.checklistItems ?? []).filter(
                  (item) => item.id !== action.itemId
                ),
              }
        ),
      };

    case "REORDER_PROJECTS": {
      const reorderedInSection = action.projectIds
        .map((id) => state.projects.find((p) => p.id === id))
        .filter((p): p is Project => p !== undefined);
      const others = state.projects.filter(
        (p) => p.section !== action.sectionId
      );
      return { ...state, projects: [...others, ...reorderedInSection] };
    }

    default:
      return state;
  }
}

interface GardenContextValue {
  state: GardenState;
  dispatch: React.Dispatch<GardenAction>;
  createProject: (
    data: Omit<Project, "id" | "createdAt" | "lastTouchedAt" | "timeline" | "archived">
  ) => void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gardenReducer, initialState);

  // Hydrate from storage on mount
  useEffect(() => {
    loadState().then((saved) => {
      if (saved) {
        dispatch({ type: "HYDRATE", state: saved });
      } else {
        const { hydrated: _, ...rest } = initialState;
        dispatch({ type: "HYDRATE", state: rest });
      }
    });
  }, []);

  // Persist on every state change (debounced inside saveState)
  useEffect(() => {
    if (state.hydrated) {
      saveState(state);
    }
  }, [state]);

  const createProject = useCallback(
    (
      data: Omit<Project, "id" | "createdAt" | "lastTouchedAt" | "timeline" | "archived">
    ) => {
      const now = new Date().toISOString();
      const project: Project = {
        ...data,
        id: nanoid(),
        createdAt: now,
        lastTouchedAt: now,
        timeline: [],
        journalEntries: [],
        checklistItems: [],
        archived: false,
      };
      dispatch({ type: "ADD_PROJECT", project });
    },
    []
  );

  return (
    <GardenContext.Provider value={{ state, dispatch, createProject }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return ctx;
}
