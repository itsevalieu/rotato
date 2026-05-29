#!/usr/bin/env python3
"""
run_skill.py — Run any ASDD skill against the Anthropic API.

Usage:
  python run_skill.py <skill-name> --input <text or file> [options]

Examples:
  # Dead Reckoning on a ticket file
  python run_skill.py dead-reckoning --input docs/workspace/jira/ROT-006.md --rules architecture

  # Spec compliance check with a git diff appended
  python run_skill.py spec-compliance-check \\
    --input docs/workspace/jira/ROT-006.md \\
    --append-git-diff

  # Post-merge ADR update
  python run_skill.py update-adr --append-git-diff --rules architecture

  # Red Team audit on the PRD
  python run_skill.py red-team-spec --input docs/spec-driven/01-prd.md

  # CI mode — exit 1 if output contains RED items
  python run_skill.py spec-compliance-check --input ticket.md --fail-on RED
"""

import argparse
import os
import pathlib
import subprocess
import sys

try:
    import anthropic
except ImportError:
    print("Error: anthropic package not installed. Run: pip install anthropic")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Paths — relative to this script's location.
# Adjust SKILLS_DIR and RULES_DIR if you move the script.
# ---------------------------------------------------------------------------
SCRIPT_DIR = pathlib.Path(__file__).parent
KIT_DIR = SCRIPT_DIR.parent
SKILLS_DIR = KIT_DIR / ".cursor" / "skills"
RULES_DIR = KIT_DIR / ".cursor" / "rules"

# Model selection — matches the ASDD cost/quality guidelines
MODELS = {
    "red-team-spec":        "claude-opus-4-5",   # adversarial reasoning — high stakes
    "dead-reckoning":       "claude-opus-4-5",   # adversarial reasoning — high stakes
    "confidence-map":       "claude-sonnet-4-5", # analysis
    "feature-tdd":          "claude-sonnet-4-5", # generation + reasoning
    "impl-tdd":             "claude-sonnet-4-5", # generation + reasoning
    "impl-plan":            "claude-sonnet-4-5", # structured generation
    "tech-lead-review":     "claude-sonnet-4-5", # analysis
    "design-review":        "claude-sonnet-4-5", # analysis
    "spec-compliance-check":"claude-sonnet-4-5", # structured validation
    "create-pr":            "claude-sonnet-4-5", # generation
    "qa-test-plan":         "claude-haiku-4-5",  # template-driven — cheaper
    "desk-check":           "claude-haiku-4-5",  # template-driven — cheaper
    "update-adr":           "claude-haiku-4-5",  # template-driven — cheaper
}
DEFAULT_MODEL = "claude-sonnet-4-5"

RULE_FILE_MAP = {
    "architecture":    "architecture.mdc",
    "design-system":   "design-system.mdc",
    "design":          "design-system.mdc",
    "testing":         "testing-standards.mdc",
}


def load_skill(skill_name: str) -> str:
    skill_path = SKILLS_DIR / skill_name / "SKILL.md"
    if not skill_path.exists():
        # Also look in project's own .cursor/skills if run from a real repo
        alt = pathlib.Path(".cursor") / "skills" / skill_name / "SKILL.md"
        if alt.exists():
            skill_path = alt
        else:
            print(f"Error: skill '{skill_name}' not found at {skill_path}")
            sys.exit(1)
    content = skill_path.read_text()
    # Strip YAML frontmatter — only pass the prompt body to the model
    if content.startswith("---"):
        parts = content.split("---", 2)
        return parts[2].strip() if len(parts) >= 3 else content
    return content


def load_rule(rule_key: str) -> str:
    filename = RULE_FILE_MAP.get(rule_key, rule_key + ".mdc")
    rule_path = RULES_DIR / filename
    if not rule_path.exists():
        alt = pathlib.Path(".cursor") / "rules" / filename
        if alt.exists():
            rule_path = alt
        else:
            print(f"Warning: rule file '{filename}' not found — skipping")
            return ""
    content = rule_path.read_text()
    # Strip YAML frontmatter
    if content.startswith("---"):
        parts = content.split("---", 2)
        return parts[2].strip() if len(parts) >= 3 else content
    return content


def load_input(input_arg: str | None) -> str:
    if not input_arg:
        return ""
    p = pathlib.Path(input_arg)
    if p.exists():
        return p.read_text()
    return input_arg  # treat as raw text


def get_git_diff() -> str:
    try:
        result = subprocess.run(
            ["git", "diff", "origin/main...HEAD"],
            capture_output=True, text=True, check=True
        )
        diff = result.stdout.strip()
        if not diff:
            # Fall back to last commit if no branch diff
            result = subprocess.run(
                ["git", "diff", "HEAD~1..HEAD"],
                capture_output=True, text=True, check=True
            )
            diff = result.stdout.strip()
        return diff or "(no git diff found)"
    except subprocess.CalledProcessError:
        return "(git diff unavailable)"


def run_skill(
    skill_name: str,
    user_input: str,
    rules: list[str],
    model: str,
    max_tokens: int = 4096,
) -> str:
    skill_prompt = load_skill(skill_name)

    rule_blocks = [load_rule(r) for r in rules if r]
    rule_blocks = [b for b in rule_blocks if b]

    system_parts = []
    if rule_blocks:
        system_parts.append("# Project rules (apply to all output)\n\n" + "\n\n---\n\n".join(rule_blocks))
    system_parts.append("# Skill instructions\n\n" + skill_prompt)
    system = "\n\n" + "=" * 60 + "\n\n".join(system_parts)

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_input}],
    )
    return response.content[0].text


def main():
    parser = argparse.ArgumentParser(
        description="Run an ASDD skill against the Anthropic API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("skill", help="Skill name (e.g. dead-reckoning, spec-compliance-check)")
    parser.add_argument("--input", "-i", help="Path to input file or raw text string")
    parser.add_argument("--append", "-a", help="Additional text to append to the input (raw string)")
    parser.add_argument("--append-file", help="Path to a file whose content is appended to the input")
    parser.add_argument("--append-git-diff", action="store_true", help="Append the current git diff to the input")
    parser.add_argument(
        "--rules", "-r", nargs="*", default=[],
        help="Rule names to include as context (e.g. architecture design-system)"
    )
    parser.add_argument("--model", "-m", help="Override model (default: auto-selected per skill)")
    parser.add_argument("--max-tokens", type=int, default=4096)
    parser.add_argument(
        "--fail-on", metavar="KEYWORD",
        help="Exit code 1 if the output contains this keyword (e.g. RED). Useful in CI."
    )
    parser.add_argument("--output", "-o", help="Write output to this file instead of stdout")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    # Build the user message
    parts = []
    if args.input:
        parts.append(load_input(args.input))
    if args.append:
        parts.append(args.append)
    if args.append_file:
        parts.append(pathlib.Path(args.append_file).read_text())
    if args.append_git_diff:
        diff = get_git_diff()
        parts.append(f"\n## Git diff\n\n```\n{diff}\n```")

    user_input = "\n\n".join(p for p in parts if p).strip()
    if not user_input:
        print("Error: no input provided. Use --input or --append.")
        sys.exit(1)

    model = args.model or MODELS.get(args.skill, DEFAULT_MODEL)

    print(f"Running skill: {args.skill}", file=sys.stderr)
    print(f"Model: {model}", file=sys.stderr)
    if args.rules:
        print(f"Rules: {', '.join(args.rules)}", file=sys.stderr)
    print(file=sys.stderr)

    result = run_skill(args.skill, user_input, args.rules, model, args.max_tokens)

    if args.output:
        pathlib.Path(args.output).write_text(result)
        print(f"Output written to {args.output}", file=sys.stderr)
    else:
        print(result)

    if args.fail_on and args.fail_on in result:
        print(f"\nCI check failed: output contains '{args.fail_on}'", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
