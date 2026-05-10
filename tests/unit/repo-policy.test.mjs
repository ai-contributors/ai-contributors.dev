import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

test('package dependencies are pinned to exact versions', async () => {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.pnpm?.overrides,
  };

  const ranged = Object.entries(dependencies)
    .filter(([, version]) => /^[~^*]|[<>=]|\s+\|\|\s+/.test(version))
    .map(([name, version]) => `${name}@${version}`);

  assert.deepEqual(ranged, []);
});
