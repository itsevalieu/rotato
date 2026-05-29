# Appendix A — Product Requirements Document

**Product:** Rotato
**Version:** 1.0
**Status:** Validated (post-Red Team audit)
**Author:** PM + AI (Claude Sonnet draft, Claude Opus Red Team audit)
**Epic:** ROT-EPIC-001
**Confluence page:** ROT-PRD-001

---

## Problem Statement

Creative people — musicians, writers, game developers, artists, hobbyists — typically have more projects than time. They context-switch frequently, work in bursts, and abandon things without it meaning failure.

Existing tools fail them in two ways:
1. **Task managers** (Jira, Todoist, Linear, Asana) frame everything as work: deadlines, priorities, completion percentages. They create anxiety around creative work that is inherently non-linear.
2. **Note apps** (Notion, Obsidian) are too freeform — they don't give the "glance view" that lets someone see all their projects at once and feel oriented.

The gap: a tool that surfaces **all creative projects at a glance** without imposing urgency, deadlines, or productivity frameworks.

---

## User Personas

### Persona 1 — The Multidisciplinary Maker
- Has 8–15 active or semi-active creative projects across multiple domains (a game, a music album, a woodworking project, a novel)
- Context-switches frequently; needs to "re-enter" a project quickly after weeks away
- Pain: losing track of where they left off; the mental overhead of remembering all projects
- Goal: a single view that shows everything without requiring maintenance effort

### Persona 2 — The Hobby Juggler
- Has hobbies they cycle through seasonally (knitting in winter, gardening in summer, photography year-round)
- Doesn't want to "archive" or "delete" projects that aren't currently active — just park them
- Pain: binary tools (active/done) don't match the reality of seasonal creative life
- Goal: a system that accepts "resting" as a legitimate state, not a failure state

### Persona 3 — The Creative Burnout Recoverer
- Previously burned out from treating hobbies like work
- Actively avoids tools that feel like productivity software
- Pain: anything with deadlines, streaks, or completion metrics triggers anxiety
- Goal: a tool that feels like a garden, not a sprint board

---

## Goals

### Product Goals
1. Show all creative projects at a glance in one view
2. Support multiple "states" of a project without judgment (active, resting, seed, done)
3. Make adding a new project so frictionless it happens in the moment
4. Provide gentle context when returning to an abandoned project (notes, last entry)
5. Feel calming and personal, not corporate and urgent

### Non-Goals (explicit — Red Team resolved)
1. **No deadline or due date fields.** Ever. Not even optional.
2. **No account system.** Rotato is single-user, single-device, local-first. This is a permanent architectural constraint, not a deferred feature.
3. **No collaboration features.** Not in scope at any roadmap horizon.
4. **No gamification.** No streaks, no completion percentages, no badges.
5. **No monetization features** in v1.

---

## Success Metrics

| Metric | Target |
|---|---|
| Time to add first project (new user) | < 30 seconds |
| App feels "calming" (qualitative, user test) | > 80% of test participants |
| Data persists across browser refresh | 100% (IndexedDB) |
| Data persists in private browsing mode | Graceful degradation with user-visible warning |
| Hydration errors in production (SSR) | 0 |
| Lighthouse accessibility score | > 90 |

---

## Feature List

### P0 — Must ship for v1

**F-001: Garden Board**
The main view. Four fixed sections: Currently Playing, Resting, Seeds, Finished Worlds. Each project appears as a card showing title, icon, color, tags, and section. Section order is fixed; project order within sections is user-configurable via drag-and-drop.

*Acceptance criteria:*
- Given a user with projects, when the app loads, the board shows all non-archived projects in their correct sections
- Given an empty section, when the user views the board, a section-specific empty state message is shown
- Given any section, when the user collapses it, the section content hides and the collapse state persists across page reloads

**F-002: Project Form — Create and Edit**
A modal form for creating a new project or editing an existing one. Fields: title (required), description, section, color (from palette), icon (from icon set), tags (free-form), next tiny step.

*Acceptance criteria:*
- Given a user on the board, when they click "New Project", a modal opens with an empty form
- Given a form with a title, when the user submits, the project is added to the selected section
- Given an existing project card, when the user clicks edit, the form opens pre-populated
- Given a form in edit mode, when the user submits, changes are saved and visible immediately
- Given a form, when the user closes without submitting, no changes are made

**F-003: Drag and Drop**
Projects can be dragged within a section (reordering) and between sections (moving). Order persists across page reloads.

*Acceptance criteria:*
- Given a project card, when the user drags it within its section, it reorders correctly
- Given a project card, when the user drags it to a different section, it moves and the section updates
- Given any reorder or move, when the page reloads, the new order/section is preserved

### P1 — Ship within v1.1

**F-004: Onboarding + Demo Data**
First-time users see a welcome modal with a choice: explore with demo data or start fresh. A dismissible banner indicates when demo data is active. Demo data can be cleared at any time.

*Acceptance criteria:*
- Given a first-time user, when the app loads, the onboarding modal is shown
- Given the user chooses "Show me around", demo projects populate the board and a banner appears
- Given the user chooses "Start fresh", the board is empty and the onboarding modal closes
- Given demo data is active, when the user clicks "Clear demo data", all demo projects are removed

**F-005: Delight Features**
Ambient sounds (rain, café, forest — toggleable), confetti animation on project completion (move to Finished Worlds), creative weather moods (affects ambient background), tended whispers (occasional gentle encouragements), mood check-in.

*Acceptance criteria:*
- Given a project moved to Finished Worlds, confetti fires once
- Given ambient mode enabled, the ambient background animates according to the active weather mood
- Given ambient sound toggled on, audio plays; toggled off, audio stops; preference persists

### P2 — Roadmap

**F-006: Form Style Switcher**
Six interchangeable form layouts for creating and editing projects: Classic, Sentence, Seed Packet, Two-Beat, Envelope, and Live Preview. The user's preferred style persists across sessions. Switching styles mid-form preserves all entered field values.

*Acceptance criteria:*
- Given the project form modal, a style picker is visible in the modal header
- Given the user selects a style, the form re-renders in the new style without losing field values
- Given the user closes and reopens the modal, the previously selected style is restored
- Given each of the 6 styles, when the user fills and submits the form, the project is created correctly
- Given the Live Preview style, when the user types in any field, the preview card updates in real time
- Given the Two-Beat style, when the user completes Step 1 (title), Step 2 (details) appears with a transition

---

## Out of Scope

- User accounts, authentication, or cloud sync
- Mobile native app (web responsive only)
- Collaboration or sharing
- Integrations with external tools (calendars, project management software)
- Import/export to other tools (export to JSON is in-scope for a future version)
- Analytics, telemetry, or usage tracking

---

## Data Model Summary

All data is stored locally in IndexedDB via `idb-keyval`. The root object is `GardenState`:

```typescript
interface GardenState {
  projects: Project[];        // all projects (including archived)
  creativeWeather: CreativeWeather;
  ambientMode: boolean;
  collapsedSections: SectionId[];
  viewMode: ViewMode;
  formStyle: FormStyle;       // persisted form layout preference
  focusProjectId?: string;
  hydrated: boolean;
  isDemoData?: boolean;
}
```

A `Project` contains: `id`, `title`, `description`, `section`, `tags`, `color`, `icon`, `nextTinyStep`, `journalEntries`, `checklistItems`, `timeline`, `archived`, `createdAt`, `lastTouchedAt`.

Sections are fixed: `"currently-playing"` | `"resting"` | `"seeds"` | `"finished-worlds"`.

---

## Red Team Audit Log

*Generated by Claude Opus, reviewed and resolved by PM.*

| # | Finding | Type | Resolution |
|---|---|---|---|
| RT-001 | "No deadlines" conflicts with "Finished Worlds" section — what defines 'finished'? | Contradiction | Added to non-goals: "finished" means user-declared, no completion criteria enforced |
| RT-002 | Single-user assumption never stated | Implicit assumption | Added explicit non-goal: "No multi-user or collaboration features" |
| RT-003 | "Local-first" not scoped as permanent constraint | Implicit assumption | Added explicit non-goal: "No account system, ever. Permanent architectural constraint." |
| RT-004 | Private browsing mode: IndexedDB unavailable — not addressed | Missing edge case | Added to success metrics: graceful degradation with user-visible warning |
| RT-005 | Two browser tabs open simultaneously — behavior undefined | Missing edge case | Added note: last-write-wins; no sync conflict handling in v1 |
