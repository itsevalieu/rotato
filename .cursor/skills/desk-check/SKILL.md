---
name: desk-check
description: Generates role-specific checklists for a desk check meeting. Each participant gets a checklist for their specific responsibilities. Use before the desk check meeting so each person reviews their concerns, not a generic list.
disable-model-invocation: true
---

# Desk Check Checklist Generator

Generate a tailored checklist for each desk check participant.

## Participants and their focus

| Role | Checks for |
|---|---|
| **PM** | All ACs met, product goals achieved, no regressions to product intent |
| **Designer** | Visual spec compliance, animation quality, accessibility visual check |
| **Tech Lead** | ADR compliance, Confidence Map AMBER items reviewed, no architectural shortcuts |
| **QA** | Test plan coverage complete, edge cases identified, sign-off on scope |
| **Developer** | AMBER decisions explained, no known deferred issues, docs updated |

## Prompt to use

```
Generate a desk check checklist for a feature review meeting.
One section per role: PM, Designer, Tech Lead, QA, Developer.

Each section should have 4-8 specific, checkable items reflecting that role's
actual responsibilities — not generic "does it work?" items.

Pull specific items from:
- The ticket's acceptance criteria (for PM)
- The design spec (for Designer)
- The Implementation TDD's AMBER decisions (for Tech Lead and Developer)
- The QA test plan scope (for QA)

Ticket: [Jira link]
Implementation TDD: [Confluence link]
Design spec: [Confluence link]
```
