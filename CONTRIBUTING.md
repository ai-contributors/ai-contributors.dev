# Contributing

Thanks for considering a contribution. This repository maintains the public
website for the AI Contributor Specification.

## Scope

All contributors must follow `AGENTS.md`. That file is the authoritative source
for AI-agent instructions and repository-specific guardrails.

In scope:

- Website copy, navigation, styling, accessibility, and generated spec routing.
- CI, deployment, dependency, and security hardening for the site.
- Fixes that keep the website aligned with the pinned spec submodule.

Out of scope:

- Normative specification changes. Propose those in
  `ai-contributors/ai-contributor-spec`.
- Hosted GitHub settings that cannot be represented in git, except as
  documentation or workflow assumptions.

## Local Validation

Use Node.js 24.x and pnpm 10.33.2.

```sh
pnpm install --frozen-lockfile
pnpm setup:spec
pnpm validate:spec
pnpm lint
pnpm format:check
pnpm type-check
pnpm deps:check
pnpm secret:scan
pnpm test
pnpm check
pnpm build
```

## Generated Spec Pages

Do not hand-edit `src/content/docs/generated-spec/`. The files are committed
because Astro/Starlight must see them in CI and deploy environments. Refresh
them with:

```sh
pnpm prepare:spec
```

## AI-Authored Contributions

Material AI-authorship is allowed when disclosed and reviewable. Fill out the
AI Authorship & Agent Trace block in the pull request template. Confirm that
AI-generated material can be contributed under the license for the path:

- CC BY 4.0 for documentation and public site content.
- Apache-2.0 for repository tooling, scripts, components, tests, and workflow
  configuration.

AI-assisted dependency additions must follow `docs/ai-governance.md` and include
verification against the canonical package registry, source repository, license,
and lockfile diff. Prompt, transcript, and tool-output evidence must be redacted
according to `docs/ai-governance.md` before it is retained.

## Security And Guardrails

- Credential handling: `docs/credentials.md`.
- Machine and manual guardrails: `docs/guardrails.md`.
- Threat model and runtime/auth boundaries: `docs/threat-model.md`.
- Security reporting: `SECURITY.md`.

Changes to workflows, CODEOWNERS, Pages deployment assumptions, or custom domain
behavior require explicit maintainer approval before the PR is opened.

## License

Documentation and public site content are licensed under CC BY 4.0. Repository
tooling, scripts, components, tests, and workflow configuration are licensed
under Apache-2.0.
