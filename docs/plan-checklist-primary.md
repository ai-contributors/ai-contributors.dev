# Plan: shift to checklist-primary IA, gated on generated level pages

Make checklists the primary reader path **only after** generated level pages
prove they are useful. Do not rebrand first. Do not add a Recipes section
yet. Do not let the site invent checklist guidance that should live upstream
in the rule catalog.

## Why this framing

Most visitors arrive asking "what do I do next?", not "what is the formal
model?". Spec-first IA optimises for the second question. The product
direction is to flip that — but the gating issue is **not** the sidebar.
It is whether `AI-CONTRIBUTOR-RULE-CATALOG.json` carries enough structured
data to generate useful per-level pages without the site becoming a second
source of normative truth.

If the catalog is too thin, the site has two bad options: render thin
pages, or invent prose. Inventing prose breaks the project's own
single-source-of-truth rule. So the first PR is narrow on purpose: it
exposes the gap.

## Phase 1 — additive, no rebrand

Ship under the existing structure. The only nav change is five new entries
inside `Specification`.

```
Start
  Overview
  Quickstart
  Adoption guide
  Glossary

Specification
  Full specification
  Level 0 checklist          ← new
  Level 1 checklist          ← new
  Level 2 checklist          ← new
  Level 3 checklist          ← new
  Level 4 checklist          ← new
  Pillars overview
  Coverage map
  Rule catalog

Audit
  How the audit works
  The profile
  No-install prompt
  CI integration
  A stamped audit

Skills
  ai-contributor-audit-profile
  ai-contributor-audit
  ai-contributor-audit-fix

Project
  Contributing
  Authors
  Tooling
  Security policy
  Releases
  Doc coverage
```

### Level page shape (phase 1)

Render only catalog-backed fields. Empty cells are the signal. Do not
backfill with site-authored prose.

```
# Level N Checklist

Purpose
  Generated from the level's description / workflowSummary in the catalog.

Prerequisites
  "You must satisfy Level 0 … Level (N-1) first." (computed from level order.)

Checklist rows
  Scope · Rule · Requirement · Pillar · IDs
  Automated coverage (if catalog carries it)
  Evidence metadata (if catalog carries it)

Related audit rows
  Links to the full checklist / audit model.

Reference
  Links to Conformance levels, Rule catalog, Full specification.
```

Do **not** add "What to do", "Does not count", or "How to fix" unless those
fields exist upstream.

### Source of truth

```
AI-CONTRIBUTOR-RULE-CATALOG.json
  → generated level checklists
  → audit templates
  → full spec cross-references
```

The site supplies framing, navigation, and explanatory layout. The site
does **not** supply requirement text, IDs, levels, scope, or evidence
expectations.

## Phase 2 — close the catalog gap upstream

Phase 1 will make catalog gaps visible. The likely-missing optional fields
on each clause/checklist row are:

```jsonc
{
  "whatToDo": "Concrete action the adopter should take.",
  "evidenceExpected": "What evidence should appear in the repo or audit log.",
  "doesNotCount": "Common false-positive evidence.",
  "fixHint": "Short remediation hint.",
  "relatedDocs": ["AI-CONTRIBUTOR-AUDIT.md"],
}
```

These ship as **optional** fields on the catalog projection. Site renderers
fall through cleanly when a row omits them. Each field has at most a
sentence or two — long-form prose still belongs in the spec body, not the
checklist row.

Open an upstream spec PR proposing the schema additions plus a starter
fill for the highest-hit rows (the ones the audit flags most often in
real repos). The PR is the decision point for the whole IA shift: if
upstream rejects structured guidance fields, phase 3 cannot proceed
without breaking the single-source rule, and the site stops at phase 1.

## Phase 3 — promote, only when pages have density

After phase 2 lands and the level pages have real content for most rows,
flip the IA in a single PR.

```
Start
  Overview
  Quickstart
  Adoption guide

Checklists                   ← promoted out of Specification
  Level 0 checklist
  Level 1 checklist
  Level 2 checklist
  Level 3 checklist
  Level 4 checklist
  Full checklist

Audit
  Run an audit
  Read the audit result
  Fix audit findings
  CI integration
  No-install prompt

Reference                    ← demoted from Specification
  Full specification
  Conformance levels
  Pillars
  Rule catalog
  Coverage map
  Glossary

Project
  Releases
  Security policy
  Contributing
  Tooling
  Authors
```

No Recipes section yet. Hardening advice (branch protection, secret
scanning, CODEOWNERS, MCP scoping, prompt audit trail, etc.) lives as
anchors inside the relevant level page. A Recipes section is added only
once **at least three** recipes have unique, non-duplicative content.

## Phase 4 — homepage CTA flip

Once `/checklists/...` is the primary path, change the homepage to lead
with the audit/checklist flow:

```
Get your repository to an AI Contributor level
  1. Run the audit
  2. See your current level
  3. Fix the checklist rows
  4. Publish your badge

CTAs:
  Start with Level 1 · Run an audit · View full checklist · Read the spec
```

The spec stays one click away, but is no longer the primary reading path.

## Phase 5 — recipes / fix pages, demand-driven only

Add fix-guidance pages **per row** only when audit telemetry or user
reports show people repeatedly stuck on that row. Do not pre-author them.
A Recipes section is added only when ≥3 recipes have unique content.

## Implementation order

1. Add five generated level pages under the existing `Specification`
   section. Catalog-backed fields only.
2. Wire them into `docs.config.json` (one entry per level), add the
   matching MDX files under `src/content/docs/` (Starlight content
   collection), and update the sidebar / built-output tests.
3. Let thin rows expose the catalog gap. Document which fields are
   missing, with counts.
4. Open the upstream spec PR adding optional guidance fields.
5. Once the pages are useful, promote them to a top-level `Checklists`
   section and move `Pillars`, `Coverage map`, `Rule catalog`, and
   `Full specification` into a new `Reference` section.
6. Flip the homepage CTA.
7. Add recipes or row-specific fix pages only when real audit usage
   shows demand.

## Risks and gates

- **Catalog rejection.** If upstream declines structured guidance fields,
  phase 3 cannot proceed without violating single-source-of-truth.
  Phase 1 still ships value (per-level landing pages with thin rows are
  better than no per-level pages), but the IA flip is parked.
- **Sidebar weight.** The phase-3 layout must _replace_ `Pillars`,
  `Coverage map`, `Rule catalog` in primary nav, not stack on top of
  them. Otherwise the cleanup we just did regresses.
- **Recipe sprawl.** Resist adding empty recipe slots. Eight TODO pages
  is the failure mode this plan exists to prevent.
- **Level page ≠ checklist dump.** A level page that is just a table of
  rows is no better than `/docs/rule-catalog`. Density (purpose,
  prerequisites, fix hints, related docs) is what makes it primary
  reading. Without phase 2, density is capped.

## One-line summary

Yes, make checklists primary — but the first PR is narrow: five
generated level pages, no rebrand, no recipes. The decision point
is whether upstream will accept the structured guidance fields
needed to make those pages genuinely useful.
