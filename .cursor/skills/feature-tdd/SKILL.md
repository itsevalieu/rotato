---
name: feature-tdd
description: Writes a high-level Technical Design Document for a planned feature before tickets are created. The PM uses this to correctly scope and size tickets. Use during architecture phase for each feature in the backlog. Tech Lead runs this; output goes to Confluence before sprint planning.
disable-model-invocation: true
---

# Feature TDD

Write a Feature Technical Design Document before tickets are scoped. The PM cannot accurately size or split a feature without understanding the technical shape first.

## When to run
During Stage 4 (Architecture), for each feature in the PRD backlog. Must exist before the PM writes tickets for the feature.

## Output structure

```markdown
# Feature TDD: [Feature Name]

**PRD reference:** [section]
**Author:** Tech Lead
**Status:** Draft | Approved
**Informs tickets:** [populated after tickets are created]

## Approach overview
High-level strategy. What changes, what stays the same.

## Files and components affected
Which existing files change; what new files/components are needed.

## Interface or type changes
New types, props, context actions required.

## Vertical slice guidance
How to split into tickets. What must ship together vs. what can be deferred.

## Applicable ADRs
Which ADRs constrain this feature. Any new ADRs needed.

## Estimated complexity
Story point range and rationale.
```

## Prompt to use

```
You are a Tech Lead writing a Feature TDD before sprint planning.
The PM will use this to scope and size tickets accurately.

Document: approach overview, files/components affected, interface or type changes,
how to vertically slice into tickets, applicable ADRs, estimated story points.

Be specific about file paths and type signatures. The PM needs to understand
the scope; the developer needs enough to start without re-deriving everything.

Feature: [feature description from PRD]
Architecture doc: [Confluence link or paste]
Codebase patterns: [GitHub search results or relevant files]
```

## Rotato example (ROT-006)

Key outputs that made the 8-point estimate accurate:
- Requires lifting all field state to `ProjectForm` (container pattern)
- Shared `FormStyleProps` interface across 6 presentational components
- Modal needs `size` and `headerAction` props → new ADR-005
- 6 components × medium complexity + context wiring = 8 points
