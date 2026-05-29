---
name: dead-reckoning
description: Pre-code ambiguity check — reads a Jira ticket and surfaces every implementation decision not answered by the spec before any code is written. Use when picking up a new ticket, before writing an implementation plan or any code. High-stakes ambiguities must be resolved by PM/Designer before proceeding.
disable-model-invocation: true
---

# Dead Reckoning — Pre-Code Ambiguity Check

Before writing a single line of code, surface every undecided question in the ticket.

Named after the navigation practice: when a sailor runs out of known landmarks, they stop and take a new bearing rather than guessing into open ocean. Same principle here — stop at every undecided question rather than guessing forward.

## Classification

- **LOW STAKES + REVERSIBLE** — proceed with the most reasonable default, note the assumption, continue
- **HIGH STAKES or IRREVERSIBLE** — STOP. State the exact question, the options, and which files each option affects. Do not continue until a human resolves it.

## Prompt to use

```
You are implementing the following ticket. Before writing any code:

1. Read every acceptance criterion completely.
2. List every implementation decision NOT answered by the spec or the Feature TDD.
3. Classify each:
   - LOW STAKES + REVERSIBLE: proceed with reasonable default, note assumption.
   - HIGH STAKES or IRREVERSIBLE: STOP. State the exact question, the options,
     and which downstream files each option affects. Do not continue until resolved.

Only after all STOP items are resolved, confirm you are ready for the Implementation TDD.

Ticket: [Jira ticket ID or paste]
Feature TDD: [Confluence link if exists]
Architecture doc: [Confluence link]
Design spec: [Confluence link]
```

## After Dead Reckoning

Route STOP items to the right person:
- Product/scope decisions → PM
- UX/interaction decisions → Designer
- Technical trade-offs → Tech Lead

Once all resolved, use the `impl-tdd` skill to document resolutions and draft the Implementation TDD.

## Rotato example (ROT-006)

| Question | Classification | Resolution |
|---|---|---|
| Where does `formStyle` persist? (localStorage / GardenState) | 🛑 STOP | PM: "GardenState — survives tab refresh like viewMode" |
| Preserve field values on style switch? | 🛑 STOP | Designer: "Yes — lift state to ProjectForm" |
| Style picker placement | 🟡 Default | Modal `headerAction` slot |
| LivePreview modal width | 🟡 Default | `size="lg"` |
