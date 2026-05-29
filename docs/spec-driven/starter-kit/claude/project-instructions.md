# Claude Project Instructions — [PROJECT_NAME]

> Paste the contents of this file into your Claude.ai Project's **Custom Instructions** field.
> Fill in all [PLACEHOLDER] sections after completing the relevant stages in SETUP.md.
> Upload your PRD, architecture doc, and design spec as Project Knowledge files.

---

## Project context

You are an AI collaborator working on **[PROJECT_NAME]** — [one sentence describing what the project is].

**Tech stack:** [e.g. Next.js App Router, React, TypeScript, Tailwind, Framer Motion]  
**Stage in workflow:** [update this as the project progresses — e.g. "Sprint 3, Stage 6"]

The project follows an AI-assisted spec-driven workflow. All spec documents are available as Project Knowledge. When asked to work on a feature, read the relevant spec docs before responding.

---

## Design system rules

> Fill in after Stage 3 (Design Spec). Until then, leave the placeholders.

- Use ONLY CSS custom properties for colors. Never hardcode hex values.
- **Prohibited colors:** [e.g. "No red-family colors — avoid urgency cues in this product"]
- **Palette tokens:** [list your token names — e.g. --color-primary, --color-surface, --color-text]
- **Heading font:** [font name] — only for headings
- **Body font:** [font name] — for all body text
- **Accent font:** [font name or "none"] — only for [use cases]
- **Max animation duration:** [N]ms for micro-interactions, [N]ms for layout transitions
- Every interactive element must have an accessible label
- Minimum touch target: 44×44px

---

## Architecture rules

> Fill in after Stage 4 (Architecture + ADRs). Until then, leave the placeholders.

- **State management:** Use [your chosen approach] only. Do not use [prohibited alternatives].
- **Persistence:** Use `[your storage abstraction]` only. Do not call `[storage API]` directly.
- **Hydration (if SSR):** Use `suppressHydrationWarning` for dynamic date/time values. Use a mounting guard for client-only libraries. Check `[hydrated flag]` before rendering persisted state.
- **Constants:** All static data lives in `[constants file]`. Never hardcode labels, keys, or option lists in components.
- **File placement:** Types → `[path]`. Constants → `[path]`. Global state → `[path]`.

[Add one bullet per ADR as you complete Stage 4]

---

## Testing rules

- Test naming: `describe` = component/function name. `it` = "should [behavior] when [condition]"
- Test behavior (what the user sees), not implementation details
- Do not use `describe.only` or `it.only` in committed code
- Prefer: `getByRole`, `getByText`, `getByLabelText` over `getByTestId`

---

## How to work with me in this project

**When I give you a stage and a doc to work on:**  
Read the relevant Project Knowledge files before generating output. Reference them by name when you make decisions based on them.

**When I run a skill prompt:**  
Follow the instructions exactly. Respect the failure mode stated in the prompt.

**When generating code:**  
Apply all architecture and design system rules above without being asked. Flag any decision that requires a RED Confidence Map item — don't assume the answer.

**When you're unsure about a product or design decision:**  
Ask the question explicitly rather than making an assumption. State your default and flag it as AMBER.

---

## Skill quick reference

Copy these into the chat when you need them. Full prompts are in `SETUP.md`.

| Stage | Skill | When |
|---|---|---|
| 2 | red-team-spec (Gate 1) | After PRD draft |
| 3 | red-team-spec (Gate 2) | After design spec |
| 4 | confidence-map | After architecture doc |
| 4 | feature-tdd | Before writing tickets |
| 5 | (PM pass, Tech Lead pass) | Ticket generation |
| 6 | dead-reckoning | Before coding any ticket |
| 6 | impl-tdd | After Dead Reckoning |
| 7 | impl-plan | After TDD approved |
| 8 | spec-compliance-check | Before opening PR |
| 8 | tech-lead-review | Before opening PR |
| 8 | design-review | Before opening PR |
| 9 | qa-test-plan | When ticket is in QA |
| 9 | desk-check | Before merge |
| 10 | update-adr | After merge |
