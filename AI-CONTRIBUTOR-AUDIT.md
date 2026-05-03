# AI Contributor Audit

Full audit artifacts live in `.ai-contributor-audit/`:

- [`.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md`](.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md)
- [`.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md`](.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md)
- [`.ai-contributor-audit/AI-CONTRIBUTOR-EVIDENCE.json`](.ai-contributor-audit/AI-CONTRIBUTOR-EVIDENCE.json)
- [`.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-PROFILE.md`](.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-PROFILE.md)

## Display your level badge

> Stamped automatically by `audit-stamp.ts` from `conformance_level`.

[![AI Contributor: Level 3 AI Authored](https://img.shields.io/badge/AI%20Contributor-Level%203%20AI%20Authored-brightgreen)](./AI-CONTRIBUTOR-SPECIFICATION.md#conformance-levels)

## Conformance level summary

> `Status` is stamped automatically by `audit-stamp.ts` from the per-row tables below. Fill `Date reached` only when a level is first claimed as `✅ Yes`; the stamper preserves it while the level remains reached and clears it if the level drops. Edit `Notes` with blockers or review context. `Partial` means one or more rows at that level are `Alarm` or `Warning`; record the blockers in **Notes** and list them in the root backlog.

| Level                          | Status     | Date reached | Notes                                                                                               |
| ------------------------------ | ---------- | ------------ | --------------------------------------------------------------------------------------------------- |
| **Level 0 — Baseline Hygiene** | ✅ Yes     | 2026-05-03   | Reached.                                                                                            |
| **Level 1 — Hardened**         | ✅ Yes     |              | Reached.                                                                                            |
| **Level 2 — AI Assisted**      | ✅ Yes     |              | Reached.                                                                                            |
| **Level 3 — AI Authored**      | ✅ Yes     |              | Reached.                                                                                            |
| **Level 4 — AI Autonomous**    | ⚠️ Partial |              | Not reached; autonomous-runner rows are not relevant, and many Level 4 SHOULD rows remain warnings. |

### Deriving `conformance_level`

`audit-stamp.ts` derives `conformance_level` from the table above:

1. Complete every checklist row first.
2. Run the stamper so each summary **Status** is derived from the checklist tables.
3. The stamper sets `conformance_level` to the **highest** level whose **Status** is `✅ Yes`. The value is `0` for Level 0, and `1`, `2`, `3`, or `4` for Levels 1–4.
4. If no level row is `✅ Yes`, the stamper sets `none`.
5. Never claim a level whose row is not `✅ Yes`, even if most requirements are met.

The frontmatter value and the summary table `MUST` agree; a mismatch is an audit defect. To advertise the level with a README badge, see [the badge section in the spec README](README.md#display-your-level).

## Backlog — what to address first

> `Priority`, `Level`, `Rule`, `Scope`, and `Current status` are stamped automatically by `audit-stamp.ts` from the full checklist. Edit only `Next action`, `Owner`, and `Target date`.

Populate this table from **every** checklist row where **Status** is `Alarm` or `Warning`. Do not drop rows for brevity. This keeps audits reproducible.

**Priority tiers** (the `Priority` column is the tier number, **not** a sequential unique rank — ties are expected and correct):

1. `MUST` at `Alarm` — repository fails on an unconditional requirement.
2. `MUST when applicable` at `Alarm` — the requirement applies to the repository and is unmet.
3. `MUST` at `Warning` — partial coverage or drift risk on an unconditional requirement.
4. `MUST when applicable` at `Warning`.
5. `SHOULD` at `Alarm` / `Warning` — each unmet `SHOULD` needs a documented reason in its Comment to count toward Level 4.

**Ordering rules** (deterministic so two auditors produce the same row order):

- Primary: ascending by `Level` (`L0`, then `L1`, through `L4`).
- Secondary: ascending by `Priority` (tier 1 first, tier 5 last).
- Tertiary: alphabetical by **Rule** name (case-insensitive).
- `MAY` rows are **not** listed here even if at `Alarm` / `Warning`; `MAY` is optional and tracked only in the full checklist.

**Cell conventions:**

- `Priority` — severity tier, not a unique rank.
- `Level` — conformance level this row affects in the step-by-step backlog.
- `Scope` — one of `MUST`, `MUST when applicable`, `SHOULD`. No parentheticals.
- `Current status` — the emoji-prefixed status from the full checklist (`🚨 Alarm` or `⚠️ Warning`).
- `Next action` — the concrete remediation; reuse wording from the checklist Comment when appropriate.
- `Owner` — handle or team (e.g. `@org/team`); leave blank if unknown.
- `Target date` — ISO date (`YYYY-MM-DD`) or blank if unknown. Do **not** write `TBD`, `n/a`, or similar filler.

| Priority | Level | Rule                             | Scope  | Current status | Next action                                                                                               | Owner | Target date |
| -------- | ----- | -------------------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------------------- | ----- | ----------- |
| 5        | L4    | `A11y Helpers`                   | SHOULD | ⚠️ Warning     | Add reusable a11y helpers or fixtures for UI review.                                                      |       |             |
| 5        | L4    | `A11y Keyboard Focus`            | SHOULD | ⚠️ Warning     | Add keyboard-focus checks for interactive UI components.                                                  |       |             |
| 5        | L4    | `Agent Bounded Delegation`       | SHOULD | ⚠️ Warning     | Document delegation boundaries, ownership, and success criteria for subagents.                            |       |             |
| 5        | L4    | `Agent Roles`                    | SHOULD | ⚠️ Warning     | Create standard agent roles and escalation paths.                                                         |       |             |
| 5        | L4    | `Agent Structured Outputs`       | SHOULD | ⚠️ Warning     | Define structured output requirements for agent task results.                                             |       |             |
| 5        | L4    | `Agent Tool Pinning`             | SHOULD | ⚠️ Warning     | Pin or record versions of agent tools used for material contributions.                                    |       |             |
| 5        | L4    | `AI Coverage Vanity Guard`       | SHOULD | ⚠️ Warning     | Define a policy preventing weak AI-generated tests from counting as meaningful coverage.                  |       |             |
| 5        | L4    | `AI Fixtures`                    | SHOULD | ⚠️ Warning     | Add fixtures for AI prompt/tool-output behavior where AI workflows are tested.                            |       |             |
| 5        | L4    | `AI Instructions Discoverable`   | SHOULD | ⚠️ Warning     | Link AGENTS.md from README.md or CONTRIBUTING.md and keep the instruction source discoverable.            |       |             |
| 5        | L4    | `AI Model Provenance`            | SHOULD | ⚠️ Warning     | Ensure AI-authored changes record model provenance in PR metadata and commit trailers.                    |       |             |
| 5        | L4    | `AI Workflow Standardization`    | SHOULD | ⚠️ Warning     | Define standard AI workflow categories and required evidence for each.                                    |       |             |
| 5        | L4    | `Ban Unsafe Escape Hatches`      | SHOULD | ⚠️ Warning     | Add policy or lint checks for unsafe escape hatches and CI bypasses.                                      |       |             |
| 5        | L4    | `Boundary Tests`                 | SHOULD | ⚠️ Warning     | Document and add tests for source-generation and routing boundaries.                                      |       |             |
| 5        | L4    | `Build Origin Records`           | SHOULD | ⚠️ Warning     | Add provenance attestations or immutable build-origin records for the Pages artifact.                     |       |             |
| 5        | L4    | `CODEOWNERS Coverage`            | SHOULD | ⚠️ Warning     | Close CODEOWNERS coverage gaps reported by the collector.                                                 |       |             |
| 5        | L4    | `CODEOWNERS Self-Owned`          | SHOULD | ⚠️ Warning     | Verify CODEOWNERS changes themselves require owner review.                                                |       |             |
| 5        | L4    | `Coupling Review Checklist`      | SHOULD | ⚠️ Warning     | Add a coupling/architecture review checklist to PR or design-review docs.                                 |       |             |
| 5        | L4    | `Credential Rotation`            | SHOULD | ⚠️ Warning     | Document credential rotation and offboarding triggers even when most credentials are GitHub-managed.      |       |             |
| 5        | L4    | `Custom Secret Patterns`         | SHOULD | ⚠️ Warning     | Add custom secret patterns or document why platform defaults cover the repo risk.                         |       |             |
| 5        | L4    | `Debug Statement Hygiene`        | SHOULD | ⚠️ Warning     | Add lint rules or review checks for debug/log statement hygiene.                                          |       |             |
| 5        | L4    | `Deployment Separation`          | SHOULD | ⚠️ Warning     | Separate production and preview deployment permissions or document the accepted Pages shared-branch risk. |       |             |
| 5        | L4    | `Disclosure Evidence`            | SHOULD | ⚠️ Warning     | Exercise and preserve AI disclosure evidence on materially AI-authored PRs and commits.                   |       |             |
| 5        | L4    | `Escalated Approval Categories`  | SHOULD | ⚠️ Warning     | Define changes that need escalated approval beyond baseline review.                                       |       |             |
| 5        | L4    | `Guardrail Active Evidence`      | SHOULD | ⚠️ Warning     | Create an evidence index mapping each guardrail to active enforcement proof.                              |       |             |
| 5        | L4    | `Human Approval — Large Changes` | SHOULD | ⚠️ Warning     | Define large-change thresholds and additional human approval expectations.                                |       |             |
| 5        | L4    | `Input-Domain Property Coverage` | SHOULD | ⚠️ Warning     | Add property-based or input-domain tests for generators and route transforms.                             |       |             |
| 5        | L4    | `License Compliance Automation`  | SHOULD | ⚠️ Warning     | Add automated license review for dependencies and generated material where applicable.                    |       |             |
| 5        | L4    | `Minimum Capability Set`         | SHOULD | ⚠️ Warning     | Document minimum required agent capabilities by task type.                                                |       |             |
| 5        | L4    | `Naming and Export Conventions`  | SHOULD | ⚠️ Warning     | Document naming/export conventions or enforce them through lint rules.                                    |       |             |
| 5        | L4    | `OIDC Federation`                | SHOULD | ⚠️ Warning     | Prefer OIDC or GitHub Pages-native deploy credentials over pushing with GITHUB_TOKEN where feasible.      |       |             |
| 5        | L4    | `Policy Effective Dates`         | SHOULD | ⚠️ Warning     | Add effective dates and review cadence to policy documents.                                               |       |             |
| 5        | L4    | `Policy Evidence Links`          | SHOULD | ⚠️ Warning     | Link policies to enforcement evidence such as workflows, settings, or tests.                              |       |             |
| 5        | L4    | `Preserve User Work`             | SHOULD | ⚠️ Warning     | Add an explicit AI/contributor rule to preserve unrelated user work and avoid reverting others changes.   |       |             |
| 5        | L4    | `Provider EOL Tracking`          | SHOULD | ⚠️ Warning     | Track provider/model EOL notices for allowlisted AI providers.                                            |       |             |
| 5        | L4    | `Provider Fallback Path`         | SHOULD | ⚠️ Warning     | Document fallback or migration paths for allowlisted AI providers/models.                                 |       |             |
| 5        | L4    | `Release from CI`                | SHOULD | ⚠️ Warning     | Document release/deploy origin and make release-from-CI evidence explicit for the Pages artifact.         |       |             |
| 5        | L4    | `Security Design Reviews`        | SHOULD | ⚠️ Warning     | Add recurring security design review or threat-model revisit evidence.                                    |       |             |
| 5        | L4    | `Sensitive Write Paths Owned`    | SHOULD | ⚠️ Warning     | Align CODEOWNERS patterns with all sensitive write paths reported by the collector.                       |       |             |
| 5        | L4    | `Skill Shared vs Personal`       | SHOULD | ⚠️ Warning     | Distinguish approved shared skills from personal helper skills in AGENTS.md.                              |       |             |
| 5        | L4    | `Skill Usage Examples`           | SHOULD | ⚠️ Warning     | Add examples showing how approved skills should record Prompt-Audit metadata.                             |       |             |
| 5        | L4    | `Test Against Built Artifact`    | SHOULD | ⚠️ Warning     | Add a test or preview check that exercises the built dist artifact.                                       |       |             |
| 5        | L4    | `Test Assertion Effectiveness`   | SHOULD | ⚠️ Warning     | Add assertion-strength review, mutation testing, or equivalent evidence.                                  |       |             |
| 5        | L4    | `Test Network Isolation`         | SHOULD | ⚠️ Warning     | Document or enforce network isolation for tests.                                                          |       |             |
| 5        | L4    | `Tests Colocated`                | SHOULD | ⚠️ Warning     | Colocate tests with source modules or document the centralized test layout rationale.                     |       |             |
| 5        | L4    | `Vuln Alert Ownership`           | SHOULD | ⚠️ Warning     | Document dependency/security alert owner and triage SLA.                                                  |       |             |
| 5        | L4    | `Workflow Change Review`         | SHOULD | ⚠️ Warning     | Prove workflow changes require code-owner review or add an enforced review rule.                          |       |             |

Once a rule reaches `Fulfilled` or `Not relevant` in the checklist, it disappears from this backlog on the next stamp run.
