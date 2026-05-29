---
name: desk-check
description: Generates role-specific checklists for a desk check meeting (PM, Designer, Tech Lead, QA). Each list is tailored to what that role cares about for this specific ticket. Use at Stage 9.
disable-model-invocation: true
---

# Desk Check Checklist Generator

Generate a tailored checklist for each desk check participant.

## What it produces

Four role-specific checklists — each with 4-6 specific, answerable questions:

- **PM** — does it match the intent? does each AC feel right in the actual product?
- **Designer** — does it match the design spec? does it feel right visually and in motion?
- **Tech Lead** — are ADRs respected? is the approach clean? anything to clean up before it becomes debt?
- **QA** — were all test cases executed? were any edge cases discovered during testing that aren't in the plan?

## How to use

```
You are generating a desk check checklist for a feature ready for sign-off.

Inputs:
- Ticket: [paste ticket]
- QA test plan: [paste test plan]
- Implementation TDD: [paste TDD]

Generate role-specific checklists for: PM, Designer, Tech Lead, QA.
Each list: 4-6 specific, answerable items based on this ticket's actual content.
Avoid generic questions — every item should require reading the actual implementation to answer.
```
