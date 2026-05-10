import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const distRoot = path.join(repoRoot, 'dist');
const activeBase = process.env.ASTRO_BASE ?? '/ai-contributor-spec/';
const origin = 'https://ai-contributors.dev';

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

function builtTargetForPathname(pathname) {
  const withoutBase = pathname.slice(activeBase.length).replace(/^\/+/, '');
  if (withoutBase === '') return path.join(distRoot, 'index.html');
  if (withoutBase.endsWith('/')) return path.join(distRoot, withoutBase, 'index.html');
  if (path.extname(withoutBase)) return path.join(distRoot, withoutBase);
  return path.join(distRoot, withoutBase, 'index.html');
}

function hasFragmentTarget(html, fragment) {
  if (!fragment || fragment === '_top') return true;
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(?:id|name)=["']${escaped}["']`).test(html);
}

test('built same-site links resolve to generated files and anchors', async () => {
  const failures = [];
  const htmlByFile = new Map();

  for (const file of await htmlFiles(distRoot)) {
    const html = await readFile(file, 'utf8');
    htmlByFile.set(file, html);

    for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('mailto:') ||
        value.startsWith('data:')
      ) {
        continue;
      }

      const currentPath = `${activeBase}${path.relative(distRoot, file).replace(/\\/g, '/')}`;
      const currentUrl = new URL(currentPath, origin);
      const url = new URL(value, currentUrl);
      if (url.origin !== origin || !url.pathname.startsWith(activeBase)) continue;

      const target = value.startsWith('#') ? file : builtTargetForPathname(url.pathname);
      let targetHtml = htmlByFile.get(target);
      if (targetHtml === undefined) {
        try {
          const stats = await stat(target);
          if (!stats.isFile()) throw new Error('not a file');
          targetHtml = target.endsWith('.html') ? await readFile(target, 'utf8') : '';
          htmlByFile.set(target, targetHtml);
        } catch {
          failures.push(
            `${path.relative(repoRoot, file)}: ${value} -> missing ${path.relative(repoRoot, target)}`,
          );
          continue;
        }
      }

      if (
        url.hash &&
        target.endsWith('.html') &&
        !hasFragmentTarget(targetHtml, decodeURIComponent(url.hash.slice(1)))
      ) {
        failures.push(`${path.relative(repoRoot, file)}: ${value} -> missing anchor ${url.hash}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
