import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('coverage map visual summary lives on the coverage-map docs page only', async () => {
  // Migrated to Starlight MDX.
  const specification = await readFile(
    path.join(repoRoot, 'src/content/docs/specification.mdx'),
    'utf8',
  );
  // The coverage-map page is a Starlight MDX content-collection
  // entry that imports the CoverageMap component; the bespoke
  // /specification page must still not embed it.
  const coveragePage = await readFile(
    path.join(repoRoot, 'src/content/docs/docs/coverage-map.mdx'),
    'utf8',
  );

  assert.doesNotMatch(specification, /CoverageMap|appendix-coverage|Coverage map/);
  assert.match(coveragePage, /CoverageMap/);
});
