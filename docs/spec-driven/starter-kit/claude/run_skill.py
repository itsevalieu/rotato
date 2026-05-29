#!/usr/bin/env python3
"""
run_skill.py — Run any ASDD skill against Anthropic, OpenAI, or a local LLM.

Providers:
  anthropic      Anthropic API (default) — requires ANTHROPIC_API_KEY
  openai         OpenAI API — requires OPENAI_API_KEY
  ollama         Local Ollama server (http://localhost:11434/v1)
  lmstudio       Local LM Studio server (http://localhost:1234/v1)
  local          Any OpenAI-compatible endpoint — use --base-url to specify

Usage:
  python run_skill.py <skill-name> [options]

Examples:
  # Anthropic (default)
  python run_skill.py dead-reckoning --input ticket.md --rules architecture

  # Ollama with a local model
  python run_skill.py dead-reckoning --input ticket.md --provider ollama --model llama3.1:70b

  # LM Studio
  python run_skill.py spec-compliance-check --input ticket.md --provider lmstudio --model qwen2.5-72b

  # Any OpenAI-compatible endpoint
  python run_skill.py red-team-spec --input prd.md --provider local --base-url http://localhost:8080/v1 --model my-model

  # CI mode — exit 1 if output contains RED
  python run_skill.py spec-compliance-check --input ticket.md --append-git-diff --fail-on RED

  # Post-merge ADR update
  python run_skill.py update-adr --append-git-diff --rules architecture
"""

import argparse
import os
import pathlib
import subprocess
import sys

# ---------------------------------------------------------------------------
# Paths — relative to this script's location.
# Adjust SKILLS_DIR and RULES_DIR if you move the script.
# ---------------------------------------------------------------------------
SCRIPT_DIR = pathlib.Path(__file__).parent
KIT_DIR = SCRIPT_DIR.parent
SKILLS_DIR = KIT_DIR / ".cursor" / "skills"
RULES_DIR = KIT_DIR / ".cursor" / "rules"

# ---------------------------------------------------------------------------
# Provider configuration
# ---------------------------------------------------------------------------
PROVIDERS = {
    "anthropic": {
        "base_url": None,           # uses Anthropic SDK natively
        "api_key_env": "ANTHROPIC_API_KEY",
    },
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "api_key_env": "OPENAI_API_KEY",
    },
    "ollama": {
        "base_url": "http://localhost:11434/v1",
        "api_key_env": None,        # Ollama doesn't need a key
        "default_api_key": "ollama",
    },
    "lmstudio": {
        "base_url": "http://localhost:1234/v1",
        "api_key_env": None,
        "default_api_key": "lmstudio",
    },
    "local": {
        "base_url": None,           # must be set via --base-url
        "api_key_env": None,
        "default_api_key": "local",
    },
}

# Default models per skill for Anthropic — auto-selected by tier
ANTHROPIC_MODELS = {
    "red-team-spec":         "claude-opus-4-5",   # adversarial — high stakes
    "dead-reckoning":        "claude-opus-4-5",   # adversarial — high stakes
    "confidence-map":        "claude-sonnet-4-5",
    "feature-tdd":           "claude-sonnet-4-5",
    "impl-tdd":              "claude-sonnet-4-5",
    "impl-plan":             "claude-sonnet-4-5",
    "tech-lead-review":      "claude-sonnet-4-5",
    "design-review":         "claude-sonnet-4-5",
    "spec-compliance-check": "claude-sonnet-4-5",
    "create-pr":             "claude-sonnet-4-5",
    "qa-test-plan":          "claude-haiku-4-5",  # template-driven — cheaper
    "desk-check":            "claude-haiku-4-5",
    "update-adr":            "claude-haiku-4-5",
}

# Suggested local models by capability tier
# Swap in whatever you have pulled — these are good starting points
LOCAL_MODEL_SUGGESTIONS = {
    "high":     "llama3.1:70b",    # red-team-spec, dead-reckoning
    "medium":   "llama3.1:8b",     # most skills
    "low":      "llama3.2:3b",     # qa-test-plan, desk-check, update-adr
}

SKILL_TIERS = {
    "red-team-spec":         "high",
    "dead-reckoning":        "high",
    "confidence-map":        "medium",
    "feature-tdd":           "medium",
    "impl-tdd":              "medium",
    "impl-plan":             "medium",
    "tech-lead-review":      "medium",
    "design-review":         "medium",
    "spec-compliance-check": "medium",
    "create-pr":             "medium",
    "qa-test-plan":          "low",
    "desk-check":            "low",
    "update-adr":            "low",
}

RULE_FILE_MAP = {
    "architecture":  "architecture.mdc",
    "design-system": "design-system.mdc",
    "design":        "design-system.mdc",
    "testing":       "testing-standards.mdc",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_skill(skill_name: str) -> str:
    skill_path = SKILLS_DIR / skill_name / "SKILL.md"
    if not skill_path.exists():
        alt = pathlib.Path(".cursor") / "skills" / skill_name / "SKILL.md"
        if alt.exists():
            skill_path = alt
        else:
            print(f"Error: skill '{skill_name}' not found at {skill_path}")
            sys.exit(1)
    content = skill_path.read_text()
    # Strip YAML frontmatter — only the prompt body goes to the model
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
            print(f"Warning: rule file '{filename}' not found — skipping", file=sys.stderr)
            return ""
    content = rule_path.read_text()
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
    return input_arg


def get_git_diff() -> str:
    try:
        result = subprocess.run(
            ["git", "diff", "origin/main...HEAD"],
            capture_output=True, text=True, check=True
        )
        diff = result.stdout.strip()
        if not diff:
            result = subprocess.run(
                ["git", "diff", "HEAD~1..HEAD"],
                capture_output=True, text=True, check=True
            )
            diff = result.stdout.strip()
        return diff or "(no git diff found)"
    except subprocess.CalledProcessError:
        return "(git diff unavailable)"


def build_system_prompt(skill_name: str, rules: list[str]) -> str:
    skill_prompt = load_skill(skill_name)
    rule_blocks = [load_rule(r) for r in rules if r]
    rule_blocks = [b for b in rule_blocks if b]

    parts = []
    if rule_blocks:
        parts.append("# Project rules (apply to all output)\n\n" + "\n\n---\n\n".join(rule_blocks))
    parts.append("# Skill instructions\n\n" + skill_prompt)
    return ("\n\n" + "=" * 60 + "\n\n").join(parts)


# ---------------------------------------------------------------------------
# Provider-specific runners
# ---------------------------------------------------------------------------

def run_anthropic(system: str, user_input: str, model: str, max_tokens: int) -> str:
    try:
        import anthropic as anthropic_sdk
    except ImportError:
        print("Error: pip install anthropic")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    client = anthropic_sdk.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_input}],
    )
    return response.content[0].text


def run_openai_compatible(
    system: str,
    user_input: str,
    model: str,
    max_tokens: int,
    base_url: str,
    api_key: str,
) -> str:
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: pip install openai")
        sys.exit(1)

    client = OpenAI(base_url=base_url, api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_input},
        ],
    )
    return response.choices[0].message.content


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Run an ASDD skill against any AI provider",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("skill", help="Skill name (e.g. dead-reckoning, spec-compliance-check)")
    parser.add_argument("--input", "-i", help="Path to input file or raw text")
    parser.add_argument("--append", "-a", help="Text to append to the input")
    parser.add_argument("--append-file", help="File whose content is appended to the input")
    parser.add_argument("--append-git-diff", action="store_true", help="Append current git diff")
    parser.add_argument("--rules", "-r", nargs="*", default=[],
                        help="Rules to include as context (e.g. architecture design-system)")
    parser.add_argument(
        "--provider", "-p",
        choices=["anthropic", "openai", "ollama", "lmstudio", "local"],
        default="anthropic",
        help="AI provider (default: anthropic)",
    )
    parser.add_argument("--model", "-m",
                        help="Model name (default: auto-selected per skill and provider)")
    parser.add_argument("--base-url",
                        help="Base URL for OpenAI-compatible endpoint (required for --provider local)")
    parser.add_argument("--api-key",
                        help="API key (overrides env var; use any string for local providers)")
    parser.add_argument("--max-tokens", type=int, default=4096)
    parser.add_argument("--fail-on", metavar="KEYWORD",
                        help="Exit 1 if output contains this keyword (e.g. RED) — for CI")
    parser.add_argument("--output", "-o", help="Write output to file instead of stdout")
    parser.add_argument("--list-models", action="store_true",
                        help="Print suggested local models for this skill and exit")
    args = parser.parse_args()

    if args.list_models:
        tier = SKILL_TIERS.get(args.skill, "medium")
        print(f"Skill '{args.skill}' is tier: {tier}")
        print(f"Suggested local model: {LOCAL_MODEL_SUGGESTIONS[tier]}")
        print("\nAll tier suggestions:")
        for t, m in LOCAL_MODEL_SUGGESTIONS.items():
            print(f"  {t:8} → {m}")
        print("\nPull with Ollama: ollama pull <model>")
        return

    # Resolve model
    provider_cfg = PROVIDERS[args.provider]
    if args.model:
        model = args.model
    elif args.provider == "anthropic":
        model = ANTHROPIC_MODELS.get(args.skill, "claude-sonnet-4-5")
    else:
        tier = SKILL_TIERS.get(args.skill, "medium")
        model = LOCAL_MODEL_SUGGESTIONS[tier]
        print(f"Note: no --model specified. Using suggested model for tier '{tier}': {model}", file=sys.stderr)
        print("Override with --model <name>. Run --list-models to see suggestions.", file=sys.stderr)

    # Resolve base URL
    base_url = args.base_url or provider_cfg.get("base_url")
    if args.provider == "local" and not base_url:
        print("Error: --provider local requires --base-url (e.g. http://localhost:8080/v1)")
        sys.exit(1)

    # Resolve API key
    if args.api_key:
        api_key = args.api_key
    elif provider_cfg.get("api_key_env"):
        api_key = os.environ.get(provider_cfg["api_key_env"], "")
        if not api_key:
            print(f"Error: {provider_cfg['api_key_env']} environment variable not set")
            sys.exit(1)
    else:
        api_key = provider_cfg.get("default_api_key", "none")

    # Build input
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
        print("Error: no input provided. Use --input, --append, or --append-git-diff.")
        sys.exit(1)

    system = build_system_prompt(args.skill, args.rules or [])

    print(f"Skill:    {args.skill}", file=sys.stderr)
    print(f"Provider: {args.provider}", file=sys.stderr)
    print(f"Model:    {model}", file=sys.stderr)
    if base_url:
        print(f"Endpoint: {base_url}", file=sys.stderr)
    if args.rules:
        print(f"Rules:    {', '.join(args.rules)}", file=sys.stderr)
    print(file=sys.stderr)

    if args.provider == "anthropic":
        result = run_anthropic(system, user_input, model, args.max_tokens)
    else:
        result = run_openai_compatible(system, user_input, model, args.max_tokens, base_url, api_key)

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
