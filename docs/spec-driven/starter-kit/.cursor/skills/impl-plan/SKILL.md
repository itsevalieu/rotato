---
name: impl-plan
description: Generates a file-level, step-by-step implementation plan from an approved Implementation TDD. Each step touches one file. Steps are ordered to keep the codebase runnable. Use at Stage 7.
disable-model-invocation: true
---

# Implementation Plan Generator

Turn an approved Implementation TDD into a numbered, file-level implementation plan.

## What it produces

- Numbered steps, each touching one file or one logical unit
- Steps ordered so the codebase compiles and runs after each step
- Commit boundaries marked every 3-5 steps
- No code — file-level instructions only

## How to use

```
You are a developer generating a file-level implementation plan from an approved Implementation TDD.

Inputs:
- Implementation TDD: [paste approved TDD]
- Relevant file tree: [paste]

Generate a numbered step-by-step plan where:
- Each step touches one file or one logical unit
- Steps are ordered so the codebase is always in a runnable state
- Every 3-5 steps forms a logical commit (mark commit boundaries)
- Each step is: "In [file], add/update [thing] so that [behavior]"

Do not write code. Write instructions.
```

This plan is handed to the developer (or used as context for an AI coding agent).
