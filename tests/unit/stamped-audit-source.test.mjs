import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('stamped audit page is backed by the spec audit artifact root summary', () => {
  const entry = docsConfig.docs.find((doc) => doc.key === 'stamped-audit');

  assert.deepEqual(entry?.source, {
    repo: 'spec',
    path: 'AI-CONTRIBUTOR-AUDIT.md',
  });
});

test('stamped audit page renders loaded audit artifacts instead of hardcoded example data', async () => {
  // Migrated to Starlight MDX.
  const page = await readFile(
    path.join(repoRoot, 'src/content/docs/docs/stamped-audit.mdx'),
    'utf8',
  );

  assert.match(page, /loadSpecAuditArtifacts/);
  assert.doesNotMatch(page, /e5b1c7af3d8a14f9c2b07e6195d3f4a8c0a9b811/);
});
