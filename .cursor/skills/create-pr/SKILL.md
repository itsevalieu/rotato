---
name: create-pr
description: Generates a pull request description from the linked Jira ticket and PR diff, then opens the PR. Use after all commits are pushed to the feature branch. Includes a Confidence Map summary section so reviewers know where to focus.
disable-model-invocation: true
---

# Create PR

Generate a PR description from the ticket and diff, then open the PR.

## PR body structure

```markdown
## Summary
[2-3 bullets: what this PR does]

## What changed
[File-level summary of changes]

## How to test
[Steps to verify the feature manually]

## Ticket
[Jira link]

## Confidence Map Summary
[AMBER decisions from the Implementation TDD that reviewers should know about]
```

## Prompt to use

```
Create a pull request for the current branch targeting main.

Title: the ticket title from the Jira ticket.
Body: use the structure above. For "Confidence Map Summary", list any AMBER decisions
from the Implementation TDD — things the developer chose as a reasonable default
that weren't explicitly in the spec, so the reviewer can make an informed call.

Labels: feature, [component area]
Reviewers: @tech-lead

Ticket: [Jira ID or link]
Implementation TDD: [Confluence link for AMBER decisions]
```

## After PR is open
Run `spec-compliance-check`, `tech-lead-review`, and `design-review` skills if not automated.
Use the `babysit` skill to monitor reviewer comments and keep the PR merge-ready.
