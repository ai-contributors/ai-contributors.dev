import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(import.meta.dirname, '..');

test('Lighthouse CI measures the active deployed base path', () => {
  process.env.ASTRO_BASE = '/pr-preview/pr-3/';
  delete require.cache[require.resolve('../.lighthouserc.cjs')];

  const config = require('../.lighthouserc.cjs');

  assert.equal(config.ci.collect.staticDistDir, './.lhci-dist');
  assert.deepEqual(config.ci.collect.url, [
    '/pr-preview/pr-3/',
    '/pr-preview/pr-3/docs/',
    '/pr-preview/pr-3/specification/',
    '/pr-preview/pr-3/audit/model/',
    '/pr-preview/pr-3/audit/prompt/',
    '/pr-preview/pr-3/guide/typescript-pnpm/',
    '/pr-preview/pr-3/skills/audit/',
  ]);
});

test('spec validation and generation stay strict about missing submodules', async () => {
  const generateDocsCli = await readFile(path.join(repoRoot, 'scripts/generate-docs.mjs'), 'utf8');
  const validateSpecCli = await readFile(
    path.join(repoRoot, 'scripts/validate-spec-source.mjs'),
    'utf8',
  );

  assert.doesNotMatch(generateDocsCli, /ensureSpecSourceReady/);
  assert.doesNotMatch(validateSpecCli, /ensureSpecSourceReady/);
});

test('build and type-check do not implicitly prepare spec sources', async () => {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));

  assert.equal(packageJson.scripts.prebuild, undefined);
  assert.equal(packageJson.scripts['pretype-check'], undefined);
  assert.equal(packageJson.scripts.precheck, undefined);
});

test('secret scanning uses the tracked-file scanner instead of a path allowlist', async () => {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));

  assert.equal(packageJson.scripts['secretlint:scan'], 'node scripts/secret-scan-tracked.mjs');
  assert.match(packageJson.scripts['secret:scan'], /secretlint:scan/);
  assert.doesNotMatch(packageJson.scripts['secret:scan'], /AGENTS\.md|docs\/\*\*/);
});

test('CI keeps non-hook quality gates enforced', async () => {
  const deployWorkflow = await readFile(
    path.join(repoRoot, '.github/workflows/deploy.yml'),
    'utf8',
  );

  assert.match(deployWorkflow, /pnpm format:check/);
  assert.match(deployWorkflow, /pnpm lint/);
  assert.match(deployWorkflow, /pnpm deps:check/);
  assert.match(deployWorkflow, /pnpm secret:scan/);
});
