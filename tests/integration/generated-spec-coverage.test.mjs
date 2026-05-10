import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { GENERATED_DOCS_ROOT, SOURCE_ROUTES } from '../../scripts/spec-content.mjs';

test('spec markdown routes map one-to-one with generated content files', async () => {
  const sources = SOURCE_ROUTES.map((route) => route.source);
  const generatedFiles = SOURCE_ROUTES.map((route) => route.file);
  const filesOnDisk = (await readdir(GENERATED_DOCS_ROOT))
    .filter((file) => file.endsWith('.md'))
    .sort();

  assert.equal(new Set(sources).size, sources.length, 'spec source markdown paths are unique');
  assert.equal(
    new Set(generatedFiles).size,
    generatedFiles.length,
    'generated markdown targets are unique',
  );
  assert.deepEqual(generatedFiles.toSorted(), filesOnDisk);

  for (const file of generatedFiles) {
    assert.equal(path.extname(file), '.md', `${file} is a generated markdown content entry`);
  }
});
