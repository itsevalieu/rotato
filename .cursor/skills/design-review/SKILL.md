---
name: design-review
description: Checks a React component implementation against the design spec and design-system.mdc rule. Returns GREEN/AMBER/RED compliance report. Use before opening a PR for any component with a Figma spec, or as part of the automated review stack.
disable-model-invocation: true
---

# Design Review

Compare a component implementation against the Rotato design spec and `design-system.mdc`.

## What it checks
- Colors: palette tokens vs hardcoded hex values
- Typography: Caveat for accent text only; Inter for body
- Animations: enter 200–300ms, exit 150ms; nothing under 150ms
- No red-family colors anywhere
- Accessibility: labels on all inputs, focus rings on all interactive elements, no color-only state indicators

## Output format

```
GREEN — matches spec
AMBER — acceptable deviation; note for desk check
RED   — violates design-system.mdc; must fix before merge
```

For RED items: state the specific rule violated and the required change.

## Prompt to use

```
You are reviewing a React component against the Rotato design system rules.

Classify each aspect: GREEN (matches spec), AMBER (acceptable deviation), RED (violates rule).

Rules summary:
- No hardcoded hex colors — use CSS custom properties from globals.css
- No red-family colors (#FF..., #E5..., #DC... ranges)
- Caveat font for accent text only; Inter for everything else
- Enter animations 200-300ms ease-out; exit 150ms ease-in
- All inputs need <label>; all interactive elements need focus ring
- Color never sole state indicator

Component: [paste file contents]
Figma reference: [optional node URL or description]
```
