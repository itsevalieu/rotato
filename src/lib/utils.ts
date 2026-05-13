import { formatDistanceToNow } from "date-fns";
import type { Project, SectionId } from "./types";

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function randomPick<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function filterProjects(
  projects: Project[],
  query: string,
  tagFilter?: string
): Project[] {
  let filtered = projects;

  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.nextTinyStep?.toLowerCase().includes(q) ||
        p.journalEntries?.some((e) => e.text.toLowerCase().includes(q))
    );
  }

  if (tagFilter) {
    filtered = filtered.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())
    );
  }

  return filtered;
}

export function getProjectsBySection(
  projects: Project[],
  sectionId: SectionId
): Project[] {
  return projects.filter((p) => p.section === sectionId && !p.archived);
}

export function getAllTags(projects: Project[]): string[] {
  const tagSet = new Set<string>();
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getDormancyStatus(
  lastTouchedAt: string
): { label: string; level: "warn" | "alert" } | null {
  const days = Math.floor(
    (Date.now() - new Date(lastTouchedAt).getTime()) / 86400000
  );
  if (days >= 30) return { label: `${days}d idle`, level: "alert" };
  if (days >= 7) return { label: `${days}d idle`, level: "warn" };
  return null;
}

export function getSectionColor(sectionId: SectionId): string {
  const colors: Record<SectionId, string> = {
    "currently-playing": "terracotta",
    resting: "dusty-blue",
    seeds: "sage",
    "finished-worlds": "muted-gold",
  };
  return colors[sectionId];
}
