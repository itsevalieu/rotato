export type SectionId =
  | "currently-playing"
  | "resting"
  | "seeds"
  | "finished-worlds";

export interface TimelineEntry {
  from: SectionId;
  to: SectionId;
  movedAt: string; // ISO date
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
  journalEntry?: string;
  timeline: TimelineEntry[];
  archived: boolean;
}

export type CreativeWeather =
  | "sunny"
  | "breezy"
  | "cozy-rain"
  | "foggy"
  | "starry";

export type ViewMode = "board" | "gallery";

export interface GardenState {
  projects: Project[];
  creativeWeather: CreativeWeather;
  ambientMode: boolean;
  collapsedSections: SectionId[];
  viewMode: ViewMode;
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
  | { type: "REORDER_PROJECTS"; projectIds: string[]; sectionId: SectionId };
