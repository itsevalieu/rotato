# Appendix C — Technical Architecture

**Product:** Rotato
**Version:** 1.0
**Status:** Validated (post-Confidence Map review)
**Author:** Tech Lead + AI (Claude Sonnet)
**Confluence page:** ROT-ARCH-001

---

## Architecture Overview

Rotato is a **client-only, local-first web application** built with Next.js. All data lives in the browser via IndexedDB. There is no backend, no API, no authentication.

```
┌─────────────────────────────────────────────────────┐
│  Next.js App Router (static export capable)         │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  React Context (GardenContext)              │    │
│  │  useReducer — GardenState                  │    │
│  │                                             │    │
│  │  ┌──────────────┐  ┌────────────────────┐   │    │
│  │  │  Components  │  │  Cursor rules/     │   │    │
│  │  │  (garden/,   │  │  skills/hooks      │   │    │
│  │  │   ui/)       │  │  (generated)       │   │    │
│  │  └──────────────┘  └────────────────────┘   │    │
│  └─────────────────────────────────────────────┘    │
│                           │                         │
│                    idb-keyval                        │
│                    (IndexedDB)                       │
└─────────────────────────────────────────────────────┘
```

---

## Architecture Decision Records

### ADR-001: Next.js App Router

**Status:** Accepted
**Context:** Need a React framework with SSR support, good DX, and Vercel deploy story. Options: Next.js Pages Router, Next.js App Router, Vite + React SPA.
**Decision:** Use Next.js App Router.
**Consequences:**
- Server components available but not heavily used (app is client-only)
- SSR behavior requires careful handling of client-only APIs (localStorage, Date, browser-specific formatting)
- **Confidence: 🟡 AMBER** — this is the standard choice; not explicitly required by the PRD

### ADR-002: React Context + useReducer (not Zustand or Redux)

**Status:** Accepted
**Context:** Need global state for projects, view mode, ambient settings, form preferences. Options: Zustand, Redux Toolkit, React Context + useReducer, Jotai.
**Decision:** React Context + useReducer. Single `GardenContext` with `GardenState` and `GardenAction` union type.
**Consequences:**
- No additional dependency
- Entire state shape is visible in one file (`src/lib/types.ts`)
- Re-renders on any state change (acceptable — state updates are infrequent)
- **Confidence: 🟡 AMBER** — reasonable default for app of this scale; not spec'd

### ADR-003: IndexedDB via idb-keyval

**Status:** Accepted
**Context:** Local-first storage is an explicit PRD non-goal (no backend). Options: localStorage, IndexedDB directly, idb-keyval, Dexie.
**Decision:** `idb-keyval` — a minimal wrapper around IndexedDB.
**Consequences:**
- Storage limit ~50–250MB (vs ~5MB for localStorage)
- Async read/write (requires hydration pattern — see ADR-006)
- Falls back silently in private browsing (IndexedDB unavailable) — graceful degradation required
- **Confidence: 🟢 GREEN** — local-first is explicitly required; idb-keyval is the appropriate tool

### ADR-004: dnd-kit for Drag and Drop

**Status:** Accepted
**Context:** F-003 (drag and drop) is a P0 feature. Options: react-beautiful-dnd (deprecated), dnd-kit, react-sortable-hoc (deprecated), custom.
**Decision:** `dnd-kit` — actively maintained, accessible, performant.
**Consequences:**
- Adds `aria-describedby` attributes to draggable elements at mount time
- SSR: these attributes are not present on the server render, causing a hydration mismatch unless guarded with a client-side mount check
- **Confidence: 🟡 AMBER** — standard choice; SSR behavior not spec'd (see Confidence Map)

### ADR-005: Modal size prop and headerAction slot

**Status:** Accepted (added during Red Team Gate 2)
**Context:** `LivePreviewForm` requires a wider modal. `FormStylePicker` needs to render in the modal header. Original Modal had neither capability.
**Decision:** Add `size?: "md" | "lg"` prop and `headerAction?: ReactNode` prop to `Modal.tsx`.
**Consequences:**
- Modal is now more composable
- `headerAction` is rendered between the title and the close button
- **Confidence: 🟢 GREEN** — requirement surfaced by design spec; explicitly resolved before implementation

### ADR-006: Client-side hydration pattern

**Status:** Accepted (created after hydration bugs were discovered)
**Context:** Three components caused hydration mismatches in production: `Date.now()` in seed data, `toLocaleString()` for date formatting, `dnd-kit aria-describedby` attributes.
**Decision:** Three mitigation patterns:
1. `suppressHydrationWarning` on elements rendering dynamic date/time values
2. Client-side mounting guard (`const [mounted, setMounted] = useState(false)`) before rendering dnd-kit draggables
3. `idb-keyval` hydration: state loads asynchronously after initial render; components check `state.hydrated` before rendering persisted data
**Consequences:**
- Initial render shows loading/skeleton states briefly
- No hydration errors in production
- **Confidence: 🔴 RED → resolved** — SSR behavior was never spec'd; this ADR documents the resolution

---

## Data Model

### GardenState

```typescript
interface GardenState {
  projects: Project[];
  creativeWeather: CreativeWeather;    // "sunny" | "breezy" | "cozy-rain" | "foggy" | "starry"
  ambientMode: boolean;
  collapsedSections: SectionId[];
  viewMode: ViewMode;                  // "board" | "gallery" | "kanban" | "quadrant" | "river" | "deck" | "three-panel"
  formStyle: FormStyle;               // "classic" | "sentence" | "seed-packet" | "two-beat" | "envelope" | "live-preview"
  focusProjectId?: string;
  hydrated: boolean;                  // false until idb-keyval load completes
  isDemoData?: boolean;
}
```

### Project

```typescript
interface Project {
  id: string;                         // uuid
  title: string;
  description: string;
  section: SectionId;                 // "currently-playing" | "resting" | "seeds" | "finished-worlds"
  tags: string[];
  color?: string;                     // hex from PALETTE_COLORS
  icon?: string;                      // Lucide icon name from ICON_OPTIONS
  nextTinyStep?: string;
  inspirationText?: string;
  journalEntries: JournalEntry[];
  checklistItems: ChecklistItem[];
  timeline: TimelineEntry[];          // movement history between sections
  archived: boolean;
  createdAt: string;                  // ISO date
  lastTouchedAt: string;              // ISO date
}
```

### GardenAction (reducer actions)

All state mutations go through the reducer. Key actions:
- `HYDRATE` — loads persisted state from IndexedDB on app init
- `ADD_PROJECT` / `UPDATE_PROJECT` / `DELETE_PROJECT`
- `MOVE_PROJECT` — changes section; adds timeline entry
- `SET_VIEW_MODE` — persisted in GardenState
- `SET_FORM_STYLE` — persisted in GardenState (added for F-006)
- `REORDER_PROJECTS` — updates order within a section (dnd-kit drag result)

---

## Confidence Map

*Full annotation of architectural decisions against the PRD + design spec.*

| Decision | Confidence | Rationale | Action required |
|---|---|---|---|
| Local-first with idb-keyval | 🟢 GREEN | PRD explicitly non-goal: no backend | None |
| Fixed four sections | 🟢 GREEN | Section names specified in PRD | None |
| No deadline/date fields in Project model | 🟢 GREEN | PRD explicit non-goal | None |
| React Context + useReducer | 🟡 AMBER | Standard for this scale; not spec'd | Review if app grows |
| Next.js App Router | 🟡 AMBER | Standard choice; not spec'd | None for current scope |
| dnd-kit for drag-and-drop | 🟡 AMBER | Standard library; not spec'd | Verify SSR behavior at integration |
| Framer Motion for animations | 🟡 AMBER | Standard choice; design spec mentions "gentle animations" | None |
| Tailwind CSS | 🟡 AMBER | Standard DX choice; not spec'd | None |
| SSR rendering behavior | 🔴 RED | Never spec'd; assumed static | **ADR-006 created; hydration guards required** |
| `Date.now()` in seed data | 🔴 RED | Server/client time mismatch not considered | **`suppressHydrationWarning` applied** |
| `toLocaleString()` on server | 🔴 RED | Locale differences server vs client | **`suppressHydrationWarning` applied** |
| dnd-kit `aria-describedby` | 🔴 RED | SSR mismatch; client-only attributes | **Mounting guard required** |
| `formStyle` in GardenState (not localStorage) | 🟢 GREEN | Resolved via Dead Reckoning — PM confirmed scope | None |
| Modal `size` and `headerAction` props | 🟢 GREEN | Resolved via Red Team Gate 2 | None |

**RED items found: 4** (3 SSR-related, 1 resolved via Dead Reckoning before coding). All resolved before or during implementation. Zero RED items in production.

---

## TDD Format Reference

There are two levels of TDD with distinct purposes and owners.

---

### Feature TDD — Stage 4, Tech Lead

Written *before tickets are scoped*. Answers: "How should this feature be built technically?" The PM uses this to correctly size and slice tickets. Without it, story point estimates are guesses.

**Generated by:** `feature-tdd` skill, written to Confluence by Tech Lead during architecture stage.

```markdown
# Feature TDD: [Feature Name]

**PRD reference:** [section]
**Author:** Tech Lead
**Status:** Draft | Approved
**Informs tickets:** [Jira ticket IDs once created]

## Approach overview
High-level technical strategy. What changes, what stays the same.

## Files and components affected
Which existing files change; what new files/components are needed.

## Interface or type changes
New types, props, or context actions required.

## Vertical slice guidance
How to split this feature into tickets. What must ship together vs. what can be deferred.

## Applicable ADRs
Which existing ADRs constrain this feature. Any new ADRs needed.

## Estimated complexity
Story point range and rationale.
```

**Feature TDD for ROT-006 (Form Style Switcher):**
- Requires adding `FormStyle` type and `formStyle` field to `GardenState`
- All field state must lift to `ProjectForm` (container); 6 style components are purely presentational
- Shared `FormStyleProps` interface needed in `form-styles/types.ts`
- Modal needs `size` and `headerAction` props (new ADR-005)
- `FormStylePicker` dispatches `SET_FORM_STYLE` to GardenContext
- Estimated: 8 points (6 components × medium + context wiring)

This Feature TDD is what made the PM's 8-point estimate accurate before the ticket was written.

---

### Implementation TDD — Stage 6, Developer

Written *after the ticket exists and Dead Reckoning resolves all ambiguities*. Documents micro-decisions specific to this ticket. Every resolved Dead Reckoning question becomes a decision log entry.

**Generated by:** `impl-tdd` skill, written to Confluence after Dead Reckoning, reviewed by Tech Lead before coding begins.

```markdown
# Implementation TDD: [Ticket ID]

**Ticket:** [Jira ticket ID]
**Author:** Developer
**Status:** Draft | Under Review | Approved
**Tech Lead review:** [Name, date, outcome]

## Problem
What this ticket solves and why.

## Approach
Specific implementation strategy. Files, patterns, APIs.

## Alternatives Considered
Other approaches and why rejected.

## Decision Log
| Dead Reckoning question | Resolution | Decided by | Confidence |
|---|---|---|---|
| ... | ... | ... | 🟢/🟡/🔴 |

## Open Questions
Must be empty before coding starts. If not empty → STOP.

## Confidence Summary
| Decision | Color |
|---|---|
| ... | 🟢/🟡/🔴 |
```

See [Appendix E](./05-implementation-plan.md) for both TDDs for ROT-006.
