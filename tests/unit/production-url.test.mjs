import assert from 'node:assert/strict';
import test from 'node:test';

import { productionUrl } from '../../scripts/pages-routing.mjs';

test('productionUrl preserves the published documentation base path', () => {
  assert.equal(productionUrl('levels/'), 'https://ai-contributors.dev/ai-contributor-spec/levels/');
});
