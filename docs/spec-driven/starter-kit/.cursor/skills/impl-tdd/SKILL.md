---
name: impl-tdd
description: Drafts an Implementation TDD from Dead Reckoning resolutions and a Jira ticket. Documents every implementation decision before code is written. Use at Stage 6, after Dead Reckoning.
disable-model-invocation: true
---

# Implementation TDD

Document all implementation decisions for a specific ticket, derived from Dead Reckoning resolutions.

## When to run this

Stage 6 — after Dead Reckoning is complete and all STOP items are resolved.
The developer writes this, the Tech Lead approves it before coding begins.

## What it produces

- Problem (one sentence)
- Approach (numbered steps — decisions, not code)
- Alternatives considered (why rejected)
- Decision log (table: Question | Resolution | Decided by | Confidence)
- Open questions (should be empty)
- Confidence Map summary

## What it does NOT do

- Does not contain code
- Does not replace the implementation plan (that's `impl-plan`)
- Does not proceed past open questions

## How to use

```
You are a senior developer writing an Implementation TDD.

Inputs:
- Ticket: [paste ticket]
- Feature TDD: [paste]
- Dead Reckoning resolutions: [paste resolved questions]

Write an Implementation TDD with:
- Problem (one sentence)
- Approach (step-by-step decisions, no code)
- Alternatives considered
- Decision log (table)
- Open questions — must be empty
- Confidence Map summary (GREEN / AMBER / RED per decision)

This document is approved by the Tech Lead before coding begins.
```

After Tech Lead approval, run `impl-plan` to turn this into a file-level implementation plan.
