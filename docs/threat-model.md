# Threat Model

Review date: 2026-05-07
Owner: `@ai-contributors`
Review cadence: quarterly and before deployment, workflow, submodule, or
generated-spec routing changes.

## System

`ai-contributors.dev` is a public Astro 6.x documentation site for the AI
Contributor Specification. It publishes site-authored docs plus generated pages
from the pinned `external/ai-contributor-spec/` submodule to GitHub Pages.

## Assets

- Public documentation accuracy and route stability.
- Pinned upstream specification submodule commit.
- Generated Markdown under `src/content/generated-spec/`.
- GitHub Actions workflows and Pages deployment settings.
- Repository governance files such as `AGENTS.md`, `SECURITY.md`,
  `.github/CODEOWNERS`, and audit evidence.

## Trust Boundaries

| Boundary          | Trusted side                                      | Untrusted or less-trusted side                   |
| ----------------- | ------------------------------------------------- | ------------------------------------------------ |
| Repository source | Reviewed commits on `main`                        | Pull requests, forks, issue text, fetched URLs   |
| Spec generation   | Pinned submodule commit and route manifest        | Upstream changes before review and pin update    |
| Build and deploy  | GitHub Actions with scoped `GITHUB_TOKEN`         | Contributor machines and PR branches             |
| Public website    | Static Pages artifact                             | Browser requests and public readers              |
| AI assistance     | Maintainer-approved prompts and disclosed outputs | Raw model output, tool output, retrieved content |

## Entry Points

- Pull requests that change source, docs, workflows, package manifests,
  submodule pins, generated routes, or governance files.
- Dependency updates from Dependabot or human contributors.
- GitHub Actions workflow execution.
- GitHub Pages deployment from the generated `gh-pages` branch.
- AI-generated suggestions, summaries, code, tests, and tool output.

## Attacker Paths And Controls

| Attacker path                                                                                      | Control                                                                                                                  |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Change generated spec pages by hand to create documentation drift                                  | `AGENTS.md` forbids hand edits; `pnpm validate:spec` and `pnpm build` regenerate and validate source content             |
| Alter workflows, CODEOWNERS, or deployment routing to weaken review or deploy the wrong path       | CODEOWNERS routes sensitive paths; `AGENTS.md` requires explicit maintainer approval for workflow and CODEOWNERS changes |
| Introduce dependency or supply-chain risk                                                          | Dependabot, dependency review workflow, lockfile review, `pnpm deps:check`, and AI dependency verification policy        |
| Commit a secret or local credential                                                                | `.gitignore`, `.env.example`, `docs/credentials.md`, and `pnpm secret:scan`                                              |
| Use AI output that includes hidden prompt injection or untrusted instructions                      | `docs/ai-governance.md` classifies untrusted input channels and requires human review of material AI output              |
| Ship code whose tests were authored by the same AI session and only confirm the generated behavior | `docs/ai-governance.md` requires independent verification for AI-authored code and tests                                 |
| Publish stale content after upstream spec changes                                                  | Submodule pin review, generated metadata, `pnpm prepare:spec`, and route tests                                           |

## Auth And Runtime Validation

The site has no application authentication boundary, backend API, database,
worker, or privileged client credential path. Authorization is handled by GitHub
repository permissions and GitHub Pages deployment settings, not by site runtime
code.

Runtime input is limited to build-time configuration (`ASTRO_SITE`,
`ASTRO_BASE`), the pinned spec submodule, package manifests, and repository
content. New backend, API, worker, form-processing, or non-public data flows
must add runtime validation and update this threat model in the same PR.

## Test Layers

Current test layers are:

- Unit tests under `tests/unit/` (no filesystem mutations, no git, no child processes).
- Integration tests under `tests/integration/` (real filesystem, submodule helpers, child processes).
- Built-output tests under `tests/built/` (run by `pnpm build` against `dist/`).
- Coverage threshold checks through `pnpm coverage:check`.
- Type checking through `pnpm type-check`.
- Dependency-boundary and circular-dependency checking through
  `pnpm deps:check`.
- Build validation through `pnpm build`.
- Accessibility and performance budget assertions through `.lighthouserc.cjs`
  and `pnpm lhci:assert` in CI.

Additional accessibility, performance, or built-artifact checks should be added
when UI behavior or deployment risk expands beyond the current static docs
surface.
