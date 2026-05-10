import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('obsolete source sync plan is not part of the public docs surface', () => {
  assert.equal(
    docsConfig.docs.some((doc) => doc.key === 'source-sync-plan'),
    false,
  );
  assert.equal(existsSync(path.join(repoRoot, 'src/pages/docs/source-sync-plan.astro')), false);
});
