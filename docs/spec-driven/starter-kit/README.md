# ASDD Starter Kit
### AI-Assisted Spec-Driven Development

A portable template to bootstrap the ASDD workflow on any project. Works with **Cursor** (automatic) or **Claude** (manual, via Claude.ai Projects or the API). Copy the contents of this folder into a new repository and follow `SETUP.md`.

**Using Claude instead of Cursor?** → See [`claude/USAGE.md`](claude/USAGE.md)

---

## What you get

```
starter-kit/
├── SETUP.md              ← Stage-by-stage guide with copy-paste prompts
├── claude/               ← Everything needed to use this kit outside Cursor
│   ├── USAGE.md          ← How to use with Claude.ai Projects or the API
│   ├── project-instructions.md  ← Ready-to-paste Claude Project template
│   └── run_skill.py      ← Python script to run any skill via the Anthropic API
├── templates/            ← Blank document scaffolds for each stage
│   ├── 01-prd.md
│   ├── 02-design-spec.md
│   ├── 03-architecture.md
│   ├── 04-tickets.md
│   ├── 05-implementation-plan.md
│   ├── 06-qa-test-plan.md
│   └── 07-mcp-integrations.md
└── .cursor/
    ├── rules/            ← Three generic Cursor rules (fill in project specifics)
    │   ├── design-system.mdc
    │   ├── architecture.mdc
    │   └── testing-standards.mdc
    └── skills/           ← 13 workflow skills (ready to use as-is)
        ├── red-team-spec/
        ├── confidence-map/
        ├── dead-reckoning/
        ├── feature-tdd/
        ├── impl-tdd/
        ├── impl-plan/
        ├── tech-lead-review/
        ├── design-review/
        ├── spec-compliance-check/
        ├── qa-test-plan/
        ├── desk-check/
        ├── create-pr/
        └── update-adr/
```

---

## How to use

### New project from scratch

1. Copy `starter-kit/` contents into your repo root
2. Open `SETUP.md` and follow Stage 1 → Stage 10
3. Fill in the `[PROJECT_NAME]` and `[TECH_STACK]` placeholders as you go
4. The rules and skills work immediately — populate them after Stage 4

### Adding to an existing project

1. Copy `.cursor/` into your project root
2. Use `SETUP.md` as a reference for which prompts to run and when
3. The `red-team-spec` skill is useful even mid-project — run it on any existing spec doc to find gaps

---

## Skills that are context-free (work on any project immediately)

These skills read whatever you give them — no project-specific configuration needed:

| Skill | When to use |
|---|---|
| `red-team-spec` | Any time you have a spec doc to audit |
| `dead-reckoning` | Before starting any ticket |
| `confidence-map` | After writing architecture or an ADR |
| `spec-compliance-check` | Before opening a PR |
| `qa-test-plan` | When a ticket is ready for QA |
| `create-pr` | When opening a PR |

## Skills that need project context first

These work best after Stage 4, once you have ADRs and a design spec:

| Skill | What to add |
|---|---|
| `tech-lead-review` | Update with your ADR list |
| `design-review` | Update with your design tokens and constraints |
| `feature-tdd` | Update with your stack and patterns |
| `impl-tdd` | Update with your architectural conventions |

---

---

## Using with Claude (without Cursor)

| What you want | What to do |
|---|---|
| Rules always active in Claude.ai | Create a Claude.ai Project, paste `claude/project-instructions.md` into custom instructions |
| Run a skill in Claude.ai | Copy the prompt from `SETUP.md` and paste it into the Project chat |
| Automate skills in CI | Run `python claude/run_skill.py <skill-name> --input <file> --fail-on RED` |
| Upload docs to Claude | Add PRD, architecture, and design spec as Project Knowledge files |
| Run fully local (Ollama / LM Studio) | `python claude/run_skill.py <skill> --provider ollama --model llama3.1:70b` |
| Privacy / air-gapped / cut API costs | Use local for template tasks, cloud for adversarial skills |

See [`claude/USAGE.md`](claude/USAGE.md) for the full walkthrough.

---

## Model selection cheat sheet

| Task | Model | Why |
|---|---|---|
| PRD draft, architecture | Claude Sonnet | Reasoning + generation balance |
| Red Team, Dead Reckoning | Claude Opus | Adversarial reasoning, stakes are high |
| Ticket generation, test plans | Claude Haiku | Structured templates, lower stakes |
| PR descriptions | Claude Sonnet | Mix of reading + writing |
| ADR updates post-merge | Claude Haiku | Template-driven, predictable format |
