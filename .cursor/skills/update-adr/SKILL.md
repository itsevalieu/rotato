---
name: update-adr
description: Post-merge, compares the merged code against existing architecture ADRs and drafts superseding entries where code diverged. Run after every merge to main to keep architecture docs current. Prevents stale spec drift automatically.
disable-model-invocation: true
---

# Update ADR — Post-Merge Architecture Sync

After every merge to main, check whether the merged code diverged from any accepted ADR. If it did, draft a superseding or amending ADR entry.

## What it does
1. Reads all ADRs from the architecture doc
2. Reads the merged diff
3. For each ADR: checks whether the merged code is consistent with the decision
4. Where code diverges: drafts a "supersedes ADR-00X" or "amends ADR-00X" entry

## ADR update format (Nygard)

```markdown
## ADR-00X: [Title] (supersedes ADR-00Y)

**Status:** Superseded / Amended
**Date:** [merge date]

### Context
[What changed and why — reference the ticket and PR]

### Decision
[The new decision that replaces or amends the original]

### Consequences
[What this means going forward]
```

## Prompt to use

```
You are maintaining living architecture documentation after a merge.

Compare the merged PR diff against the ADRs listed below.
For each ADR the merged code contradicts or extends: draft a superseding or amending entry.

Only flag genuine divergences — not every PR needs an ADR update.
If the code is consistent with all ADRs, output "No ADR updates required."

ADRs: [paste from architecture doc or Confluence link]
Merged diff: [paste diff or GitHub PR link]
```

## When no update is needed
Most PRs won't require ADR updates — output "No ADR updates required." This is the expected outcome for feature work that follows the established patterns. ADR updates are needed when: a new architectural choice is introduced, an existing pattern is deliberately replaced, or a constraint is relaxed with intent.
