# Architecture

How `ai-contributors.dev` actually works, end to end. Read this once;
the rest of `docs/` covers operational specifics ([`process.md`](process.md)
for what-runs-when, [`guardrails.md`](guardrails.md) for invariants,
[`roadmap.md`](roadmap.md) for cross-repo outstanding work).

The watch-words are:

- **Single source of truth in `docs.config.json`.** Every nav-shaped
  fact about a doc page (sidebar order, eyebrow, breadcrumbs,
  prev/next, view-source link, search index, llms.txt) is derived
  from one ordered root config file.
- **Starlight renders every doc route.** `@astrojs/starlight` owns
  the doc-route layout, sidebar, search dialog, and breadcrumbs. The
  marketing homepage and 404 page are the only routes outside it.
- **Spec content reaches the site through the porter.** The
  `ai-contributor-spec` repo's Markdown is read at build time, has
  its H1 + lede stripped into front-matter, and is written into
  `src/content/generated-spec/` for Starlight to render. Inline prose
  in this repo is forbidden by `SP-1.1` in `AGENTS.md`.
- **Enforced consistency at commit time.** `scripts/check-doc-nav.mjs`
  runs on the husky pre-commit and fails on drift between nav, pages,
  and cross-page anchors.

## Repos and how they relate

```
ai-contributors.dev/             ← this repo (the docs site, Astro + Starlight)
├─ external/ai-contributor-spec/ ← git submodule, pinned commit
└─ ../ai-contributor-spec/       ← optional sibling checkout (dev)
                                   used by branches that consume
                                   content not yet on the spec's main
```

The site repo and spec repo are two separate git repos. The spec is
wired in two ways:

- a **submodule** at `external/ai-contributor-spec` pinned to a known
  commit — used in CI and on `main`,
- a **sibling checkout** at `../ai-contributor-spec` — used by
  consume-side branches when upstream content has not landed yet
  (see [Consume-branch pattern](#consume-branch-pattern) below).

`scripts/spec-content.mjs::pickSpecRoot()` picks between them in
priority order: `SPEC_ROOT_OVERRIDE` env → submodule (if complete) →
sibling fallback (with a warning) → submodule (failing loud).

## The single source of truth: `docs.config.json`

This root config is the heart of the system. One entry per page:

```json
{
  "key": "adoption-guide",
  "path": "docs/adoption-guide",
  "section": "Start",
  "label": "Adoption guide",
  "source": { "repo": "spec", "path": "AI-CONTRIBUTOR-GUIDE.md" }
}
```

`src/lib/doc-nav.ts` imports the JSON and exposes the typed helper
API used by the Starlight overrides and a couple of scripts.

Things that derive from this array, by consumer:

| Consumer                                   | What it reads                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `scripts/build-starlight-sidebar.mjs`      | groups items by `section`, emits `STARLIGHT_SIDEBAR` for `astro.config` |
| `scripts/spec-content.mjs` (the porter)    | spec sources to read; output paths under `src/content/generated-spec/`  |
| `scripts/spec-content.routes.mjs`          | maps each entry's `path` to a Starlight content slug                    |
| `src/components/overrides/PageTitle.astro` | `eyebrowForPath()` for the per-page `<Section> › <Title>` line          |
| `scripts/generate-llms.mjs`                | `dist/llms.txt` index, sectioned by nav                                 |
| `scripts/check-doc-nav.mjs`                | drift validation (see below)                                            |

Starlight itself owns breadcrumbs, prev/next pagination, active-link
highlight, and search — those are computed from the rendered route
tree, not from `docs.config.json`. The "View source" link in the TOC
footer comes from `sourceFor(key)` in `src/lib/doc-nav.ts`.

**Reordering, renaming, or adding a doc page = edit
`docs.config.json` only.** The sidebar generator is committed
(`src/lib/starlight-sidebar.generated.ts`) and CI fails the build if
the snapshot drifts from a fresh regeneration of the sidebar / spec
content / spec data — see the `Guard against stale committed
generated files` step in `.github/workflows/deploy.yml`.

## How a doc page renders

Every doc route is a Markdown / MDX file in Starlight's content
collection. There is no `DocLayout`, no `DerivedDocPage` wrapper —
Starlight's default route layout, with the component overrides under
`src/components/overrides/`, is the doc chrome.

For a spec-backed page, the content flows like this:

```
upstream MD (e.g. ai-contributor-spec/AI-CONTRIBUTOR-GUIDE.md)
  ↓  scripts/spec-content.mjs (the porter, run by `pnpm prepare:spec`)
  ↓     • read upstream Markdown body
  ↓     • extract H1 → title, first paragraph → deck
  ↓     • let docs.config.json title/deck override those fallbacks
  ↓     • strip both from the body so they don't double-render
  ↓     • inject generated frontmatter with title + deck
src/content/generated-spec/ai-contributor-guide.md
  ↓  scripts/spec-content.routes.mjs projects this entry into the
  ↓  Starlight `docs` content collection at the URL slug from
  ↓  docs.config.json (e.g. "docs/ai-contributor-guide")
src/content/docs/<slug>.md (or .mdx for component-bearing pages)
  ↓  Starlight content collection (loader: docsLoader)
  ↓  markdown pipeline (astro.config.mjs):
  ↓     • remark-custom-heading-id   (honour `## h {#anchor}` from upstream)
  ↓     • remark-directive
  ↓     • remark-prompt-directive    (turns `:::prompt{…}` into a toolbar)
  ↓  Starlight default route layout + the five component overrides
HTML
```

For a site-authored page (the docs overview, doc-coverage,
rule-catalog, etc.), the MD/MDX lives directly under
`src/content/docs/` — no porter step, but the same Starlight render
path.

The marketing homepage (`src/pages/index.astro`) and 404
(`src/pages/404.astro`) are the only routes outside Starlight. Both
use `src/layouts/BaseLayout.astro`.

### Component overrides

Five Starlight overrides under `src/components/overrides/`:

| Override            | What it does                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `Sidebar.astro`     | Default Starlight sidebar, except on `/specification` where `SpecFilterSidebar` swaps in |
| `PageTitle.astro`   | Prepends the eyebrow line via `eyebrowForPath(entry.id)` from `src/lib/doc-nav.ts`       |
| `Head.astro`        | Adds `ClientRouter`, theme-reapply on swap, sidebar-scroll restore, Pagefind prefetch    |
| `Footer.astro`      | Custom site footer                                                                       |
| `ThemeSelect.astro` | Bridges Starlight's theme picker to the bespoke `theme` localStorage key                 |

The `Sidebar` override uses `Astro.locals.starlightRoute.entry.id`
to detect the spec route. Other routes get the default Starlight
sidebar wrapped in a `transition:persist` to avoid flicker.

## Build-time consistency: `scripts/check-doc-nav.mjs`

Wired into `pnpm check` (and the husky pre-commit hook). Four gates:

1. **`docs.config.json` validates.** Schema version, required fields,
   keys, source repo, no duplicate keys.
2. **Every nav entry has a page backing.** Either a hand-rolled
   `.astro`/`.md`/`.mdx` under `src/content/docs/` matching the
   entry's `path`, or a porter-emitted entry under
   `src/content/generated-spec/`.
3. **Every page has a nav entry.** Pages without a `docs.config.json`
   row (other than the explicit allowlist) fail the gate.
4. **Cross-page anchor references resolve.** Any `__PAGE__<key>#frag`
   placeholder in body text must resolve to a real id in the target
   page. The mechanism is wired but no current page uses it; the gate
   stays as a safety net for re-introduction.

CI runs the same check via `pnpm check`, plus the
`Guard against stale committed generated files` step in the deploy
workflow that re-runs `pnpm prepare:spec` and `git diff --exit-code`
against `src/content/generated-spec/`,
`src/data/spec.generated.ts`, and
`src/lib/starlight-sidebar.generated.ts`.

## Per-build flow

```
pnpm dev      → pnpm prepare:spec → astro dev
pnpm build    → astro build → generate-llms.mjs → pagefind --site dist → tests/built/*
pnpm test     → unit + integration tests under tests/{unit,integration}
pnpm check    → check-doc-nav.mjs + astro check (type-check)
```

`pnpm prepare:spec` does two things:

1. `scripts/generate-docs.mjs` calls the porter
   (`scripts/spec-content.mjs`) to refresh
   `src/content/generated-spec/` and the Starlight projection, and
   regenerates `src/lib/starlight-sidebar.generated.ts` from
   `docs.config.json`.
2. `scripts/generate-spec-data.mjs` reads
   `AI-CONTRIBUTOR-RULE-CATALOG.json` (with a J3 schema-version
   compat check) and emits `src/data/spec.generated.ts` — a typed
   structure that the bespoke `/specification` page consumes
   directly.

`spec.generated.ts` is committed so non-Node consumers can read it
directly and so commit diffs surface spec changes.

`pagefind --site dist --output-subdir pagefind` runs after
`astro build` to index the rendered HTML for the search dialog. The
override `Head.astro` prefetches the resulting `pagefind-ui.js` /
`.css` so the first dialog open does not flash empty.

## Consume-branch pattern

When a feature needs both a spec change and a site change, the
workflow is:

1. Branch on `ai-contributor-spec`, land the spec changes there.
2. Branch on this repo that adapts the site to consume those changes.
3. The site branch's `pickSpecRoot()` automatically uses the sibling
   spec checkout (with a warning) so `pnpm dev` works without env
   wrangling. Set `SPEC_ROOT_OVERRIDE` to silence the warning.
4. Track work against the relevant entry in [`roadmap.md`](roadmap.md);
   open a GitHub issue for execution status if the change needs
   per-step tracking.
5. PR upstream first. Once it merges and the submodule bumps in this
   repo, regenerating should produce a no-op diff — that's the
   round-trip acceptance test for the whole branch.
6. Then merge the site branch to `main`.

## Where to start when adding a feature

| You're adding…                             | Start here                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| A new spec-backed page                     | Land the upstream MD on `ai-contributor-spec`, then add the `docs.config.json` entry with `source.repo: "spec"` |
| A new site-authored page                   | Add the `docs.config.json` entry, then create the file at `src/content/docs/<path>.{md,mdx}`                    |
| Text on an existing spec-backed page       | Edit the upstream MD                                                                                            |
| A new section in the sidebar               | Set `section` on the `docs.config.json` entries that should land in it; the sidebar generator picks them up     |
| A reorder                                  | Reorder rows in `docs.config.json`                                                                              |
| A doc-chrome change                        | The relevant Starlight component override under `src/components/overrides/`                                     |
| A new structural field on doc pages        | `docs.config.schema.json` + the `DocNavEntry` type in `src/lib/doc-nav.ts` + the consuming override / script    |
| A spec-data field used by `/specification` | `scripts/generate-spec-data.mjs` + `src/content/docs/specification.mdx`                                         |
| A new build-time check                     | Extend `scripts/check-doc-nav.mjs` (or a new `scripts/check-*.mjs` wired into `pnpm check`)                     |

## Key files, in dependency order

```
docs.config.json                                ← single source of truth
docs.config.schema.json                         ← validation schema
  ↓
src/lib/doc-nav.ts                              ← typed helpers over docs.config.json
src/lib/links.ts                                ← url() helper (BASE-aware)
  ↓
scripts/spec-content.mjs                        ← the porter (spec MD → generated-spec/)
scripts/spec-content.routes.mjs                 ← projects entries into Starlight's docs collection
scripts/generate-spec-data.mjs                  ← rule catalog → spec.generated.ts
scripts/build-starlight-sidebar.mjs             ← docs.config.json → STARLIGHT_SIDEBAR
src/lib/starlight-sidebar.generated.ts          ← committed sidebar snapshot
src/data/spec.generated.ts                      ← committed spec data snapshot
src/content/generated-spec/**/*.md              ← committed porter output
  ↓
astro.config.mjs                                ← starlight() integration + remark plugins + overrides
src/content.config.ts                           ← docs + generatedSpec collections
src/components/overrides/                       ← Sidebar / PageTitle / Head / Footer / ThemeSelect
src/lib/markdown/prompt-toolbar.ts              ← remark-prompt-directive plugin
  ↓
src/content/docs/**/*.{md,mdx}                  ← Starlight-rendered routes (site-authored + projected)
src/pages/index.astro                           ← marketing homepage (BaseLayout)
src/pages/404.astro                             ← branded 404 (BaseLayout)
  ↓
scripts/check-doc-nav.mjs                       ← drift gate (pnpm check + husky)
scripts/generate-llms.mjs                       ← post-build llms.txt
```

## Rules of thumb

- **Don't write nav copy in two places.** If you find yourself
  writing the same string in `docs.config.json` and somewhere else,
  the somewhere-else is wrong.
- **Don't bypass `pnpm check`.** The drift gates are cheap; act on
  them. If the `__PAGE__` regex misses a real id, declare it with a
  `{/* check-doc-nav:ids … */}` directive rather than disabling.
- **Don't edit `src/content/generated-spec/`** — it's regenerated on
  every `pnpm prepare:spec`. Edit the upstream MD instead.
- **Don't edit `src/data/spec.generated.ts`** — same reason; edit the
  upstream catalog or `src/data/spec-intents.json`.
- **Don't edit `src/lib/starlight-sidebar.generated.ts`** by hand —
  regenerated by `scripts/build-starlight-sidebar.mjs` (called from
  `prepare:spec`).
- **Don't write inline normative spec text** in this repo (SP-1.1).
  Spec content reaches the site through the submodule and the porter,
  not through hand-authored prose.
