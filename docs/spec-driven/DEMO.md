# Demo One-Pager: AI-Assisted Spec-Driven Development

---

## The Problem (30 seconds)

Spec-driven development works. Teams abandon it because the overhead is too high to sustain.

> "The gap between what a PM says and what ships is where projects fail — not because developers are bad, but because the spec never made it out of someone's head."

**The five friction points every team hits:**
1. **Intent decay** — PM → Designer → Dev → QA is a telephone game
2. **Late discovery tax** — bugs found in QA cost 10×; in production, 100×
3. **Assumption invisibility** — developer decisions made silently, never documented
4. **Context collapse** — developer has a ticket; the PRD and architecture are somewhere else
5. **Stale spec drift** — specs written once, immediately diverge from the code

**This submission:** AI removes the overhead. Full spec discipline at startup velocity. ~$1.48 per feature.

---

## The Workflow

```
PROBLEM STATEMENT  ──►  PRD  ──►  [ADVERSARIAL AUDIT]  ──►  Validated PRD
                                   AI finds gaps before
                                   anyone builds on them

          ┌──────────────────────────────────────────┐
          │  PARALLEL                                │
          │  Design Spec          Architecture       │
          │  + rules              + ADRs             │
          │  + Figma tokens       + Feature TDDs     │
          └──────────────────────┬───────────────────┘
                                 │
                         [GATE 2 AUDIT]
                    Design + Arch vs PRD
                                 │
                        Tickets (PM + Tech Lead)
                     Pass 1: PM writes ACs
                     Pass 2: Tech Lead adds tech notes
                             informed by Feature TDDs
                                 │
                    ┌────────────┤  parallel per ticket
                    │            │
              [PRE-CODE AUDIT]   │
              AI reads ticket,   │
              surfaces every     │
              undecided question │
              before coding      │
              HIGH STAKES → STOP │
              get human answer   │
                    │            │
              Implementation TDD │
              (all assumptions   │
               documented)       │
                    │
                  CODE
          (rules + hooks active
           during generation)
                    │
          ┌─────────────────────┐
          │  5-GATE AUTO REVIEW │
          │  1. Spec compliance │  diff vs ticket AC
          │  2. Bugbot          │  ADR-derived patterns
          │  3. Tech lead skill │  diff vs architecture
          │  4. Design review   │  vs Figma spec
          │  5. Human review    │
          └─────────────────────┘
                    │
              QA test plan (AI-generated from AC)
                    │
              PRODUCTION
                    │
              [POST-MERGE]
              update-adr skill: architecture docs
              stay current automatically
```

---

## The Three Audit Agents

| Agent | What it does | When it runs | If you skip it |
|---|---|---|---|
| **Adversarial Spec Audit** ("Red Team") | Reads the spec as an attacker — finds contradictions, missing edge cases, unstated assumptions | Before architecture (Gate 1) and before ticketing (Gate 2) | Architecture built on false assumptions discovered in QA |
| **Pre-Code Ambiguity Check** ("Dead Reckoning") | Lists every decision the ticket doesn't answer. High-stakes ones block until a human resolves them | Before any code is written | Developer makes silent choices → undocumented assumptions → bugs → tribal knowledge |
| **Confidence Map** | Annotates every decision: 🟢 explicitly spec'd · 🟡 reasonable default · 🔴 assumed without spec backing | Architecture + PR review | No traceability; reviewers guess where the risks are |

---

## The .cursor/ Folder: Specs as Executable Enforcement

Each stage generates Cursor artifacts *from* the specs — not manually authored.

```
Spec stage          →  Cursor artifact generated         →  What it enforces
─────────────────────────────────────────────────────────────────────────
PRD (Stage 2)       →  red-team-spec skill               →  reusable audit on any future spec
Design (Stage 3)    →  design-system.mdc rule            →  no red colors, palette tokens only,
                                                            typography rules — in every AI session
Architecture (S4)   →  architecture.mdc rule             →  use Context not Zustand, idb-keyval
                                                            not localStorage, hydration guards
Architecture (S4)   →  feature-tdd skill                 →  Tech Lead writes TDD before tickets
Tickets (Stage 5)   →  dead-reckoning skill              →  developer runs before every ticket
Pre-code (Stage 6)  →  impl-tdd + impl-plan skills       →  documents all decisions, generates plan
Development (S7)    →  hooks.json                        →  lint + type-check on every commit
PR (Stage 8)        →  bugbot.json                       →  ADR-derived bug patterns on every PR
PR (Stage 8)        →  spec-compliance-check skill       →  CI: diff validated vs ticket AC
QA (Stage 9)        →  qa-test-plan + desk-check skills  →  test plan from AC, role checklists
Post-merge (S10)    →  update-adr skill                  →  architecture docs stay current
```

**Sprint 2 starts with all of this active.** Each sprint is cheaper than the last because the previous sprint generated the enforcement layer.

---

## The Feedback Loops

```
                 ┌─────────────────────────────────┐
                 │                                 │
   Spec gap  ──► Adversarial Audit ──► Spec fixed  │
                                       before build │
                                                    │
   Ambiguity ──► Pre-code check ──► Human resolves │
   in ticket      blocks dev        before code     │
                                                    │
   Code drifts ► Spec compliance ──► Caught at PR  │
   from AC        check (CI)         not in QA      │
                                                    │
   Code drifts ► Post-merge ADR ──► Docs current   │
   from arch      update skill       automatically  │
                                                    │
   Bug found  ──► Bugbot config ──► Can't recur    │
   in PR          + rule updated     next sprint ───┘
```

The last loop is the key one: **bugs feed back into the enforcement tooling**. The `.cursor/` folder accumulates the spec wisdom of every sprint. You cannot make the same class of mistake twice.

---

## Model Selection + Cost

| Task | Model | ~Cost |
|---|---|---|
| Adversarial spec audits (×2) | Claude Opus 4 | $0.70 |
| PRD, design spec, architecture drafting | Claude Sonnet 4 | $0.27 |
| Ticket creation, spec compliance, QA plan | Claude Haiku 3.5 | $0.04 |
| Code generation (Cursor) | Sonnet 4 | $0.30 |
| ADR updates, PR descriptions | Sonnet 4 / Haiku | $0.07 |
| Slack notifications | Any nano tier | ~$0 |
| **Total per feature** | | **~$1.48** |

Right model for the right task: Opus only where the downstream cost of a miss is highest.

---

## Demo Flow

**1. Open with the app** *(~1 min)*
Show Rotato — a real, shipped product. "This was built spec-first. Everything you see came from a documented spec that an AI helped write, audit, and enforce."

**2. Show the spec chain** *(~2 min)*
Open `docs/spec-driven/`. Walk through: PRD → Design spec → Architecture (show the Confidence Map table) → Tickets (show ROT-006) → Implementation plan (show the Dead Reckoning session — the STOP questions and resolutions).

**3. Show the adversarial audit in action** *(~1 min)*
Open `01-prd.md`, scroll to the Red Team Audit Log. "These five findings were surfaced by an AI before a single component was designed. RT-003 — 'local-first never scoped as permanent' — would have caused a major architecture refactor if discovered mid-sprint."

**4. Show the pre-code check** *(~1 min)*
Open `05-implementation-plan.md`, show the Dead Reckoning table. "Two STOP items. Both routed to PM and Designer. Both resolved before a single file was opened. Three downstream files depended on those answers."

**5. Show the enforcement layer** *(~1 min)*
Open `08-cursor-artifacts.md`. Show the folder structure. "These files weren't written by hand — they were generated by the workflow. `architecture.mdc` encodes the ADRs. `bugbot.json` encodes the RED items from the Confidence Map. The specs became the tools."

**6. Close with the loop** *(~30 sec)*
"Sprint 2 starts with all of this active. The bugs from Sprint 1 are in Bugbot. The decisions from Sprint 1 are in the rules. The same class of mistake cannot recur. That's the compounding effect — and that's why this costs $1.48 per feature instead of a week of rework."

---

## Key Numbers for the Demo

- **$1.48** — total AI inference cost per complete feature, problem statement to production
- **5** — automated review gates before a human sees a PR
- **13** — Cursor skills generated in Sprint 1; active from Sprint 2 day one
- **3** — RED Confidence Map decisions in Rotato → 3 hydration bugs in production (direct correlation)
- **2** — STOP items in the ROT-006 Dead Reckoning session; both involved 3+ downstream files
- **0** — hydration errors in production after ADR-006 and the architecture rule were in place
