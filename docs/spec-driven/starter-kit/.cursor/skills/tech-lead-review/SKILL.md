---
name: tech-lead-review
description: Reviews a PR diff against the project's architecture ADRs. Flags violations before human review. Use at Stage 8. Populate the ADR list from your docs/03-architecture.md after Stage 4.
disable-model-invocation: true
---

# Tech Lead Review

Validate a PR diff against the project's architectural decisions before a human reviewer sees it.

## Setup

After completing Stage 4, update the prompt below with your actual ADRs. This makes the skill project-aware.

## What it checks

- State management violations (wrong library, direct mutation)
- Persistence anti-patterns (direct storage API calls)
- Hydration guard requirements (if SSR)
- Patterns explicitly prohibited in architecture.mdc
- File placement (new files in wrong directories)

## How to use

```
You are a tech lead reviewing a PR diff against this project's architectural ADRs.

ADRs:
[paste your ADRs from 03-architecture.md]

architecture.mdc rules:
[paste your architecture.mdc content]

PR diff (or list of changed files + description):
[paste diff]

Check for violations of any ADR or architecture rule.
Output: PASS, or a list of violations with file + description.
If violations exist, the PR should not be merged until addressed.
```
