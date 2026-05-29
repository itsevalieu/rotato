import { formatDistanceToNow } from "date-fns";
import type { Project, SectionId, ActivityEvent } from "./types";

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/** Gentle, poetic relative time for the "last tended" whisper on cards. */
export function tendedWhisper(dateStr: string, section?: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );
  if (days === 0) return "tended today";
  if (days === 1) return "tended yesterday";
  if (days < 7) return `tended ${days} days ago`;
  if (days < 14) return section === "resting" ? "resting a week" : "tended a week ago";
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return section === "resting" ? `resting ${weeks} weeks` : `tended ${weeks} weeks ago`;
  }
  if (days < 60) return section === "resting" ? "resting a month" : "tended a month ago";
  const months = Math.floor(days / 30);
  return section === "resting" ? `resting ${months} months` : `tended ${months} months ago`;
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
