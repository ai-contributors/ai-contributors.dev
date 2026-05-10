import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('quickstart page is backed by the spec README', () => {
  const entry = docsConfig.docs.find((doc) => doc.key === 'quickstart');

  assert.deepEqual(entry?.source, {
    repo: 'spec',
    path: 'README.md',
  });
});

test('quickstart describes the current audit artifact set', async () => {
  // Migrated to Starlight. The
  // page is now porter-emitted from the README.md slice between the
  // `<!-- doc-site:extract:quickstart -->` markers.
  const page = await readFile(path.join(repoRoot, 'src/content/docs/docs/quickstart.md'), 'utf8');

  assert.match(page, /AI-CONTRIBUTOR-AUDIT\.md/);
  assert.match(page, /AI-CONTRIBUTOR-CHECKLIST\.md/);
  assert.match(page, /AI-CONTRIBUTOR-AUDIT-LOG\.md/);
  assert.match(page, /AI-CONTRIBUTOR-EVIDENCE\.json/);
  assert.doesNotMatch(page, /audit\.md \+ evidence\.json/);
});
