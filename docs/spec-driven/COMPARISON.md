# How Rotato Was Actually Built vs. How It Would Have Been Built

This document compares the actual Rotato development timeline against what the ASDD workflow would have produced. All evidence is from the real git history.

---

## The Actual Timeline

```
956eb84  feat: Build Rotato — core app
1ca4c2e  fix:  resolve modal portal, nested-button hydration, dropdown clipping  ← hydration bug #1
e581d45  feat: seed quick-capture, view modes, focus mode, milestones
6d32053  fix:  dark mode contrast, accessible colours
0bd73fc  fix:  hero floating cards repositioned
5668e41  feat: onboarding modal, demo data flow
826dc10  feat: delight features — confetti, ambient sounds, whispers
403040b  fix:  resolve SSR hydration mismatches across date-dependent components  ← hydration bug #2
7cc6ea9  feat: six interchangeable form styles with persistent switcher
```

**Pattern:** feature → bug fix → feature → bug fix. The same class of bug appeared in two separate commits. No mechanism prevented it from recurring.

---

## The Workflow Timeline

```
Stage 1   Problem statement
Stage 2   PRD → Red Team audit (5 findings caught before design)
Stage 3   Design spec → Gate 2 audit (ADR-005 created for Modal props)
Stage 4   Architecture → Confidence Map (hydration: 🔴 RED → ADR-006 written)
           design-system.mdc generated  ← "no red colors" rule active
           architecture.mdc generated   ← hydration guard pattern encoded
Stage 5   Tickets (PM + Tech Lead, Feature TDDs inform scoping)
Stage 6   Dead Reckoning per ticket
Stage 7   Code  (rules enforcing ADR-006 on every AI-generated file)
Stage 8   Bugbot catches violations on every PR
Stage 9   QA
Stage 10  Post-merge ADR update
```

**Pattern:** decisions surfaced early → constraints encoded as tooling → bugs prevented structurally.

---

## Four Concrete Divergences

### 1. Hydration bugs — found in production vs caught at Stage 4

**What happened (actual):**

`1ca4c2e` — "fix: resolve modal portal, **nested-button hydration**, and dropdown clipping"
- Nested `<button>` inside `<button>` caused SSR hydration mismatch
- dnd-kit `aria-describedby` caused hydration mismatch on `ProjectCard`
- Fixed reactively, after shipping

`403040b` — "fix: resolve SSR hydration mismatches across date-dependent components"
- `ActivityHeatmap`: mounting guard needed — `Date()` produces different structures server vs. client
- `RiverView`: same — `dayLabel()` calls `new Date()`
- `ProjectJournal`: `suppressHydrationWarning` needed on `toLocaleString()`
- Fixed reactively again, different sprint, same root cause

**Two separate fix commits for the same class of bug.**

**What the workflow would have done:**

Stage 4 — Confidence Map review flags three hydration patterns as 🔴 RED:

| Pattern | Classification | Action |
|---|---|---|
| `Date.now()` / `new Date()` in render | 🔴 RED — not spec'd, SSR behavior assumed | → ADR-006: use `suppressHydrationWarning` |
| `toLocaleString()` in render | 🔴 RED — locale differs server vs. client | → ADR-006: same |
| dnd-kit `aria-describedby` | 🔴 RED — client-only attribute | → ADR-006: mounting guard required |

`architecture.mdc` generated from ADR-006:
```
- Dynamic date/time values: use suppressHydrationWarning
- Client-only libraries (dnd-kit): use useState(false) + useEffect mounting guard
- Persisted state: check state.hydrated before rendering
```

`bugbot.json` pattern added:
```json
{ "pattern": "new Date\\(\\)|Date\\.now\\(\\)", 
  "message": "Dynamic date in render — needs suppressHydrationWarning or mounting guard (ADR-006)" }
```

**Result with workflow:** ADR-006 written at Stage 4. Every subsequent AI-generated component follows the pattern automatically. Neither fix commit happens. Zero hydration errors across the entire sprint.

---

### 2. Modal `size` + `headerAction` props — discovered mid-build vs specified before implementation

**What happened (actual):**

`Modal.tsx` was built without variable width or a header slot. When `ROT-006` (Form Style Switcher) needed a wider modal for the Live Preview split-panel layout, and needed a `FormStylePicker` in the header, the Modal component had to be retrofitted.

This was discovered at implementation time — the developer opened the file and realized the existing API couldn't support the feature.

**What the workflow would have done:**

Stage 3 — Gate 2 audit cross-checks the design spec against the PRD feature list:

> **Finding DT-002:** "F-006 (Form Style Switcher) requires a `FormStylePicker` component in the modal header. The current component inventory shows one Modal variant with no header slot. The Live Preview layout requires a two-column modal wider than the default."

→ ADR-005 written at Stage 3: `Modal` gets `size?: "md" | "lg"` and `headerAction?: ReactNode`

**Result with workflow:** Modal API is correct before any feature touches it. No mid-implementation retrofit. ADR-005 is already written when the developer opens the file.

---

### 3. "No red colors" — caught by a human reviewer vs prevented by tooling

**What happened (actual):**

During the delight features sprint, `canvas-confetti` was integrated with default colors that included red (`#FF4444`). This reached a PR, where the designer caught it during review and requested a fix.

The PRD says "no red-family colors anywhere in the application." That constraint existed, but it was enforced only by human vigilance.

**What the workflow would have done:**

Stage 3 — Design spec explicitly documents the prohibition:

> "No red-family colors (`#FF...`, `#E5...`, `#DC...` ranges) anywhere in the UI. Reason: avoid urgency cues in a calm productivity tool."

Stage 4 — `design-system.mdc` generated:
```
## Colors
- No red-family colors anywhere (#FF..., #E5..., #DC... ranges)
```

Stage 4 — `bugbot.json` pattern added:
```json
{ "pattern": "#[Ff][Ff][0-9a-fA-F]{4}|#[Ee][0-9a-fA-F]{5}|#[Dd][Cc][0-9a-fA-F]{4}",
  "message": "Red-family color detected. No red anywhere in the UI (design-system.mdc)." }
```

**Result with workflow:** Bugbot flags the confetti colors before the PR is opened. The constraint is structural — it cannot be violated unknowingly regardless of the library used.

---

### 4. `formStyle` persistence scope — decided during coding vs resolved before the first file opened

**What happened (actual):**

When building ROT-006, the developer had to decide: does `formStyle` persist in `GardenState` (survives page reload) or in local component state (session only)? This decision affected three files (`types.ts`, `seed-data.ts`, `GardenContext.tsx`) and the answer wasn't in the ticket.

The ticket said "persists on page reload" without specifying where the state should live.

**What the workflow would have done:**

Stage 6 — Dead Reckoning on ROT-006:

> **🛑 STOP — Question 1: `formStyle` persistence scope**
> Options: A) GardenState via idb-keyval (3 files affected, survives reload) B) localStorage directly (violates ADR-003) C) Component state (doesn't survive reload, fails AC #4)
> **Needs PM decision.**

PM responds in 14 minutes: "GardenState — same as viewMode."

Decision documented in Implementation TDD before any file is opened. Zero ambiguity, zero rework risk.

**Result with workflow:** The PM decision is made and recorded before coding starts. The developer opens `types.ts` knowing exactly what to add.

---

## Summary

| Issue | When discovered (actual) | When discovered (workflow) | Sprints saved |
|---|---|---|---|
| Hydration patterns (Date, dnd-kit, toLocaleString) | 2 separate fix commits after shipping | Stage 4 Confidence Map → ADR-006 | ~1 sprint of rework |
| Modal API for ROT-006 | Mid-implementation of ROT-006 | Gate 2 audit (before architecture) → ADR-005 | Hours of refactor |
| Red colors in confetti | PR review (human catch) | Bugbot on every PR (structural) | PR review cycle |
| `formStyle` persistence scope | During coding | Dead Reckoning session (before first file) | Ambiguity + possible rework |

**The pattern:** without the workflow, decisions accumulate silently during implementation and surface as bugs or blockers. With the workflow, decisions are surfaced explicitly — by adversarial agents or by structured ambiguity checks — and resolved before they become bugs.

The cost difference isn't in writing more documents. It's in **when** the decision happens: before the code is written (cheap) vs. after it ships (expensive).
