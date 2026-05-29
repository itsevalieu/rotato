# ASDD Setup Guide

Follow these stages in order. Each stage has a **goal**, the **role** running it, the **model** to use, and a **copy-paste prompt**.

Replace `[PROJECT_NAME]`, `[TECH_STACK]`, and `[DOMAIN]` throughout.

---

## Stage 1 — Problem Statement

**Goal:** Articulate the problem, the users, and what success looks like before anything is designed.  
**Role:** PM  
**Model:** Claude Sonnet  
**Output:** `docs/problem-statement.md`

```
You are a senior product manager with deep experience in [DOMAIN].

I am building [PROJECT_NAME]. Here is my rough idea:

[PASTE YOUR ROUGH IDEA HERE]

Generate a structured problem statement with:
1. The core problem (1 paragraph, no solution language)
2. Who experiences this problem (2-3 user personas with name, context, and pain point)
3. What "solved" looks like for each persona
4. What is explicitly out of scope for a first version

Format as a clean markdown document I can share with a team.
Failure mode: Do not propose solutions or features yet. Stay in the problem space.
```

---

## Stage 2 — Product Requirements Document + Red Team Audit

**Goal:** Turn the problem statement into a complete PRD, then audit it for contradictions and gaps before design begins.  
**Role:** PM → Red Team  
**Model:** Sonnet for PRD, Opus for Red Team  
**Output:** `docs/01-prd.md` (with Red Team audit appended)

### 2a — Generate PRD

```
You are a senior product manager writing a PRD for a small, focused product.

Input: [PASTE PROBLEM STATEMENT]

Generate a PRD with:
- Problem summary (1 paragraph)
- User personas (from the problem statement)
- Goals (measurable)
- Non-goals (explicit, permanent constraints go here)
- Feature list with priority (P0/P1/P2) and 3-5 acceptance criteria per feature
- Data model summary (the key entities and their fields)
- Success metrics

Use the template at docs/templates/01-prd.md.
Failure mode: Do not add features without a persona that needs them.
```

### 2b — Red Team Gate 1

```
You are a senior product critic. Your only job is to find what is wrong with this PRD.

Input: [PASTE PRD]

For each finding, state:
- Finding ID (RT-001, RT-002, ...)
- Severity: BLOCKER / WARNING / QUESTION
- What the contradiction or gap is
- The two sentences that contradict each other (if applicable)
- What decision would resolve it

Categories to check:
- Internal contradictions between features or non-goals
- Acceptance criteria that are untestable or ambiguous
- Missing edge cases (empty state, error state, mobile, offline)
- Implicit assumptions that should be explicit (e.g., auth, data persistence, platform)
- Features without a persona that needs them

Output as a numbered audit log. Then restate the PRD with each BLOCKER resolved.
Failure mode: Do not suggest new features. Only resolve contradictions in what's already stated.
```

---

## Stage 3 — Design Specification + Red Team Gate 2

**Goal:** Define the visual language and component inventory. Audit the design spec against the PRD for gaps.  
**Role:** Designer → Red Team  
**Model:** Sonnet for spec, Opus for Gate 2  
**Output:** `docs/02-design-spec.md`

### 3a — Generate Design Spec

```
You are a senior UI/UX designer writing a design specification for a small product.

Input:
- PRD: [PASTE VALIDATED PRD]
- Design direction: [DESCRIBE AESTHETIC — e.g. "warm, cozy, anti-corporate, local-first feel"]
- Tech stack: [e.g. "React, Tailwind, Framer Motion"]

Generate a design spec with:
- Design brief (tone, principles, what to avoid)
- Color system (primary palette, semantic tokens, dark mode, any explicit prohibitions)
- Typography (heading/body/accent fonts, scale)
- Component inventory (list every UI component implied by the PRD features)
- Interaction principles (animation approach, transitions, focus states)

Use the template at docs/templates/02-design-spec.md.
Failure mode: Do not specify layout or implementation. Focus on tokens and principles.
```

### 3b — Red Team Gate 2

```
You are a technical reviewer cross-checking a design spec against a PRD.

Inputs:
- PRD: [PASTE PRD]
- Design Spec: [PASTE DESIGN SPEC]

Find:
1. PRD features whose components are missing from the design spec's component inventory
2. Design choices that contradict PRD non-goals (e.g. a loading spinner when offline is a non-goal)
3. Components that require capabilities the design spec doesn't address (e.g. a modal that needs variable width)
4. Interaction behaviors specified in ACs that have no corresponding design principle

Output as a numbered finding list. Then list the specific changes needed before architecture begins.
```

---

## Stage 4 — Architecture + ADRs + Cursor Rules

**Goal:** Record all architectural decisions formally. Generate the Cursor rules that enforce them automatically.  
**Role:** Tech Lead  
**Model:** Sonnet for architecture, Haiku for ADRs and rules  
**Output:** `docs/03-architecture.md`, `.cursor/rules/*.mdc`

### 4a — Architecture Overview

```
You are a senior software architect designing the technical foundation for [PROJECT_NAME].

Inputs:
- PRD: [PASTE PRD]
- Design Spec: [PASTE DESIGN SPEC]
- Tech stack constraints: [PASTE ANY KNOWN CONSTRAINTS]

Generate an architecture document with:
- System overview (one paragraph)
- Stack decisions with brief rationale (framework, state management, persistence, key libraries)
- Data model (TypeScript interfaces for all entities from the PRD)
- Key files and their responsibilities
- 4-6 Architecture Decision Records (ADR format: Context, Decision, Consequences)

Use the template at docs/templates/03-architecture.md.
Failure mode: Flag any decision where the PRD is ambiguous about what the technical behavior should be.
```

### 4b — Confidence Map

```
You are a technical reviewer auditing an architecture document for assumption risk.

Input: [PASTE ARCHITECTURE DOC]

For each significant decision, classify it as:
- GREEN: Explicitly required by the PRD or design spec
- AMBER: Reasonable default not explicitly spec'd — document the assumption
- RED: Assumed without any spec backing — requires resolution before implementation

Output as a table: Decision | Classification | Spec Reference or Assumption

For every RED item, write the question that needs to be answered and who should answer it (PM or Designer).
```

### 4c — Generate Cursor Rules

```
You are generating Cursor AI rules for [PROJECT_NAME].

Inputs:
- Design spec (colors, typography, animation): [PASTE DESIGN SPEC]
- Architecture ADRs: [PASTE ADRS]
- Tech stack: [TECH_STACK]

Generate three .mdc rule files:

1. design-system.mdc
   - Enforce: use of design tokens (no hardcoded values), typography rules, animation constraints, accessibility
   - globs: **/*.tsx, **/*.css
   - alwaysApply: true

2. architecture.mdc
   - Enforce: one rule per ADR (state management, persistence, hydration, patterns to avoid)
   - globs: src/**/*.ts, src/**/*.tsx
   - alwaysApply: true

3. testing-standards.mdc
   - Enforce: test naming convention, coverage requirements, allowed testing tools
   - globs: **/*.test.ts, **/*.test.tsx
   - alwaysApply: false

Format: frontmatter with description/globs/alwaysApply, then rules as bullet points.
```

### 4d — Feature TDD (run once per major feature before ticketing)

```
You are a senior engineer writing a Feature Technical Design Document for [FEATURE_NAME].

Inputs:
- PRD feature section: [PASTE FEATURE ACS]
- Architecture doc: [PASTE ARCHITECTURE]
- Design spec component list: [PASTE RELEVANT COMPONENTS]

Write a Feature TDD with:
- Approach overview (1 paragraph — key architectural insight)
- Files and components affected (table: file → change type)
- Interface changes (TypeScript signatures for new types, props, actions)
- Vertical slice guidance (how to split or not split into tickets, and why)
- Applicable ADRs
- Estimated complexity with breakdown (story points)

This document is handed to the PM before tickets are written so they can correctly scope and size.
Failure mode: Do not write implementation code. Write decisions and interfaces only.
```

---

## Stage 5 — Ticket Generation (PM + Tech Lead)

**Goal:** Generate vertical-slice tickets with testable ACs. Two passes: PM drafts, Tech Lead reviews.  
**Role:** PM (Pass 1) + Tech Lead (Pass 2)  
**Model:** Haiku (Pass 1), Sonnet (Pass 2)  
**Output:** `docs/04-tickets.md` (or individual Jira ticket files)

### Pass 1 — PM (Claude Haiku)

```
You are a product manager writing Jira-style user stories.

Inputs:
- Validated PRD: [PASTE PRD]
- Feature TDDs written by Tech Lead: [PASTE FEATURE TDDS]

For each P0 and P1 feature, write a ticket with:
- Title
- User story (As a... I want... so that...)
- 4-6 acceptance criteria (Given/When/Then format, testable)
- Dependencies (other tickets this needs)

Do not add story points or technical notes — that is the Tech Lead's job.
Failure mode: Each AC must be verifiable by a QA engineer without reading source code.
```

### Pass 2 — Tech Lead (Claude Sonnet)

```
You are a tech lead reviewing and enriching a set of Jira tickets.

Inputs:
- Tickets from PM: [PASTE TICKETS]
- Feature TDDs: [PASTE FEATURE TDDS]
- Architecture ADRs: [PASTE ADRS]

For each ticket:
1. Add story point estimate (informed by Feature TDD complexity assessment)
2. Add technical notes (which files, patterns, ADRs apply)
3. Flag any AC that is untestable, ambiguous, or has hidden technical complexity
4. Return flagged ACs to the PM as explicit questions before estimating

Output each ticket in the same format, with a "Tech Lead flags" section for any returned questions.
```

---

## Stage 6 — Dead Reckoning + Implementation TDD

**Goal:** Surface every undecided question before a single line of code is written.  
**Role:** Developer  
**Model:** Opus (Dead Reckoning), Sonnet (Implementation TDD)  
**Output:** `docs/05-implementation-plan.md`

### 6a — Dead Reckoning

```
You are a senior developer doing a pre-implementation review of a ticket.

Inputs:
- Ticket: [PASTE TICKET]
- PRD: [PASTE PRD]
- Architecture doc + ADRs: [PASTE ARCHITECTURE]
- Feature TDD: [PASTE FEATURE TDD]

Before writing any code, identify every implementation decision this ticket requires that is NOT answered by the spec.

For each question:
- Classify as HIGH STAKES (blocks architecture, affects other tickets, needs PM/Designer input) or LOW STAKES (safe default, document the assumption)
- For HIGH STAKES: state the two options and who needs to decide
- For LOW STAKES: state your default and why

Output a numbered list of questions. Mark HIGH STAKES with 🛑 STOP.
Failure mode: Do not assume answers to HIGH STAKES questions. Stop and get decisions before proceeding.
```

### 6b — Implementation TDD

```
You are a senior developer writing an Implementation TDD after a Dead Reckoning session.

Inputs:
- Ticket: [PASTE TICKET]
- Feature TDD: [PASTE FEATURE TDD]
- Dead Reckoning resolutions: [PASTE RESOLVED QUESTIONS]

Write an Implementation TDD with:
- Problem (one sentence)
- Approach (step-by-step — no code yet, just decisions)
- Alternatives considered (why you rejected them)
- Decision log (table: Question | Resolution | Decided by | Confidence)
- Open questions (should be empty — resolve before coding)
- Confidence Map summary

This document is approved by the Tech Lead before coding begins.
```

---

## Stage 7 — Implementation Plan

**Goal:** Turn the approved TDD into a numbered, file-level plan a developer (or AI) can execute commit by commit.  
**Role:** Developer  
**Model:** Sonnet  
**Output:** Steps appended to `docs/05-implementation-plan.md`

```
You are a developer generating a file-level implementation plan from an approved Implementation TDD.

Input:
- Implementation TDD: [PASTE APPROVED TDD]
- Current codebase structure: [PASTE RELEVANT FILE TREE]

Generate a numbered step-by-step implementation plan where:
- Each step touches one file or one logical unit of work
- Steps are ordered so the codebase is always in a runnable state
- Every 3-5 steps forms a logical commit (mark commit boundaries)
- No step requires knowledge beyond the TDD and the spec

Do not write code. Write file-level instructions: "In [file], add [thing] that does [behavior]."
```

---

## Stage 8 — Automated PR Review Stack

**Goal:** Validate the implementation against spec, architecture, and design before human review.  
**Role:** Developer (runs before opening PR)  
**Model:** Sonnet  

Run these in order. Each is a skill in `.cursor/skills/`.

### Spec compliance check

```
You are a QA engineer validating a PR against a Jira ticket's acceptance criteria.

Inputs:
- Ticket: [PASTE TICKET]
- PR diff or changed files: [PASTE OR DESCRIBE CHANGES]

For each AC, classify as:
- GREEN: Clearly satisfied by the diff
- AMBER: Partially addressed — describe the gap
- RED: Not addressed at all

Output a table: AC # | Text | Status | Notes
If any RED items exist, the PR should not be opened until they are resolved.
```

### Tech lead review

```
You are a tech lead reviewing a PR diff against the project's architectural ADRs.

Inputs:
- ADRs: [PASTE ADRS]
- architecture.mdc rules: [PASTE RULES]
- PR diff: [PASTE DIFF]

Check for violations of:
- State management pattern (ADR)
- Persistence pattern (ADR)
- Hydration guard requirements (ADR)
- Any pattern explicitly prohibited in architecture.mdc

Output: PASS or list of violations with file + line reference.
```

### Design review

```
You are a designer reviewing a component implementation against the design spec.

Inputs:
- design-system.mdc rules: [PASTE RULES]
- Design spec (colors, typography, animation): [PASTE DESIGN SPEC]
- Changed component files: [PASTE FILES]

Check:
- No hardcoded color values (should use tokens)
- Typography uses correct font/size per spec
- Animations within timing constraints
- All interactive elements have accessible labels

Output: GREEN / AMBER / RED per check with specific lines flagged.
```

---

## Stage 9 — QA Test Plan + Desk Check

**Goal:** Structured test execution and sign-off before merge.  
**Role:** QA (test plan), Full team (desk check)  
**Model:** Haiku  

### QA test plan

```
You are a QA engineer generating a structured test plan.

Inputs:
- Ticket: [PASTE TICKET]
- Implementation plan: [PASTE IMPL PLAN]

Generate test cases in four categories:
1. Happy path (one test per AC)
2. Edge cases (empty state, boundary values, concurrent actions)
3. Regression (features this change could break)
4. Accessibility (keyboard navigation, screen reader, color contrast)

Format per test case:
- ID: [TICKET-HP-01, TICKET-EC-01, etc.]
- AC validated
- Precondition
- Steps
- Expected result
```

### Desk check checklist

```
You are generating a desk check checklist for a feature that is ready for sign-off.

Inputs:
- Ticket: [PASTE TICKET]
- QA test plan: [PASTE TEST PLAN]
- Implementation TDD: [PASTE TDD]

Generate role-specific checklists:
- PM: Does each AC match the original intent? Does it feel right?
- Designer: Does it match the design spec? Does it feel right?
- Tech Lead: Are ADRs respected? Is the approach clean?
- QA: Were all test cases executed? Were edge cases found during testing?

Each list should have 4-6 specific, answerable items — not generic questions.
```

---

## Stage 10 — Post-Merge ADR Update

**Goal:** Keep architecture docs current. Detect when code diverged from accepted ADRs.  
**Role:** Tech Lead (automated)  
**Model:** Haiku  

```
You are a technical writer updating architecture documentation after a merge.

Inputs:
- Merged PR diff: [PASTE DIFF]
- Existing ADRs: [PASTE ADRS]
- Implementation TDD: [PASTE TDD]

For each ADR:
1. Did the merged code follow the accepted decision? (YES / PARTIAL / NO)
2. If PARTIAL or NO: draft a superseding ADR entry with status "Supersedes ADR-XXX"

Only flag actual divergence. If the code followed the ADR, say so briefly.
Output: list of ADRs checked + new ADR draft if needed.
```

---

## Generating Cursor Artifacts from your docs

After Stage 4, run this prompt to generate the `bugbot.json` for your project:

```
You are generating a Bugbot configuration for [PROJECT_NAME].

Inputs:
- ADRs: [PASTE ADRS]
- architecture.mdc: [PASTE RULE]

Generate a bugbot.json with one `focus` pattern per ADR enforcement point.
Each pattern needs: regex pattern, message citing the ADR, severity (warning or error).

Focus on: patterns the ADR explicitly prohibits, hydration anti-patterns,
hardcoded values that should use constants, and any library/API misuse the ADR documents.
```

---

## Quick Reference — Role-Scoped Prompt Formula

Every prompt in this workflow follows the same structure:

```
You are a [ROLE] with expertise in [DOMAIN].

[FAILURE MODE: state what the model must NOT do]

Inputs:
- [Document 1]
- [Document 2]

Generate [OUTPUT] with:
- [Section 1]
- [Section 2]
```

The failure mode line is the most important part. It tells the model where the guardrail is.

**Common failure modes:**
- "Do not propose solutions — stay in the problem space"
- "Do not assume answers to HIGH STAKES questions"
- "Do not add features without a persona that needs them"
- "Do not write code — write decisions and interfaces only"
- "Do not suggest new features — only resolve contradictions in what's stated"
