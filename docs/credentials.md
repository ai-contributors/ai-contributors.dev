# Credential Handling

Effective date: 2026-05-03
Owner: `@ai-contributors`
Review cadence: quarterly and whenever deployment, workflow, or hosting
configuration changes.

This repository is a public static documentation site. Contributors do not need
personal secrets, API keys, auth tokens, service-account keys, or production
credentials to clone, build, test, or preview the site locally.

## Local Development

- Install dependencies with `pnpm install --frozen-lockfile`.
- Use `.env.example` only for placeholder Astro route overrides. Copying it to a
  local `.env` file is optional.
- Never commit `.env`, `.env.*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, service
  account JSON, API keys, auth tokens, or other secret material.
- If a local credential is accidentally created while debugging, delete it
  before committing and run `pnpm secret:scan`.

## Automation

- GitHub Actions use the repository `GITHUB_TOKEN` with explicit
  least-privilege permissions in workflow files.
- GitHub Pages deployment credentials are GitHub-managed. Maintainers do not
  store deploy keys or cloud-provider credentials in this repository.
- Hosted GitHub settings such as Pages source, branch protection, secret
  scanning, and deployment environment protection are maintained by repository
  admins.

## Rotation And Revocation

- If any secret is accidentally committed, revoke or rotate it at the provider
  before relying on history cleanup.
- If GitHub-hosted credentials or tokens are suspected to be exposed, disable
  the affected workflow or environment, rotate the credential where applicable,
  and document the remediation in the security advisory or incident record.
- Remove access for maintainers who no longer need repository administration
  rights as part of normal GitHub org offboarding.
