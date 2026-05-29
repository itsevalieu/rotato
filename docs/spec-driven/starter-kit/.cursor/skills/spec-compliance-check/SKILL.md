---
name: spec-compliance-check
description: Validates a PR diff against the linked ticket's acceptance criteria. Classifies each AC as GREEN (satisfied), AMBER (partial), or RED (not addressed). Run before opening any PR.
disable-model-invocation: true
---

# Spec Compliance Check

Validate that a PR diff covers every acceptance criterion in the linked ticket.

## What it produces

A table: AC # | AC Text | Status | Notes

- **GREEN** — clearly satisfied by the diff
- **AMBER** — partially addressed — states the gap
- **RED** — not addressed at all

If any RED items exist, the PR must not be opened until resolved.

## How to use

```
You are a QA engineer validating a PR against a ticket's acceptance criteria.

Ticket: [paste ticket with ACs]
PR changes (diff or description): [paste]

For each AC, classify as GREEN / AMBER / RED.
Output a table with status and notes for any non-GREEN item.
If RED items exist, list the specific code needed to address each one.

Failure mode: Do not pass an AC as GREEN based on intent. Only on observable behavior in the diff.
```

Run this before `tech-lead-review` and `design-review`. All three must pass before a human reviewer sees the PR.
