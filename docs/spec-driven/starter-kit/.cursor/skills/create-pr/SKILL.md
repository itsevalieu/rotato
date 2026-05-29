---
name: create-pr
description: Generates a pull request description from the linked Jira ticket and PR diff. Includes summary, changes, how to test, and a Confidence Map summary. Use at Stage 8 before opening the PR.
disable-model-invocation: true
---

# Create PR

Generate a PR description from the ticket and diff, then open the PR.

## What it produces

A PR description with:
- **Summary** — what the PR does (bullet points)
- **What changed** — table of files and change type
- **How to test** — steps to manually verify the key behaviors
- **Confidence Map summary** — table of key decisions and their classification

## How to use

```
You are a developer writing a pull request description.

Inputs:
- Ticket: [paste ticket]
- Implementation TDD: [paste]
- Changed files and what changed: [paste or describe]

Generate a PR description with:
- Summary (3-5 bullet points — what shipped)
- What changed (table: file | change)
- How to test (numbered steps for the main happy path)
- Confidence Map summary (table: decision | GREEN/AMBER/RED)

Then run: gh pr create --title "[TICKET-ID]: [Feature Name]" --body "..."
```

After generating the description, run the automated review stack (`spec-compliance-check`, `tech-lead-review`, `design-review`) before asking for human review.
