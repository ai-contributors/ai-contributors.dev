# `docs/` index

Operational documentation for the `ai-contributors.dev` site. The
authoritative AI instruction file is **`AGENTS.md`** at the repo root,
not in this directory.

| File                                   | What it covers                                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`architecture.md`](architecture.md)   | How it all hangs together: doc-nav as single source of truth, the derive pipeline, build-time consistency checks, the consume pattern.              |
| [`process.md`](process.md)             | What runs when. Single matrix of every command + its trigger contexts (predev, pre-commit, pre-push, CI). The first thing to read.                  |
| [`guardrails.md`](guardrails.md)       | Machine-enforced + manual guardrails, repository invariants, evidence index. Pairs with `process.md`.                                               |
| [`ai-governance.md`](ai-governance.md) | AI provider/model allowlist, redaction rules, agent scope, capability scoping, code-test independence.                                              |
| [`credentials.md`](credentials.md)     | Credential handling and rotation. The site is public; this is mostly "no credentials needed."                                                       |
| [`threat-model.md`](threat-model.md)   | Lightweight threat model (assets, trust boundaries, attacker paths, controls).                                                                      |
| [`roadmap.md`](roadmap.md)             | Outstanding cross-repo work — upstream spec-repo asks (U#/J#) and consume-side deferred items. PR upstream and reference the U#/J# tag in the body. |

## Where else docs live

- `AGENTS.md` (repo root) — authoritative AI instruction file. Includes
  the **Site Policy** clauses (SP-1.x source-of-truth, SP-2.x
  self-conformance, SP-3.x versioning) and the **Open Policy Gaps**
  list (SP-OPEN-x).
- `README.md` (repo root) — installer-facing quickstart, project
  layout, contributor pointer.
- `CONTRIBUTING.md` (repo root) — human contribution flow.
- `SECURITY.md` (repo root) — vulnerability reporting.
- `AI-CONTRIBUTOR-AUDIT.md` (repo root) — the project's own audit
  artifact. Stamped by the `ai-contributor-audit` skill; do not edit by
  hand. Full details under `.ai-contributor-audit/`.

## Ordering for new contributors

1. `README.md` (root) — install + commands.
2. `AGENTS.md` (root) — the contract.
3. `docs/process.md` — what runs when.
4. `docs/guardrails.md` + `docs/threat-model.md` — what gets enforced.
5. `docs/ai-governance.md` — the rules for AI agents specifically.
6. `docs/roadmap.md` — only when filing a spec-repo PR or picking up a deferred consume-side task.
