---
name: confidence-map
description: Annotates architectural or implementation decisions as GREEN (explicitly spec'd), AMBER (reasonable default), or RED (assumed without spec backing). Use after writing architecture docs or TDDs.
disable-model-invocation: true
---

# Confidence Map

Annotate decisions with how explicitly they were specified. Turns invisible assumptions into visible ones.

## Classifications

- **🟢 GREEN** — Explicitly required by the PRD or design spec. Cite the section.
- **🟡 AMBER** — Not spec'd, but a reasonable default given the context. State the assumption.
- **🔴 RED** — Assumed without any spec backing. Needs resolution before implementation.

## What it produces

A table: Decision | Classification | Spec reference or assumption

For every RED item: the question that needs answering + who should answer it.

## What it does NOT do

- Does not resolve RED items — resolution requires a human decision
- Does not rate stylistic choices

## How to use

```
You are a technical reviewer auditing an architecture document for assumption risk.

Input: [paste architecture doc or TDD]

For each significant decision, classify as GREEN / AMBER / RED.
Output as a table: Decision | Classification | Spec Reference or Assumption.
For every RED item, write the question that needs to be answered and who answers it (PM or Designer).
```

RED items must be resolved before tickets are written (Stage 4) or before coding begins (Stage 6).
Add resolutions back to the architecture doc or Implementation TDD.
