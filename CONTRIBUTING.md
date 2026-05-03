# Contributing

Thanks for considering a contribution. This repository maintains the public
website for the AI Contributor Specification.

## Scope

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
pnpm validate:spec
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

## License

Documentation and public site content are licensed under CC BY 4.0. Repository
tooling, scripts, components, tests, and workflow configuration are licensed
under Apache-2.0.
