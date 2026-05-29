# Appendix D — Feature Tickets

**Epic:** ROT-EPIC-001 — Rotato v1.0
**Status:** Sprint-ready (PM Pass 1 + Tech Lead Pass 2 complete)
**Created via:** Jira MCP (`create_issue` × 6, `update_issue` × 6)

---

## How these tickets were generated

**Pass 1 — PM + Claude Haiku:**
Prompt: *"Draft vertical-slice tickets from the validated PRD. For each: user-facing title, description, ACs in given/when/then format, business priority. No story points. No technical notes."*

**Pass 2 — Tech Lead + Claude Sonnet:**
Informed by **Feature TDDs written at Stage 4** — the Tech Lead already knows the technical shape of each feature before reviewing tickets. Story point estimates are derived from Feature TDD complexity assessments, not guessed from the ticket description alone.

Prompt: *"Review these ticket drafts using the Feature TDDs as context. Add: story point estimates, technical dependencies, applicable ADR notes. Flag untestable ACs back to PM."*

---

## ROT-001 — Garden Board

| Field | Value |
|---|---|
| **ID** | ROT-001 |
| **Title** | Garden Board — core board with four sections and project cards |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P0 |
| **Story points** | 5 |
| **Dependencies** | None |

**Description**
As a creative person with many projects, I want to see all my projects organized into four meaningful sections — Currently Playing, Resting, Seeds, and Finished Worlds — so I can feel oriented without opening a single project.

**Acceptance Criteria**

1. Given a user with existing projects, when the app loads, then all non-archived projects appear in their correct sections on the board.
2. Given a section with no projects, when the user views the board, then a section-specific empty state message is displayed (e.g., "What sparks joy today?" for Currently Playing).
3. Given any section header, when the user clicks the collapse toggle, then the section content hides; given the page is reloaded, then the collapsed state is restored.
4. Given a project card, when the user hovers, then a contextual menu appears with options: Edit, Move to section, Archive.
5. Given an archived project, then it does not appear on the main board.

**Technical notes (Tech Lead)**
- Section metadata (labels, icons, colors, empty messages) lives in `SECTION_META` in `src/lib/constants.ts` — do not hardcode
- `collapsedSections: SectionId[]` in GardenState — ADR-002 (Context + useReducer)
- Section order is fixed (`SECTION_ORDER` constant) — do not make it user-configurable in this ticket
- Board renders inside the hydration guard: check `state.hydrated` before rendering project counts (ADR-006)

---

## ROT-002 — Project Form

| Field | Value |
|---|---|
| **ID** | ROT-002 |
| **Title** | Project Form — create and edit project with color, icon, tags, section |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P0 |
| **Story points** | 3 |
| **Dependencies** | ROT-001 (board must exist to place a new project) |

**Description**
As a user, I want a modal form where I can create a new project or edit an existing one, choosing a color, icon, section, and tags, so that my projects feel personal and organized.

**Acceptance Criteria**

1. Given the board, when the user clicks "New Project", then a modal opens with an empty form defaulting to Currently Playing section.
2. Given a form with a title entered, when the user clicks Save, then the project is added to the selected section and the modal closes.
3. Given a form with no title, when the user clicks Save, then a validation message appears and the form does not submit.
4. Given an existing project card, when the user clicks Edit, then the form modal opens pre-populated with all the project's current values.
5. Given the edit form, when the user changes values and clicks Save, then the project updates immediately on the board.
6. Given any open form modal, when the user clicks the X or presses Escape, then the modal closes and no changes are made.
7. Given the color picker, when the user selects a color, then the preview (icon/color swatch in the form) updates immediately.
8. Given the icon picker, when the user selects an icon, then the preview updates immediately.

**Technical notes (Tech Lead)**
- Form state: local `useState` per field, not in GardenContext (form is ephemeral until submit)
- On submit: dispatch `ADD_PROJECT` or `UPDATE_PROJECT` to GardenContext
- Color picker: `PALETTE_COLORS` from constants; icon picker: `ICON_OPTIONS` from constants
- Tags: free-form string array; implement as comma-separated or enter-to-add input

---

## ROT-003 — Drag and Drop

| Field | Value |
|---|---|
| **ID** | ROT-003 |
| **Title** | Drag and Drop — reorder projects within sections and move between sections |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P0 |
| **Story points** | 5 |
| **Dependencies** | ROT-001 (board), ROT-002 (projects must exist) |

**Description**
As a user, I want to drag project cards to reorder them within a section and move them to a different section, so I can organize my board exactly how I want it without using menus.

**Acceptance Criteria**

1. Given a project card, when the user drags it within its section, then the card reorders correctly and the new order persists on page reload.
2. Given a project card, when the user drags it onto a different section, then the card moves to that section and the move persists on page reload.
3. Given a drag in progress, when the user releases over a valid drop zone, then the card drops smoothly with no visual glitch.
4. Given a drag in progress, when the user releases outside any valid drop zone, then the card returns to its original position.
5. Given a drag-and-drop move between sections, then the project's `timeline` array gains a new entry recording the move.

**Technical notes (Tech Lead)**
- Use `dnd-kit`: `DndContext`, `SortableContext`, `useSortable`, `useDroppable`
- **CRITICAL — ADR-004 + ADR-006:** dnd-kit adds `aria-describedby` to draggable elements on the client. Wrap draggable items in a mounting guard (`const [mounted, setMounted] = useState(false)`) to prevent hydration mismatch.
- On drop: dispatch `REORDER_PROJECTS` (same section) or `MOVE_PROJECT` (different section)
- `MOVE_PROJECT` reducer must also add a `TimelineEntry` to the project

---

## ROT-004 — Onboarding + Demo Data

| Field | Value |
|---|---|
| **ID** | ROT-004 |
| **Title** | Onboarding + Demo Data — first-visit welcome, demo/fresh choice, demo banner |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P1 |
| **Story points** | 3 |
| **Dependencies** | ROT-001, ROT-002 (board must function before onboarding can demonstrate it) |

**Description**
As a first-time user, I want a welcoming modal that offers to show me around with sample projects, so I can understand the app without having to imagine it with empty sections.

**Acceptance Criteria**

1. Given a first-time user (no `rotato-onboarding-done` key in localStorage), when the app loads, then the onboarding modal is displayed.
2. Given the onboarding modal, when the user clicks "Show me around", then 6 demo projects are loaded and a dismissible demo banner appears at the top of the board.
3. Given the onboarding modal, when the user clicks "Start fresh", then the board is empty and the modal closes.
4. Given demo data is active, when the user clicks "Clear demo data" in the banner, then all demo projects are removed.
5. Given a returning user (onboarding key set), when the app loads, then no onboarding modal is shown.

**Technical notes (Tech Lead)**
- Onboarding seen flag: `localStorage.getItem(ONBOARDING_KEY)` — use the constant, not a magic string
- Demo projects: defined in `src/lib/seed-data.ts` — do not generate them inline
- `isDemoData: boolean` in GardenState — used to show/hide the demo banner
- Demo data clear: dispatch `CLEAR_DEMO_DATA` reducer action

---

## ROT-005 — Delight Features

| Field | Value |
|---|---|
| **ID** | ROT-005 |
| **Title** | Delight Features — confetti, tended whispers, mood check, ambient sounds |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P1 |
| **Story points** | 5 |
| **Dependencies** | ROT-001 (board), ROT-003 (moving to Finished Worlds triggers confetti) |

**Description**
As a user, I want small moments of delight — a confetti burst when I finish a project, gentle ambient sounds, a creative weather mood that shifts the background — so the app feels alive and personal, not sterile.

**Acceptance Criteria**

1. Given a project, when the user moves it to Finished Worlds (via drag or menu), then a confetti animation fires once.
2. Given the header ambient toggle, when the user enables it, then the ambient background animates according to the active creative weather mood.
3. Given ambient sound, when the user selects a sound (rain, café, forest) and enables it, then audio plays; when disabled, audio stops; given a page reload, the preference is restored.
4. Given the creative weather picker, when the user selects a mood, then the ambient background updates and the preference persists.
5. Given the app is open and idle, then "tended whispers" (gentle encouragements) appear occasionally without requiring user action.

**Technical notes (Tech Lead)**
- Confetti: `useConfetti` hook in `src/hooks/useConfetti.ts`
- Ambient sound: `useAmbientSound` hook in `src/hooks/useAmbientSound.ts`
- Creative weather: `creativeWeather` field in GardenState; `SET_WEATHER` action
- Background animation: CSS classes applied to `AmbientBackground` component based on weather

---

## ROT-006 — Form Style Switcher

| Field | Value |
|---|---|
| **ID** | ROT-006 |
| **Title** | Form Style Switcher — six interchangeable form layouts with persistent preference |
| **Epic** | ROT-EPIC-001 |
| **Priority** | P2 |
| **Story points** | 8 |
| **Dependencies** | ROT-002 (base project form must exist) |

**Description**
As a user, I want to choose how I fill out the project form — from a classic stacked layout to a poetic sentence-style to a seed packet aesthetic — so the act of adding a project feels intentional and personal to my creative mood.

**Acceptance Criteria**

1. Given the project form modal is open, then a `FormStylePicker` is visible in the modal header showing 6 style options.
2. Given the user selects a style from the picker, then the form body re-renders in the selected style without losing any partially-entered field values.
3. Given the user closes the modal and reopens it, then the previously selected style is restored (not reset to classic).
4. Given the user creates a new browser session (page reload), then the preferred form style persists (stored in GardenState → idb-keyval).
5. Given each of the 6 styles (Classic, Sentence, Seed Packet, Two-Beat, Envelope, Live Preview), when the user completes and submits the form, then the project is created correctly with all entered data.
6. Given the Live Preview style, when the user types in any field, then the mini preview card on the left updates in real time.
7. Given the Two-Beat style, when the user enters a title and clicks "Next", then Step 2 appears with a smooth Framer Motion transition.
8. Given the style picker, all styles must be keyboard accessible (Tab to picker, arrow keys to cycle, Enter to select).

**Technical notes (Tech Lead — Pass 2 additions)**
- `formStyle: FormStyle` is already in `GardenState` and persists via idb-keyval (resolved in Dead Reckoning, see Appendix E)
- `SET_FORM_STYLE` action already in GardenAction type
- `FormStylePicker` renders in `Modal`'s `headerAction` prop slot (ADR-005)
- LivePreview requires `size="lg"` on the Modal
- Each form style component receives `FormStyleProps` — all fields + setters + `onSubmit` + `onClose`
- Switching styles: `ProjectForm` holds the state; child components are purely presentational
- Do not reset field values on style switch — this was a HIGH STAKES Dead Reckoning resolution

**Tech Lead flags (returned to PM before Pass 2 sign-off):**
- AC #3: "previously selected style" — confirmed this means GardenState persistence (resolved)
- AC #6: "updates in real time" — confirmed this means on every keystroke, not on blur (resolved)

See full Dead Reckoning session, TDD, and implementation plan in [Appendix E](./05-implementation-plan.md).
