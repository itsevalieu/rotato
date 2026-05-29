---
name: tech-lead-review
description: Reviews a PR diff against the project's architecture ADRs. Flags violations before human review. Use as part of the automated review stack after Bugbot and before requesting human review.
disable-model-invocation: true
---

# Tech Lead Review

Validate a PR diff against the project's architectural decisions before a human reviewer sees it.

## What it checks
- Direct `localStorage` calls bypassing `idb-keyval` (ADR-003)
- State management bypassing `GardenContext` (ADR-002)
- Missing hydration guards on dynamic date renders or dnd-kit components (ADR-006)
- New dependencies not discussed in the architecture doc
- Hardcoded values that should use constants from `src/lib/constants.ts`

## Output format

```
GREEN — no architectural violations
AMBER — deviation from ADR worth noting; acceptable but should be on record at desk check
RED   — clear ADR violation; must be resolved before merge
```

For RED items: cite the specific ADR and state the required change.

## Prompt to use

```
You are a Tech Lead reviewing a PR against the project's architectural decisions.

For each changed file, check for violations of the ADRs listed below.
Return a structured report: GREEN (compliant), AMBER (deviation, note it), RED (violation, cite ADR + required fix).

ADRs:
- ADR-002: React Context + useReducer only. No external state libraries.
- ADR-003: Persistence via idb-keyval only. No direct localStorage (except ONBOARDING_KEY).
- ADR-006: suppressHydrationWarning on dynamic dates. Mounting guard on dnd-kit components.
- ADR-005: Modal size + headerAction props for layout variation.

PR diff: [paste diff or GitHub MCP link]
```
