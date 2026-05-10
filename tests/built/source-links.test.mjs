import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

const repoRoots = {
  spec: 'https://github.com/ai-contributors/ai-contributor-spec/blob/main/',
  site: 'https://github.com/ai-contributors/ai-contributors.dev/blob/main/',
};

function htmlPathFor(routePath) {
  const normalized = routePath.replace(/^\/+|\/+$/g, '');
  return normalized === 'docs'
    ? path.join(repoRoot, 'dist', 'docs', 'index.html')
    : path.join(repoRoot, 'dist', normalized, 'index.html');
}

test('built docs TOC footers render configured source links', async () => {
  for (const entry of docsConfig.docs) {
    const html = await readFile(htmlPathFor(entry.path), 'utf8');
    if (!html.includes('class="dx-toc-foot"')) continue;

    const expectedHref = `${repoRoots[entry.source.repo]}${entry.source.path}`;
    const expectedLabel = `View source (${entry.source.repo}/${path.basename(entry.source.path)})`;

    assert.match(html, new RegExp(`href="${expectedHref.replaceAll('.', '\\.')}"`), entry.key);
    assert.ok(html.includes(expectedLabel), `${entry.key} renders ${expectedLabel}`);
  }
});
