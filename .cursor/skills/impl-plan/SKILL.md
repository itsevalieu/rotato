---
name: impl-plan
description: Generates a file-level, step-by-step implementation plan from an approved Implementation TDD. Use after Tech Lead approves the TDD and before writing any code. Groups steps into logical commits.
disable-model-invocation: true
---

# Implementation Plan Generator

Turn an approved Implementation TDD into a numbered, file-level implementation plan.

## What it produces
- Numbered steps, each specifying: file path, what to add/change, which AC it satisfies
- Steps grouped into logical commits (one concern per commit — see `split-to-prs` pattern)
- Explicit "test at each step" checkpoints

## Prompt to use

```
You are a senior developer generating an implementation plan from an approved TDD.

Read the TDD and existing codebase patterns. Generate a numbered plan where each step specifies:
- File to create or modify
- Exactly what to add or change (reference the TDD approach)
- Which acceptance criterion this step satisfies
- Commit boundary (group steps that belong together)

Group steps into logical commits: one concern per commit.
Flag any step where an existing pattern should be followed and cite the source file.

Implementation TDD: [Confluence link or paste]
Codebase patterns: [relevant existing files]
```

## Rotato example commit structure (ROT-006)

```
Commit 1 — types + context:
  src/lib/types.ts          → add FormStyle type, update GardenState, add SET_FORM_STYLE
  src/lib/seed-data.ts      → add formStyle: "classic" to initialState
  src/context/GardenContext → add SET_FORM_STYLE case, update HYDRATE for backward compat

Commit 2 — form style components:
  src/components/garden/form-styles/types.ts        → FormStyleProps interface
  src/components/garden/form-styles/ClassicForm.tsx  → extract from existing ProjectForm
  src/components/garden/form-styles/SentenceForm.tsx → new
  ... (all 6 styles)

Commit 3 — picker + wiring:
  src/components/garden/FormStylePicker.tsx → new
  src/components/garden/ProjectForm.tsx     → refactor as container, wire picker + Modal
  src/components/ui/Modal.tsx               → add size + headerAction props
```
