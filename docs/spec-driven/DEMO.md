# Demo Script: AI-Assisted Spec-Driven Development

---

## The Problem *(30 sec)*

Spec-driven development works. Teams abandon it because the overhead is too high.

**Five friction points:**
1. **Intent decay** — PM → Designer → Dev → QA is a telephone game
2. **Late discovery tax** — bugs in QA cost 10×; in production, 100×
3. **Assumption invisibility** — developer decisions made silently, never documented
4. **Context collapse** — developer has a ticket; the PRD is somewhere else
5. **Stale spec drift** — specs written once, immediately diverge from code

**This submission:** AI removes the overhead. Full spec discipline at startup velocity. ~$1.48 per feature.

---

## The Workflow

```
Problem  →  PRD  →  [RED TEAM AUDIT]  →  Design + Architecture (parallel)
                                       →  [GATE 2 AUDIT]
                                       →  Tickets (PM pass + Tech Lead pass)
                                       →  [DEAD RECKONING per ticket]  →  Code
                                       →  [5-GATE AUTO REVIEW]         →  QA  →  Production
                                       →  [POST-MERGE ADR UPDATE]
```

**The three audit agents:**
- **Red Team** — reads the spec as an attacker; finds contradictions and gaps *before* anyone builds
- **Dead Reckoning** — lists every decision the ticket doesn't answer; HIGH STAKES items block until a human resolves them
- **Confidence Map** — annotates decisions: 🟢 spec'd · 🟡 default · 🔴 assumed; RED items become Bugbot rules

---

## Specs Become Enforcement Tools

Each stage generates a Cursor artifact from the spec — not hand-written.

| Stage | Generated artifact | Active from |
|---|---|---|
| PRD | `red-team-spec` skill | Sprint 1 |
| Design spec | `design-system.mdc` rule | Sprint 1 |
| Architecture + ADRs | `architecture.mdc` rule | Sprint 1 |
| Architecture | `feature-tdd` skill | Sprint 1 |
| Tickets | `dead-reckoning` skill | Sprint 1 |
| Pre-code | `impl-tdd` + `impl-plan` skills | Sprint 1 |
| Development | `hooks.json` (lint + typecheck) | Sprint 1 |
| PR | `bugbot.json` + `spec-compliance-check` | Sprint 1 |
| QA | `qa-test-plan` + `desk-check` skills | Sprint 1 |
| Post-merge | `update-adr` skill | Sprint 1 |

**Sprint 2 starts with all 13 skills and 3 rules already active.** Bugs from Sprint 1 are in Bugbot. The same mistake cannot recur.

---

## The Feedback Loops

- **Spec gap** → Red Team audit → fixed before anyone builds
- **Ambiguous ticket** → Dead Reckoning blocks → human resolves → documented before code
- **Code drifts from spec** → spec-compliance check in CI → caught at PR, not in QA
- **Bug found in PR** → added to Bugbot + rule → cannot recur next sprint ← *this is the compounding effect*

---

## Model Selection + Cost

| Task | Model | ~Cost |
|---|---|---|
| Adversarial spec audits (×2) | Claude Opus 4 | $0.70 |
| PRD, design spec, architecture | Claude Sonnet 4 | $0.27 |
| Tickets, spec compliance, QA plan | Claude Haiku 3.5 | $0.04 |
| Code generation (Cursor) | Sonnet 4 | $0.30 |
| ADR updates, PR descriptions | Sonnet 4 / Haiku | $0.07 |
| Slack notifications | Any nano tier | ~$0 |
| **Total per feature** | | **~$1.48** |

---

## Demo Flow

**1. The app** *(~1 min)*
Show Rotato. "This was built spec-first. Everything you see came from a documented spec that AI helped write, audit, and enforce."

**2. The spec chain** *(~2 min)*
`docs/spec-driven/` → PRD → Design spec → Architecture (show Confidence Map table) → ROT-006 ticket → Implementation plan (show the Dead Reckoning STOP items and resolutions).

**3. The adversarial audit** *(~1 min)*
`01-prd.md` → Red Team Audit Log. "RT-003 — 'local-first never scoped as permanent' — would have caused a major architecture refactor if discovered mid-sprint."

**4. The pre-code check** *(~1 min)*
`05-implementation-plan.md` → Dead Reckoning table. "Two STOP items, both routed to PM and Designer, both resolved before a file was opened."

**5. The enforcement layer** *(~1 min)*
`.cursor/` folder. "`architecture.mdc` encodes the ADRs. `bugbot.json` encodes the RED items from the Confidence Map. The specs became the tools."

**6. The loop** *(~30 sec)*
"Sprint 2 starts with all of this active. That's the compounding effect — and why this costs $1.48 per feature instead of a week of rework."

---

## Key Numbers

| | |
|---|---|
| **$1.48** | total AI cost per feature, problem statement to production |
| **5** | automated review gates before a human sees a PR |
| **13** | Cursor skills generated in Sprint 1; active Sprint 2 day one |
| **3** | RED Confidence Map items → 3 hydration bugs (direct correlation) |
| **2** | Dead Reckoning STOP items for ROT-006; both touched 3+ files |
| **0** | hydration errors after ADR-006 + architecture rule in place |
