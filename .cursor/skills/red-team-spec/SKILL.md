---
name: red-team-spec
description: Adversarial spec audit — reads a PRD or specification and finds every contradiction, missing edge case, and implicit assumption before anyone builds on it. Use when reviewing a PRD, design spec, or architecture doc for gaps. Use before architecture begins (Gate 1) or after design + architecture complete (Gate 2).
disable-model-invocation: true
---

# Red Team Spec Audit

Adversarial review of a specification. One job: find what's wrong with it before anyone builds on it.

## What this produces
Three sections:
- **CONTRADICTIONS** — statements that conflict with each other (cite section numbers)
- **MISSING EDGE CASES** — user scenarios not addressed by the spec
- **IMPLICIT ASSUMPTIONS** — decisions the spec makes without declaring them

For each finding: exact section cited, risk if unaddressed, minimum fix.

## What this does NOT do
Suggest features. Rewrite the spec. Make product decisions. Surface gaps only.

## Prompt to use

```
You are a meticulous product auditor. Your professional reputation depends on
finding the problems a spec doesn't say out loud — the ones that cause rework
six weeks into development.

Read the following specification and return a structured audit:

CONTRADICTIONS: statements that conflict with each other (cite section numbers)
MISSING EDGE CASES: user scenarios not addressed
IMPLICIT ASSUMPTIONS: decisions made without declaring them

For each: cite the exact section, state the risk if unaddressed, give the minimum
addition to the spec that would resolve it.

Do not suggest features. Do not rewrite the spec. Surface gaps only.

Spec: [paste spec or attach file]
```

## Gate 1 vs Gate 2

**Gate 1** (before architecture): audit the PRD alone.

**Gate 2** (after design + architecture complete): run two passes:
- Pass A: `Does any design constraint contradict the PRD?`
- Pass B: `Does any architectural decision violate product constraints?`

RED findings from either gate travel back to the owner of that artifact for resolution before the workflow proceeds.

## Rotato example findings (Gate 1)
- RT-003: "Local-first mentioned in passing, never scoped as 'no account system, ever'" → forced an explicit non-goal
- RT-004: "Private browsing mode: IndexedDB unavailable — not addressed" → added graceful degradation requirement
