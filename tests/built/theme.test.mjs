import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

async function builtHtml(route) {
  return readFile(path.join(repoRoot, 'dist', route, 'index.html'), 'utf8');
}

test('built pages initialize theme from the site-owned storage key', async () => {
  const home = await builtHtml('');
  const docs = await builtHtml('docs');

  for (const html of [home, docs]) {
    assert.match(html, /localStorage\.getItem\('theme-mode'\)/);
    assert.doesNotMatch(html, /localStorage\.getItem\('starlight-theme'\)/);
    assert.doesNotMatch(html, /localStorage\.setItem\('starlight-theme'/);
    assert.doesNotMatch(html, /localStorage\.getItem\('theme'\)/);
    assert.doesNotMatch(html, /localStorage\.setItem\('theme'/);
  }
});
