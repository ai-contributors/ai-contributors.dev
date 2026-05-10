import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import docsConfig from '../../docs.config.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '../..');

function htmlPathFor(routePath) {
  const normalized = routePath.replace(/^\/+|\/+$/g, '');
  return normalized === 'docs'
    ? path.join(repoRoot, 'dist', 'docs', 'index.html')
    : path.join(repoRoot, 'dist', normalized, 'index.html');
}

test('every configured nav route has built HTML', () => {
  for (const entry of docsConfig.docs) {
    assert.equal(
      existsSync(htmlPathFor(entry.path)),
      true,
      `${entry.key} should build ${entry.path}`,
    );
  }
});
