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

| Level                          | Status     | Date reached | Notes                                                                                                          |
| ------------------------------ | ---------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| **Level 0 — Baseline Hygiene** | ✅ Yes     | 2026-07-02   | Clean-clone build fixed in PR #23; the build no longer reads the submodule. All L0 rows Fulfilled.             |
| **Level 1 — Hardened**         | ✅ Yes     | 2026-07-02   | High-severity Dependabot alerts cleared in PR #23; hosted protections verified via host API.                   |
| **Level 2 — AI Assisted**      | ✅ Yes     | 2026-07-02   | Provider allowlist rescoped with a recorded review (`docs/ai-governance.md`); AI governance rows evidenced.    |
| **Level 3 — AI Authored**      | ✅ Yes     | 2026-07-02   | All L3 MUST rows Fulfilled or Not relevant; agent credentials cannot self-approve (ruleset `main-protection`). |
| **Level 4 — AI Autonomous**    | ⚠️ Partial |              | 17 SHOULD rows at Warning (see Backlog); no L4 claim intended — the repository targets L3.                     |

### Deriving `conformance_level`

`audit-stamp.ts` derives `conformance_level` from the table above:

1. Complete every checklist row first.
2. Run the stamper so each summary **Status** is derived from the checklist tables.
3. The stamper sets `conformance_level` to the numeric value of the **highest** level whose **Status** is `✅ Yes`.
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

| Priority | Level | Rule                             | Scope  | Current status | Next action                                                                                                                                               | Owner            | Target date |
| -------- | ----- | -------------------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| 5        | L4    | `A11y Helpers`                   | SHOULD | ⚠️ Warning     | Add reusable component-level a11y test helpers beyond Lighthouse budgets.                                                                                 | @ai-contributors |             |
| 5        | L4    | `A11y Keyboard Focus`            | SHOULD | ⚠️ Warning     | Add keyboard-navigation and focus-management checks for interactive components.                                                                           | @ai-contributors |             |
| 5        | L4    | `Action Version Pinned`          | SHOULD | ⚠️ Warning     | Pin GitHub Actions `uses:` refs to immutable commit SHAs.                                                                                                 | @ai-contributors |             |
| 5        | L4    | `AI Coverage Vanity Guard`       | SHOULD | ⚠️ Warning     | Document or automate a guard against AI-inflated vanity coverage.                                                                                         | @ai-contributors |             |
| 5        | L4    | `Ban Unsafe Escape Hatches`      | SHOULD | ⚠️ Warning     | Add lint rules banning `@ts-ignore` / `eslint-disable` without justification.                                                                             | @ai-contributors |             |
| 5        | L4    | `Build Origin Records`           | SHOULD | ⚠️ Warning     | Add provenance attestation (e.g. actions/attest-build-provenance) to the deploy workflow.                                                                 | @ai-contributors |             |
| 5        | L4    | `Coupling Review Checklist`      | SHOULD | ⚠️ Warning     | Write a short reviewer checklist for coupling/boundary changes.                                                                                           | @ai-contributors |             |
| 5        | L4    | `Custom Secret Patterns`         | SHOULD | ⚠️ Warning     | Add repository-specific secretlint patterns beyond the recommended preset.                                                                                | @ai-contributors |             |
| 5        | L4    | `Debug Statement Hygiene`        | SHOULD | ⚠️ Warning     | Remove `log` from the `no-console` allow list or add a justification.                                                                                     | @ai-contributors |             |
| 5        | L4    | `Deployment Protection Rules`    | SHOULD | ⚠️ Warning     | Intentional: `github-pages-preview` has no required reviewers so PR previews deploy without manual approval (PR #21); production keeps the reviewer gate. | @ai-contributors |             |
| 5        | L4    | `Input-Domain Property Coverage` | SHOULD | ⚠️ Warning     | Consider property-based tests for the markdown/config parsing scripts.                                                                                    | @ai-contributors |             |
| 5        | L4    | `License Compliance Automation`  | SHOULD | ⚠️ Warning     | Configure license allow/deny lists in the dependency-review action.                                                                                       | @ai-contributors |             |
| 5        | L4    | `Naming and Export Conventions`  | SHOULD | ⚠️ Warning     | Document naming and export conventions in `AGENTS.md` or `docs/architecture.md`.                                                                          | @ai-contributors |             |
| 5        | L4    | `Release from CI`                | SHOULD | ⚠️ Warning     | Not a package-publishing repo; deploys are the release path — document or accept as-is.                                                                   | @ai-contributors |             |
| 5        | L4    | `Test Assertion Effectiveness`   | SHOULD | ⚠️ Warning     | Evaluate mutation-style checks to verify assertion strength.                                                                                              | @ai-contributors |             |
| 5        | L4    | `Test Network Isolation`         | SHOULD | ⚠️ Warning     | State and enforce network isolation for unit tests in `docs/process.md`.                                                                                  | @ai-contributors |             |
| 5        | L4    | `Tests Colocated`                | SHOULD | ⚠️ Warning     | Intentional: central `tests/` split by layer is the documented convention (`docs/process.md`).                                                            | @ai-contributors |             |

Once a rule reaches `Fulfilled` or `Not relevant` in the checklist, it disappears from this backlog on the next stamp run.
