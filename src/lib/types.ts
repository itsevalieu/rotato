export type SectionId =
  | "currently-playing"
  | "resting"
  | "seeds"
  | "finished-worlds";

export type CreativeWeather =
  | "sunny"
  | "breezy"
  | "cozy-rain"
  | "foggy"
  | "starry";

export interface TimelineEntry {
  from: SectionId;
  to: SectionId;
  movedAt: string; // ISO date
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string; // ISO date
  mood?: CreativeWeather;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  section: SectionId;
  inspirationText?: string;
  tags: string[];
  lastTouchedAt: string; // ISO date
  createdAt: string; // ISO date
  color?: string; // hex from palette
  icon?: string; // lucide icon name
  nextTinyStep?: string;
  /** @deprecated use journalEntries instead */
  journalEntry?: string;
  journalEntries: JournalEntry[];
  checklistItems: ChecklistItem[];
  timeline: TimelineEntry[];
  archived: boolean;
}

export type ViewMode = "board" | "gallery";

export interface GardenState {
  projects: Project[];
  creativeWeather: CreativeWeather;
  ambientMode: boolean;
  collapsedSections: SectionId[];
  viewMode: ViewMode;
  focusProjectId?: string;
  hydrated: boolean;
}

export type GardenAction =
  | { type: "HYDRATE"; state: Omit<GardenState, "hydrated"> }
  | { type: "ADD_PROJECT"; project: Project }
  | { type: "UPDATE_PROJECT"; project: Project }
  | { type: "DELETE_PROJECT"; id: string }
  | { type: "MOVE_PROJECT"; id: string; to: SectionId }
  | { type: "ARCHIVE_PROJECT"; id: string }
  | { type: "UNARCHIVE_PROJECT"; id: string }
  | { type: "SET_WEATHER"; weather: CreativeWeather }
  | { type: "TOGGLE_AMBIENT" }
  | { type: "TOGGLE_SECTION_COLLAPSE"; sectionId: SectionId }
  | { type: "SET_VIEW_MODE"; mode: ViewMode }
  | { type: "SHUFFLE_SECTION"; sectionId: SectionId }
  | { type: "REORDER_PROJECTS"; projectIds: string[]; sectionId: SectionId }
  | { type: "ADD_JOURNAL_ENTRY"; id: string; entry: JournalEntry }
  | { type: "SET_FOCUS"; id: string }
  | { type: "CLEAR_FOCUS" }
  | { type: "ADD_CHECKLIST_ITEM"; projectId: string; item: ChecklistItem }
  | { type: "TOGGLE_CHECKLIST_ITEM"; projectId: string; itemId: string }
  | { type: "DELETE_CHECKLIST_ITEM"; projectId: string; itemId: string };
