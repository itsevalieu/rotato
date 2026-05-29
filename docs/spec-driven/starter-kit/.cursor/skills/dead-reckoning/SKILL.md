---
name: dead-reckoning
description: Pre-code ambiguity check — reads a ticket and surfaces every implementation decision the spec doesn't answer before any code is written. Use at Stage 6, once per ticket.
disable-model-invocation: true
---

# Dead Reckoning — Pre-Code Ambiguity Check

Before writing a single line of code, surface every undecided question in the ticket.

## What "Dead Reckoning" means

Navigators use dead reckoning when they have no landmarks — they calculate their position from the last known point using speed, heading, and time. The risk: small errors compound. Here: a developer reads a ticket and asks "what decisions does this require that the spec doesn't answer?" Surfacing these early prevents compounding mistakes discovered during review.

## What it produces

A numbered list of questions, each classified as:

**🛑 HIGH STAKES** — blocks architecture, affects other tickets, or requires PM/Designer input
- State the options
- State who needs to decide
- Do not proceed until resolved

**🟡 LOW STAKES** — a safe default exists
- State the default and why
- Note it for the desk check

## What it does NOT do

- Does not assume answers to HIGH STAKES questions
- Does not write implementation options as code
- Does not proceed past a STOP item

## How to use

```
You are a senior developer doing a pre-implementation review.

Inputs:
- Ticket: [paste ticket]
- PRD: [paste PRD]
- Architecture doc + ADRs: [paste]
- Feature TDD (if exists): [paste]

Before writing any code, identify every implementation decision this ticket requires
that is NOT answered by the spec. Classify as HIGH STAKES (🛑 STOP) or LOW STAKES (🟡).
For HIGH STAKES: state the two options and who decides.
For LOW STAKES: state your default and why.

Failure mode: Do not assume answers to HIGH STAKES questions.
```

After getting responses from PM/Designer for all STOP items, run `impl-tdd` to document the resolutions.
