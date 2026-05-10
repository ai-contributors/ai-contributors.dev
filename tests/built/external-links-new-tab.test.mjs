import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const distRoot = path.join(repoRoot, 'dist');

async function* htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      yield fullPath;
    }
  }
}

function attributesFor(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\s([a-zA-Z:-]+)(?:=(["'])(.*?)\2)?/g)].map(([, name, , value = '']) => [
      name.toLowerCase(),
      value,
    ]),
  );
}

test('built external links open in a new tab', async () => {
  const failures = [];

  for await (const file of htmlFiles(distRoot)) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/<a\b[^>]*\bhref=(["'])(https?:\/\/[^"']+)\1[^>]*>/g)) {
      const [tag, , href] = match;
      const attrs = attributesFor(tag);
      const relTokens = new Set((attrs.rel ?? '').split(/\s+/).filter(Boolean));

      if (attrs.target !== '_blank' || !relTokens.has('noreferrer')) {
        failures.push(`${path.relative(repoRoot, file)}: ${href}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
