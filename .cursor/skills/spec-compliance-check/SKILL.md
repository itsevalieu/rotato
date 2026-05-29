---
name: spec-compliance-check
description: Validates a PR diff against the linked ticket's acceptance criteria. Classifies each AC as GREEN (satisfied), AMBER (partial), or RED (not addressed). Use on every PR before human review — catches spec drift at PR time, not in QA.
disable-model-invocation: true
---

# Spec Compliance Check

Validate that a PR diff covers every acceptance criterion in the linked ticket. Catch spec drift before a human reviewer sees the PR.

## Output format

```
GREEN — diff clearly satisfies this AC
AMBER — diff partially addresses this; manual verification needed
RED   — this AC is not addressed by the diff

If any RED: output "SPEC-INCOMPLETE" followed by the exact ACs missing.
```

## Prompt to use

```
You are a spec compliance auditor. A PR claims to implement a Jira ticket.

Compare the PR diff against every acceptance criterion.
Classify each: GREEN (satisfied), AMBER (partial — note what needs manual check), RED (not addressed).

If any RED items exist: output "SPEC-INCOMPLETE" and list the exact ACs.

Ticket ACs: [Jira ticket ID or paste ACs]
PR diff: [paste diff or GitHub PR link]
```

## How to run in CI
Trigger this skill as a GitHub Action on `pull_request` event. Pass the Jira ticket ID (from the PR branch name or description) and the PR diff. Block merge if output contains "SPEC-INCOMPLETE".

## Note on AMBER items
AMBER does not block merge but must appear in the PR description's "Confidence Map Summary" section so the human reviewer knows where to focus.
