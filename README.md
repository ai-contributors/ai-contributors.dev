# ai-contributors.dev

Public Astro website for the AI Contributor Specification.

## Quick start

Requires Node 24.x and pnpm 10.33.2 (see `engines` in `package.json`).

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server (localhost:4321)
pnpm build          # build static site to ./dist + emit llms.txt
pnpm preview        # preview the built site locally
```

`pnpm dev` runs `prepare:spec` first (via the `predev` hook), which
regenerates `src/content/generated-spec/` from the pinned
`ai-contributor-spec` checkout (`scripts/generate-docs.mjs`).
`pnpm build` does **not** auto-run `prepare:spec` — run it manually
after bumping the submodule, or before the first build on a fresh
checkout.

## Useful scripts

| Command                             | What it does                                                           |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `pnpm setup:spec`                   | Initialise / update the spec source submodule.                         |
| `pnpm validate:spec`                | Sanity-check the spec source layout.                                   |
| `pnpm type-check`                   | Run `astro check`.                                                     |
| `pnpm test`                         | Run the `node:test` suites under `tests/unit/` + `tests/integration/`. |
| `pnpm coverage:check`               | Run the Vitest coverage gate over `tests/coverage/`.                   |
| `pnpm check`                        | `check:doc-nav` (drift gate) + `astro check` (type-check).             |
| `pnpm format` / `pnpm format:check` | Prettier write / check.                                                |
| `pnpm lint`                         | ESLint.                                                                |
| `pnpm secret-scan`                  | Scan tracked files for secrets via secretlint.                         |

## Project layout

- `src/layouts/BaseLayout.astro` — head + FOUC-safe theme init for the marketing homepage and 404. Doc routes use Starlight's built-in layout.
- `src/components/overrides/` — Starlight component overrides (`Sidebar`, `PageTitle`, `Head`, `Footer`, `ThemeSelect`).
- `src/components/` — non-Starlight pieces: `Logomark`, `ThemeToggle`, `SpecFilterSidebar`, `RuleCatalogBrowser`, `CoverageMap`.
- `src/styles/` — site CSS: `global`, `landing`, `starlight-theme`, `spec`.
- `src/pages/` — `index.astro` (marketing) and `404.astro`. All other routes are content collections rendered by Starlight.
- `src/content/docs/` + `src/content/generated-spec/` — Starlight content collections; `generated-spec/*.md` is derived from the pinned spec tag at build time.
- `scripts/` — build/setup tooling (`generate-docs.mjs`, `generate-llms.mjs`, `generate-spec-data.mjs`, `build-starlight-sidebar.mjs`, etc.).

## Contributor instructions

- Authoritative AI and repository instructions live in `AGENTS.md`.
- Human contribution flow is documented in `CONTRIBUTING.md`.
- Repository guardrails are documented in `docs/guardrails.md`.
- Credential handling is documented in `docs/credentials.md`.
- The current threat model is documented in `docs/threat-model.md`.
- AI provider, agent, skill, and Prompt-Audit policy is documented in
  `docs/ai-governance.md`.
