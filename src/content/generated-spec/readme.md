---
title: "Quickstart"
---
## The Audit Process

```text
+--------------------------+
| Profile skill (optional) |
+--------------------------+
        |
        v
+-------------+
| Audit skill |
+-------------+
        |
        v
+------------------+   +----------------+   +----------------+   +----------------+   +-------------------+
| audit-collect.ts | -> | audit-stamp.ts | -> | auditor edits  | -> | audit-stamp.ts | -> | audit-validate.ts |
| (evidence JSON)  |    | (initial pass) |    | judgment rows  |    | (final pass)   |    | (read-only)       |
+------------------+   +----------------+   +----------------+   +----------------+   +-------------------+
                                                                                                |
                                                                                                v
                                                                                        +-------------------------------+
                                                                                        | Reviewable audit artifacts    |
                                                                                        | (filled MD, evidence JSON)    |
                                                                                        +-------------------------------+
                                                                                                |
                                                                                                v
                                                                                        +-----------+   +---------------------------+
                                                                                        | Fix skill  | -> | Audit skill (loop back)   |
                                                                                        | (optional) |    | after improvements        |
                                                                                        +-----------+   +---------------------------+
```

The audit is scripted. `audit-collect.ts`, `audit-stamp.ts`, and
`audit-validate.ts` own mechanical evidence, timestamps, derived fields, and
the root summary; the auditor — a human or an agent — owns the
judgment-required rows and manual evidence. Both auditor choices produce the
same artifacts and the same evidence chain, and a human or named accountable
owner reviews and accepts the artifacts before the repository publishes a
conformance claim. The optional fix-skill loop addresses gaps found by the
audit, then the audit runs again.

Before adopting the tooling, you can read the specification and checklist by
hand for gap analysis: treat the rows you would mark `Alarm` or `Warning` as
your backlog, and revisit the target level after each group of fixes. That
manual pass is useful for planning, but it is not audit evidence: timestamps,
summaries, derived level status, and evidence completeness are not
mechanically checked. Publishing a conformance claim requires a scripted
audit.

## Start Here

1. Run the
   [audit profile skill](../skill-profile/), then
   have the owner confirm the profile answers. This gives the audit
   applicability evidence for checks that do not apply.
2. Run the [audit skill](../skill-audit/) to produce the
   [audit artifacts](#what-the-audit-produces), including
   `AI-CONTRIBUTOR-AUDIT.md`.
3. Review the current result and decide which
   [target level](#choose-your-target-level) you want to reach.
4. Use the [fix skill](../skill-fix/) to address the
   backlog rows blocking your target level. It confirms the batch scope with
   you, fixes each row, and finishes with a single re-audit.
5. Rerun the audit whenever you need refreshed results outside a fix batch.
6. Have a human or named accountable owner review the
   [audit evidence](../audit-overview/) before claiming a level.

The audit also runs without an agent: run the audit scripts yourself and fill
the judgment-required rows by hand, or start with a script-free read of the
specification and checklist for gap analysis (see
[The Audit Process](#the-audit-process)).

Using TypeScript, pnpm, and GitHub? Follow the concrete adoption path in
[`AI-CONTRIBUTOR-GUIDE.md`](../adoption-guide/).

Maintaining this repository? See [`TOOLING.md`](../tooling/) for the tooling
architecture, command map, and directory responsibilities.

## Install The Skills

For the scripted audit, have:

- `git`, Node.js 24.x, and `npm` / `npx` available.
- Network access to fetch the pinned specification and runbook tooling. The
  bootstrap/start command may use `npx --yes tsx@4.21.0`; after `audit-run.ts`
  starts, child phases reuse `tsx` from `PATH` instead of invoking `npx` again.
- The target repository checked out locally.
- The target repository's package tools installed where applicable, such as
  `pnpm` or `npm`.
- `gh` authenticated as an account that can read the target GitHub repository
  if you want hosted settings verified.

Without GitHub CLI access, the audit still runs, but hosted controls such as
branch protection, required reviews, secret scanning, push protection, and
dependency alerts may remain `Warning` / verification gaps.

Install the skills:

```sh
npx skills add ai-contributors/ai-contributor-spec --skill ai-contributor-audit-profile ai-contributor-audit ai-contributor-audit-fix
```

Refresh an already installed audit skill outside an audit run:

```sh
npx skills update ai-contributor-audit
```

Do not auto-update during an audit. The audit skill and specification are coupled, and silent updates would hurt reproducibility. Actual audits should materialize the runbook from a pinned release tag or full commit SHA.

Then start the skill using your agent's invocation syntax:

- GitHub Copilot / Claude Code: `/ai-contributor-audit-profile`,
  `/ai-contributor-audit`, or `/ai-contributor-audit-fix`.
- Codex: `$ai-contributor-audit-profile`, `$ai-contributor-audit`, or
  `$ai-contributor-audit-fix`.
- Other agents: ask for the skill by name.

The fix skill has two modes: **fix-next-level** (default —
`/ai-contributor-audit-fix` fixes every backlog row blocking the next
conformance level) and **fix-one** (`/ai-contributor-audit-fix <rule>` fixes
the single named row). Both confirm the scope with you first, fix each row,
ask what to do next (leave the changes uncommitted, commit, branch, push, or
open a PR), and finish with a single re-audit.

The skills are user-invoked only: an agent never starts them on its own from a
matched prompt.

If your agent does not support skills, or you prefer the prompt-based flow, use
the prompt in
[`AI-CONTRIBUTOR-AUDIT-PROMPT.md`](../../audit/prompt/).

## Choose Your Target Level

Choose the highest-risk AI workflow the repository allows. The formal
definitions are in
[`AI-CONTRIBUTOR-SPECIFICATION.md` § Conformance levels](../conformance-levels/).

| Minimum level | Use this when... | What it enables |
|---|---|---|
| **L0 Baseline Hygiene** | AI is not part of the contribution workflow yet. | Foundational repository hygiene. |
| **L1 Hardened** | AI reads repository context, explains code, suggests commands, or helps with review. | Safer read-only AI assistance. |
| **L2 AI Assisted** | AI creates changes and a human actively accepts each one. | Human-accepted AI contributions. |
| **L3 AI Authored** | AI completes delegated tasks, opens pull requests, or changes files for review. | AI-authored work with human review. |
| **L4 AI Autonomous** | AI merges, releases, deploys, schedules changes, approves workflows, or changes settings without human approval for each action. | Autonomous AI operation. |

Level 0 is the minimum baseline. It covers universal hygiene such as secret
handling, pinned tooling, committed lockfiles, clean setup instructions, and
automated formatting.

## What The Audit Produces

- [`AI-CONTRIBUTOR-AUDIT.md`](../stamped-audit/): root summary
  template. A populated audit contains the conformance level and sorted backlog.
- [`.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md`](../stamped-audit/):
  full row-by-row checklist.
- [`.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md`](../stamped-audit/):
  command and evidence trace.
- `.ai-contributor-audit/AI-CONTRIBUTOR-EVIDENCE.json`: structured evidence
  collected from the repository and host.
- `.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-PROFILE.md`:
  owner-confirmed applicability answers that can explain why mapped checks are
  or are not in scope. The profile skill should draft answers from repository
  evidence first, then ask the owner to confirm or correct them. The audit reads
  this file as pre-audit input; if new owner facts are needed, update the
  profile and rerun rather than relying on chat answers.

The audit is not a generic security review. It checks whether repository
guardrails are strong enough for the AI workflow level you want to claim.