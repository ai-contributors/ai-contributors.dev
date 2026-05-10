import assert from 'node:assert/strict';
import test from 'node:test';

import { assertSpecSource, SOURCE_ROUTES } from '../../scripts/spec-content.mjs';
import { readDocsConfig } from '../../scripts/spec-content.routes.mjs';

test('source manifest stays mechanical', () => {
  const expectedSources = new Set(
    readDocsConfig()
      .docs.filter((entry) => entry.source.repo === 'spec' && entry.source.path.endsWith('.md'))
      .map((entry) => entry.source.path),
  );
  assert.equal(SOURCE_ROUTES.length, expectedSources.size);
  assert.ok(SOURCE_ROUTES.every((route) => route.source.endsWith('.md')));
  assert.ok(SOURCE_ROUTES.every((route) => route.file.endsWith('.md')));
});

test('pinned specification source supports all generated route inputs', async (t) => {
  // Consume-branch sentinel: on a branch that consumes spec-repo
  // content not yet landed in the pinned submodule, the developer
  // points SPEC_ROOT_OVERRIDE at the local sibling checkout. Skip
  // this assertion when no override is set so the test stays green
  // against the pinned submodule on `main`. See the "Consume-branch
  // pattern" section of docs/architecture.md.
  if (!process.env.SPEC_ROOT_OVERRIDE) {
    t.skip('SPEC_ROOT_OVERRIDE not set; using pinned submodule only');
    return;
  }
  assert.doesNotThrow(() => assertSpecSource());
});
