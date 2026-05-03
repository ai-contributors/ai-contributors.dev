# Security Policy

## Reporting A Vulnerability

If you believe you have found a security issue in this repository, please report
it privately rather than opening a public issue.

- Preferred channel: GitHub private security advisory for
  `ai-contributors/ai-contributors.dev`.

Please include:

- Affected file(s), commit SHA, or workflow run.
- A minimal reproduction or trace.
- The impact you believe it has, such as data exposure, supply-chain risk, or
  unauthorized deployment.

You can expect an acknowledgement within 5 business days and a triage update
within 10 business days.

## Scope

In scope:

- Site source and generated documentation routing.
- Scripts under `scripts/`.
- CI workflows under `.github/workflows/`.
- GitHub Pages deployment configuration represented in this repository.

Out of scope:

- The upstream specification itself; report those issues to
  `ai-contributors/ai-contributor-spec`.
- GitHub-hosted settings that are not controlled by repository files, unless a
  repo file creates an unsafe assumption about them.

## Security Design Review

The current lightweight threat model is `docs/threat-model.md`. It records
assets, trust boundaries, entry points, attacker paths, controls, auth boundary,
runtime validation boundary, and review date. Review it quarterly and whenever
workflows, deployment behavior, generated-spec routing, package manifests, or
the pinned specification submodule change.

Credential handling and rotation expectations are documented in
`docs/credentials.md`. Machine and manual guardrails are documented in
`docs/guardrails.md`.

## Supported Versions

Security fixes land on `main`. The deployed site should be considered supported
only at the latest `main` commit.
