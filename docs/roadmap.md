# Roadmap

Outstanding work tracked outside the issue tracker because it spans
both `ai-contributors/ai-contributors.dev` and the upstream
`ai-contributors/ai-contributor-spec` repo. Each entry names the
files involved, the current workaround, and the trigger that should
unblock the work.

For policy-level open gaps (CI workflows, audit automation), see the
**Open Policy Gaps** section in [`AGENTS.md`](../AGENTS.md). Items
here are concrete schema / workflow / content changes; items there
are governance commitments.

---

## Upstream (spec-repo) asks

These are changes the doc site needs from `ai-contributor-spec`. File
a PR upstream and reference the U#/J# tag in the PR body.

### U7 · `spec_rev` on every audit-related output — P2 (deferred)

The audit-output frontmatter pins the spec revision via
`spec_version: "0.1.1"` (in `.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md`
and `.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md`). Renaming
the field to `spec_rev` to match U1's structural front-matter would
touch ~10 files in the audit toolchain (validator, stamper, collector,
audit-run) plus golden-audit fixtures.

- **Trigger to land:** next audit-toolchain version bump.
- **Workaround today:** `SPEC.version` is global; per-page rev is not displayed.
- **Doc-site code that would consume it:** a per-page footer surfacing rev would replace the global `SPEC.version`.

### U12 · Standardised callout / aside syntax — P3 (open)

Adopt a single callout syntax across upstream Markdown so the doc
site can map it to its design-system component. GitHub-flavored alerts
are a reasonable pick:

```markdown
> [!NOTE]
> The spec revision is stable within a minor version.
```

A new remark plugin in this repo (`src/lib/markdown/dx-aside.ts`)
would map `> [!NOTE]` to `<aside class="dx-aside">…</aside>`.

- **Workaround today:** `.dx-aside` callouts on derive pages have been dropped; they survive on site-authored or catalog/config-driven pages (`/`, `/docs/`, `/docs/doc-coverage`).

### U13 · `repository_dispatch` from spec releases — P3 (deferred)

When `ai-contributor-spec` publishes a release tag, fire a
`repository_dispatch` event into `ai-contributors.dev` so the
submodule-bump PR opens within minutes instead of waiting for the
next daily cron. Pairs with `SP-OPEN-2` in `AGENTS.md`.

- **Files (upstream):** `.github/workflows/release.yml`.
- **Trigger to land:** focused session that includes secret rotation — needs an `AI_CONTRIBUTORS_DEV_TOKEN` secret on the spec repo with permission to dispatch into this repo.
- **Workaround today:** doc site relies on the daily cron only; updates can lag a release by up to 24 hours.
- **Doc-site code that would consume it:** the submodule-bump workflow (`.github/workflows/update-spec.yml`, see SP-OPEN-2) would listen for `event_type: spec-release`. The daily schedule remains as a fallback.

```yaml
- name: Notify doc site of new release
  run: |
    gh api -X POST repos/ai-contributors/ai-contributors.dev/dispatches \
      -f event_type=spec-release \
      -f client_payload[tag]=${{ github.event.release.tag_name }} \
      -f client_payload[sha]=${{ github.sha }}
  env:
    GH_TOKEN: ${{ secrets.AI_CONTRIBUTORS_DEV_TOKEN }}
```

### J1 · Vector pillar icons (`icon_svg`) — P2 (deferred refinement)

The `pillars[]` block in `AI-CONTRIBUTOR-RULE-CATALOG.json` already
ships with order guarantee and emoji icons (landed in v0.1.1). The
remaining refinement: also publish `icon_svg` as a relative path to
an SVG in the spec repo (e.g. `assets/pillars/engineering.svg`) for
visual consistency in print and at small sizes.

- **Files:** `AI-CONTRIBUTOR-RULE-CATALOG.json` plus 7 new SVGs.
- **Trigger to land:** when a designer is available to draw the seven pillar marks.
- **Workaround today:** emoji-only.
- **Doc-site code that would consume it:** plumb `pillars[].icon_svg` through `scripts/generate-spec-data.mjs` into `src/data/spec.generated.ts`.

### J2 · Per-rule `required_evidence[]` schema — P2 (open)

The rule catalog declares `id`, `w` (weight), `t` (text), and implicit
pillar/level membership, but does not declare _what evidence the audit
is supposed to find_ in a machine-readable way. Add a
`required_evidence[]` block per rule:

```json
{
  "id": "AIC-runtime-version-pinned",
  "w": "MUST",
  "t": "The runtime version `MUST` be pinned.",
  "required_evidence": [
    { "kind": "file", "target": ".tool-versions" },
    { "kind": "file", "target": ".nvmrc" },
    { "kind": "key", "target": "engines.node", "in": "package.json" }
  ]
}
```

- **Files:** `AI-CONTRIBUTOR-RULE-CATALOG.json` and its `.schema.json`.
- **Trigger to land:** design call — touches all 240 rules and needs a stable `kind` taxonomy first.
- **Workaround today:** `docs/rule-catalog.mdx` renders required evidence as hand-authored prose.

---

## Consume-side (this-repo) deferred work

Site-side tasks that pair with already-landed upstream changes but
were intentionally deferred during the original consume branch.

### U11 paired · Quickstart section-extract loader — deferred

Today `src/content/docs/docs/quickstart.md` is hand-authored and
does not match the spec repo's README "Start Here" section. Wiring
a section-extract loader (à la `loadDerivePage('quickstart-from-readme')`)
that reads the marked block from the upstream README would ship a
visibly different page than today's.

- **Trigger to land:** when the doc-site quickstart copy is rewritten to align with the README.

### U8 paired · Per-version release pages — deferred

The spec repo now keeps release history in `CHANGELOG.md`; duplicate
`release-notes/v*.md` files were removed. A future
`src/content/docs/docs/releases/[version]` route would need to derive
version slices from the changelog rather than from per-version files.

- **Trigger to land:** changelog sections are structured enough to
  support stable per-version extraction.
