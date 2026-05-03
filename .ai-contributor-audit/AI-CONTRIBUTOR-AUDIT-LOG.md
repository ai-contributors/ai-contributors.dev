---
spec_version: "0.1"
spec_source: https://github.com/ai-contributors/ai-contributor-spec/tree/9d6e0676353315f6c0f86e5ed09468f6ac2286e9
assessment_started_at: 2026-05-03T17:08:54.838Z
assessment_completed_at: 2026-05-03T17:14:43.984Z
assessment_duration: 00:05:49
audited_commit: 15c5cac967cf6de47e2270840513aac0516c0462
auditor: OpenAI Codex | GPT-5 | medium
validator_version: "0.1.0"
collector_version: "0.1.0"
runner_agent: OpenAI Codex
runner_model: GPT-5
conformance_level: 3
---

# AI Contributor Audit Log

> Audit-log companion to [`AI-CONTRIBUTOR-CHECKLIST.md`](AI-CONTRIBUTOR-CHECKLIST.md). Record every auditor-run command used to gather evidence. The stamper records collector-run commands in the stamped block. A fresh checkout plus the same external-service access should reproduce the findings. This helps reviewers catch invented or stale evidence, especially in AI-run audits.
>
> Keep this file next to the checklist. Checklist evidence references point here for command output. Keep the stamper-owned frontmatter fields (`spec_source`, `assessment_started_at`, `assessment_completed_at`, `assessment_duration`, `audited_commit`, `auditor`, `validator_version`, `collector_version`, `runner_agent`, `runner_model`, `conformance_level`) in sync with the checklist frontmatter.

## Where this asset lives

- **This file belongs under `.ai-contributor-audit/`**, next to `AI-CONTRIBUTOR-CHECKLIST.md` and `AI-CONTRIBUTOR-EVIDENCE.json`.
- **Commit and push it with every audit**, together with the root `AI-CONTRIBUTOR-AUDIT.md` summary and the full `.ai-contributor-audit/` artifacts. `audited_commit`, `spec_source`, and `assessment_started_at` pin each audit to a point in time. Git history becomes the audit trail.
- **Prior audit logs live in git history.** To inspect old evidence, run `git log -- .ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md` or `git show <sha>:.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md`. Do not copy old entries into a new audit.

## Shortest correct use

Record one row for every command or hosted-setting check that supports the checklist. The first row is the evidence collector. Do not record `date` rows for the assessment timestamps — `audit-stamp.ts` stamps `assessment_started_at`, `assessment_completed_at`, and `assessment_duration` itself.

Keep each output excerpt short. Do not paste a full terminal session. Show enough for another reviewer to see which command produced each checklist status.

## Re-audit protocol (start from scratch)

The re-audit protocol is defined in [`AI-CONTRIBUTOR-CHECKLIST.md` § Re-audit protocol](AI-CONTRIBUTOR-CHECKLIST.md#re-audit-protocol-start-from-scratch). It applies to both files. Start from the blank template, let the collector and stamper write fresh timestamps, and let the stamper record an immutable `spec_source`. The first stamped evidence row must be the `audit-collect` command and its `[audit-collect] wrote ...` summary. Every checklist `Comment` must cite current-run evidence: a command in this log, a `file:line` or section citation from `audited_commit`, or `AI-CONTRIBUTOR-EVIDENCE.json` from this collector run.

## What to record

- **Use the table form only.** Columns: `Spec IDs | Rules | Command | Output excerpt`. This keeps audits easy to compare and validate.
- **Every evidence row must name the checklist rule(s) it supports** in the `Rules` column. Use `<preflight>` only for setup rows such as `audit-collect` and token disclosure.
- **Every non-preflight row must list the spec IDs it supports** in the `Spec IDs` column. Use backtick-quoted `AIC-*` IDs from [`AI-CONTRIBUTOR-SPECIFICATION.md`](../AI-CONTRIBUTOR-SPECIFICATION.md), separated by commas. Preflight rows such as `audit-collect` may leave `Spec IDs` blank and use `<preflight>` in `Rules`. CI checks non-preflight IDs against the spec and checklist.
- Include two to three rows per rule (or per cluster of related rules) — enough that a reviewer on a fresh clone can reproduce the finding without guessing which command produced which evidence.
- Paste the command exactly as run (including flags and working directory when non-obvious). `Output excerpt` is a short preview — up to ~5 lines, with long output truncated using `…` and a pointer like `# truncated — full output in <path or CI job link>`. Do not paste 20-line blocks into cells; move them to a linked file or gist.
- Prefer commands that read repository state (`ls`, `cat`, `grep`, `git log`, `git config --get-all branch.*.protection`, `gh api`, package-manager introspection). Avoid commands that mutate the repository or call external services with side effects.
- Redact secrets from pasted output. If a command's output would include credentials, record the command but replace secret values with `***redacted***` and note the redaction.
- If you relied on GitHub UI screenshots or settings pages that have no CLI equivalent, record the navigation path instead (for example `Settings → Branches → main → Require a pull request before merging: ON`) and still name the rule it evidences.
- For external settings that can be queried, prefer timestamped API evidence over UI memory. Record the exact endpoint or command, the authenticated actor or role if relevant, and the output excerpt. A local checkout cannot reproduce external branch protection, security settings, deployment environments, or SaaS policy state by itself.
- Negative findings count: a command that returned `No files found` or `no matches` is evidence for a `Warning` or `Alarm` row and should be logged with the rule it supports.

Example commands to record (illustrative, not exhaustive): `ls -la AGENTS.md .github/copilot-instructions.md CLAUDE.md .cursorrules`, `grep -n '"strict"' tsconfig*.json`, `pnpm test --reporter=min`, `pnpm audit --prod`, `gh api repos/:owner/:repo/branches/main/protection`, `gh secret list`, CI job IDs or URLs for protected-branch runs.

Row-shape examples, not live rows:

- Preflight row: leave `Spec IDs` blank, set `Rules` to `<preflight>`, record the `audit-collect` command, and paste its `[audit-collect] wrote ...` summary.
- Evidence row: set `Spec IDs` to one or more real backtick-quoted `AIC-*` IDs, set `Rules` to the exact checklist rule name, paste the command exactly as run, and include a short output excerpt.

---

Rows between `<!-- BEGIN:STAMPED-COLLECTOR-ROWS -->` and `<!-- END:STAMPED-COLLECTOR-ROWS -->` are written by `audit-stamp.ts` from `AI-CONTRIBUTOR-EVIDENCE.json` — do not edit them. The stamper adds a checksum sentinel inside non-empty stamped blocks and refuses to overwrite a block whose checksum no longer matches. Add manual rows for judgment-required rules below the END marker.

| Spec IDs | Rules | Command | Output excerpt |
| -------- | ----- | ------- | -------------- |
<!-- BEGIN:STAMPED-COLLECTOR-ROWS -->
<!-- STAMPED-BLOCK-SHA256: b06000f3091c604503f243b11d050508baf804491f4405f39c026f707e1dd667 -->

| | `<preflight>` | `npx --yes tsx@4.21.0 audit-collect.ts /home/sasc9948/dev/github/ai-contributors/ai-contributors.dev/.worktrees/aic-level-3-remediation --out /home/sasc9948/dev/github/ai-contributors/ai-contributors.dev/.worktrees/aic-level-3-remediation/.ai-contributor-audit/AI-CONTRIBUTOR-EVIDENCE.json --commit 15c5cac967cf6de47e2270840513aac0516c0462` | `[audit-collect] wrote .ai-contributor-audit/AI-CONTRIBUTOR-EVIDENCE.json — 44 rules; Fulfilled=37 Warning=4 Alarm=0 jud…` |
| | `<preflight>` | `gh api user --jq .login` | `login=ai-contributors; token_tier=api_identity_verified_scopes_unknown; gh api user login=ai-contributors; gh auth stat…` |
| `AIC-default-branch-protected` | `Branch Protection` | `gh api repos/ai-contributors/ai-contributors.dev/rules/branches/main` | `[\n  {\n    "type": "deletion",\n    "ruleset_source_type": "Repository",\n    "ruleset_source": "ai-contributors/ai-contri…` |
| `AIC-ci-guardrail-suite` | `CI Gates` | `gh api repos/ai-contributors/ai-contributors.dev/rules/branches/main` | `[\n  {\n    "type": "deletion",\n    "ruleset_source_type": "Repository",\n    "ruleset_source": "ai-contributors/ai-contri…` |
| `AIC-dependency-review-visibility` | `Dependency Review` | `gh api repos/ai-contributors/ai-contributors.dev/rules/branches/main` | `[\n  {\n    "type": "deletion",\n    "ruleset_source_type": "Repository",\n    "ruleset_source": "ai-contributors/ai-contri…` |
| `AIC-dependency-vuln-detection` | `Dependency Security` | `gh api repos/ai-contributors/ai-contributors.dev/dependabot/alerts?state=open&severity=high&per_page=1` | `[]` |
| `AIC-human-review-required` | `Human Review Required` | `gh api repos/ai-contributors/ai-contributors.dev/rules/branches/main` | `[\n  {\n    "type": "deletion",\n    "ruleset_source_type": "Repository",\n    "ruleset_source": "ai-contributors/ai-contri…` |
| `AIC-lint-correctness-rules` | `Lint Rules` | `pnpm -r lint` | `\n> ai-contributors-dev@0.1.0 lint /tmp/audit-collect-15c5cac9-EMI2Pl\n> eslint .\n\n` |
| `AIC-lockfile-integrity-hashes`, `AIC-lockfile-enforced-in-ci` | `Lockfile Integrity` | `pnpm install --frozen-lockfile --ignore-scripts --prefer-offline --lockfile-only` | `Done in 501ms using pnpm v10.33.2\n` |
| `AIC-push-protection-enabled` | `Push Protection` | `gh api repos/ai-contributors/ai-contributors.dev` | `{\n  "id": 1227930329,\n  "node_id": "R_kgDOSTC62Q",\n  "name": "ai-contributors.dev",\n  "full_name": "ai-contributors/ai-…` |
| `AIC-secret-scanning-enabled` | `Secret Scanning` | `gh api repos/ai-contributors/ai-contributors.dev/secret-scanning/alerts` | `[]` |
| `AIC-strict-typing-enabled` | `Strict Types` | `pnpm -r type-check` | `\n> ai-contributors-dev@0.1.0 pretype-check /tmp/audit-collect-15c5cac9-EMI2Pl\n> pnpm prepare:spec\n\n\n…` |

<!-- END:STAMPED-COLLECTOR-ROWS -->

Append further rows as needed. If a rule is evidenced entirely by `AI-CONTRIBUTOR-EVIDENCE.json`, keep the collector row and cite `AI-CONTRIBUTOR-EVIDENCE.json` in the checklist Comment.

## Validating this audit log

Run the structural validator over both files before committing the audit. It cross-checks this log against [`AI-CONTRIBUTOR-CHECKLIST.md`](AI-CONTRIBUTOR-CHECKLIST.md) — every Comment that cites a `` `command` `` must match a Command cell here, every `Rules` entry must name a real checklist rule, and the synchronized frontmatter fields must be identical in both files. Exit 0 means the pair is mechanically consistent; exit 1 prints every defect with a stable `AUDITxxx` code.

Validation makes the audit mechanically consistent. A human or named accountable owner still reviews and accepts the filled artifacts before publishing a conformance claim, especially for agent-run audits.

```sh
# If the spec-repo tools package lives in your repo:
# Full cycle: collect, stamp, fill judgment-required rows, stamp again, validate
npm --prefix tools run audit -- \
  --auditor "AGENT | MODEL | REASONING_EFFORT" \
  --runner-agent "<runner>" \
  --runner-model "<model>"
npm --prefix tools run audit:stamp     # writes derivable cells
npm --prefix tools run audit:validate  # read-only structural check

# Or invoke directly:
tsx skills/ai-contributor-audit/scripts/audit-stamp.ts \
  .ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md \
  .ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md \
  --auditor "AGENT | MODEL | REASONING_EFFORT" \
  --runner-agent "<runner>" \
  --runner-model "<model>"
tsx skills/ai-contributor-audit/scripts/audit-stamp.ts \
  .ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md \
  .ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md \
  --diff
tsx skills/ai-contributor-audit/scripts/audit-validate.ts \
  .ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md \
  .ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md
```
