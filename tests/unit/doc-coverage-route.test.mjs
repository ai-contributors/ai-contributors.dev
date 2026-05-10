import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('doc coverage has a non-gap route and is generated from docs config', async () => {
  const byKey = new Map(docsConfig.docs.map((entry) => [entry.key, entry]));

  assert.equal(byKey.has('gap'), false);
  assert.equal(byKey.has('doc-coverage'), true);
  // Migrated to Starlight MDX.
  assert.deepEqual(byKey.get('doc-coverage')?.source, {
    repo: 'site',
    path: 'src/content/docs/docs/doc-coverage.mdx',
  });
  assert.equal(byKey.get('doc-coverage')?.path, 'docs/doc-coverage');
  assert.equal(byKey.get('doc-coverage')?.label, 'Published pages');

  assert.equal(existsSync(path.join(repoRoot, 'src/pages/docs/gap-analysis.astro')), false);
  assert.equal(existsSync(path.join(repoRoot, 'src/content/docs/docs/doc-coverage.mdx')), true);

  const page = await readFile(
    path.join(repoRoot, 'src/content/docs/docs/doc-coverage.mdx'),
    'utf8',
  );
  assert.match(page, /docsConfig/);
  assert.match(page, /sourceInputsFor/);
  assert.match(page, /coverage-source-list/);
  assert.doesNotMatch(page, /gap-analysis/);
});
