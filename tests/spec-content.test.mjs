import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  GENERATED_DOCS_ROOT,
  SOURCE_ROUTES,
  assertSpecSource,
  ensureSpecSourceReady,
  generateDocs,
  getRequiredSourcePaths,
  getSpecVersionMetadata,
} from '../scripts/spec-content.mjs';

async function makeSpecRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'ai-contributor-spec-'));
  for (const sourcePath of getRequiredSourcePaths()) {
    const fullPath = path.join(root, sourcePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, `# ${sourcePath}\n\nSource body for ${sourcePath}.\n`, 'utf8');
  }
  return root;
}

test('source manifest lists the upstream files consumed by custom Astro pages', () => {
  const paths = getRequiredSourcePaths();
  assert.ok(paths.includes('AI-CONTRIBUTOR-AUDIT-MODEL.md'));
  assert.ok(paths.includes('AI-CONTRIBUTOR-AUDIT-PROMPT.md'));
  assert.ok(paths.includes('AI-CONTRIBUTOR-GUIDE.md'));
  assert.ok(paths.includes('skills/ai-contributor-audit/README.md'));
});

test('generated docs directory is visible to Astro content sync', () => {
  assert.notEqual(path.basename(GENERATED_DOCS_ROOT).startsWith('_'), true);
});

test('assertSpecSource passes when all expected files exist', async () => {
  const root = await makeSpecRoot();
  await assert.doesNotReject(() => assertSpecSource({ root }));
  await rm(root, { recursive: true, force: true });
});

test('assertSpecSource fails clearly when the submodule root is missing', async () => {
  const missingRoot = path.join(tmpdir(), 'missing-ai-contributor-spec');
  await assert.rejects(() => assertSpecSource({ root: missingRoot }), /Spec submodule is missing/);
});

test('assertSpecSource reports all missing required files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'partial-ai-contributor-spec-'));
  await assert.rejects(
    () => assertSpecSource({ root }),
    (error) => {
      assert.match(error.message, /Missing required spec source files/);
      assert.match(error.message, /AI-CONTRIBUTOR-AUDIT-MODEL\.md/);
      assert.match(error.message, /skills\/ai-contributor-audit\/README\.md/);
      return true;
    },
  );
  await rm(root, { recursive: true, force: true });
});

test('ensureSpecSourceReady initializes missing submodule source', async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'site-repo-'));
  const root = path.join(repoRoot, 'external/ai-contributor-spec');
  const calls = [];

  const initialized = await ensureSpecSourceReady({
    root,
    repoRoot,
    runCommand: async (command, args) => {
      calls.push([command, args]);
      for (const sourcePath of getRequiredSourcePaths()) {
        const fullPath = path.join(root, sourcePath);
        await mkdir(path.dirname(fullPath), { recursive: true });
        await writeFile(fullPath, `# ${sourcePath}\n`, 'utf8');
      }
    },
  });

  assert.equal(initialized, true);
  assert.deepEqual(calls, [
    [
      'git',
      [
        '-C',
        repoRoot,
        'submodule',
        'update',
        '--init',
        '--recursive',
        'external/ai-contributor-spec',
      ],
    ],
  ]);
  await assert.doesNotReject(() => assertSpecSource({ root }));

  await rm(repoRoot, { recursive: true, force: true });
});

test('generateDocs writes no Starlight routes (custom Astro pages now own all rendering)', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  const result = await generateDocs({ root, outDir });

  assert.equal(SOURCE_ROUTES.length, 0);
  assert.equal(result.generated.length, 0);

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
});

test('generateDocs sweeps stale files even when no routes are configured', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  await writeFile(path.join(outDir, 'stale.md'), 'stale route', 'utf8');

  await generateDocs({ root, outDir });

  assert.equal(existsSync(path.join(outDir, 'stale.md')), false);

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
});

test('getSpecVersionMetadata falls back when git metadata is unavailable', () => {
  const metadata = getSpecVersionMetadata({ root: path.join(tmpdir(), 'not-a-git-repo') });
  assert.equal(metadata.tag, 'unknown');
  assert.equal(metadata.shortSha, 'unknown');
  assert.equal(metadata.sha, 'unknown');
});
