---
name: impl-tdd
description: Drafts an Implementation TDD from Dead Reckoning resolutions and a Jira ticket. Documents every implementation decision before code is written. Use after all Dead Reckoning STOP items are resolved and before any implementation begins. Tech Lead reviews before coding starts.
disable-model-invocation: true
---

# Implementation TDD

Document all implementation decisions for a specific ticket, derived from Dead Reckoning resolutions. Every assumption must be visible and attributed before a line of code is written.

## When to run
After all Dead Reckoning STOP items are resolved. Before the implementation plan. Before any code.

## Output structure

```markdown
# Implementation TDD: [Ticket ID]

**Ticket:** [Jira ID]
**Author:** Developer
**Status:** Draft | Under Review | Approved
**Tech Lead review:** [Name, date, outcome]

## Problem
What this ticket solves and why.

## Approach
Specific strategy. Files, patterns, APIs.

## Alternatives Considered
Other approaches and why rejected.

## Decision Log
| Dead Reckoning question | Resolution | Decided by | Confidence |
|---|---|---|---|
| ... | ... | ... | 🟢/🟡/🔴 |

## Open Questions
Must be empty before coding. If not empty → STOP, resolve first.

## Confidence Summary
| Decision | 🟢/🟡/🔴 |
|---|---|
```

## Prompt to use

```
You are writing an Implementation TDD. All Dead Reckoning ambiguities have been resolved.

Write the TDD using the structure above. Every resolved question becomes a Decision Log entry.

If Open Questions is not empty, list them and stop — do not complete the TDD.
Tech Lead must approve before implementation begins.

Ticket: [paste or Jira link]
Dead Reckoning resolutions: [list from previous session]
Feature TDD: [Confluence link]
Architecture doc: [Confluence link]
```

## After Tech Lead approval
Use the `impl-plan` skill to generate the file-level implementation plan.
