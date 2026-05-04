import assert from 'node:assert/strict';
import test from 'node:test';

import { assertSpecSource, SOURCE_ROUTES } from '../../scripts/spec-content.mjs';

test('pinned specification source supports all generated route inputs', async () => {
  await assert.doesNotReject(() => assertSpecSource());
  assert.equal(SOURCE_ROUTES.length, 0);
  assert.ok(SOURCE_ROUTES.every((route) => route.source.endsWith('.md')));
});
