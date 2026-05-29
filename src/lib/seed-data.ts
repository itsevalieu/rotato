import type { Project, GardenState } from "./types";

// All dates are static so server and client produce identical HTML (no hydration mismatch).
// Reference point: 2026-05-12

const seedProjects: Project[] = [
  {
    id: "seed-1",
    title: "Watercolor Journal",
    description:
      "A daily watercolor practice journal exploring color theory and botanical illustration.",
    section: "currently-playing",
    inspirationText: "Inspired by the golden hour light through kitchen windows",
    tags: ["art", "watercolor", "daily-practice"],
    lastTouchedAt: "2026-05-11T10:00:00.000Z",
    createdAt: "2026-03-28T10:00:00.000Z",
    color: "#C67B5C",
    icon: "Palette",
    nextTinyStep: "Paint the succulent on the windowsill",
    journalEntries: [
      {
        id: "je-1-1",
        text: "Finally figured out how to get that soft edge on wet paper. The trick is patience.",
        createdAt: "2026-05-11T10:00:00.000Z",
      },
      {
        id: "je-1-2",
        text: "Started with leaves today. Botanical shapes are harder than they look.",
        createdAt: "2026-05-04T10:00:00.000Z",
      },
    ],
    checklistItems: [
      { id: "ci-1-1", text: "Buy cold-press paper", done: true },
      { id: "ci-1-2", text: "Practice wet-on-wet technique", done: false },
      { id: "ci-1-3", text: "Fill one full sketchbook page", done: false },
    ],
    timeline: [],
    archived: false,
  },
  {
    id: "seed-2",
    title: "Ambient Music EP",
    description:
      "Four-track ambient EP using field recordings from morning walks and layered synths.",
    section: "currently-playing",
    inspirationText: "The sound of rain on a tin roof",
    tags: ["music", "ambient", "recording"],
    lastTouchedAt: "2026-05-09T10:00:00.000Z",
    createdAt: "2026-03-13T10:00:00.000Z",
    color: "#7E9BB0",
    icon: "Music",
    nextTinyStep: "Record the creek behind the house at dawn",
    journalEntries: [],
    checklistItems: [
      { id: "ci-2-1", text: "Record creek at dawn", done: false },
      { id: "ci-2-2", text: "Layer synth pad on track 1", done: true },
      { id: "ci-2-3", text: "Master and export", done: false },
    ],
    timeline: [],
    archived: false,
  },
  {
    id: "seed-3",
    title: "Short Story Collection",
    description:
      "Interconnected short stories set in a fictional small town. Cozy magical realism vibes.",
    section: "resting",
    inspirationText: "What if a library could remember everyone who visited?",
    tags: ["writing", "fiction", "short-stories"],
    lastTouchedAt: "2026-04-12T10:00:00.000Z",
    createdAt: "2026-01-12T10:00:00.000Z",
    color: "#C9A96E",
    icon: "BookOpen",
    nextTinyStep: "Outline the story about the clockmaker",
    journalEntries: [
      {
        id: "je-3-1",
        text: "Taking a break from this one. The characters need time to develop in my mind.",
        createdAt: "2026-04-12T10:00:00.000Z",
      },
    ],
    checklistItems: [],
    timeline: [
      { from: "currently-playing", to: "resting", movedAt: "2026-04-12T10:00:00.000Z" },
    ],
    archived: false,
  },
  {
    id: "seed-4",
    title: "Ceramics Experiments",
    description: "Hand-building wonky mugs and small bowls. Embracing imperfection.",
    section: "resting",
    tags: ["craft", "ceramics", "3d"],
    lastTouchedAt: "2026-04-28T10:00:00.000Z",
    createdAt: "2026-02-11T10:00:00.000Z",
    color: "#A8998A",
    icon: "Gem",
    nextTinyStep: "Try the new speckled glaze on a test tile",
    journalEntries: [],
    checklistItems: [],
    timeline: [
      { from: "currently-playing", to: "resting", movedAt: "2026-04-28T10:00:00.000Z" },
    ],
    archived: false,
  },
  {
    id: "seed-5",
    title: "Learn letterpress",
    description: "Find a local workshop or studio to try letterpress printing.",
    section: "seeds",
    tags: ["craft", "typography", "printmaking"],
    lastTouchedAt: "2026-04-22T10:00:00.000Z",
    createdAt: "2026-04-22T10:00:00.000Z",
    icon: "Pen",
    journalEntries: [],
    checklistItems: [],
    timeline: [],
    archived: false,
  },
  {
    id: "seed-6",
    title: "Tiny stop-motion film",
    description:
      "A 30-second stop-motion using paper cutouts. Maybe about seasons changing.",
    section: "seeds",
    tags: ["animation", "film", "paper"],
    lastTouchedAt: "2026-05-02T10:00:00.000Z",
    createdAt: "2026-05-02T10:00:00.000Z",
    icon: "Film",
    journalEntries: [],
    checklistItems: [],
    timeline: [],
    archived: false,
  },
  {
    id: "seed-7",
    title: "Herb garden zine",
    description: "A small illustrated zine about growing herbs in an apartment.",
    section: "seeds",
    tags: ["zine", "illustration", "gardening"],
    lastTouchedAt: "2026-05-07T10:00:00.000Z",
    createdAt: "2026-05-07T10:00:00.000Z",
    color: "#8B9E82",
    icon: "Leaf",
    journalEntries: [],
    checklistItems: [],
    timeline: [],
    archived: false,
  },
  {
    id: "seed-8",
    title: "Inktober 2025",
    description:
      "Completed all 31 days of ink drawings following the official prompt list. A full sketchbook of weird creatures and cozy scenes.",
    section: "finished-worlds",
    tags: ["art", "illustration", "challenge"],
    lastTouchedAt: "2025-11-24T10:00:00.000Z",
    createdAt: "2025-10-24T10:00:00.000Z",
    color: "#C9A96E",
    icon: "Feather",
    journalEntries: [
      {
        id: "je-8-1",
        text: "This was the first time I finished a month-long challenge. So proud of how the style evolved.",
        createdAt: "2025-11-24T10:00:00.000Z",
      },
      {
        id: "je-8-2",
        text: "Day 15 — the prompt 'shelter' unlocked something. Drew a snail carrying a tiny house.",
        createdAt: "2025-11-08T10:00:00.000Z",
      },
    ],
    checklistItems: [
      { id: "ci-8-1", text: "Complete all 31 days", done: true },
      { id: "ci-8-2", text: "Scan and post favourite pieces", done: true },
    ],
    timeline: [
      { from: "currently-playing", to: "finished-worlds", movedAt: "2025-11-24T10:00:00.000Z" },
    ],
    archived: false,
  },
];

export const initialState: GardenState = {
  projects: seedProjects,
  creativeWeather: "sunny",
  ambientMode: false,
  collapsedSections: [],
  viewMode: "board",
  formStyle: "classic",
  hydrated: false,
  isDemoData: true,
};

export { seedProjects };
