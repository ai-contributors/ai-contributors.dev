import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('conformance levels use vertical cards with integrated badges', async () => {
  // Migrated to Starlight MDX.
  const page = await readFile(
    path.join(repoRoot, 'src/content/docs/docs/conformance-levels.mdx'),
    'utf8',
  );

  assert.match(page, /level-card-list/);
  assert.match(page, /level-card/);
  assert.match(page, /badgeMarkdownForLevel/);
  assert.match(page, /pinnedBadgeMarkdownForLevel/);
  assert.doesNotMatch(page, /<div class="levels-table"/);
  assert.doesNotMatch(page, /<div class="badge-stack">/);
});

test('homepage uses a compact five-level badge band', async () => {
  const page = await readFile(path.join(repoRoot, 'src/pages/index.astro'), 'utf8');

  assert.match(page, /level-band/);
  assert.match(page, /BADGE_LEVELS\.map/);
  assert.doesNotMatch(page, /BADGE_LEVELS\.filter\(\(level\) => level\.id !== 'L0'\)/);
});
