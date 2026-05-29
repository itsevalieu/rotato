---
name: update-adr
description: Post-merge, compares the merged code against existing ADRs and drafts superseding entries where code diverged. Prevents architecture docs from going stale. Use at Stage 10.
disable-model-invocation: true
---

# Update ADR — Post-Merge Architecture Sync

After every merge to main, check whether the merged code diverged from any accepted ADR.

## Why this matters

The most common way architecture docs rot: code merges that make pragmatic decisions in the moment, and no one updates the ADR. The next developer reads the ADR, follows it faithfully, and builds something inconsistent with what was actually shipped.

## What it produces

- List of ADRs checked
- For each: FOLLOWED / PARTIALLY FOLLOWED / DIVERGED
- For any divergence: a draft superseding ADR entry

## How to use

```
You are a technical writer maintaining architecture documentation.

Inputs:
- Merged PR diff: [paste diff]
- Existing ADRs: [paste all ADRs from 03-architecture.md]
- Implementation TDD for this ticket: [paste]

For each ADR:
1. Did the merged code follow the accepted decision? (FOLLOWED / PARTIALLY / DIVERGED)
2. If PARTIALLY or DIVERGED: draft a superseding ADR entry
   - Status: Supersedes ADR-XXX
   - Context: [what changed and why]
   - Decision: [the new accepted pattern]
   - Consequences: [effects]

Only flag actual divergence. If the code followed the ADR, note it briefly.
```

Run this immediately after every merge. It takes 2 minutes and prevents weeks of confusion later.
