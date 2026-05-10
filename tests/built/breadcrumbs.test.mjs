import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

// Sentinel: every doc route now goes through Starlight, which has
// its own breadcrumb mechanism. The marketing homepage and 404 don't
// render `dx-crumbs` either. The list stays empty so a regression
// that reintroduces a bespoke `dx-crumbs` page would surface here —
// populate this array if a future page reuses the hand-rolled chrome.
const pages = [];

function decodeEntities(value) {
  return value
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function textContent(html) {
  return decodeEntities(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

test('built docs pages render complete topbar breadcrumbs', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(repoRoot, 'dist', page.route, 'index.html'), 'utf8');
    const crumbs = /<nav class="dx-crumbs">([\s\S]*?)<\/nav>/.exec(html)?.[1];

    assert.ok(crumbs, `${page.route} renders dx-crumbs`);
    assert.equal(textContent(crumbs), page.expected);
  }
});
