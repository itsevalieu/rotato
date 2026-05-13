import { formatDistanceToNow } from "date-fns";
import type { Project, SectionId, ActivityEvent } from "./types";

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

export function buildActivityFeed(projects: Project[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const project of projects) {
    // Project created event
    events.push({
      id: `created-${project.id}`,
      type: "created",
      projectId: project.id,
      projectTitle: project.title,
      projectColor: project.color,
      projectSection: project.section,
      date: project.createdAt,
    });

    // Timeline moves
    for (const entry of project.timeline ?? []) {
      events.push({
        id: `move-${project.id}-${entry.movedAt}`,
        type: "move",
        projectId: project.id,
        projectTitle: project.title,
        projectColor: project.color,
        projectSection: project.section,
        date: entry.movedAt,
        from: entry.from as SectionId,
        to: entry.to as SectionId,
      });
    }

    // Journal entries
    for (const entry of project.journalEntries ?? []) {
      events.push({
        id: `journal-${entry.id}`,
        type: "journal",
        projectId: project.id,
        projectTitle: project.title,
        projectColor: project.color,
        projectSection: project.section,
        date: entry.createdAt,
        text: entry.text,
      });
    }
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
