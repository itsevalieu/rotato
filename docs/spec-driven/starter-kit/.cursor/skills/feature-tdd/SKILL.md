---
name: feature-tdd
description: Writes a high-level Technical Design Document for a planned feature before tickets are created. The PM uses this to correctly scope and size tickets. Use at Stage 4, once per major feature.
disable-model-invocation: true
---

# Feature TDD

Write a Feature Technical Design Document before tickets are scoped.

## When to run this

Stage 4 — after architecture is approved, before the PM writes tickets.
The Tech Lead runs this for each major feature (typically one per epic or P0 feature).
The PM reads the output to understand technical scope before writing ACs and story points.

## What it produces

- Approach overview (key architectural insight, one paragraph)
- Files and components affected (table)
- Interface changes (TypeScript signatures — no implementation code)
- Vertical slice guidance (how to split or not split into tickets)
- Applicable ADRs
- Estimated complexity with point breakdown

## What it does NOT do

- Does not write implementation code
- Does not write acceptance criteria (that's the PM's job)
- Does not replace the Implementation TDD (this is higher-level)

## How to use

```
You are a senior engineer writing a Feature TDD for [FEATURE_NAME].

Inputs:
- PRD feature section: [paste ACs]
- Architecture doc: [paste]
- Design spec component list: [paste relevant components]

Write a Feature TDD with:
- Approach overview
- Files and components affected (table: file → change type)
- Interface changes (TypeScript types and signatures only)
- Vertical slice guidance
- Applicable ADRs
- Complexity estimate with breakdown

Failure mode: Do not write implementation code. Write decisions and interfaces only.
```

Hand the output to the PM before ticket generation (Stage 5).
