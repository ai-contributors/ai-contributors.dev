// Route table mapping spec-owned Markdown sources from docs.config.json
// to generated content collection entries. The site-owned JSON config is
// the source of truth for what the docs site publishes; this table is a
// mechanical projection used by the porter.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_CONFIG_PATH = path.join(repoRoot, 'docs.config.json');

// Resolve docs.config.json relative to the repo root, not the caller's
// CWD. Tests and `pnpm` script invocations sometimes run from a
// subdirectory; reading by relative path silently picked up a stale or
// missing file in those cases.
export function readDocsConfig() {
  return JSON.parse(readFileSync(DOCS_CONFIG_PATH, 'utf8'));
}

export function generatedFileForSource(sourcePath) {
  const withoutExt = sourcePath.replace(/\.md$/, '');
  const withoutDocsPrefix = withoutExt.replace(/^docs\//, '');
  return `${withoutDocsPrefix.replace(/[\\/]/g, '-').toLowerCase()}.md`;
}

// Each spec-backed route also projects into Starlight's
// `src/content/docs/` collection, mirroring the public URL so
// Starlight's slug machinery resolves correctly.
//
//   entry.path "docs/quickstart" → starlight slug "docs/quickstart"
//                                  → src/content/docs/docs/quickstart.md
//   entry.path "specification"   → starlight slug "specification"
//                                  → src/content/docs/specification.md
//   entry.path "audit/prompt"    → starlight slug "audit/prompt"
//                                  → src/content/docs/audit/prompt.md
export function starlightSlugForEntryPath(entryPath) {
  return entryPath.replace(/^\/+|\/+$/g, '');
}

export function starlightFileForEntryPath(entryPath) {
  return `${starlightSlugForEntryPath(entryPath)}.md`;
}

export function sourceRoutesFromConfig(config = readDocsConfig()) {
  const seen = new Set();
  const routes = [];
  for (const [index, entry] of config.docs.entries()) {
    if (entry.source.repo !== 'spec' || !entry.source.path.endsWith('.md')) continue;
    if (seen.has(entry.source.path)) continue;
    seen.add(entry.source.path);
    routes.push({
      source: entry.source.path,
      file: generatedFileForSource(entry.source.path),
      // `starlightHandAuthored: true` opts the entry out of the
      // src/content/docs/<path>.md write so a hand-authored .mdx file
      // (with component imports, e.g. coverage-map.mdx) can serve the
      // URL instead. The body still lands in src/content/generated-spec/
      // so the MDX can pull it in via `getEntry('generatedSpec', key)`
      // + `render()` — the dual write is the contract, not legacy.
      starlightFile: entry.starlightHandAuthored ? null : starlightFileForEntryPath(entry.path),
      starlightSlug: starlightSlugForEntryPath(entry.path),
      sidebarOrder: (index + 1) * 10,
      entry,
    });
  }
  return routes;
}

export const SOURCE_ROUTES = sourceRoutesFromConfig();
