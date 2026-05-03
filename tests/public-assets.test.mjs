import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import test from 'node:test';

test('conventional favicon.ico exists for browser fallback requests', async () => {
  const favicon = await stat('public/favicon.ico');
  assert.ok(favicon.size > 0);
});
