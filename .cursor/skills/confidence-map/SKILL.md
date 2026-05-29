---
name: confidence-map
description: Annotates architectural or implementation decisions as GREEN (explicitly spec'd), AMBER (reasonable default), or RED (assumed without spec backing). Use when reviewing architecture docs, PR diffs, or after implementing a feature. RED items tell reviewers exactly where to focus.
disable-model-invocation: true
---

# Confidence Map

Annotate decisions with how explicitly they were specified. Turns "trust but verify" into "verify here."

## Classifications

| Color | Meaning |
|---|---|
| 🟢 GREEN | The spec explicitly required or excluded this choice |
| 🟡 AMBER | Reasonable default, not contradicted by the spec |
| 🔴 RED | The spec was silent; this decision has downstream consequences |

## For every RED item
- State the exact question that would have resolved it
- Identify the file/line most affected by this assumption
- Recommend: add to ADR, or raise with PM

## Prompt to use

```
You are annotating architectural decisions against a specification.

Given the spec and decisions below, classify each:
GREEN (explicitly specified), AMBER (reasonable default), RED (assumption with consequence).

For every RED: state the exact question that would have resolved it,
and identify which file most depends on this assumption.

Spec: [PRD + design spec + architecture doc]
Decisions to annotate: [list or code diff]
```

## Rotato Confidence Map

| Decision | | Outcome |
|---|---|---|
| Local-first with idb-keyval | 🟢 GREEN | PRD explicit non-goal |
| React Context + useReducer | 🟡 AMBER | Standard default |
| Next.js App Router | 🟡 AMBER | Standard default |
| SSR rendering behavior | 🔴 RED | → `Date.now()` hydration bug |
| dnd-kit `aria-describedby` | 🔴 RED | → hydration mismatch |
| `toLocaleString()` on server | 🔴 RED | → hydration warning |

Three RED decisions → three production bugs. Direct correlation.
