# AI-Assisted Spec-Driven Development: From Problem Statement to Production

**Hackathon submission — Epic: Spec-to-Data Pipelines**
**Proof of concept: [Rotato](https://github.com/evalieu/rotato) — local-first creative project tracker**

---

## Abstract

Spec-driven development is not a new idea. It's a well-understood practice that teams consistently abandon — not because it doesn't work, but because the overhead of writing specs, keeping them current, and enforcing them against code was too high to sustain.

This submission is a proof that **AI removes that overhead**. The entire SDLC (Software Development Life Cycle — the end-to-end process from problem discovery through design, development, QA, and production) can now run with full spec discipline at the velocity of a startup. The cost: ~$1.48 in AI inference per feature.

The deeper claim: the workflow doesn't just produce code. Each stage generates **executable spec artifacts** — Cursor rules, skills, hooks, and Bugbot configs — that enforce spec fidelity on every future session automatically. The specs don't just inform the tools; they *become* the tools.

**Sprint 2 is cheaper than Sprint 1 because Sprint 1 generated the enforcement layer.**

---

## The Five Friction Points This Workflow Addresses

Every SDLC has the same failure modes. The workflow in this submission closes each with a specific mechanism.

### 1. Intent decay at handoffs

PM → Designer → Tech Lead → Developer → QA is a telephone game. Each translation loses fidelity. By the time code ships, the original intent is barely recognizable.

**Mechanism:** Role-scoped AI agents read the *source artifact* directly via MCP — not a verbal summary, not a ticket paraphrase. The PRD is in Confluence. The Figma spec is in Figma. The architecture ADRs are in Confluence. Every agent works from the same ground truth.

**Rotato example:** The "anti-urgency" constraint from the PRD flows untranslated into the `design-system.mdc` rule ("no red colors"), the data model ("no deadline fields"), and every future code generation session — because the rule was generated from the PRD, not reinterpreted by a human.

---

### 2. The late discovery tax

A spec gap found at Stage 2 costs a 10-minute conversation. The same gap found in QA costs days of rework. Found in production: weeks. Teams knew this and still skipped thorough spec review — because doing it manually was too slow.

**Mechanism:** Two adversarial audit gates — called "Red Team" after the security practice of having a dedicated attacker find holes before real attackers do — run automatically at near-zero marginal cost. An AI agent is given one job: read the spec and find everything wrong with it. Not suggest features. Not rewrite it. Just find the gaps, contradictions, and unstated assumptions — *before anyone builds anything on top of them*. Gate 1 audits the PRD before architecture begins. Gate 2 audits the design spec and architecture against the PRD once both are complete. A single high-reasoning model call surfaces what weeks of human review would have missed.

**Rotato example:** RT-003 — "local-first constraint mentioned in passing, never scoped as 'no account system, ever'" — was caught in the Red Team audit. In actual development, this implicit assumption drove the entire architecture. If it had been a revisable decision mid-sprint, it would have caused a major refactor.

---

### 3. Assumption invisibility

Every developer makes dozens of undocumented decisions per feature — persistence scope, fallback behavior, edge case handling. These become tribal knowledge, then technical debt, then bugs when that developer moves on.

**Mechanism:** Before writing a single line of code, an AI agent reads the ticket and asks: *what decisions does this ticket require that the spec doesn't answer?* This is called "Dead Reckoning" — a navigation term for estimating your position when you can't see landmarks. Sailors doing dead reckoning would eventually hit a point where they'd run out of known information and had to guess. A good navigator stops and takes a new bearing rather than guessing forward into open ocean. Applied to software: the agent stops at every undecided question, classifies it as low-stakes (proceed with a noted default) or high-stakes (stop, surface the question, get a human decision before continuing). The resolved answers are recorded in the Implementation TDD — every assumption is visible and attributed.

**Rotato example:** The `formStyle` persistence question — GardenState vs localStorage vs sessionStorage — was resolved via Dead Reckoning. Three downstream files depended on the answer. Without this step, the decision would have been made silently by the developer and never documented.

---

### 4. Context collapse at the keyboard

When a developer sits down to code, they have: a ticket (partial), maybe a Figma mock (visual), and the codebase (implementation, no intent). The PRD, design rationale, architecture decisions — inaccessible in the flow of work.

**Mechanism:** MCP access is live throughout development. Jira reads the ticket. Confluence reads the Feature TDD, design spec, and ADRs. Figma reads the component mockup. The `architecture.mdc` and `design-system.mdc` rules are always active. The developer's AI session has full context without copy-pasting anything.

**Rotato example:** The `architecture.mdc` rule encodes ADR-006 — hydration guards required for `Date.now()`, dnd-kit, and `toLocaleString()`. A developer who joined after these bugs were discovered and fixed doesn't need to know the history — the rule prevents the mistake automatically.

---

### 5. Stale spec drift

Specs are written once and immediately diverge from reality. Code evolves; specs don't. New team members read outdated documentation and make wrong assumptions.

**Mechanism:** The `update-adr` skill runs post-merge. GitHub MCP reads the final diff. Confluence MCP reads all ADRs. Where code diverged from an accepted decision, a superseding ADR is drafted. The architecture document stays current automatically — no manual maintenance required.

**Feedback loop:** quality issues encountered during development feed back into the enforcement tooling. When a bug pattern is identified, it becomes a Bugbot rule and a Cursor rule. The same class of bug cannot recur in the next sprint because the spec environment has been updated to prevent it.

---

## The Feedback Loops

```
Spec gap found       →  Adversarial audit   →  spec updated before architecture
                        (Red Team agent:           is designed
                        find contradictions,
                        gaps, assumptions)

Cross-artifact       →  Gate 2 audit        →  corrected before tickets written
contradiction           (same agent,
                        design+arch vs PRD)

Ambiguous ticket     →  Pre-code audit      →  resolved before code written,
                        (Dead Reckoning:       not mid-implementation
                        surface every
                        undecided question,
                        block until resolved)

Code drifts          →  Spec compliance     →  caught at PR, not in QA
from ticket AC          check (CI gate)

Code drifts          →  Post-merge ADR      →  architecture docs stay current
from architecture       update skill           automatically

Bug pattern found    →  Bugbot config +     →  same class of bug cannot recur
in PR review            architecture rule      in the next sprint
                        updated
```

The last loop is the most important. The `.cursor/` folder accumulates the spec wisdom of every previous sprint. You cannot introduce the same class of mistake twice — the enforcement layer prevents it.

---

## The Solution

A chain of role-scoped AI agents connected to the team's actual tools via MCPs. Each agent:
1. Gets an **expert identity** with a stated failure mode — not just instructions
2. Reads its inputs **live from the source** via MCP — no copy-paste, no summaries
3. Produces a **validated artifact** the next stage consumes
4. Generates **Cursor artifacts** (rules, skills, hooks, Bugbot) as side effects

Humans stay in the loop at every decision gate. The AI's job is to surface the right questions at the right time and enforce the answers permanently once made.

---

## Expected Impact

| | Without ASDD | With ASDD |
|---|---|---|
| Spec gaps | Found in QA or production | Found before a line of code is written |
| Implicit assumptions | Invisible until they break | Surfaced by Red Team + Dead Reckoning |
| Developer onboarding | "Read the codebase" | `architecture.mdc` explains every constraint |
| PR review | Full review from scratch | 5 automated gates before human eyes |
| Architecture drift | Found in post-mortems | `update-adr` skill flags every divergence |
| Cost per feature | High (rework, late bugs) | ~$1.48 in AI inference |

---

## MCP Ecosystem

MCPs give AI agents live read/write access to external tools. No copy-pasting Jira tickets into chat windows — the agent reads and writes directly.

| MCP | Operations | Stages active |
|---|---|---|
| **Confluence** | `get_page`, `create_page`, `update_page` | 1–2, 3, 4, 6, 9, 10 |
| **Jira** | `create_issue`, `get_issue`, `transition_issue` | 1, 5, 6, 8, 10 |
| **Figma** | `get_file`, `get_styles`, `get_components` | 3, 6, 7 |
| **GitHub** | `create_branch`, `create_pull_request`, `merge_pull_request` | 4, 7, 8, 10 |
| **Slack** | `post_message`, `send_dm` | 2, 5, 8, 10 |

Full config and per-stage operation lists → [Appendix G](./07-mcp-integrations.md)

---

## Workflow

```
Stage 1–2  PM: Problem statement → PRD → Red Team Gate 1 (Opus)
           ↓ Validated PRD, Jira epic, Slack notify
           ┌──────────────────┬──────────────────────────────┐
Stage 3    │ Designer         │ Stage 4  Tech Lead           │  [PARALLEL]
           │ Design spec      │ Architecture + Macro ADRs    │
           │ → design-system  │ + Feature TDDs per epic      │
           │   rule           │ → architecture rule          │
           │ → design-review  │ → confidence-map skill       │
           │   skill          │                              │
           └──────────────────┴──────────────────────────────┘
           ↓ Both complete
Red Team Gate 2: Design vs PRD, Architecture vs PRD (Opus)
           ↓ Specs locked
Stage 5    PM + Tech Lead: Vertical-slice tickets (two passes)
           Pass 1: PM drafts ACs from PRD (Haiku)
           Pass 2: Tech Lead adds story points, deps, technical notes
                   informed by Feature TDDs from Stage 4
           → dead-reckoning skill generated
           ↓ Sprint backlog ready — tickets run in parallel
Stage 6    Developer: Dead Reckoning → Implementation TDD → impl plan
           Ambiguity STOP items → back to PM/Designer before coding
           → impl-tdd skill, impl-plan skill
Stage 7    Developer: Code in Cursor
           → pre-commit hook, post-commit Jira update
           → Background Agent: test stubs from Implementation TDD
Stage 8    Automated review stack:
           1. spec-compliance-check (Haiku) — diff vs Jira AC
           2. Bugbot — ADR-derived bug patterns
           3. tech-lead-review — diff vs architecture ADRs
           4. design-review — components vs Figma spec
           5. Human PR review + babysit skill
           → bugbot.json, spec-compliance skill, create-pr skill
Stage 9    QA: desk check + test plan generation (Haiku)
           → qa-test-plan skill, desk-check skill
Stage 10   UAT → merge → release → living docs updated
           → update-adr skill, Slack ship announcement
```

---

## Model Selection

| Stage | Task | Model | Why |
|---|---|---|---|
| 2, Gate 2 | Red Team audits | Claude Opus 4 | Highest-stakes reasoning; one miss = expensive rework |
| 2, 3, 4, 6 | Drafting + reasoning | Claude Sonnet 4 | Quality generation at reasonable cost |
| 5 | Ticket creation (×6) | Claude Haiku 3.5 | Structured output from structured input |
| 8 | Spec compliance, PR description | Claude Haiku 3.5 | High volume, template work |
| 9 | QA test plan | Claude Haiku 3.5 | Structured output from AC |
| 10 | ADR updates | Claude Sonnet 4 | Requires reasoning about divergence |
| — | Slack notifications | Any nano tier | Zero reasoning needed |

**~$1.48 per feature.** The two Opus Red Team calls dominate the cost. Everything else is Sonnet or Haiku.

---

## Stage 1 — Problem Discovery

| | |
|---|---|
| **Role** | PM |
| **Model** | Claude Sonnet |
| **MCPs** | Confluence (read research), Slack (notify team) |
| **Artifact out** | Problem statement in Confluence |
| **Cursor artifact** | Notepad `project-context` — seeds every future AI session with personas, constraints, non-goals |

**Rotato:** *"Creatives have too many projects and no low-pressure way to manage them. Existing tools create anxiety (task managers) or no structure (note apps). The core constraint: anti-urgency."*

This one phrase — "anti-urgency" — cascades through every downstream decision: no red colors (design), no deadline fields (data model), "Seeds" instead of "Backlog" (copy).

---

## Stage 2 — PRD + Adversarial Spec Audit (Red Team Gate 1)

| | |
|---|---|
| **Role** | PM + AI |
| **AI capability** | Red Team My Spec |
| **Model** | Sonnet (draft) → Opus (audit) |
| **MCPs** | Confluence (write PRD), Jira (create epic), Slack (notify) |
| **Artifact out** | Validated PRD, ROT-EPIC-001 |
| **Cursor artifact** | `red-team-spec` skill — reusable on any future PRD |

**Prompt pattern:**
```
You are a meticulous product auditor. Your reputation depends on finding what
the spec doesn't say out loud — the things that cause rework six weeks in.

Return three sections: CONTRADICTIONS, MISSING EDGE CASES, IMPLICIT ASSUMPTIONS.
For each: cite the section, state the risk, give the minimum fix.
Do not suggest features. Surface gaps only.

PRD: [Confluence MCP: get_page ROT-PRD-001]
```

**Red Team findings on the actual Rotato PRD:**

| # | Finding | Type |
|---|---|---|
| RT-001 | "No deadlines" conflicts with "Finished Worlds" — what defines finished? | Contradiction |
| RT-002 | Single-user assumed throughout, never stated | Implicit assumption |
| RT-003 | "Local-first" not scoped as "no account system, ever" | Implicit assumption |
| RT-004 | Private browsing: IndexedDB unavailable — not addressed | Missing edge case |
| RT-005 | Two tabs open simultaneously — behavior undefined | Missing edge case |

Full PRD → [Appendix A](./01-prd.md)

---

## Stage 3 — Design Spec *(parallel with Stage 4)*

| | |
|---|---|
| **Role** | Designer + AI |
| **Model** | Claude Sonnet |
| **MCPs** | Figma (extract tokens, write component specs), Confluence (write design spec) |
| **Artifact out** | Design spec in Confluence; Figma annotated |
| **Cursor artifacts** | `design-system.mdc` rule (always-on: palette tokens, no red, typography, animation limits) · `design-review` skill |

**Rotato:** The Figma MCP extracts color styles → seeds `globals.css` automatically. The "no red" constraint from the design brief becomes a permanent rule in `design-system.mdc` — every future code generation session respects it without being told.

Full design spec → [Appendix B](./02-design-spec.md)

---

## Stage 4 — Architecture + Feature TDDs + Confidence Map *(parallel with Stage 3)*

| | |
|---|---|
| **Role** | Tech Lead + AI |
| **AI capability** | Confidence Map |
| **Model** | Claude Sonnet |
| **MCPs** | GitHub (read existing patterns), Confluence (write ADRs + Feature TDDs) |
| **Artifacts out** | Architecture doc with ADRs; Feature TDD per planned epic feature |
| **Cursor artifacts** | `architecture.mdc` rule · `testing-standards.mdc` rule · `confidence-map` skill · `tech-lead-review` skill |

**Two outputs at this stage:**

**Macro ADRs** — project-wide decisions (Next.js App Router, Context + useReducer, idb-keyval, dnd-kit). Encoded in `architecture.mdc` so every future code generation respects them automatically.

**Feature TDDs** — high-level technical design per planned feature, written *before tickets are scoped*. The PM cannot correctly slice ROT-006 into an 8-point ticket until the Tech Lead explains it requires a shared `FormStyleProps` interface, state lifting to `ProjectForm`, 6 presentational components, and two new Modal props.

**Prompt pattern:**
```
You are a senior architect writing a Feature TDD before tickets are created.
The PM will use this to scope and size the work correctly.

For this feature, document: approach overview, components/files affected,
interface or type changes required, estimated complexity per vertical slice,
and any ADRs that apply or need to be created.

Feature: Form Style Switcher (from PRD F-006)
Architecture doc: [Confluence MCP] | Codebase patterns: [GitHub MCP: search_code]
```

**Confidence Map (Rotato):**

| Decision | | Outcome |
|---|---|---|
| Local-first with idb-keyval | 🟢 GREEN | Explicitly spec'd |
| React Context + useReducer | 🟡 AMBER | Standard default, not spec'd |
| Next.js App Router | 🟡 AMBER | Standard default, not spec'd |
| SSR rendering behavior | 🔴 RED | Never spec'd → `Date.now()` hydration bug |
| dnd-kit `aria-describedby` | 🔴 RED | SSR behavior not spec'd → hydration mismatch |
| `toLocaleString()` on server | 🔴 RED | Locale mismatch not spec'd → hydration warning |

Three RED decisions. Three hydration bugs. The Confidence Map is the "verify here" directive.

Full architecture doc → [Appendix C](./03-architecture.md)

---

## Red Team Gate 2 — Design + Architecture vs PRD

Runs after Stage 3 and Stage 4 both complete. Same `red-team-spec` skill, two passes:
- Pass A: design spec vs PRD ("do any design constraints contradict product goals?")
- Pass B: architecture vs PRD ("do any technical decisions violate product constraints?")

RED findings travel back to the stage owner before ticketing proceeds.

---

## Stage 5 — Vertical-Slice Tickets

| | |
|---|---|
| **Role** | PM + Tech Lead + AI (two passes) |
| **Model** | Haiku (Pass 1) · Sonnet (Pass 2) |
| **MCPs** | Jira (create + update tickets), Confluence (link to PRD sections) |
| **Artifact out** | 6 sprint-ready tickets with AC + technical notes |
| **Cursor artifact** | `dead-reckoning` skill generated for developer use |

**Pass 1 — PM (Haiku):** user-facing descriptions + ACs in given/when/then format. No story points.

**Pass 2 — Tech Lead (Sonnet):** adds story points, technical dependencies, applicable ADRs. Flags untestable ACs back to PM. **Informed by Feature TDDs from Stage 4** — the Tech Lead already knows the technical shape, so Pass 2 is fast.

| Ticket | Title | Points | Priority |
|---|---|---|---|
| ROT-001 | Garden Board — four sections, project cards | 5 | P0 |
| ROT-002 | Project Form — create/edit with color, icon, tags | 3 | P0 |
| ROT-003 | Drag and Drop — reorder and move between sections | 5 | P0 |
| ROT-004 | Onboarding + Demo Data | 3 | P1 |
| ROT-005 | Delight Features — confetti, ambient, mood, sound | 5 | P1 |
| ROT-006 | Form Style Switcher — 6 interchangeable layouts | 8 | P2 |

Full tickets → [Appendix D](./04-tickets.md)

---

## Stage 6 — Pre-Code Ambiguity Resolution (Dead Reckoning) + Implementation TDD

| | |
|---|---|
| **Role** | Developer + AI |
| **AI capability** | Dead Reckoning |
| **Model** | Claude Sonnet |
| **MCPs** | Jira (read ticket), Figma (read mockups), Confluence (read Feature TDD + specs, write Implementation TDD) |
| **Artifacts out** | Resolved ambiguities + Implementation TDD in Confluence |
| **Cursor artifacts** | `impl-tdd` skill · `impl-plan` skill |

Developer reads the ticket **and** the Feature TDD from Stage 4. The Feature TDD answers most architectural questions. Dead Reckoning surfaces only the micro-ambiguities the Feature TDD didn't resolve.

**Prompt pattern:**
```
You are implementing a Jira ticket. Before writing any code:
1. Read every acceptance criterion.
2. List every decision NOT answered by the spec or the Feature TDD.
3. Classify each:
   - LOW STAKES + REVERSIBLE: proceed with reasonable default, note it.
   - HIGH STAKES or IRREVERSIBLE: STOP. State the question, the options,
     the downstream files affected. Do not continue until resolved.
Only after all STOP items are resolved, confirm readiness for the Implementation TDD.
Ticket: [Jira MCP] | Feature TDD: [Confluence MCP] | Architecture: [Confluence MCP]
```

**Dead Reckoning for ROT-006:**

| Question | Classification | Resolution |
|---|---|---|
| Where does `formStyle` persist? (localStorage / sessionStorage / GardenState) | 🛑 STOP | PM: "GardenState — survives tab refresh like viewMode" |
| Preserve field values on style switch? | 🛑 STOP | Designer: "Yes — lifting state to ProjectForm confirmed" |
| Style picker placement (header vs. form body) | 🟡 Default | Modal `headerAction` slot — matches ViewModePicker pattern |
| LivePreview modal width | 🟡 Default | `size="lg"` — ADR-005 added this prop |

Full Dead Reckoning session + Implementation TDD → [Appendix E](./05-implementation-plan.md)

---

## Stage 7 — Development

| | |
|---|---|
| **Role** | Developer |
| **Model** | Cursor native (Sonnet) |
| **MCPs** | GitHub (branch, push), Figma (reference mockup), Jira (status update) |
| **Cursor artifacts** | `hooks.json` (pre-commit lint + type-check; post-commit Jira update) · Background Agent (test stubs from Implementation TDD) |

`architecture.mdc` and `design-system.mdc` are active in every generation session — the hydration bugs and hardcoded color violations that appeared in Rotato's actual development become impossible to introduce.

---

## Stage 8 — Code Quality + PR

| | |
|---|---|
| **Role** | Developer + automated agents + human reviewer |
| **Model** | Haiku (spec compliance, PR description) · Sonnet (tech-lead-review) · Bugbot |
| **MCPs** | GitHub (open PR, add reviewers), Jira (→ In Review), Slack (notify) |
| **Cursor artifacts** | `bugbot.json` (ADR-derived patterns) · `spec-compliance-check` skill · `create-pr` skill |

**Automated review stack — in order before human eyes:**

```
1. pre-commit hook          ← lint + type errors at commit time
2. spec-compliance-check    ← diff validated against every Jira AC
3. Bugbot                   ← project-specific patterns from ADRs
4. tech-lead-review skill   ← diff vs architecture decisions
5. design-review skill      ← components vs Figma spec
```

**Bugbot config is generated from the ADRs**, not generic lint rules:
- Direct `localStorage` calls (bypasses idb-keyval) → warning
- `Date.now()` / `toLocaleString()` in JSX without `suppressHydrationWarning` → error
- dnd-kit draggable without mounting guard → error
- Hardcoded hex colors outside constants → warning

---

## Stage 9 — Desk Check + QA Test Plan

| | |
|---|---|
| **Role** | QA Lead + all stakeholders |
| **Model** | Claude Haiku |
| **MCPs** | Jira (read AC), Confluence (write test plan), GitHub (read diff), Slack (coordinate) |
| **Cursor artifacts** | `qa-test-plan` skill · `desk-check` skill |

**Prompt pattern:**
```
You are a QA lead testing a feature built by someone else.
Generate test cases: HAPPY PATH, EDGE CASES, REGRESSION, ACCESSIBILITY.
For each: ID, steps, expected result, AC validated.
Be thorough about edge cases developers skip because they wrote the happy path first.
Ticket AC: [Jira MCP] | PR diff: [GitHub MCP]
```

Full test plan for ROT-006 → [Appendix F](./06-qa-test-plan.md)

---

## Stage 10 — UAT + Production

| | |
|---|---|
| **MCPs** | GitHub (merge, release tag), Jira (close ticket), Confluence (update living docs), Slack (ship) |
| **Cursor artifacts** | `update-adr` skill (compares merged diff against ADRs, drafts superseding entries) |

`update-adr` runs post-merge: GitHub MCP reads the final diff, Confluence MCP reads all ADRs, AI flags where code diverged. Architecture docs stay current automatically — no manual maintenance.

---

## Mapping to the Hackathon Epic

**Spec-to-Data Pipelines** — *natural language specifications automatically translated into validated, production-ready data schemas and pipelines.*

Every stage is a pipeline transformation: structured spec data in, validated artifact out, feeding the next stage. The "data" is the specification itself — flowing from natural language through increasingly precise representations until it becomes running code and executable enforcement tooling.

```
Natural language problem statement
  → Structured PRD (validated by Red Team)
    → Design spec + Architecture + Feature TDDs (validated by Gate 2)
      → Tickets with acceptance criteria (PM + Tech Lead two-pass)
        → Implementation TDD (validated by Dead Reckoning + Tech Lead)
          → Code (enforced by rules + hooks during generation)
            → Confidence-annotated PR (validated by 5-gate automated review)
              → Production + Living ADRs (closes the feedback loop)
```

The three experiment ideas each address a specific, expensive gap in the pipeline:

| Experiment | Plain English | Stage | Cost if skipped |
|---|---|---|---|
| **Red Team My Spec** | An AI plays adversarial auditor — reads the spec and finds every contradiction, missing edge case, and unstated assumption *before anyone builds on it* | 2 + Gate 2 | Architecture designed on false assumptions; discovered in QA or production |
| **Dead Reckoning** | Before writing any code, an AI reads the ticket and lists every implementation decision the spec doesn't answer. High-stakes ones block progress until a human resolves them | 6 | Developer makes silent assumptions that become undocumented decisions, then bugs, then tribal knowledge |
| **Confidence Map** | Every architectural and implementation decision is annotated GREEN (explicitly spec'd), AMBER (reasonable default), or RED (assumed without spec backing). RED items tell reviewers exactly where to focus | 4 + 8 | No traceability from spec to code; bugs hide in the assumption-heavy zones; reviewers have to guess where the risks are |

These aren't the innovation. They're examples of what becomes possible when AI removes the overhead that made spec discipline impractical. The innovation is the closed loop — **a workflow where specs enforce themselves, update themselves, and compound across sprints.**

---

## The Compounding Effect

Each sprint closes friction points that were open in the previous one.

```
Sprint 1: hydration bug found in PR review
  → ADR-006 created, added to architecture.mdc
  → Bugbot config updated with hydration pattern
Sprint 2: hydration bug is impossible to introduce
  → same class of issue cannot recur

Sprint 1: Dead Reckoning surfaces formStyle persistence ambiguity
  → PM resolves it, recorded in Implementation TDD
Sprint 2: that decision is in architecture.mdc
  → future developers don't face the same ambiguity

Sprint N: .cursor/ folder contains accumulated spec wisdom
  → Dead Reckoning sessions are shorter (less to surface)
  → Code review is faster (more automated gates)
  → Onboarding is cheaper (rules explain every constraint)
```

The `.cursor/` folder is not config. It's the workflow's output in executable form — specs compiled into enforcement.

After Sprint 1: 13 skills, 3 rules, hooks, Bugbot, 5 MCPs active. Each subsequent sprint starts with all of it in place.

---

## Appendices

| | |
|---|---|
| [A — PRD](./01-prd.md) | Product Requirements Document |
| [B — Design Spec](./02-design-spec.md) | Color system, typography, component inventory |
| [C — Architecture](./03-architecture.md) | ADRs, Confidence Map, Feature TDD + Implementation TDD formats |
| [D — Tickets](./04-tickets.md) | ROT-001 through ROT-006 with full AC and technical notes |
| [E — Implementation Plan](./05-implementation-plan.md) | ROT-006: Feature TDD → Dead Reckoning → Implementation TDD → impl plan |
| [F — QA Test Plan](./06-qa-test-plan.md) | 30 test cases for ROT-006 |
| [G — MCP Integrations](./07-mcp-integrations.md) | Per-MCP operation lists, prompts, `.cursor/mcp.json` |
| [H — Cursor Artifacts](./08-cursor-artifacts.md) | Full `.cursor/` catalogue with file contents |
