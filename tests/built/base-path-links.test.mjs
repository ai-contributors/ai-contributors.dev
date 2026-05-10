import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const distRoot = path.join(repoRoot, 'dist');
const activeBase = process.env.ASTRO_BASE ?? '/ai-contributor-spec/';
const allowedPrefixes = [activeBase, '#', 'http://', 'https://', 'mailto:', 'data:'];

async function htmlFiles(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const file = path.join(dir, name);
    const stats = await stat(file);
    if (stats.isDirectory()) out.push(...(await htmlFiles(file)));
    else if (file.endsWith('.html')) out.push(file);
  }
  return out;
}

test('built internal links and assets keep the active base path', async () => {
  const failures = [];

  for (const file of await htmlFiles(distRoot)) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (!value.startsWith('/')) continue;
      if (allowedPrefixes.some((prefix) => value.startsWith(prefix))) continue;
      failures.push(`${path.relative(repoRoot, file)}: ${value}`);
    }
  }

  assert.deepEqual(failures, []);
});
