---
name: red-team-spec
description: Adversarial spec audit — reads any PRD or specification and finds every contradiction, missing edge case, and implicit assumption before anyone builds on it. Use at Stage 2 (Gate 1) and Stage 3 (Gate 2).
disable-model-invocation: true
---

# Red Team Spec Audit

Adversarial review of a specification. One job: find what is wrong with it before anyone builds on it.

## What "Red Team" means

The term comes from military wargaming, where a "Red Team" is tasked with attacking your plan to find weaknesses before an actual adversary does. Here: an AI agent reads your spec as a skeptical critic, not a helpful builder. It looks for cracks.

## What it produces

A numbered audit log:
- **Finding ID** (RT-001, RT-002 ...)
- **Severity:** BLOCKER / WARNING / QUESTION
- **The specific contradiction or gap**
- **The two sentences that conflict** (for contradictions)
- **The decision that would resolve it**

Then: a revised spec with all BLOCKERs resolved inline.

## What it does NOT do

- It does not suggest new features
- It does not design solutions
- It does not comment on style or writing quality

## How to use

**Gate 1 — after PRD draft (Stage 2):**
> "You are a senior product critic. Run a Red Team audit on this PRD. Find every internal contradiction, untestable AC, missing edge case (empty state, error state, offline, mobile), and implicit assumption that should be explicit. Input: [paste PRD]"

**Gate 2 — after design spec (Stage 3):**
> "You are a technical reviewer. Cross-check this design spec against the PRD. Find: PRD features missing from the component inventory, design choices that contradict non-goals, components that need capabilities the spec doesn't address, and interaction behaviors with no corresponding design principle. Input PRD: [paste] Input design spec: [paste]"
