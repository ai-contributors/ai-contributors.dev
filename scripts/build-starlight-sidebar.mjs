// Generate Starlight's sidebar config from docs.config.json.
//
// The sidebar is grouped by the `section` field, in declaration order.
// Spec-backed entries reference the Starlight content slug; site-backed
// entries (the homepage, the bespoke /specification page, doc-coverage,
// etc.) reference an absolute link that Astro's `pages/` routing serves
// outside Starlight.
//
// Output: a generated TS module imported by astro.config.mjs. The
// generated file is hand-edit-rejected by carrying a clear marker.

import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readDocsConfig,
  starlightFileForEntryPath,
  starlightSlugForEntryPath,
} from './spec-content.routes.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(repoRoot, 'src/lib/starlight-sidebar.generated.ts');
const STARLIGHT_DOCS_ROOT = path.join(repoRoot, 'src/content/docs');

function buildSidebar(config = readDocsConfig()) {
  const sections = [];
  for (const entry of config.docs) {
    let bucket = sections[sections.length - 1];
    if (!bucket || bucket.label !== entry.section) {
      bucket = { label: entry.section, items: [] };
      sections.push(bucket);
    }

    // An entry resolves through Starlight's docs collection whenever the
    // matching MD file exists at src/content/docs/<entry.path>.md — that
    // covers both porter-emitted spec-backed pages and hand-authored
    // site-backed pages we move into the collection. Other entries
    // (catalog-driven .json renderers, bespoke landing pages, etc.) stay
    // outside Starlight and are linked by absolute URL.
    const starlightFile = starlightFileForEntryPath(entry.path);
    const starlightMdxFile = starlightFile?.replace(/\.md$/, '.mdx');
    const hasStarlightContent =
      starlightFile &&
      (existsSync(path.join(STARLIGHT_DOCS_ROOT, starlightFile)) ||
        (starlightMdxFile && existsSync(path.join(STARLIGHT_DOCS_ROOT, starlightMdxFile))));

    if (hasStarlightContent) {
      bucket.items.push({
        label: entry.label,
        slug: starlightSlugForEntryPath(entry.path),
      });
    } else {
      const target = entry.path === 'docs/' ? '/docs/' : `/${entry.path}`;
      bucket.items.push({
        label: entry.label,
        link: target,
      });
    }
  }
  return sections;
}

export function generateStarlightSidebar() {
  const sidebar = buildSidebar();
  const banner =
    '// GENERATED FILE — do not edit. Regenerate via:\n' +
    '//   pnpm exec node scripts/build-starlight-sidebar.mjs\n' +
    '// Source: docs.config.json (consumed by scripts/build-starlight-sidebar.mjs).\n';
  const body = `export const STARLIGHT_SIDEBAR = ${JSON.stringify(sidebar, null, 2)} as const;\n`;
  writeFileSync(TARGET, `${banner}\n${body}`, 'utf8');
  return { target: TARGET, sidebar };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { target } = generateStarlightSidebar();
  console.log(`wrote ${path.relative(repoRoot, target)}`);
}
