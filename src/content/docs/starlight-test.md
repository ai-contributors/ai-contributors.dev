---
title: Starlight test page
description: Internal sandbox page used to verify the Starlight integration during the doc-chrome migration. Not linked from public navigation.
---

This page exists to verify that `@astrojs/starlight` is installed and renders
alongside the existing hand-rolled chrome without colliding on URLs. It is
not linked from any sidebar or topbar and will be deleted at the end of the
migration.

## Why this page exists

Phase 1 of the Starlight migration installs the integration in parallel.
Nothing else changes. If `pnpm build` produces this page at
`/_starlight-test/` with Starlight default chrome, **and** every existing
URL still resolves with the current chrome, phase 1 is complete.

## What it should not do

- Appear in the sidebar of any production page.
- Affect the routing or rendering of any page under `/docs/...`,
  `/audit/...`, or the bespoke `/`, `/specification` pages.
- Pull in extra CSS that leaks into existing pages.

## What it should do

- Render with Starlight's default layout (sidebar, topbar, TOC, theme
  toggle).
- Pick up the title and description from this file's frontmatter.
- Build cleanly under `pnpm build`.
