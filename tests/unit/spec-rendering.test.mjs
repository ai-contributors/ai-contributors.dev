import assert from 'node:assert/strict';
import test from 'node:test';

import { highlightWeight } from '../../src/lib/spec-rendering.ts';

test('highlightWeight wraps RFC keywords without reprocessing generated markup', () => {
  assert.equal(
    highlightWeight('Repositories MUST NOT bypass CI and SHOULD document exceptions.'),
    'Repositories <em class="w-must">MUST NOT</em> bypass CI and <em class="w-should">SHOULD</em> document exceptions.',
  );
});
