import type { SectionId, CreativeWeather } from "./types";

export const SECTION_META: Record<
  SectionId,
  {
    label: string;
    icon: string;
    color: string;
    emptyMessage: string;
    description: string;
  }
> = {
  "currently-playing": {
    label: "Currently Playing",
    icon: "Sparkles",
    color: "terracotta",
    emptyMessage: "What sparks joy today?",
    description: "Projects you're actively excited about",
  },
  resting: {
    label: "Resting",
    icon: "CloudMoon",
    color: "dusty-blue",
    emptyMessage: "Resting peacefully. They'll be here when you're ready.",
    description: "Dormant projects — not abandoned, just sleeping",
  },
  seeds: {
    label: "Seeds",
    icon: "Sprout",
    color: "sage",
    emptyMessage: "Got a tiny idea? Drop it here.",
    description: "Tiny undeveloped ideas waiting to grow",
  },
  "finished-worlds": {
    label: "Finished Worlds",
    icon: "Trophy",
    color: "muted-gold",
    emptyMessage: "Look at all you've made.",
    description: "Completed or retired projects — celebrate them",
  },
};

export const SECTION_ORDER: SectionId[] = [
  "currently-playing",
  "resting",
  "seeds",
  "finished-worlds",
];

export const WEATHER_OPTIONS: {
  id: CreativeWeather;
  label: string;
  icon: string;
}[] = [
  { id: "sunny", label: "Sunny", icon: "Sun" },
  { id: "breezy", label: "Breezy", icon: "Wind" },
  { id: "cozy-rain", label: "Cozy Rain", icon: "CloudRain" },
  { id: "foggy", label: "Foggy", icon: "CloudFog" },
  { id: "starry", label: "Starry", icon: "Star" },
];

export const PALETTE_COLORS = [
  { hex: "#C67B5C", name: "Terracotta" },
  { hex: "#8B9E82", name: "Sage" },
  { hex: "#C9A96E", name: "Muted Gold" },
  { hex: "#7E9BB0", name: "Dusty Blue" },
  { hex: "#A8998A", name: "Warm Gray" },
  { hex: "#D4957A", name: "Peach" },
  { hex: "#A8B8A0", name: "Soft Green" },
  { hex: "#D9C08E", name: "Sand" },
];

export const ICON_OPTIONS = [
  "Palette",
  "Music",
  "BookOpen",
  "Camera",
  "Pen",
  "Scissors",
  "Brush",
  "Film",
  "Mic",
  "Gamepad2",
  "Flower2",
  "Heart",
  "Gem",
  "Leaf",
  "Feather",
  "Globe",
  "Lightbulb",
  "Rocket",
  "Puzzle",
  "Code",
] as const;

export const STORAGE_KEY = "rotato-garden-state";
