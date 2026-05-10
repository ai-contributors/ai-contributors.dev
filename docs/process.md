# Process — what runs when

This file is the single answer to "when does that command actually
run?" — both for fresh contributors and for AI agents working on the
repo. If something runs in CI but not locally (or vice versa), it
should be documented here.

## Quick map

```
                     ┌──────────────────────────────────────┐
                     │  external/ai-contributor-spec/       │
                     │  (pinned submodule, upstream MD)     │
                     └─────────────────┬────────────────────┘
                                       │ scripts/spec-content.mjs (porter)
                                       │ scripts/generate-spec-data.mjs
                                       ▼
            ┌──────────────────────────────────────────────────┐
            │  src/content/generated-spec/*.md   (MDX consumers) │
            │  src/content/docs/<slug>.md        (Starlight)     │
            │  src/data/spec.generated.ts        (typed catalog) │
            │  src/data/spec-source.generated.json (provenance)  │
            │  src/lib/starlight-sidebar.generated.ts            │
            └─────────────────┬────────────────────────────────┘
                              │ Starlight content collection
                              │ + 5 component overrides under
                              │   src/components/overrides/
                              ▼
            ┌──────────────────────────────────────────────────┐
            │  Starlight-rendered doc routes                   │
            │  (every entry in docs.config.json)               │
            └──────────────────────────────────────────────────┘

            ┌──────────────────────────────────────────────────┐
            │  src/pages/index.astro      (marketing)          │
            │  src/pages/404.astro        (branded 404)        │
            │  (BaseLayout-only; non-Starlight routes)         │
            └──────────────────────────────────────────────────┘
```

## Command matrix

| Command               | Triggered by                                                        | What it gates                                                                  | Defined in                                          |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `pnpm setup:spec`     | Manual, on a fresh checkout                                         | Submodule presence + initialisation                                            | `package.json` → `scripts/setup-spec-source.mjs`    |
| `pnpm validate:spec`  | Manual; also CI before `prepare:spec`                               | Submodule manifest matches expectations                                        | `package.json` → `scripts/validate-spec-source.mjs` |
| `pnpm prepare:spec`   | `predev` hook (auto on `pnpm dev`); CI; manual after submodule bump | Regenerates `src/content/generated-spec/*.md` and `src/data/spec.generated.ts` | `package.json`                                      |
| `pnpm dev`            | Manual                                                              | Local dev server                                                               | `astro dev`                                         |
| `pnpm build`          | Manual; CI                                                          | Static site → `dist/` + `llms.txt` + Pagefind index                            | `astro build && generate-llms.mjs && pagefind`      |
| `pnpm preview`        | Manual                                                              | Serves `dist/` locally                                                         | `astro preview`                                     |
| `pnpm lint`           | Pre-commit hook; pre-push hook; CI                                  | ESLint                                                                         | `package.json`                                      |
| `pnpm format:check`   | Pre-commit hook; pre-push hook; CI                                  | Prettier (read-only)                                                           | `package.json`                                      |
| `pnpm format`         | Manual                                                              | Prettier (write)                                                               | `package.json`                                      |
| `pnpm secret-scan`    | Pre-commit hook; pre-push hook; CI                                  | Secretlint over tracked files                                                  | `scripts/secret-scan-tracked.mjs`                   |
| `pnpm test`           | Pre-push hook; CI                                                   | `node:test` suites under `tests/unit/` + `tests/integration/`                  | `package.json`                                      |
| `pnpm coverage:check` | Pre-push hook; CI                                                   | Vitest coverage gate (`tests/coverage/`)                                       | `package.json`                                      |
| `pnpm type-check`     | Indirect (via `pnpm check`)                                         | `astro check` (TypeScript across `.astro` + `.ts`)                             | `package.json`                                      |
| `pnpm check`          | Pre-commit hook; pre-push hook; CI                                  | `check:doc-nav` (drift gate) + `pnpm type-check`                               | `package.json` → `scripts/check-doc-nav.mjs`        |
| `pnpm deps:check`     | Pre-push hook; CI                                                   | dependency-cruiser + madge (no circulars, no forbidden imports)                | `package.json` + `.dependency-cruiser.cjs`          |
| `pnpm lhci:assert`    | CI on production build                                              | Lighthouse a11y + perf budgets                                                 | `.lighthouserc.cjs`                                 |

## Hook surface area (local)

| Hook                | Runs                                                                                                                 | Rationale                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `.husky/pre-commit` | `lint`, `format:check`, `secret-scan`, `check`                                                                       | Fast checks + drift gate; gate every commit |
| `.husky/pre-push`   | Full CI suite (`lint`, `format:check`, `test`, `coverage:check`, `type-check`, `deps:check`, `secret-scan`, `build`) | Catch CI failures locally before push       |

The pre-push hook deliberately mirrors the CI deploy workflow's gate
order. Skipping it (`git push --no-verify`) is forbidden by SP-policy
unless explicitly approved by a maintainer for a specific situation.

## CI surface area (`.github/workflows/`)

| Workflow                | Triggers                            | What it does                                                                                                                                                                                                                   |
| ----------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `deploy.yml`            | push to `main`; PR open/sync/reopen | Install → validate-spec → prepare-spec → format → lint → test → coverage → check → deps → secret → build → lighthouse → SBOM → upload artefact → on `main`: copy to `gh-pages/ai-contributor-spec/`, write root redirect, push |
| `dependency-review.yml` | PR open/sync                        | Reviews dependency changes against advisory DB; fails on high-severity adds                                                                                                                                                    |
| `codeql.yml`            | push, PR, weekly cron               | Static analysis for the JS/TS surface                                                                                                                                                                                          |

**Open gaps** (tracked in AGENTS.md SP-OPEN):

- `audit.yml` — scheduled run of the `ai-contributor-audit` skill against `main` (SP-OPEN-1).
- `update-spec.yml` — submodule-bump PR on `repository_dispatch` from the spec repo + daily cron (SP-OPEN-2; pairs with U13 upstream — see [`roadmap.md`](roadmap.md)).

## Test runners

The repo runs **two** test runners with a clear directory split.
`pnpm test` runs the `node:test` files under `tests/unit/` +
`tests/integration/`; `pnpm coverage:check` runs the Vitest files
under `tests/coverage/`. All test files use the `.test.mjs` extension.

| Path                           | Runner      | What lives there                                                                                                         |
| ------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `tests/unit/*.test.mjs`        | `node:test` | Unit tests. No filesystem mutations, no git, no child processes. Pure-function or in-memory checks.                      |
| `tests/integration/*.test.mjs` | `node:test` | Integration tests. Exercise the real filesystem (temp dirs), the git submodule helpers, child processes, or real assets. |
| `tests/coverage/*.test.mjs`    | Vitest      | Tests behind a coverage threshold gate. Run by `pnpm coverage:check`.                                                    |

**Where to put a new test:**

- Touches the filesystem, runs a child process, exercises the
  submodule, or hits `tmpdir()`? → `tests/integration/`.
- Otherwise → `tests/unit/`.
- Specifically a coverage-gated test for `src/data/`? → `tests/coverage/`.

**Why two runners?** Vitest gives us coverage-threshold reporting
out of the box. `node:test` is the default for everything else
because it's zero-dep, fast, and ships with the Node runtime we
already pin. New tests should use `node:test` unless they're
specifically a coverage-gated test.

## Generation pipeline

Three scripts under `scripts/` produce committed generated artifacts:

1. **`scripts/spec-content.mjs`** (driver: `scripts/generate-docs.mjs`)
   — reads each entry of `SOURCE_ROUTES` from
   `scripts/spec-content.routes.mjs`, strips the upstream YAML
   front-matter, prepends generated front-matter with the derived
   title and deck, and writes
   `src/content/generated-spec/<file>.md`.

2. **`scripts/generate-spec-data.mjs`** — reads
   `external/ai-contributor-spec/AI-CONTRIBUTOR-RULE-CATALOG.json`,
   merges with `src/data/spec-intents.json`, and emits
   `src/data/spec.generated.ts` plus
   `src/data/spec-source.generated.json` (submodule version metadata).

3. **`scripts/generate-llms.mjs`** — runs at the end of `pnpm build`,
   walks the rendered `dist/` tree, and emits `dist/llms.txt` +
   `dist/llms-full.txt` against the [llmstxt.org](https://llmstxt.org)
   format.

The first two run as `pnpm prepare:spec`. The third runs as part of
`pnpm build`. None should be invoked directly except for debugging.

## Trigger summary for AI agents

When an AI agent edits this repo:

- **Touched MD under `src/content/generated-spec/`?** No — that's
  generated. Edit the upstream MD in `external/ai-contributor-spec/`
  (or open a PR upstream) and re-run `pnpm prepare:spec`.
- **Touched MD/MDX under `src/content/docs/`?** Spec-backed entries
  (with `source.repo: "spec"` in `docs.config.json`) are also generated
  by the porter — edit upstream and re-run `pnpm prepare:spec`. Site-
  authored entries (`source.repo: "site"`) are hand-edited.
- **Touched `src/data/spec.generated.ts` or
  `src/lib/starlight-sidebar.generated.ts`?** No — re-run
  `pnpm prepare:spec`.
- **Adding a new test?** Pick the directory by runner (see Test runners
  above). Default to `node:test` under either `tests/unit/` or
  `tests/integration/`.
- **Adding a new dependency?** See `docs/ai-governance.md` (AI
  Dependency Verification) — provider, license, lockfile diff,
  registry verification.
- **Bumping the submodule?** Submodule-bump PRs go through SP-1.2 (no
  auto-merge, human reviewer approves after CI + preview pass).

---

**Last revised:** 2026-05-07.
