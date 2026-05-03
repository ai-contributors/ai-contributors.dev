#  Website Specification for AI Contributor Spec - ai-contributors.dev

> This file lives in [`ai-contributors/ai-contributors.dev`](https://github.com/ai-contributors/ai-contributors.dev). The website is a **separate repository** from the specification ([`ai-contributors/ai-contributor-spec`](https://github.com/ai-contributors/ai-contributor-spec)); the spec is pulled in as a Git submodule at build time so the website never duplicates spec content and the spec repository stays uncluttered by site code.

**Status:** Draft v0.1
**Target site:** `https://ai-contributors.dev` (custom domain on GitHub Pages)

---

## 1. Goal

A docs-style website that:

- introduces AI Contributor Spec to developers, engineering leads, platform teams, harness engineers, and security reviewers in under 30 seconds;
- exposes the formal specification (29 clauses, 7 pillars, 5 conformance levels) as browsable, searchable, anchorable pages;
- gives readers a one-line install command for the audit skills;
- generates the level-conformance badge.
- shows a normal audit workflow with the help of the agent

Out of scope for v1: blog, account system, telemetry, plugin registry, third-party audit submissions.

---

## 2. Reference landscape — "open standard / open spec for AI coding"

The site should feel native to this category: clean, doc-heavy, vendor-neutral, fast.

| Site | What it specifies | Steward | Public source repository |
|---|---|---|---|
| [agents.md](https://agents.md) | `AGENTS.md` file format — "README for agents" | Linux Foundation / Agentic AI Foundation | [`agentsmd/agents.md`](https://github.com/agentsmd/agents.md) (Next.js + Tailwind) |
| [agentskills.io](https://agentskills.io) | `SKILL.md` folder format | Anthropic + community | [`agentskills/agentskills`](https://github.com/agentskills/agentskills) (spec/SDK only, site not public) |
| [openspec.dev](https://openspec.dev) | Spec-driven development workflow (`openspec/`) | Fission-AI | [`Fission-AI/OpenSpec`](https://github.com/Fission-AI/OpenSpec) (CLI; site not public) |
| [opencode.ai](https://opencode.ai) | Open-source coding agent + `opencode.json` | sst / Anomaly | [`sst/opencode`](https://github.com/sst/opencode) |
| [skills.sh](https://skills.sh) | Skill-package directory + leaderboard | Vercel | [`vercel-labs/skills`](https://github.com/vercel-labs/skills) (CLI; site not public) |
| [llmstxt.org](https://llmstxt.org) | `/llms.txt` proposal | Answer.AI | [`AnswerDotAI/llms-txt`](https://github.com/AnswerDotAI/llms-txt) |
| [github.github.io/spec-kit](https://github.com/github/spec-kit) | Spec-Driven Dev toolkit | GitHub | [`github/spec-kit`](https://github.com/github/spec-kit) |
| [modelcontextprotocol.io](https://modelcontextprotocol.io) | Model Context Protocol | Anthropic + community | [`modelcontextprotocol/modelcontextprotocol`](https://github.com/modelcontextprotocol/modelcontextprotocol) |

Two structural patterns are observable in this category:

- **One-page marketing** (agents.md). Next.js + Tailwind, content authored in JSX. Works when the spec is short.
- **Docs-as-the-product** (opencode.ai docs, MCP, OpenSpec docs). Static-site generator over Markdown content with a sidebar, full-text search, dark mode, and a custom landing route.

AI Contributor Spec has a formal specification, an audit model, conformance levels, badges, an adoption guide, a coverage matrix, and three installable skills. **It belongs in "Docs-as-the-product"**

---

## 3. Source-of-truth requirement (NORMATIVE)

The website lives in its own repository (`ai-contributors/ai-contributors.dev`) and **must not** duplicate any specification content. The specification repository (`ai-contributors/ai-contributor-spec`) remains the only authoritative source.

- **3.1.** The spec repository **must** be present in this repository as a Git submodule at `external/ai-contributor-spec/`, pinned to a released version tag and its exact commit SHA (not a branch). For launch, the displayed source version is `v0.1 (<short-sha>)`, where `v0.1` is the primary label and the SHA is the verification detail.
- **3.2.** Every page that renders specification content **must** source its Markdown from the submodule via the Astro content-collection loader. Files used:
  - `external/ai-contributor-spec/AI-CONTRIBUTOR-SPECIFICATION.md`
  - `external/ai-contributor-spec/AI-CONTRIBUTOR-AUDIT-MODEL.md`
  - `external/ai-contributor-spec/AI-CONTRIBUTOR-AUDIT-PROMPT.md`
  - `external/ai-contributor-spec/AI-CONTRIBUTOR-GUIDE.md`
  - `external/ai-contributor-spec/AI-CONTRIBUTOR-COVERAGE.md`
  - `external/ai-contributor-spec/CHANGELOG.md`
  - `external/ai-contributor-spec/skills/*/README.md` and `external/ai-contributor-spec/skills/*/SKILL.md`
- **3.3.** Copy-paste of specification content into this repository's own files is forbidden. The build **must** read directly from the submodule.
- **3.4.** A custom scheduled workflow (`.github/workflows/update-spec.yml`) **must** check at least daily whether the spec repository has a newer released tag than the pinned submodule version. If so, it **must** open a pull request that bumps the submodule pointer to the new tag's commit SHA. Renovate is intentionally not used for this flow; the update logic stays in-repository so the release-tag semantics, PR title, and PR body remain explicit.
- **3.5.** Every submodule-bump PR **must** rebuild the site in CI and surface a deploy preview before it is merged. This makes every spec update a reviewable site update. Submodule-bump PRs **must not** auto-merge; a human reviewer must explicitly approve and merge them after the required checks pass.
- **3.6.** The spec repository **must** fire a `repository_dispatch` event to this repository when a new spec release tag is published, so the update PR opens within minutes of the release. The daily schedule in §3.4 remains as a fallback if the dispatch event fails or is delayed.
- **3.7.** A source-manifest check **must** run as part of the build. If the submodule is missing or unpopulated, or any expected source path doesn't exist in the pinned revision, the build **must** fail loudly.
- **3.8.** The website **must not** introduce normative content of its own. Marketing copy on the index page is allowed; anything that reads as specification-level guidance **must** come from the submodule.
- **3.9.** The spec source files **must** continue to render correctly on GitHub as plain Markdown for users who never visit this site. This site is an additional surface, not a replacement.
- **3.10.** Every published page **should** show, in the footer, the released spec version tag and short SHA of the submodule it was built from, formatted as `v0.1 (<short-sha>)` for the launch release. The `v0.1` label should link to the corresponding GitHub release or tag page, and the short SHA should link to the exact commit tree. The version tag is the main reader-facing signal; the SHA makes it possible to verify the exact spec text being rendered.

**Rationale.** Two repos, one source of truth. The spec stays uncluttered by site concerns; the website is a build artifact of the spec. Pinning to a release tag plus its exact SHA keeps the site both understandable and reproducible. Auto-PRs keep it fresh without ever bypassing review.

---

## 4. Self-conformance requirement (NORMATIVE)

This repository (`ai-contributors/ai-contributors.dev`) **must** demonstrably satisfy at least **Level 3 (AI Authored)** of the AI Contributor Specification — *"AI completes delegated tasks, opens pull requests, or changes files for review."*

This is a **separate audit** from the one that runs against `ai-contributor-spec`. Both repositories hold their own L3 claim independently.

- **4.1.** All changes to this repository **must** go through pull request. Direct pushes to `main` are not permitted.
- **4.2.** This repository **must** use pinned tooling and a committed lockfile, with the same Node version pin as the audit runtime in the spec submodule (24.x) and a pinned `pnpm` version.
- **4.3.** Dependency-update and scanning workflows (Renovate or Dependabot, plus GitHub native Dependabot alerts and secret scanning) **must** be enabled.
- **4.4.** Pre-commit and CI gates (formatting, linting, type-checking, secret scanning, branch protection, required reviews) **must** be configured. The starter under `external/ai-contributor-spec/examples/typescript-pnpm/` is the recommended baseline.
- **4.5.** Any agent, agent skill, or MCP server used during site development **must** be declared and governed under §17–§20 of the AI Contributor Specification.
- **4.6.** Before this repository's first deploy, the `ai-contributor-audit` skill (from the spec submodule) **must** be run against this repository and the resulting `AI-CONTRIBUTOR-AUDIT.md` **must** show `conformance_level: 3` or higher. The audit artifact **should** be committed under `.ai-contributor-audit/` and refreshed on a schedule.
- **4.7.** Any subsequent merge **must** keep the audit at L3 or higher. A regression to L2 or below blocks the merge. The submodule-bump workflow (§3.4) does not get an exception — bumping the spec version tag and SHA is a code change like any other.
- **4.8.** This repository's currently claimed conformance badge (Level 3 at minimum) **must** be visible on the published site. The index page is the natural place. The site uses the same `<BadgeGenerator />` component on itself that it exposes to other projects.

**Rationale.** A spec project that ships a website which does not pass its own audit is not credible. L3 is the right floor: it permits AI to write code and open PRs (which is how this site will be built) but requires human review on every change.

---

## 5. Recommended tech stack — Astro + Starlight on GitHub Pages

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 6.x** | Markdown-first, ships zero JS by default, fits docs-heavy content. native CSP, Zod 4, runs on the Node 24.x pin below. |
| Docs theme | **Starlight** | Sidebar, Pagefind search, dark mode, code tabs, asides, callouts — out of the box. |
| Spec content | **Git submodule** of `ai-contributor-spec` at `external/ai-contributor-spec/` | Source-of-truth (§3); reproducible builds. |
| Styling | Starlight defaults + minimal custom CSS for the index hero | Avoid divergence from the category aesthetic. |
| Search | **Pagefind** (bundled with Starlight) | Static, no backend, indexes every clause. |
| `llms.txt` | **`starlight-llms-txt` plugin** | Auto-generates `/llms.txt` and `/llms-full.txt`. A spec project in the AI-context business **must** publish its own. |
| Diagrams | **`astro-mermaid`** | The audit-flow ASCII diagram in the spec README becomes a real Mermaid diagram. |
| Package manager | **pnpm** | Matches the spec ecosystem. |
| Node | **24.x LTS** | Same pin as the audit runtime in the submodule. |
| CI | **GitHub Actions** | Native to GitHub Pages deploys. |
| Hosting | **GitHub Pages** | No vendor lock-in; matches the dual-licensed, vendor-neutral posture of the spec. |
| Domain | **Custom domain `ai-contributors.dev`** from day one (the repo name implies it). Falls back to `ai-contributors.github.io/ai-contributors.dev/` until DNS is set. | |

### Explicitly rejected alternatives

- **Next.js single-page (agents.md style).** Wrong shape for a multi-page spec with audit, levels, skills, and coverage.
- **VitePress.** Viable second choice; only pick it if a future maintainer is allergic to Astro.
- **npm package distribution of the spec.** Adds a packaging layer with no real benefit over the submodule. The spec is Markdown, not a library.

### Versioning policy (NORMATIVE)

- **5.1.** Every package referenced above (Astro, Starlight, plugins, integrations, the package manager, the Node runtime) **must** be at its latest stable release at the time of initial repository setup. Major version pins in this document (e.g. "Astro 6.x") **must** be re-evaluated whenever the upstream project ships a new major.
- **5.2.** Versions in `package.json` **must** be pinned to a specific version, not a range. The lockfile (`pnpm-lock.yaml`) is the source of truth for what gets installed in CI.
- **5.3.** The dependency-update workflow from §4.3 (Renovate or Dependabot) **must** be configured to open PRs for both patch/minor and major updates. Major-update PRs may be batched or scheduled, but they **must not** be silently ignored — a stale dependency budget of 30 days for non-major updates is the suggested ceiling.
- **5.4.** Astro and Starlight **must** be upgraded as a pair using the `@astrojs/upgrade` CLI. Manual version edits are forbidden because Astro's compat matrix between core, integrations, and adapters is enforced by that tool.
- **5.5.** Audit failures or build failures caused by outdated dependencies count as a §4.7 regression and block merges.

**Rationale.** A spec project that ships with stale tooling immediately undermines its own §1 (Engineering Foundation) clauses. Currency is part of conformance.

---

## 6. Repository layout

```
ai-contributors.dev/
├── .github/
│   └── workflows/
│       ├── deploy.yml              ← build + deploy to GitHub Pages
│       ├── update-spec.yml         ← release-tag submodule-bump PR
│       └── audit.yml               ← run ai-contributor-audit on a schedule
├── .gitmodules
├── external/
│   └── ai-contributor-spec/        ← submodule, pinned to a version tag and SHA
├── public/
│   ├── og.png
│   ├── favicon.svg
│   └── CNAME                       ← "ai-contributors.dev"
├── src/
│   ├── content.config.ts           ← Astro collection schema + glob loader
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx           ← custom hero (only marketing page)
│   │       ├── audit/flow.mdx      ← short bridge + Mermaid diagram
│   │       ├── levels.mdx          ← badge generator
│   │       └── skills/index.mdx    ← skills overview cards
│   └── components/
│       ├── Hero.astro
│       ├── LevelLadder.astro
│       ├── BadgeGenerator.astro
│       ├── InstallCommand.astro
│       └── SpecSourceFooter.astro  ← shows spec version tag and SHA (§3.10)
├── .ai-contributor-audit/          ← committed audit artifacts
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── AGENTS.md                       ← required by §4
├── AI-CONTRIBUTOR-AUDIT.md         ← required by §4.6
├── README.md
├── WEBSITE-SPEC.md                 ← this file
└── LICENSE                         ← CC BY 4.0
```

The submodule path (`external/ai-contributor-spec/`) is the only place spec content exists. Astro's content-collection loader is configured to read from there; nothing else in `src/` reproduces spec text.

---

## 7. Visual identity

The site **must** use `docs/design-logos/` as the starting point for the AI Contributor Spec logo and related brand assets. The current baseline asset is `docs/design-logos/01-contributor-grid.svg`, with PNG exports available for common sizes.

- `public/favicon.svg` should be derived from the logo source in `docs/design-logos/`.
- `public/og.png` should use the same visual identity, adapted for social preview dimensions.
- The index page may simplify or crop the logo for layout, but it should remain recognisably based on the `docs/design-logos/` source assets.

The logo assets are design inputs for the website, not normative specification content.

---

## 8. Sitemap (v1)

| Route | Title | Source | Notes |
|---|---|---|---|
| `/` | AI Contributor Spec | `src/content/docs/index.mdx` | Custom hero, level ladder, install snippet, three CTAs. |
| `/specification/` | Specification | `external/ai-contributor-spec/AI-CONTRIBUTOR-SPECIFICATION.md` | Sidebar grouped by the 7 pillars; one anchor per clause. |
| `/levels/` | Conformance levels | submodule + `<BadgeGenerator />` | Level dropdown → paste-ready Markdown badge. No SVG download in v1. |
| `/audit/` | How the audit runs | `src/content/docs/audit/flow.mdx` | Short bridge + Mermaid diagram. |
| `/audit/model/` | Audit evidence model | `external/ai-contributor-spec/AI-CONTRIBUTOR-AUDIT-MODEL.md` | |
| `/audit/prompt/` | No-skill audit prompt | `external/ai-contributor-spec/AI-CONTRIBUTOR-AUDIT-PROMPT.md` | |
| `/skills/` | Skills overview | `src/content/docs/skills/index.mdx` | Cards + canonical install snippet. |
| `/skills/audit/` | `ai-contributor-audit` | `external/ai-contributor-spec/skills/ai-contributor-audit/README.md` | |
| `/skills/audit-fix/` | `ai-contributor-audit-fix` | `external/ai-contributor-spec/skills/ai-contributor-audit-fix/SKILL.md` | |
| `/skills/audit-profile/` | `ai-contributor-audit-profile` | `external/ai-contributor-spec/skills/ai-contributor-audit-profile/SKILL.md` | |
| `/guide/typescript-pnpm/` | TypeScript + pnpm + GitHub adoption | `external/ai-contributor-spec/AI-CONTRIBUTOR-GUIDE.md` | |
| `/coverage/` | Coverage matrix | `external/ai-contributor-spec/AI-CONTRIBUTOR-COVERAGE.md` | |
| `/changelog/` | Changelog | `external/ai-contributor-spec/CHANGELOG.md` | |
| `/story/` *(optional)* | How this got built | `src/content/docs/story.mdx` | Personal narrative. Not normative. See "Optional pages" below for seed text. |
| `/llms.txt` and `/llms-full.txt` | — | Auto-generated by `starlight-llms-txt` | Required. `/llms-full.txt` includes the full public docs set: specification, audit model, audit prompt, adoption guide, coverage, changelog, and skill documentation. |

### Sidebar grouping

Configured in `astro.config.mjs` under Starlight's `sidebar`:

- **Start here** — `/`, `/specification/`, `/levels/`
- **Audit** — `/audit/`, `/audit/model/`, `/audit/prompt/`
- **Skills** — `/skills/`, `/skills/audit/`, `/skills/audit-fix/`, `/skills/audit-profile/`
- **Adoption** — `/guide/typescript-pnpm/`, `/coverage/`
- **Reference** — `/changelog/`, `/story/` *(if published)*, link out to the spec repo on GitHub

### Optional pages

These are not required for v1. If they are added, the source-of-truth (§3) and self-conformance (§4) rules still apply.

#### `/story/` — *How this got built*

A short narrative page explaining how the project actually came to be. Personal voice, written by the maintainer. Useful for newcomers who want to know whether the project comes from a working codebase or from a committee — and for this project, the answer is one of the more interesting things about it.

Suggested seed content for the page (cleanup and expansion welcome):

````markdown
# How the AI Contributor Spec actually got built

Here's the honest path it took from first idea to public repo in 14 days.

with I didn't plan an open specification. I planned a policy document for one of my own
repos — rules for how AI agents were allowed to contribute code.
````

Guidelines if the page is published:

- Keep the voice first-person and honest. The page earns its place by being candid about what worked, what didn't, and what changed mid-flight.
- Link it from the index page footer (not above the fold), and add it to the sidebar under "Reference".
- It is **not** part of the specification. It **must not** introduce new normative content (per §3.8) — no new rules, no new conformance criteria, no new audit requirements.
- Like every other page in the site, it counts toward the §4 self-conformance check.

### Out of scope for v1

Blog, contributor list page (link to GitHub instead), MCP server registry, license deep-dive page (already in the spec repo), web-based audit runner.

---

## 9. Index page

The hero is the only page that contains marketing copy. Anatomy, top to bottom:

1. **Headline** — one sentence, pulled verbatim from the spec repo's `README.md` lead: *"Guardrails for repositories where AI reads, writes, reviews, or releases code."*
2. **Subhead** — the second sentence: *"This specification treats AI as a system actor and defines reviewable guardrails for agent, harness, and tool behavior."*
3. **Three primary CTAs** — `Read the spec` → `/specification/`, `Run the audit` → `/skills/`, `Get a badge` → `/levels/`.
4. **L0 → L4 ladder** — visual `<LevelLadder />` component, links each level into `/specification/#conformance-levels`. Use the same colour palette as the existing badges (`blue`, `green`, `brightgreen`, `blueviolet`).
5. **Install snippet** — `<InstallCommand />` showing `npx skills add ai-contributors/ai-contributor-spec --skill …` in a copy-button code block.
6. **One-paragraph "Why this exists"** — the spec repo's `README.md` "Why This Exists" section, cropped to two sentences.
7. **Pillars grid** — 7 cards, one per pillar (Engineering Foundation 🏗️, Security 🛡️, Quality & Reliability 🎯, Release 🚀, AI Agents 🤖, AI Risk ⚠️, Oversight 🧭), each with the clause range and a link to the relevant `/specification/#…` anchor.
8. **Footer** — links to the spec repo, this site's repo, license, CHANGELOG, and the spec submodule version tag with SHA, formatted like `v0.1 (<short-sha>)` (§3.10).

The hero **must not** contain content that contradicts or extends the specification. If marketing copy and the spec disagree, the spec wins.

The index page **must** stay fully static. It must not show a live GitHub star count or make runtime API calls for repository metadata.

---

## 10. Build and deploy

- **10.1. Build command.** `pnpm build` from the repository root. Output: `dist/`.
- **10.2. Local preview.** `pnpm dev`, default port 4321. Run `git submodule update --init --recursive` first.
- **10.3. Deploy workflow** — `.github/workflows/deploy.yml` **must**:
  - run on push to `main` and on every pull request,
  - check out this repo with `submodules: recursive`,
  - pin Node 24.x and pnpm to the version in `package.json`,
  - run `pnpm install --frozen-lockfile`,
  - run `pnpm check` (Astro type check),
  - run the source-manifest check from §3.7 and fail if any expected input is missing,
  - run `pnpm build`,
  - on `main` only: upload `dist/` as a Pages artifact and deploy with `actions/deploy-pages`.
- **10.4. Spec auto-update workflow** — `.github/workflows/update-spec.yml` **must**:
  - run on a daily schedule and on `repository_dispatch` from the spec repository,
  - fetch the latest released tag from `ai-contributor-spec`,
  - if it differs from the pinned submodule version tag, open a PR that bumps the submodule pointer,
  - the PR title **must** include the new version tag and the new SHA's short form,
  - the PR body **should** list the spec commits being pulled in (`git log OLD..NEW`) and show both the old/new version tags and SHAs,
  - the PR **must not** be auto-merged; a human reviewer must approve and merge it after CI and the deploy preview pass.
- **10.5. Audit workflow.** `.github/workflows/audit.yml` **must** run the `ai-contributor-audit` skill (from the submodule) against this repository on a weekly schedule and fail the workflow if `conformance_level` drops below 3.
- **10.6. Hosting.** GitHub Pages, custom domain `ai-contributors.dev`, deployed from the artifact (no `gh-pages` branch).
- **10.7. PR previews.** On pull requests, build the site and post a deploy-preview link as a PR comment. The preview **must not** publish to the production domain.
- **10.8. Caching.** Pages should set `Cache-Control: max-age=300` on HTML and 1 year `immutable` on hashed assets. Starlight emits hashed asset names by default.

---

## 11. Acceptance criteria

The site is ready to ship when all of the following are true:

- [ ] The `ai-contributor-audit` skill, run against `main` of this repository, returns `conformance_level: 3` or higher; the audit artifact is committed under `.ai-contributor-audit/`.
- [ ] The spec is integrated as a Git submodule at `external/ai-contributor-spec/`, pinned to a released version tag and exact SHA.
- [ ] Bumping the submodule pointer to a newer spec version tag on `main` updates `/specification/` within 5 minutes of the merge.
- [ ] The spec repository's release-tag `repository_dispatch` opens a submodule-bump PR without waiting for the daily cron fallback.
- [ ] Submodule-bump PRs require human approval and are not auto-merged.
- [ ] No specification text exists outside the submodule. A check in CI confirms `src/content/docs/**` does not contain duplicated paragraphs from the submodule.
- [ ] The spec auto-update workflow has opened at least one bump PR successfully (smoke test before launch).
- [ ] All 5 conformance levels render badges that match the existing shields.io URLs in the spec repo's `README.md`.
- [ ] The badge generator produces paste-ready Markdown snippets only; SVG download is out of scope for v1.
- [ ] This repository's currently claimed level badge is visible on the index page (§4.8).
- [ ] The index page is fully static and does not fetch a live GitHub star count or other repository metadata at runtime.
- [ ] Pagefind search returns the §22 prompt-injection clause within the top 3 results for the query `prompt injection`.
- [ ] `/llms.txt` and `/llms-full.txt` exist and validate against the [`llmstxt.org`](https://llmstxt.org) format.
- [ ] `/llms-full.txt` includes the specification, audit model, audit prompt, adoption guide, coverage matrix, changelog, and skill documentation.
- [ ] Lighthouse mobile performance ≥ 95, accessibility ≥ 100.
- [ ] Every page has a visible link back to the spec repo on GitHub.
- [ ] Every page footer shows the spec submodule version tag with the short SHA in brackets, e.g. `v0.1 (<short-sha>)` (§3.10).
- [ ] CI fails the build if the submodule is missing or any source path is unresolved.
- [ ] All packages in `package.json` are pinned to their latest stable versions at the time of launch (§5.1, §5.2). The audit reflects no `Warning` rows for outdated tooling.
- [ ] DNS for `ai-contributors.dev` resolves to GitHub Pages and the `CNAME` file is committed.

---

## 12. Non-goals (v1)

- A submission flow for third-party audit reports.
- A leaderboard of audited repositories.
- A web-based audit runner (the audit is a local agent skill by design).
- A custom design system. Use Starlight defaults; iterate later.
- Internationalisation. English only at v1; Starlight's i18n hooks remain available for later.
- Hosting any spec content in this repository directly. The submodule is the only path.

---
