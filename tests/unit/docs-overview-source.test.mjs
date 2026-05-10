import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('docs overview stays site-authored but derives navigation from docs config', async () => {
  // Migrated to Starlight MDX.
  // The overview is still site-authored (it derives from docs.config and
  // SPEC) — it just lives in the Starlight content collection now.
  const overview = docsConfig.docs.find((entry) => entry.key === 'overview');

  assert.deepEqual(overview?.source, {
    repo: 'site',
    path: 'src/content/docs/docs/index.mdx',
  });

  const page = await readFile(path.join(repoRoot, 'src/content/docs/docs/index.mdx'), 'utf8');
  assert.match(page, /docsConfig/);
  // The reduce() that builds DOC_SECTIONS got renamed; assert the
  // section-grouping logic still lives on the page.
  assert.match(page, /reduce\(\(acc, entry\) =>/);
  assert.doesNotMatch(page, /<a class=\\"dx-overview-tile\\" href=\\"__PAGE__quickstart\\">/);
  assert.doesNotMatch(page, /data-lvl=\\"L0\\"/);
});
