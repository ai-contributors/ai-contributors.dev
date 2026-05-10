# Agents

Authoritative AI instruction file for `ai-contributors.dev`. Human
contributors and AI agents MUST follow this document.

## What This Repo Is

This repository builds the public Astro 6.x website for the AI
Contributor Specification. It presents the pinned specification submodule as
searchable documentation and deploys to GitHub Pages. The site is built
on **`@astrojs/starlight`** (see `astro.config.mjs`); doc routes are driven
by Starlight's content collection plus a generated sidebar
(`src/lib/starlight-sidebar.generated.ts`), and a small set of component
overrides under `src/components/overrides/` customize chrome where needed.
The marketing homepage (`src/pages/index.astro` + `src/layouts/BaseLayout.astro`)
is the only route that does not go through Starlight.

Primary risk surfaces:

- Drift between the pinned `external/ai-contributor-spec` submodule and the
  generated pages in `src/content/generated-spec/`.
- GitHub Pages deployment and workflow permissions.
- Public-facing documentation accuracy.

## Architecture

The full walkthrough — doc-nav as single source of truth, the derive
pipeline, build-time consistency checks, the consume-branch pattern —
is in **[`docs/architecture.md`](docs/architecture.md)**. Read that
once before non-trivial changes.

Quick map (file paths only):

- `astro.config.mjs` — wires `starlight()` + `mdx()`, registers the
  remark-directive prompt-toolbar plugin, and points Starlight at the
  generated sidebar and the component overrides.
- `docs.config.json` — single source of truth for sidebar order,
  eyebrow, crumbs, prev/next, view-source, search, llms.txt. Consumed
  by `scripts/build-starlight-sidebar.mjs` to produce
  `src/lib/starlight-sidebar.generated.ts` (committed).
- `src/components/overrides/` — Starlight component overrides
  (`Sidebar`, `PageTitle`, `Head`, `Footer`, `ThemeSelect`). The
  `Sidebar` override swaps in `SpecFilterSidebar` on the `/specification`
  route via `Astro.locals.starlightRoute.entry.id`.
- `src/content.config.ts` — content collections: the Starlight `docs`
  collection (loader: `docsLoader`, schema: `docsSchema`) plus a
  `generatedSpec` collection that globs `src/content/generated-spec/`.
- `src/pages/index.astro` + `src/layouts/BaseLayout.astro` — the
  marketing homepage; the only non-Starlight route.
- `external/ai-contributor-spec/` — pinned spec submodule, with a
  sibling-checkout fallback for consume-side branches
  (`scripts/spec-content.mjs::pickSpecRoot`).
- `scripts/spec-content.mjs` — the porter. Reads upstream MD, strips
  the H1 + lede into front-matter, writes `src/content/generated-spec/`.
- `scripts/generate-spec-data.mjs` — catalog → `src/data/spec.generated.ts`
  with a J3 schema-version compat check.
- `scripts/check-doc-nav.mjs` — drift gate: nav ↔ pages ↔ cross-page
  anchor refs. Runs on `pnpm check` and the husky pre-commit hook.
- `.github/workflows/` — CI, dependency review, CodeQL, Pages deploy.

## Commands

```sh
pnpm install --frozen-lockfile
pnpm validate:spec
pnpm lint
pnpm format:check
pnpm type-check
pnpm deps:check
pnpm secret:scan
pnpm test
pnpm check
pnpm build
pnpm dev
```

## Guardrails And Policy

- Machine and manual guardrails: `docs/guardrails.md`.
- Credential handling and rotation: `docs/credentials.md`.
- Threat model, auth boundary, runtime validation boundary, and test layers:
  `docs/threat-model.md`.
- AI provider allowlist, context retention, redaction, agent scope,
  permissions, isolation, shared skills, untrusted input, and code-test
  independence: `docs/ai-governance.md`.

## Site Policy

The contract this site operates under. Each clause is **NORMATIVE**.
Code can be wrong without breaking these; the policy still binds. When
a future maintainer asks "are we allowed to do X?", these clauses
answer.

### Source-of-truth

The website lives in `ai-contributors/ai-contributors.dev`; the
specification lives in `ai-contributors/ai-contributor-spec`. The spec
repo is the only authoritative source for normative content.

- **SP-1.1** Copy-paste of specification text into this repo's own
  files is forbidden. Spec content reaches the site through the
  submodule (`external/ai-contributor-spec/`) and the generated
  content collection (`src/content/generated-spec/`) — never through
  inline prose in `.astro` or `.md` files in this repo.
- **SP-1.2** Submodule-bump PRs MUST NOT auto-merge. A human reviewer
  must explicitly approve each bump after CI and the deploy preview
  pass. Bumping the spec is a code change like any other.
- **SP-1.3** This site MUST NOT introduce normative content of its
  own. Marketing copy on the index page is allowed; anything that
  reads as specification-level guidance MUST come from the submodule.
  If marketing copy and the spec disagree, the spec wins.
- **SP-1.4** The spec source files MUST continue to render correctly
  on GitHub as plain Markdown. This site is an additional surface,
  not a replacement.
- **SP-1.5** Every published page SHOULD show the spec submodule
  version tag with the short SHA of the commit it was built from,
  formatted as `vX.Y.Z (<short-sha>)`. The version tag is the
  reader-facing signal; the SHA makes the rendered text reproducible.
  Today the sidebar shows the version; the footer does not yet show
  the SHA — this is a remaining gap, not a relaxation of the rule.
- **SP-1.6** A scheduled workflow checks at least daily whether the
  spec repo has a newer released tag than the pinned submodule and
  opens a PR. The spec repo SHOULD also fire a `repository_dispatch`
  on release so the bump PR opens within minutes (see U13 in
  [`docs/roadmap.md`](docs/roadmap.md)).

### Self-conformance

This repo MUST demonstrably satisfy at least **Level 3 (AI Authored)**
of the AI Contributor Specification — independently from the audit
that runs against the spec repo itself. Both repos hold their own L3
claim.

- **SP-2.1** All changes go through pull request. Direct pushes to
  `main` are not permitted.
- **SP-2.2** Before any deploy, the `ai-contributor-audit` skill (from
  the spec submodule) MUST run against `main` and the resulting
  artifact MUST show `conformance_level: 3` or higher. The artifact
  is committed under `.ai-contributor-audit/`. Today the audit is
  refreshed manually by a maintainer; a scheduled
  `.github/workflows/audit.yml` is a known gap and tracked as a
  follow-up in SP-OPEN below.
- **SP-2.3** Any subsequent merge MUST keep the audit at L3 or
  higher. A regression to L2 or below blocks merge. The
  submodule-bump workflow does not get an exception — bumping the
  spec version is a code change like any other.
- **SP-2.4** This repo's currently-claimed conformance badge MUST be
  visible on the published site. Today the index page is the natural
  place.

### Versioning

- **SP-3.1** Every package in `package.json` is pinned to a specific
  version, not a range. The lockfile (`pnpm-lock.yaml`) is the
  source of truth for what gets installed in CI.
- **SP-3.2** Major version pins in this file or in any other doc
  MUST be re-evaluated whenever the upstream project ships a new
  major.
- **SP-3.3** The dependency-update workflow (Renovate or Dependabot)
  MUST open PRs for both patch/minor and major updates. Major-update
  PRs may be batched or scheduled, but they MUST NOT be silently
  ignored — a stale dependency budget of 30 days for non-major
  updates is the suggested ceiling.
- **SP-3.4** Audit failures or build failures caused by outdated
  dependencies count as an SP-2.3 regression and block merges.

### Open Policy Gaps

These are policies that are stated above but not yet machine-enforced.
They block neither merges nor deploys today; a maintainer is meant to
close them.

- **SP-OPEN-1** Create `.github/workflows/audit.yml` that runs the
  `ai-contributor-audit` skill against `main` on a weekly schedule and
  fails the workflow if `conformance_level` drops below 3. Until this
  lands, SP-2.2 / SP-2.3 are enforced by maintainer review at
  submodule-bump time, not by automation.
- **SP-OPEN-2** Create `.github/workflows/update-spec.yml` that
  fires on `repository_dispatch` (event_type: `spec-release`) and on a
  daily cron, opens a submodule-bump PR, and adds the spec commits
  being pulled in to the PR body. The corresponding spec-repo emitter
  is captured upstream as U13 in [`docs/roadmap.md`](docs/roadmap.md).

## Forbidden Actions

- Do not edit `src/content/generated-spec/` by hand. Update the pinned
  submodule or route manifest, then run `pnpm prepare:spec`.
- Do not change the deployed custom domain without maintainer approval.
- Do not bypass CI gates or mask failing commands.
- Do not add secrets, tokens, or environment-specific credentials.
- Do not modify `.github/workflows/` or `.github/CODEOWNERS` without explicit
  maintainer approval.

## Credentials

No credentials are required to clone, build, test, or run the site locally.
CI uses `GITHUB_TOKEN` with explicit least-privilege permissions. GitHub Pages
must be enabled in repository settings with Build and deployment source set to
Deploy from a branch, using the generated `gh-pages` branch at `/`. The
production site is intentionally served below `/ai-contributor-spec/`; the
domain root redirects there with a static `index.html` generated by the deploy
workflow.

## Authorship And Disclosure

Materially AI-authored pull requests MUST complete the AI Authorship & Agent
Trace block in `.github/PULL_REQUEST_TEMPLATE.md`. Materially AI-authored
commits SHOULD include a `Co-Authored-By:` trailer naming the AI tool/model.

Minor autocomplete, spelling, grammar, or formatting suggestions do not require
AI disclosure.

Agents MUST preserve unrelated user work. Do not revert, overwrite, or reformat
files outside the assigned scope unless a maintainer explicitly requests that
exact change.

## Data Classification

| Class                      | Examples                                   | Allowed in AI context | Notes                       |
| -------------------------- | ------------------------------------------ | --------------------- | --------------------------- |
| Public site/source content | `src/`, `docs/`, generated spec pages      | Yes                   | Public by design.           |
| Public CI configuration    | `.github/workflows/`, `.github/CODEOWNERS` | Yes                   | No embedded secrets.        |
| Secrets/credentials        | none                                       | No                    | Do not introduce.           |
| Customer or regulated data | none                                       | No                    | Out of scope for this repo. |

If a future change introduces non-public data, this table and `SECURITY.md`
MUST be updated in the same PR.
