---
name: qa-test-plan
description: Generates a structured QA test plan from a ticket's acceptance criteria and PR diff. Four categories: happy path, edge cases, regression, accessibility. Use at Stage 9.
disable-model-invocation: true
---

# QA Test Plan Generator

Generate a complete test plan from a ticket's acceptance criteria and PR diff.

## What it produces

Test cases in four categories:
1. **Happy path** — one test per AC
2. **Edge cases** — empty state, boundary values, concurrent actions, error states
3. **Regression** — features the change could break
4. **Accessibility** — keyboard navigation, screen reader labels, color contrast

Each test case has: ID, AC validated, precondition, steps, expected result.

## How to use

```
You are a QA engineer generating a test plan.

Ticket: [paste ticket]
PR diff / implementation summary: [paste]

Generate test cases in four categories:
- Happy path (one test per AC, ID format: [TICKET]-HP-01)
- Edge cases ([TICKET]-EC-01)
- Regression ([TICKET]-REG-01)
- Accessibility ([TICKET]-A11Y-01)

For each test case:
- AC validated
- Precondition
- Steps (numbered)
- Expected result

Use the template at docs/templates/06-qa-test-plan.md.
```
