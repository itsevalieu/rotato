# Appendix B — Design Specification

**Product:** Rotato
**Version:** 1.0
**Status:** Validated (post-Red Team Gate 2)
**Author:** Designer + AI (Claude Sonnet)
**Confluence page:** ROT-DESIGN-001

---

## Design Brief

### Aesthetic Goal

Rotato should feel like a **garden journal** — something analog, personal, and slow. Not a productivity dashboard. Not a startup SaaS tool.

The user should feel *oriented* when they open it (all their projects visible), *permitted* (no urgency, no judgment), and *delighted* (occasional gentle surprises).

Three words: **cozy, organized, alive.**

### Derivation from PRD

Every design constraint traces back to a product goal:

| Product goal | Design decision |
|---|---|
| "Anti-urgency" | No red colors anywhere in the palette |
| "Feels calming" | Warm earth tones; muted saturation; soft shadows |
| "Garden metaphor" | Section names (Seeds, Resting), Caveat handwritten font for accents, leaf/flower icon set |
| "Not corporate" | No sharp corners, no dense information, generous whitespace |
| "Personal" | User-chosen colors and icons per project; form styles that feel human |
| "No deadlines" | No date fields visible anywhere in the UI |

---

## Color System

### Palette (light mode)

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-cream` | `#FDF6EC` | Cream | App background |
| `--color-cream-dark` | `#F5EDDE` | Cream Dark | Card backgrounds, modal backgrounds |
| `--color-parchment` | `#F5EDDE` | Parchment | Section headers, dividers |
| `--color-terracotta` | `#C67B5C` | Terracotta | Primary accent, CTAs, Currently Playing section |
| `--color-terracotta-light` | `#D4957A` | Peach | Hover states, softer accents |
| `--color-sage` | `#8B9E82` | Sage | Seeds section, secondary accent |
| `--color-muted-gold` | `#C9A96E` | Muted Gold | Finished Worlds section, warm highlights |
| `--color-dusty-blue` | `#7E9BB0` | Dusty Blue | Resting section, cool accent |
| `--color-warm-gray` | `#A8998A` | Warm Gray | Body text, secondary text |
| `--color-soft-brown` | `#6B5B4E` | Soft Brown | Primary text, headings |

### Project color palette (user-selectable)

Eight colors available for project cards:

| Hex | Name |
|---|---|
| `#C67B5C` | Terracotta |
| `#8B9E82` | Sage |
| `#C9A96E` | Muted Gold |
| `#7E9BB0` | Dusty Blue |
| `#A8998A` | Warm Gray |
| `#D4957A` | Peach |
| `#A8B8A0` | Soft Green |
| `#D9C08E` | Sand |

### Dark mode

All tokens are remapped in dark mode. Key remaps: `--color-cream` becomes `#1E1813` (deep warm brown), text tokens lighten to remain readable, colored accents are brightened slightly to maintain contrast. The "warm earth" feeling is preserved in dark mode — it becomes a candlelit room, not a generic dark theme.

### The "no red" constraint

No red-family colors (`#FF...`, `#E5...`, `#DC...` ranges) appear anywhere in the application — not for errors, not for destructive actions, not for badges. Error states use amber/orange tones. Destructive action confirmations use terracotta, not red. This constraint is encoded in `.cursor/rules/design-system.mdc` so it is enforced in every AI-generated component.

---

## Typography

### Font pairing

| Font | Source | Usage |
|---|---|---|
| **Caveat** | Google Fonts | Accent text: section headers, empty state messages, special labels. Conveys handwritten, personal quality. |
| **Inter** | Google Fonts | All body text, form labels, buttons, inputs. Clean and readable at small sizes. |

### Scale

| Role | Font | Size | Weight |
|---|---|---|---|
| Section header | Caveat | 1.25rem | 600 |
| Card title | Inter | 0.875rem | 500 |
| Body text | Inter | 0.875rem | 400 |
| Label | Inter | 0.75rem | 500 |
| Caption / meta | Inter | 0.75rem | 400 |
| Empty state | Caveat | 1rem | 400 |

---

## Component Inventory

### Core UI components

**Card** (`src/components/ui/Card.tsx`)
Base card container. Used by project cards and UI sections. Accepts `className` for composition.

**Modal** (`src/components/ui/Modal.tsx`)
Overlay modal with Framer Motion enter/exit animation. Props: `isOpen`, `onClose`, `title`, `size` ("md" | "lg"), `headerAction` (ReactNode — used for FormStylePicker injection).

**Button** (`src/components/ui/Button.tsx`)
Variants: primary (terracotta fill), secondary (outline), ghost (no border). Sizes: sm, md, lg.

**Input** (`src/components/ui/Input.tsx`)
Single-line text input. Styled with warm-gray border, cream background, soft-brown text.

**Textarea** (`src/components/ui/Textarea.tsx`)
Multi-line text input. Same styling as Input.

**Badge** (`src/components/ui/Badge.tsx`)
Small inline tag. Used for project tags. Background: section color at 15% opacity; text: section color.

**ColorPicker** (`src/components/ui/ColorPicker.tsx`)
Grid of 8 swatches from `PALETTE_COLORS`. Renders a circular swatch for each; selected state shows a ring.

**IconPicker** (`src/components/ui/IconPicker.tsx`)
Grid of 20 Lucide icon options. Renders each icon; selected state shows a terracotta background.

### Garden components

**ProjectCard** (`src/components/garden/ProjectCard.tsx`)
Displays a single project. Left color bar, icon, title, tags, section badge, hover menu (edit, move, archive). Color bar and badge use the project's assigned color.

**Section** (`src/components/garden/Section.tsx`)
Collapsible section container. Header: Caveat font, section icon, project count, collapse toggle. Body: droppable zone for dnd-kit.

**ViewModePicker** (`src/components/garden/ViewModePicker.tsx`)
Icon button row for switching between 7 view modes: Board, Gallery, Kanban, Quadrant, River, Deck, Three-Panel.

**FormStylePicker** (`src/components/garden/FormStylePicker.tsx`)
Icon button row for switching between 6 form styles. Rendered in the Modal `headerAction` slot. Dispatches `SET_FORM_STYLE` to GardenContext.

**ProjectForm** (`src/components/garden/ProjectForm.tsx`)
Form container. Manages field state. Dynamically renders the currently selected form style component. Passes `FormStyleProps` (all fields + setters + handlers) to child components.

### Form style components

All live in `src/components/garden/form-styles/`. Each accepts `FormStyleProps`.

| Component | Concept | Character |
|---|---|---|
| `ClassicForm` | Standard stacked form | Familiar, neutral |
| `SentenceForm` | Prose-style inline inputs | "I'm planting *[title]*…" — poetic |
| `SeedPacketForm` | Seed packet aesthetic | Dashed borders, printed labels, rustic |
| `TwoBeatForm` | Two-step reveal | Step 1: title only. Step 2: everything else. Framer Motion transition. |
| `EnvelopeForm` | Letter + envelope | SVG envelope flap, handwritten body, wax seal color picker |
| `LivePreviewForm` | Split-panel | Left: live mini card preview. Right: form fields. Wide modal. |

---

## Interaction Principles

### No aggressive feedback
- No toast notifications for successful actions (save, move, delete). The board reflects the change immediately — that *is* the feedback.
- Errors use inline messages in amber/terracotta tones, never red, never modal dialogs.
- Destructive actions (delete, clear demo) use a confirmation step in terracotta, not a red danger button.

### Gentle animations
- Enter animations: 200–300ms, ease-out. Never jarring.
- Exit animations: 150ms, ease-in. Faster than enter (content disappearing should feel quick, not linger).
- The board does not animate project reorders during drag — the drag itself is the animation.

### Accessibility
- All interactive elements have visible focus rings (terracotta `outline: 2px solid var(--color-terracotta-light)`)
- Color is never the sole indicator of state — icons or labels always accompany color
- Form inputs have associated labels always (never placeholder-only)
- Keyboard navigation supported throughout; modal traps focus while open

### Responsive behavior
- Board view: sections stack vertically on mobile, side-by-side on tablet+
- LivePreview form: two-column layout on desktop, stacks to single column on mobile
- Modal: full-screen on mobile (`size="md"` = 90vw max), fixed width on desktop

---

## Red Team Gate 2 — Design vs PRD findings

*Generated by Claude Opus, resolved before Stage 5.*

| # | Finding | Resolution |
|---|---|---|
| DT-001 | Design spec adds "no toast notifications" constraint — not mentioned in PRD. Potential contradiction if PRD's "feel calming" is interpreted differently by developers. | Added to PRD non-goals: "No toast notifications for routine actions" |
| DT-002 | `LivePreviewForm` requires `size="lg"` modal — Modal component originally had no size prop. This architectural need wasn't in the PRD. | Tech Lead added Modal `size` prop to architecture doc; ADR-005 created |
| DT-003 | Font loading (Caveat from Google Fonts) has privacy implications (external request on page load) — not addressed in PRD. | Noted in architecture: fonts loaded via `next/font/google` (self-hosted at build time, no external request at runtime) |
