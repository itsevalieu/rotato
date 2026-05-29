# Using the Starter Kit Outside Cursor

The skills and rules in this kit work with any AI — Cursor just handles the invocation automatically. Outside Cursor, you inject context manually. The prompts are identical either way.

---

## Cursor vs. Claude — what maps to what

| Cursor | Claude equivalent |
|---|---|
| `.cursor/rules/*.mdc` (auto-injected by glob) | Claude.ai Project instructions, or system prompt in the API |
| `.cursor/skills/*/SKILL.md` (invoked by name) | Copy the prompt from the skill file and paste it into the chat |
| Cursor reading files in context | Attach files in Claude.ai, or pass content in the API message |

---

## Option A: Claude.ai Projects (recommended for individuals)

Claude.ai Projects give every chat in the project the same persistent context — equivalent to Cursor rules always being active.

**Setup (one time per project):**

1. Create a new Project in Claude.ai and name it after your repository
2. Open `claude/project-instructions.md` from this starter kit
3. Replace the `[PLACEHOLDER]` sections with your project's rules (filled in after Stage 3 and Stage 4)
4. Paste the entire file into the project's **Custom Instructions** field
5. Upload your key spec docs (PRD, architecture doc) as **Project Knowledge** — Claude will reference them automatically

**Running a skill:**

1. Open `SETUP.md` and find the stage you're in
2. Copy the prompt for that stage
3. Paste it into a new chat in the Project
4. Claude already has your rules as context — you only need to paste the doc it's working on

**Example — running Dead Reckoning:**

Open `.cursor/skills/dead-reckoning/SKILL.md`, copy the prompt block, paste it into the Project chat and append:

```
Ticket: [paste ROT-006]
PRD: [paste or "see project knowledge"]
Architecture: [paste or "see project knowledge"]
```

---

## Option B: Claude API (for automation and CI)

Use `claude/run_skill.py` to run any skill programmatically. Useful for:
- Running spec-compliance-check in CI before a PR opens
- Automating the post-merge ADR update check
- Batch-running Dead Reckoning across a sprint's tickets

**Setup:**

```bash
pip install anthropic
export ANTHROPIC_API_KEY=your_key_here
```

**Run a skill:**

```bash
# Dead Reckoning on a ticket
python claude/run_skill.py dead-reckoning \
  --input "$(cat docs/workspace/jira/ROT-006.md)" \
  --rules architecture design-system

# Spec compliance check on a PR diff
python claude/run_skill.py spec-compliance-check \
  --input "$(cat docs/workspace/jira/ROT-006.md)" \
  --append "$(git diff main...HEAD)"

# Post-merge ADR update
python claude/run_skill.py update-adr \
  --input "$(git diff HEAD~1..HEAD)" \
  --rules architecture
```

**Use in CI (GitHub Actions):**

```yaml
- name: Spec compliance check
  run: |
    python .cursor/skills/../../../docs/spec-driven/starter-kit/claude/run_skill.py \
      spec-compliance-check \
      --input "$(cat docs/workspace/jira/$TICKET_ID.md)" \
      --append "$(git diff origin/main...HEAD)" \
      --fail-on RED
```

---

## Option C: Single Claude.ai chat (no setup)

For occasional use without a Project:

1. Start a chat in Claude.ai
2. Paste this at the top once, at the start of the conversation:

```
I'm working on [PROJECT_NAME]. Here are the rules that apply to all code in this project:

[paste contents of .cursor/rules/architecture.mdc]
[paste contents of .cursor/rules/design-system.mdc]

Keep these constraints in mind for everything in this conversation.
```

3. Then run skills by copying their prompt from `SETUP.md` and pasting into the same chat

---

## Which option to use

| Situation | Best option |
|---|---|
| Solo dev, using Claude.ai daily | **Projects** — set it up once, rules always active |
| Team, want automation in CI | **API + run_skill.py** |
| Quick one-off audit of an existing spec | **Single chat** — paste rules once, run skill |
| Using Cursor as primary IDE | **Cursor** — rules + skills work automatically |
| Using both Cursor and Claude | **Both** — keep `.cursor/` in the repo, set up a Claude Project too |
