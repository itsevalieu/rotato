import type { Project, GardenState } from "./types";

const now = new Date().toISOString();
const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000).toISOString();

const seedProjects: Project[] = [
  {
    id: "seed-1",
    title: "Watercolor Journal",
    description:
      "A daily watercolor practice journal exploring color theory and botanical illustration.",
    section: "currently-playing",
    inspirationText: "Inspired by the golden hour light through kitchen windows",
    tags: ["art", "watercolor", "daily-practice"],
    lastTouchedAt: daysAgo(1),
    createdAt: daysAgo(45),
    color: "#C67B5C",
    icon: "Palette",
    nextTinyStep: "Paint the succulent on the windowsill",
    journalEntry:
      "Finally figured out how to get that soft edge on wet paper. The trick is patience.",
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
    lastTouchedAt: daysAgo(3),
    createdAt: daysAgo(60),
    color: "#7E9BB0",
    icon: "Music",
    nextTinyStep: "Record the creek behind the house at dawn",
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
    lastTouchedAt: daysAgo(30),
    createdAt: daysAgo(120),
    color: "#C9A96E",
    icon: "BookOpen",
    nextTinyStep: "Outline the story about the clockmaker",
    journalEntry:
      "Taking a break from this one. The characters need time to develop in my mind.",
    timeline: [
      {
        from: "currently-playing",
        to: "resting",
        movedAt: daysAgo(30),
      },
    ],
    archived: false,
  },
  {
    id: "seed-4",
    title: "Ceramics Experiments",
    description:
      "Hand-building wonky mugs and small bowls. Embracing imperfection.",
    section: "resting",
    tags: ["craft", "ceramics", "3d"],
    lastTouchedAt: daysAgo(14),
    createdAt: daysAgo(90),
    color: "#A8998A",
    icon: "Gem",
    nextTinyStep: "Try the new speckled glaze on a test tile",
    timeline: [
      {
        from: "currently-playing",
        to: "resting",
        movedAt: daysAgo(14),
      },
    ],
    archived: false,
  },
  {
    id: "seed-5",
    title: "Learn letterpress",
    description: "Find a local workshop or studio to try letterpress printing.",
    section: "seeds",
    tags: ["craft", "typography", "printmaking"],
    lastTouchedAt: daysAgo(20),
    createdAt: daysAgo(20),
    icon: "Pen",
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
    lastTouchedAt: daysAgo(10),
    createdAt: daysAgo(10),
    icon: "Film",
    timeline: [],
    archived: false,
  },
  {
    id: "seed-7",
    title: "Herb garden zine",
    description:
      "A small illustrated zine about growing herbs in an apartment.",
    section: "seeds",
    tags: ["zine", "illustration", "gardening"],
    lastTouchedAt: daysAgo(5),
    createdAt: daysAgo(5),
    color: "#8B9E82",
    icon: "Leaf",
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
    lastTouchedAt: daysAgo(200),
    createdAt: daysAgo(230),
    color: "#C9A96E",
    icon: "Feather",
    journalEntry:
      "This was the first time I finished a month-long challenge. So proud of how the style evolved.",
    timeline: [
      {
        from: "currently-playing",
        to: "finished-worlds",
        movedAt: daysAgo(200),
      },
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
  hydrated: false,
};

export { seedProjects };
