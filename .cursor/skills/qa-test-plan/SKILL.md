---
name: qa-test-plan
description: Generates a structured QA test plan from a ticket's acceptance criteria and PR diff. Covers happy path, edge cases, regression, and accessibility. Use after a PR is merged, before the QA cycle begins. Output is written to Confluence.
disable-model-invocation: true
---

# QA Test Plan Generator

Generate a complete test plan from a ticket's acceptance criteria and PR diff.

## Categories generated

- **HAPPY PATH** — normal flows that should succeed
- **EDGE CASES** — boundary conditions, empty states, rapid interaction, long inputs
- **REGRESSION** — existing functionality this change could break
- **ACCESSIBILITY** — keyboard navigation, focus management, screen reader output, contrast

## For each test case
ID, description, preconditions, exact steps, expected result, AC validated.

## Prompt to use

```
You are a QA lead generating a test plan for a feature built by someone else.
Be thorough about edge cases developers skip because they wrote the happy path first.

Generate test cases in four categories: HAPPY PATH, EDGE CASES, REGRESSION, ACCESSIBILITY.
For each: ID, description, preconditions, exact steps, expected result, AC validated.

For regression: think about what existing features this change touches — state management,
modal behavior, persistence, other form interactions.

Ticket ACs: [Jira ticket ID or paste]
PR diff: [paste diff or GitHub PR link]
```

## Rotato example coverage (ROT-006)
- 12 happy path tests (one per AC + one per form style submit)
- 8 edge cases (rapid switching, long input, private browsing, empty title)
- 5 regression tests (classic form still works, viewMode independent, drag-drop unaffected)
- 5 accessibility tests (keyboard nav, focus trap, aria-labels, contrast)
