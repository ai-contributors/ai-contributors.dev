import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');
const basePath = '/ai-contributor-spec/';

function htmlPathFor(routePath) {
  const normalized = routePath.replace(/^\/+|\/+$/g, '');
  return normalized === 'docs'
    ? path.join(repoRoot, 'dist', 'docs', 'index.html')
    : path.join(repoRoot, 'dist', normalized, 'index.html');
}

function hrefFor(routePath) {
  const normalized = routePath.replace(/^\/+|\/+$/g, '');
  return `${basePath}${normalized === 'docs' ? 'docs/' : normalized}`;
}

function sidebarSectionLabels(html) {
  return [...html.matchAll(/<summary class="dx-sidebar-summary">([^<]+)<\/summary>/g)].map(
    (match) => match[1],
  );
}

test('built sidebar keeps configured section order and current page state', async () => {
  const expectedSections = [...new Set(docsConfig.docs.map((entry) => entry.section))];

  for (const entry of docsConfig.docs) {
    const html = await readFile(htmlPathFor(entry.path), 'utf8');
    if (!html.includes('class="dx-sidebar"')) continue;

    assert.deepEqual(sidebarSectionLabels(html), expectedSections, entry.key);

    const currentLinks = [...html.matchAll(/<a href="([^"]+)" class="is-current">/g)];
    assert.equal(currentLinks.length, 1, `${entry.key} has one current sidebar item`);
    assert.equal(
      currentLinks[0][1],
      hrefFor(entry.path),
      `${entry.key} current href matches route`,
    );
  }
});
