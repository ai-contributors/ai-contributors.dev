#!/usr/bin/env node
// Asserts every docs.config.json entry has a matching .astro page,
// and that every doc page (under src/pages/docs, audit, guide) has a
// nav entry. Run from `pnpm check`. Exits non-zero on drift.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(readFileSync('docs.config.json', 'utf8'));
const schema = JSON.parse(readFileSync('docs.config.schema.json', 'utf8'));
const entries = config.docs ?? [];

function pagePathFor(navPath) {
  const stripped = navPath.replace(/\/+$/, '');
  if (stripped === 'docs') return 'src/pages/docs/index.astro';
  return `src/pages/${stripped}.astro`;
}

// Pages migrated to Starlight live under src/content/docs/<navPath>.{md,mdx}
// (the porter mirrors entry.path into the docs collection slug; hand-
// authored MDX wrappers can take over for component-rich pages). Used
// by check-doc-nav to accept either backing during the migration.
function starlightContentPathsFor(navPath) {
  const stripped = navPath.replace(/\/+$/, '');
  const base = stripped === 'docs' ? 'src/content/docs/docs/index' : `src/content/docs/${stripped}`;
  return [`${base}.md`, `${base}.mdx`];
}

function walkPages(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkPages(p));
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}

const errors = [];

function validateDocsConfig() {
  if (
    schema.properties?.schemaVersion?.const &&
    config.schemaVersion !== schema.properties.schemaVersion.const
  ) {
    errors.push(
      `docs.config.json schemaVersion must be "${schema.properties.schemaVersion.const}"`,
    );
  }
  if (!Array.isArray(config.docs) || config.docs.length === 0) {
    errors.push('docs.config.json docs must be a non-empty array');
    return;
  }
  for (const [i, entry] of config.docs.entries()) {
    const prefix = `docs.config.json docs[${i}]`;
    for (const field of ['key', 'path', 'section', 'label']) {
      if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
        errors.push(`${prefix}.${field} must be a non-empty string`);
      }
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.key ?? '')) {
      errors.push(`${prefix}.key must be kebab-case`);
    }
    if (!/^[a-z0-9][a-z0-9/-]*$/.test(entry.path ?? '')) {
      errors.push(`${prefix}.path must be a relative docs URL path`);
    }
    if (!entry.source || typeof entry.source !== 'object') {
      errors.push(`${prefix}.source is required`);
      continue;
    }
    if (!['spec', 'site'].includes(entry.source.repo)) {
      errors.push(`${prefix}.source.repo must be "spec" or "site"`);
    }
    if (typeof entry.source.path !== 'string' || entry.source.path.trim() === '') {
      errors.push(`${prefix}.source.path must be a non-empty string`);
    }
    if (entry.sourceInputs !== undefined) {
      if (!Array.isArray(entry.sourceInputs) || entry.sourceInputs.length === 0) {
        errors.push(`${prefix}.sourceInputs must be a non-empty array when present`);
      } else {
        for (const [j, sourceInput] of entry.sourceInputs.entries()) {
          const inputPrefix = `${prefix}.sourceInputs[${j}]`;
          if (!sourceInput || typeof sourceInput !== 'object') {
            errors.push(`${inputPrefix} must be an object`);
            continue;
          }
          if (!['spec', 'site'].includes(sourceInput.repo)) {
            errors.push(`${inputPrefix}.repo must be "spec" or "site"`);
          }
          if (typeof sourceInput.path !== 'string' || sourceInput.path.trim() === '') {
            errors.push(`${inputPrefix}.path must be a non-empty string`);
          }
          if (typeof sourceInput.role !== 'string' || sourceInput.role.trim() === '') {
            errors.push(`${inputPrefix}.role must be a non-empty string`);
          }
        }
      }
    }
    for (const optional of ['title', 'deck', 'tag']) {
      if (entry[optional] !== undefined && typeof entry[optional] !== 'string') {
        errors.push(`${prefix}.${optional} must be a string when present`);
      }
    }
  }
}

validateDocsConfig();

// 1. every nav entry has a page backing — either a hand-rolled .astro
//    page under src/pages/, or a Starlight content-collection MD/MDX
//    under src/content/docs/.
for (const { key, path } of entries) {
  const astroFile = pagePathFor(path);
  const starlightFiles = starlightContentPathsFor(path);
  if (!existsSync(astroFile) && !starlightFiles.some((f) => existsSync(f))) {
    errors.push(
      `nav entry "${key}" (path: "${path}") has no backing page (${astroFile} or ${starlightFiles.join(' or ')})`,
    );
  }
}

// 2. every doc page has a nav entry
const PAGE_DIRS = ['src/pages/docs', 'src/pages/audit', 'src/pages/guide'];
const navPagePaths = new Set(entries.map((e) => pagePathFor(e.path)));
// pages that are explicitly not in the nav
const ALLOWLIST = new Set();
for (const dir of PAGE_DIRS) {
  for (const file of walkPages(dir)) {
    if (navPagePaths.has(file) || ALLOWLIST.has(file)) continue;
    errors.push(`page ${file} has no entry in docs.config.json`);
  }
}

// 3. duplicate keys
const seen = new Map();
for (const { key } of entries) {
  seen.set(key, (seen.get(key) ?? 0) + 1);
}
for (const [key, count] of seen) {
  if (count > 1) errors.push(`duplicate doc-nav key: "${key}" appears ${count} times`);
}

// 4. anchor validation: every __PAGE__<key>#frag in any body must
//    resolve to a heading id in the target page.
//    For porter-emitted pages, IDs come from `id="..."` in the .astro.
//    For derive pages, IDs come from the rendered markdown — explicit
//    `## Heading {#anchor}` markers (U2) win, otherwise the auto-slug
//    that rehype-slug / github-slugger emits from the heading text.

import GithubSlugger from 'github-slugger';

const DERIVE_RE = /<DerivedDocPage\s+source="([^"]+)"/;
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*(?:\{#([a-zA-Z0-9_-]+)\})?\s*$/gm;

function deriveSourceFor(astroPath) {
  if (!existsSync(astroPath)) return null;
  const m = DERIVE_RE.exec(readFileSync(astroPath, 'utf8'));
  return m ? m[1] : null;
}

function extractHeadingIdsFromMd(mdPath) {
  if (!existsSync(mdPath)) return new Set();
  const src = readFileSync(mdPath, 'utf8');
  // Strip front-matter so it doesn't interfere with the regex.
  const body = src.startsWith('---\n') ? src.slice(src.indexOf('\n---', 4) + '\n---'.length) : src;
  const ids = new Set();
  const slugger = new GithubSlugger();
  for (const m of body.matchAll(HEADING_RE)) {
    const text = m[2].replace(/`([^`]+)`/g, '$1').trim();
    const explicit = m[3];
    ids.add(explicit ?? slugger.slug(text));
  }
  return ids;
}

const idsByKey = new Map();
for (const { key, path: navPath } of entries) {
  const file = pagePathFor(navPath);
  const ids = new Set();

  // (a) explicit id="..." in the .astro source (porter-emitted pages).
  if (existsSync(file)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/\bid=(?:\\"|")([a-z][a-z0-9-]*)(?:\\"|")/g)) {
      ids.add(m[1]);
    }
    // Pages that emit ids from a data array can't be matched by the
    // static regex above; declare them explicitly with a comment:
    //   {/* check-doc-nav:ids foo bar baz */}     (in Astro markup)
    //   // check-doc-nav:ids foo bar baz          (in TS frontmatter)
    //   <!-- check-doc-nav:ids foo bar baz -->    (HTML comment)
    const declRe = /(?:\/\*|<!--|\/\/)\s*check-doc-nav:ids\s+([^*>\n]+?)\s*(?:\*\/|-->|\n|$)/g;
    for (const m of src.matchAll(declRe)) {
      for (const id of m[1].split(/\s+/)) if (id) ids.add(id);
    }
  }

  // (b) headings in the upstream-derived MD (derive pages).
  const deriveSource = deriveSourceFor(file);
  if (deriveSource) {
    const mdPath = `src/content/generated-spec/${deriveSource}.md`;
    for (const id of extractHeadingIdsFromMd(mdPath)) ids.add(id);
  }

  idsByKey.set(key, ids);
}

const REF_RE = /__PAGE__([a-z0-9-]+)#([a-zA-Z0-9_-]+)/g;
for (const dir of PAGE_DIRS) {
  for (const file of walkPages(dir)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(REF_RE)) {
      const [, targetKey, frag] = m;
      const ids = idsByKey.get(targetKey);
      if (!ids) {
        errors.push(`${file}: link to unknown nav key "${targetKey}"`);
        continue;
      }
      if (!ids.has(frag)) {
        errors.push(`${file}: __PAGE__${targetKey}#${frag} → no id="${frag}" in target`);
      }
    }
  }
}

if (errors.length) {
  console.error('check-doc-nav: drift detected');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`check-doc-nav: ok (${entries.length} entries; docs.config.json validated)`);
