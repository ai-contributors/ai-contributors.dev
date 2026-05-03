# Repository Guardrails

Effective date: 2026-05-03
Owner: `@ai-contributors`
Review cadence: quarterly and before changes to `AGENTS.md`, `SECURITY.md`,
`.github/workflows/`, `.github/CODEOWNERS`, package manifests, audit policy, or
generated-spec routing.

`AGENTS.md` is the authoritative AI instruction source. This document records
the machine-enforced and manual guardrails that make those instructions
reviewable.

## Machine-Enforced Guardrails

| Guardrail                   | Enforcement                                             | Failure surface                             |
| --------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Clean generated spec source | `pnpm validate:spec`, `pnpm prepare:spec`, `pnpm build` | Local command, prebuild step, CI check      |
| Unit and routing behavior   | `pnpm test`                                             | Local command, pre-commit, CI check         |
| Type safety                 | `pnpm type-check` and `pnpm check`                      | Local command, pre-commit, CI check         |
| Formatting                  | `pnpm format:check`                                     | Local command, pre-commit or CI check       |
| Lint correctness            | `pnpm lint`                                             | Local command, pre-commit or CI check       |
| Coverage threshold          | `pnpm coverage:check`                                   | Local command, CI check                     |
| Accessibility/performance   | `.lighthouserc.cjs`, `pnpm lhci:assert`                 | CI check                                    |
| Dependency boundaries       | `pnpm deps:check`                                       | Local command, CI check                     |
| Secret leakage              | `pnpm secret:scan`, `.gitignore`, `.secretlintrc.json`  | Local command, pre-commit or CI check       |
| Dependency review           | `.github/workflows/dependency-review.yml`               | Pull request check                          |
| SAST                        | `.github/workflows/codeql.yml`                          | Pull request or scheduled security check    |
| Code ownership              | `.github/CODEOWNERS`                                    | GitHub review routing and branch protection |

Machine guardrails must fail closed: do not bypass, suppress, or mask failing
commands. If a command is flaky or too slow for a local hook, move it to a
documented CI gate instead of deleting the check.

## Manual Guardrails

Manual review is required for:

- Changes to workflows, CODEOWNERS, Pages deployment assumptions, or custom
  domain behavior.
- Changes to the pinned specification submodule or generated-spec route
  manifest.
- AI-authored contributions, including Prompt-Audit evidence and license
  confirmation in `.github/PULL_REQUEST_TEMPLATE.md`.
- New dependencies, especially dependencies suggested by an AI tool.
- Any future change that introduces non-public data, authentication, backend
  code, or runtime credentials.

Manual guardrail failures surface in pull request review. Reviewers must request
changes when required evidence is absent or when a change weakens a listed
machine guardrail without an approved replacement.

## Boundaries

- `external/ai-contributor-spec/` is pinned upstream input.
- `scripts/spec-content.mjs` owns generated docs refresh and metadata.
- `src/content/docs/generated-spec/` is committed generated output and must not
  be hand-edited.
- `src/` may import presentation data and components, but must not import
  repository maintenance scripts.
- `scripts/` may read the pinned spec source and write generated outputs.
- `tests/` may import source modules; source and scripts must not import tests.

`pnpm deps:check` enforces circular-dependency checks and the source/test/script
dependency boundaries that are practical for this static site.

## Invariants

- Generated specification pages must match the pinned submodule and route
  manifest.
- The public site must remain a static documentation site unless a PR updates
  `AGENTS.md`, `SECURITY.md`, and `docs/threat-model.md` for the new runtime
  boundary.
- Local validation must prepare the generated spec metadata before type checks
  or builds that import `src/data/spec-source.generated.json`.
- GitHub Pages deployment must publish the built `dist/` artifact under
  `/ai-contributor-spec/` and keep the root redirect generated from
  `scripts/pages-routing.mjs`.

Executable evidence: `pnpm validate:spec`, `pnpm type-check`, `pnpm test`,
`pnpm deps:check`, `pnpm coverage:check`, and `pnpm build`.

## Evidence Index

- Clean setup: `pnpm install --frozen-lockfile`, `pnpm validate:spec`,
  `pnpm build`.
- Quality suite: `pnpm lint`, `pnpm format:check`, `pnpm type-check`,
  `pnpm deps:check`, `pnpm coverage:check`, `pnpm test`.
- User-facing site budgets: `.lighthouserc.cjs`, `pnpm lhci:assert`.
- Secret hygiene: `.gitignore`, `.secretlintrc.json`, `pnpm secret:scan`,
  `docs/credentials.md`.
- Security review: `SECURITY.md`, `docs/threat-model.md`, CodeQL workflow,
  dependency-review workflow.
- AI governance: `AGENTS.md`, `docs/ai-governance.md`,
  `.github/PULL_REQUEST_TEMPLATE.md`.

Policy changes require maintainer review through CODEOWNERS and a reviewer must
confirm that this evidence index still points at active checks.
