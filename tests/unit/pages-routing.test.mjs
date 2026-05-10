import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CUSTOM_DOMAIN,
  PRODUCTION_BASE,
  PRODUCTION_DIR,
  productionRedirectHtml,
  previewBaseForPr,
} from '../../scripts/pages-routing.mjs';

test('production site is served from the ai-contributor-spec subfolder', () => {
  assert.equal(CUSTOM_DOMAIN, 'https://ai-contributors.dev');
  assert.equal(PRODUCTION_BASE, '/ai-contributor-spec/');
  assert.equal(PRODUCTION_DIR, 'ai-contributor-spec');
});

test('root redirect points browser users to the production subfolder', () => {
  const html = productionRedirectHtml();

  assert.match(html, /<meta http-equiv="refresh" content="0; url=\/ai-contributor-spec\/">/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/ai-contributors\.dev\/ai-contributor-spec\/">/,
  );
});

test('PR preview base matches the custom-domain preview path', () => {
  assert.equal(previewBaseForPr(123), '/pr-preview/pr-123/');
});
