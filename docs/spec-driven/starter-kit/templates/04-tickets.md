# Feature Tickets: [PROJECT_NAME]

> **Stage:** 5 — two-pass generation: PM (Haiku) → Tech Lead (Sonnet)  
> Feature TDDs from Stage 4 inform Tech Lead story point estimates.

---

## How these tickets were generated

**Pass 1 — PM + Claude Haiku**
Prompt reads the validated PRD and generates one ticket per P0/P1 feature with user story and ACs.

**Pass 2 — Tech Lead + Claude Sonnet**
Reads the PM tickets plus all Feature TDDs. Adds story points (informed by Feature TDD complexity), technical notes (which ADRs and files apply), and returns flagged ACs to the PM before estimating.

---

## [EPIC-001]: [Epic Name]

| Field | Value |
|---|---|
| **Type** | Epic |
| **Status** | To Do |
| **Total points** | [sum] |
| **Tickets** | [PROJ-001, PROJ-002, ...] |

---

## [PROJ-001]: [Feature Name]

| Field | Value |
|---|---|
| **Type** | Story |
| **Status** | To Do |
| **Priority** | P0 |
| **Points** | [N] |
| **Epic** | EPIC-001 |
| **Sprint** | Sprint [N] |
| **Dependencies** | [None / PROJ-XXX] |
| **PRD section** | F-001 |

### Description

As a [persona], I want [capability] so that [outcome].

### Acceptance Criteria

1. Given [context], when [action], then [result].
2.
3.

### Tech Lead notes

- [Which ADR applies]
- [Which files to touch]
- [Pattern to follow]

### Tech Lead flags (returned to PM before estimating)

> "[Ambiguous AC or hidden complexity — stated as a question]"

**PM response:** "[Resolution]"

---

## [PROJ-002]: [Feature Name]

<!-- Copy the block above for each feature -->
