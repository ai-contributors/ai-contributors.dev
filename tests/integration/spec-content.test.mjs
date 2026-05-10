import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
} from '../../scripts/spec-content.mjs';

async function makeSpecRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'ai-contributor-spec-'));
  for (const sourcePath of getRequiredSourcePaths()) {
    const fullPath = path.join(root, sourcePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    // Body has an H1 + lede paragraph, then a body line that the
    // porter should keep after injecting site-owned frontmatter.
    const body = `# Title for ${sourcePath}\n\nLede paragraph for ${sourcePath}.\n\nSource body for ${sourcePath}.\n`;
    await writeFile(fullPath, body, 'utf8');
  }
  return root;
}

test('source manifest is projected from docs.config.json spec Markdown entries', () => {
  assert.ok(getRequiredSourcePaths().includes('skills/ai-contributor-audit/SKILL.md'));
  assert.ok(getRequiredSourcePaths().includes('AI-CONTRIBUTOR-SPECIFICATION.md'));
  assert.equal(getRequiredSourcePaths().includes('AI-CONTRIBUTOR-RULE-CATALOG.json'), false);
});

test('source route table carries source + generated file + Starlight + config entry', () => {
  for (const route of SOURCE_ROUTES) {
    assert.deepEqual(
      Object.keys(route).sort(),
      ['entry', 'file', 'sidebarOrder', 'source', 'starlightFile', 'starlightSlug'],
      `route ${route.source ?? 'unknown'} carries unexpected keys`,
    );
    assert.equal(typeof route.starlightSlug, 'string');
    // starlightFile is null for entries flagged starlightHandAuthored in
    // docs.config.json (the .mdx is hand-authored alongside; the porter
    // does not write to src/content/docs/<path>.md for those).
    if (route.starlightFile !== null) {
      assert.equal(typeof route.starlightFile, 'string');
      assert.equal(route.starlightFile.endsWith('.md'), true);
    }
    assert.equal(typeof route.sidebarOrder, 'number');
  }
});

test('generated docs directory is visible to Astro content sync', () => {
  assert.notEqual(path.basename(GENERATED_DOCS_ROOT).startsWith('_'), true);
});

test('assertSpecSource passes when all expected files exist', async () => {
  const root = await makeSpecRoot();
  assert.doesNotThrow(() => assertSpecSource({ root }));
  await rm(root, { recursive: true, force: true });
});

test('assertSpecSource fails clearly when the submodule root is missing', () => {
  const missingRoot = path.join(tmpdir(), 'missing-ai-contributor-spec');
  assert.throws(() => assertSpecSource({ root: missingRoot }), /Spec submodule is missing/);
});

test('assertSpecSource reports all missing required files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'partial-ai-contributor-spec-'));
  assert.throws(
    () => assertSpecSource({ root }),
    (error) => {
      assert.match(error.message, /Missing required spec source files/);
      assert.match(error.message, /AI-CONTRIBUTOR-SPECIFICATION\.md/);
      assert.match(error.message, /skills\/ai-contributor-audit\/SKILL\.md/);
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
  assert.doesNotThrow(() => assertSpecSource({ root }));

  await rm(repoRoot, { recursive: true, force: true });
});

test('generateDocs derives title + deck from body and emits no structural frontmatter', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  const starlightOutDir = await mkdtemp(path.join(tmpdir(), 'starlight-docs-'));
  const result = await generateDocs({ root, outDir, starlightOutDir });
  const specification = await readFile(
    path.join(outDir, 'ai-contributor-specification.md'),
    'utf8',
  );

  assert.equal(result.generated.length, SOURCE_ROUTES.length);
  // Title comes from body H1, not from a route column.
  assert.match(specification, /title: "Title for AI-CONTRIBUTOR-SPECIFICATION\.md"/);
  // Deck comes from the lede paragraph after the H1.
  assert.match(specification, /deck: "Lede paragraph for AI-CONTRIBUTOR-SPECIFICATION\.md\."/);
  // Structural/nav frontmatter is site-owned and no longer passed through.
  assert.doesNotMatch(specification, /^section:/m);
  assert.doesNotMatch(specification, /^spec_rev:/m);
  assert.doesNotMatch(specification, /^order:/m);
  // H1 + lede are stripped from the body so they don't double-render.
  assert.doesNotMatch(specification, /^# Title for/m);
  assert.doesNotMatch(specification, /^Lede paragraph for/m);
  // Body content after the lede survives.
  assert.match(specification, /Source body for AI-CONTRIBUTOR-SPECIFICATION\.md/);
  assert.ok(existsSync(path.join(outDir, 'ai-contributor-specification.md')));

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
  await rm(starlightOutDir, { recursive: true, force: true });
});

test('generateDocs preserves source YAML frontmatter as compact metadata', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  const starlightOutDir = await mkdtemp(path.join(tmpdir(), 'starlight-docs-'));
  const skillRoute = SOURCE_ROUTES.find(
    (route) => route.source === 'skills/ai-contributor-audit/SKILL.md',
  );
  assert.ok(skillRoute);

  await writeFile(
    path.join(root, skillRoute.source),
    [
      '---',
      'name: ai-contributor-audit',
      'description: Audit skill metadata.',
      '---',
      '',
      '# AI Contributor Audit',
      '',
      'Run a reproducible conformance audit.',
      '',
      'Body after the lede.',
      '',
    ].join('\n'),
    'utf8',
  );

  await generateDocs({ root, outDir, starlightOutDir });

  const generated = await readFile(path.join(outDir, skillRoute.file), 'utf8');
  assert.match(generated, /^title: "AI Contributor Audit"/m);
  assert.match(generated, /^deck: "Run a reproducible conformance audit\."/m);
  assert.match(
    generated,
    /```yaml\nname: ai-contributor-audit\ndescription: Audit skill metadata\.\n```/,
  );
  assert.doesNotMatch(generated, /^---\nname: ai-contributor-audit/m);
  assert.doesNotMatch(generated, /^# AI Contributor Audit/m);
  assert.match(generated, /Body after the lede\./);

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
  await rm(starlightOutDir, { recursive: true, force: true });
});

test('generateDocs fails loudly on asymmetric extract markers', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  const starlightOutDir = await mkdtemp(path.join(tmpdir(), 'starlight-docs-'));

  // Pick the first spec-backed route and corrupt its source by
  // emitting only the begin marker for a route key that exists in
  // docs.config.json.
  const firstRoute = SOURCE_ROUTES[0];
  const corruptKey = firstRoute.entry.key;
  const corruptBody =
    `# Title\n\nLede.\n\nBefore.\n\n` +
    `<!-- doc-site:extract:${corruptKey} -->\n` +
    `Inside slice.\n\nAfter (no closing marker).\n`;
  await writeFile(path.join(root, firstRoute.source), corruptBody, 'utf8');

  await assert.rejects(
    () => generateDocs({ root, outDir, starlightOutDir }),
    /asymmetric extract markers/,
  );

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
  await rm(starlightOutDir, { recursive: true, force: true });
});

test('generateDocs updates expected files before removing stale files', async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), 'generated-docs-'));
  const starlightOutDir = await mkdtemp(path.join(tmpdir(), 'starlight-docs-'));
  await writeFile(
    path.join(outDir, 'ai-contributor-specification.md'),
    'old specification',
    'utf8',
  );
  await writeFile(path.join(outDir, 'stale.md'), 'stale route', 'utf8');

  await generateDocs({ root, outDir, starlightOutDir });

  const specification = await readFile(
    path.join(outDir, 'ai-contributor-specification.md'),
    'utf8',
  );
  assert.match(specification, /Source body for AI-CONTRIBUTOR-SPECIFICATION\.md/);
  assert.equal(existsSync(path.join(outDir, 'stale.md')), false);

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
  await rm(starlightOutDir, { recursive: true, force: true });
});

test('getSpecVersionMetadata falls back to stale-flagged sentinel when git is unavailable', () => {
  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    const metadata = getSpecVersionMetadata({ root: path.join(tmpdir(), 'not-a-git-repo') });
    assert.equal(metadata.tag, 'unknown');
    assert.equal(metadata.shortSha, 'unknown');
    assert.equal(metadata.sha, 'unknown');
    assert.equal(metadata.stale, true);
  } finally {
    console.warn = originalWarn;
  }
  assert.match(warnings.join('\n'), /SP-1\.5/);
});
