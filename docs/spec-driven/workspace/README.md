# Workspace Artifacts

This folder contains mock artifacts representing what each external tool would have held if the full ASDD workflow had been in place from day one.

Every file in here was AI-generated from the same source specs, following the workflow in `../README.md`.

```
workspace/
├── jira/            ← Jira tickets as they would appear in the board
│   ├── EPIC-001.md  ← The root epic
│   └── ROT-001 through ROT-006
├── confluence/      ← Confluence pages in the order they were written
│   ├── adrs/        ← One file per Architecture Decision Record
│   ├── tdds/        ← Feature TDD + Implementation TDD for ROT-006
│   └── qa/          ← QA test plan + desk check for ROT-006
└── github/          ← PR descriptions as they would appear on GitHub
    └── PR-001 through PR-006 (with spec compliance + Bugbot results)
```

The PRD, design spec, architecture overview, and QA test plan are in the appendix files one level up — these workspace files focus on the tool-specific format and the artifacts that don't have a home in the appendices (individual ADRs, individual Jira tickets, individual PR descriptions).
