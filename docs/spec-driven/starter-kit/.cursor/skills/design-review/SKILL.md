---
name: design-review
description: Checks a component implementation against the design spec and design-system.mdc rule. Returns a GREEN/AMBER/RED compliance report. Use at Stage 8. Populate the design constraints from Stage 3.
disable-model-invocation: true
---

# Design Review

Compare a component implementation against the design spec and `design-system.mdc`.

## Setup

After completing Stage 3, update the prompt below with your actual design tokens and prohibitions.

## What it checks

- No hardcoded color values (should use tokens)
- Typography uses the correct font per spec
- Animations within timing constraints
- All interactive elements have accessible labels
- No prohibited colors or patterns

## How to use

```
You are a designer reviewing component implementations against the design spec.

design-system.mdc rules:
[paste your design-system.mdc content]

Design spec (colors, typography, animation):
[paste relevant sections of 02-design-spec.md]

Changed files:
[paste component code]

For each check, classify as:
- GREEN: compliant
- AMBER: minor deviation, acceptable with a note
- RED: violation — must be fixed before merge

Output a table: Check | Status | File + Line (for AMBER/RED)
```
