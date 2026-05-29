# Appendix G — MCP Integration Map

**What this document covers:** the five MCP servers used in the ASDD workflow, the specific operations called at each stage, role-scoped prompt examples, and the `.cursor/mcp.json` configuration.

---

## What is an MCP?

MCPs (Model Context Protocol servers) are standardized adapters that give an AI agent live, bidirectional access to an external tool. Instead of copy-pasting a Jira ticket into a chat window, the agent reads it directly via `get_issue` and writes results back via `update_issue`.

This is what makes the ASDD chain **self-closing**: specs flow in, artifacts flow out, and every tool — Jira, Confluence, Figma, GitHub, Slack — stays in sync with the workflow without human copy-paste. The AI doesn't work in isolation; it works in your actual team environment.

---

## MCP Catalogue

### Confluence MCP

**What it enables:** Read and write Confluence pages from any agent in the workflow. Keeps documentation as the living source of truth — automatically written by AI, not manually maintained.

**Operations used:**
- `get_page` — read a page by ID or title
- `create_page` — create a new page in a space
- `update_page` — update existing page content
- `search_pages` — find pages by keyword or label
- `add_comment` — add review comment to a page

**Active at stages:** 1 (read research), 2 (write PRD), 3 (write design spec), 4 (write ADRs), 6 (write TDD), 9 (write test plan), 10 (update living ADRs)

**Example prompts by role:**

*PM — reading existing research before drafting PRD:*
```
Read the Rotato discovery notes from Confluence and extract:
1. Key user pain points (bulleted)
2. Any existing constraints or requirements mentioned
3. Stakeholder names and their stated priorities

Notes page: [Confluence MCP: get_page "Rotato Discovery Notes"]
```

*Tech Lead — writing an ADR:*
```
Based on the following architectural decision, write an ADR in Nygard format
(Status, Context, Decision, Consequences) and create it as a new Confluence page
in the ROT-ARCH space.

Decision: Use React Context + useReducer instead of Zustand for global state
Context: [tech lead notes]
[Confluence MCP: create_page space="ROT-ARCH" title="ADR-002: State Management"]
```

*QA Lead — writing test plan:*
```
Read the acceptance criteria from Jira ROT-006 and the PR diff below.
Generate a structured QA test plan (Happy Path, Edge Cases, Regression, Accessibility).
Create it as a new Confluence page in the ROT-QA space.
[Jira MCP: get_issue ROT-006] | [Confluence MCP: create_page space="ROT-QA" title="Test Plan: ROT-006"]
```

---

### Jira MCP

**What it enables:** Create, read, update, and transition Jira issues programmatically. The ticket is the handoff document — AI creates it, AI reads it, AI closes it.

**Operations used:**
- `create_issue` — create epic, story, or task
- `get_issue` — read issue details including AC
- `update_issue` — add story points, technical notes, labels
- `transition_issue` — move through workflow states (To Do → In Progress → In Review → Done)
- `search_issues` — find issues by JQL
- `add_comment` — leave AI-generated notes on issues
- `link_issue` — link PR to ticket

**Active at stages:** 1 (create epic), 5 (create + update tickets), 6 (read ticket, update to In Progress), 8 (link PR, transition to In Review), 10 (close ticket, update epic)

**Example prompts by role:**

*PM — creating tickets (Pass 1):*
```
You are a PM drafting vertical-slice feature tickets from a validated PRD.
For each feature listed below, create a Jira issue under epic ROT-EPIC-001 with:
- User-facing title and description
- Acceptance criteria in given/when/then format
- Priority (P0/P1/P2)
- Link to the PRD section it implements

Do not add story points or technical notes — that is a separate pass.

PRD features: [Confluence MCP: get_page ROT-PRD-001, section "Feature List"]
[Jira MCP: create_issue × 6 under ROT-EPIC-001]
```

*Tech Lead — reviewing tickets (Pass 2):*
```
You are a Tech Lead reviewing PM-drafted tickets before sprint planning.
For each ticket in the ROT sprint backlog, add:
- Story point estimate (1, 2, 3, 5, 8, 13)
- Technical dependencies (other ticket IDs that must complete first)
- Technical notes: which ADRs apply, implementation constraints, gotchas
Flag any ACs that are ambiguous, untestable, or technically infeasible.
Return flagged ACs as comments on the ticket for PM to resolve.

Tickets: [Jira MCP: search_issues "project=ROT AND sprint='Sprint 1'"]
Architecture doc: [Confluence MCP: get_page ROT-ARCH-001]
```

*Developer — reading ticket before Dead Reckoning:*
```
Read Jira ticket ROT-006 in full, including all acceptance criteria, story points,
technical notes, and comments. List every implementation decision the ticket
requires that is NOT answered by the specification.
[Jira MCP: get_issue ROT-006]
```

---

### Figma MCP

**What it enables:** Read Figma file structure, extract design tokens (colors, typography, spacing), and read component annotations. Connects the visual spec to the code without manual token extraction.

**Operations used:**
- `get_file` — read the full Figma file structure
- `get_node` — read a specific frame or component
- `get_styles` — extract all defined color and text styles
- `get_components` — read all components in the file

**Active at stages:** 3 (extract design tokens → generate `design-system.mdc` rule), 6 (read component mockup during TDD), 7 (reference during development)

**Example prompts by role:**

*Designer — extracting design tokens into CSS:*
```
Read the Rotato Figma file and extract all color styles.
Format them as CSS custom properties matching the pattern in globals.css:
  --color-[name]: [hex];
Group by: background colors, text colors, accent colors, shadow values.
[Figma MCP: get_styles file="rotato-design-system"]
```

*Developer — reading component spec during TDD:*
```
Read the "Form Style Switcher" frame in the Rotato Figma file.
Describe the layout, dimensions, spacing, and visual treatment of:
1. The style picker row in the modal header
2. The Live Preview split layout
3. The Envelope form's visual components (flap, seal, stamps)
[Figma MCP: get_node file="rotato" node="Form Style Switcher"]
```

*CI — design review skill:*
```
Compare the following React component implementation against the Figma component spec.
Return a GREEN/AMBER/RED compliance report for: colors, typography, spacing, layout structure.
Component: [file contents]
Figma spec: [Figma MCP: get_node file="rotato" node="FormStylePicker"]
```

**Rotato note:** The Rotato color system (`--color-cream`, `--color-terracotta`, `--color-sage`, etc. in `src/app/globals.css`) is exactly what this MCP would have generated automatically from a Figma token file — if Figma had been set up before development. In the ASDD workflow, this extraction happens at Stage 3, seeding `globals.css` before a single component is built.

---

### GitHub MCP

**What it enables:** Full GitHub API access — branches, commits, PRs, reviews, releases. The code review and merge process becomes part of the AI workflow.

**Operations used:**
- `create_branch` — create feature branch
- `push_files` — push file changes
- `create_pull_request` — open PR with generated description
- `add_reviewers` — assign human reviewers
- `get_pull_request` — read PR details and diff
- `list_pull_request_files` — get changed files for spec compliance check
- `add_label` — add labels (feature, bug, etc.)
- `merge_pull_request` — merge after approval
- `create_release` — tag a release
- `search_code` — find existing patterns in codebase

**Active at stages:** 4 (search existing patterns for architecture reference), 7 (create branch, push commits), 8 (open PR, add reviewers, run spec compliance), 9 (read diff for QA context), 10 (merge, release)

**Example prompts by role:**

*Tech Lead — pattern research during architecture:*
```
Search the Rotato codebase for all existing uses of React Context and useReducer.
List the files, describe the patterns used, and identify any inconsistencies.
[GitHub MCP: search_code query="useReducer" repo="evalieu/rotato"]
```

*Developer — creating PR:*
```
Create a pull request for branch feat/form-style-switcher targeting main.
Title: the ticket title from Jira ROT-006.
Body: generated from the ticket description, acceptance criteria, and the diff summary.
Include a "Confidence Map Summary" section listing the two AMBER decisions for reviewer attention.
Add labels: feature, form-ui.
Request review from @tech-lead.
[Jira MCP: get_issue ROT-006] | [GitHub MCP: create_pull_request]
```

*CI — spec compliance check:*
```
You are a spec compliance auditor in a CI pipeline.
Compare the PR diff against every acceptance criterion in Jira ROT-006.
Classify each AC: GREEN (satisfied), AMBER (partial — manual check needed), RED (not addressed).
If any RED items exist, output "SPEC-INCOMPLETE" and list the exact ACs missing.
[Jira MCP: get_issue ROT-006] | [GitHub MCP: list_pull_request_files PR=12]
```

---

### Slack MCP

**What it enables:** Post messages and DMs to Slack channels. Keeps the team informed at handoff points without anyone having to manually post updates.

**Operations used:**
- `post_message` — post to a channel
- `send_dm` — direct message a specific user

**Active at stages:** 2 (notify stakeholders PRD published), 5 (notify dev team sprint tickets ready), 8 (notify reviewers PR open), 10 (ship announcement)

**Example prompts by role:**

*Automated — PRD published notification:*
```
Post to #product-rotato:
"📋 Rotato PRD v1.0 has been published to Confluence and is ready for review.
Red Team audit complete — 5 findings resolved.
Epic ROT-EPIC-001 created in Jira.
PRD: [link] | Epic: [link]"
[Slack MCP: post_message channel="#product-rotato"]
```

*Automated — PR ready for review:*
```
Post to #dev-rotato:
"🔀 PR #12 ready for review — Form Style Switcher (ROT-006)
Adds 6 interchangeable form layouts with persistent style preference.
Passed: spec compliance ✓ | Bugbot ✓ | tech-lead-review ✓ | design-review ✓
[PR link] | [Jira ticket link]"
[Slack MCP: post_message channel="#dev-rotato"]
```

*Automated — ship announcement:*
```
Post to #releases:
"🚀 Rotato v1.1.0 shipped to production.
✨ Form Style Switcher — 6 new ways to add a project (ROT-006)
Deploy: Vercel auto-deploy from main | Release tag: v1.1.0"
[Slack MCP: post_message channel="#releases"]
```

---

## The Closed Loop: ROT-006 end-to-end

Narrative of every MCP call in sequence for the Form Style Switcher feature:

| Step | Agent action | MCP call |
|---|---|---|
| 1 | Dead Reckoning reads ticket | `Jira: get_issue ROT-006` |
| 2 | Dead Reckoning reads architecture doc | `Confluence: get_page ROT-ARCH-001` |
| 3 | Dead Reckoning reads design spec | `Confluence: get_page ROT-DESIGN-001` |
| 4 | Dead Reckoning reads existing patterns | `GitHub: search_code "FormStyle"` |
| 5 | TDD draft writes to Confluence | `Confluence: create_page "TDD: ROT-006"` |
| 6 | Jira updated to In Progress | `Jira: transition_issue ROT-006 → "In Progress"` |
| 7 | Developer references Figma mockup | `Figma: get_node "Form Style Switcher"` |
| 8 | Feature branch created | `GitHub: create_branch feat/form-style-switcher` |
| 9 | Commits pushed | `GitHub: push_files` |
| 10 | Spec compliance CI check | `Jira: get_issue ROT-006` + `GitHub: list_pull_request_files PR=12` |
| 11 | PR opened with generated description | `GitHub: create_pull_request` |
| 12 | PR linked to Jira | `Jira: add_comment ROT-006 "PR #12 opened"` |
| 13 | Reviewers notified | `Slack: post_message #dev-rotato` |
| 14 | Jira transitioned to In Review | `Jira: transition_issue ROT-006 → "In Review"` |
| 15 | PR merged | `GitHub: merge_pull_request PR=12` |
| 16 | Release tag created | `GitHub: create_release tag=v1.1.0` |
| 17 | Jira ticket closed | `Jira: transition_issue ROT-006 → "Done"` |
| 18 | ADRs updated | `Confluence: update_page ROT-ARCH-001` |
| 19 | Ship announcement | `Slack: post_message #releases` |

Zero copy-paste between tools. The agent has live access to every tool at every step.

---

## `.cursor/mcp.json` Configuration

```json
{
  "mcpServers": {
    "confluence": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-confluence"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "your-email@domain.com",
        "CONFLUENCE_API_TOKEN": "${CONFLUENCE_API_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-jira"],
      "env": {
        "JIRA_BASE_URL": "https://your-domain.atlassian.net",
        "JIRA_USERNAME": "your-email@domain.com",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "your-team-id"
      }
    }
  }
}
```

Store secrets in environment variables, not in the JSON file. Add `CONFLUENCE_API_TOKEN`, `JIRA_API_TOKEN`, `FIGMA_ACCESS_TOKEN`, `GITHUB_TOKEN`, and `SLACK_BOT_TOKEN` to your `.env.local` (never commit this file).
