import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SOURCE_ROUTES } from './spec-content.routes.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const SPEC_REPO_URL = 'https://github.com/ai-contributors/ai-contributor-spec';

// Pick the spec root in priority order:
//   1. SPEC_ROOT_OVERRIDE env (explicit caller intent — wins).
//   2. The pinned submodule, if it has every required source file.
//   3. A sibling `../ai-contributor-spec` checkout, if it has every
//      required source file.
//   4. Fall through to the submodule path; assertSpecSource() then
//      fails with a clear "missing required spec source files" error.
//
// (3) is the dev-loop fallback for branches that consume content
// that has not landed on `main` of the spec repo yet (see the
// "Consume-branch pattern" section of docs/architecture.md). It
// mirrors the convention of keeping the spec repo as a sibling
// checkout of the site repo.
//
// Resolved lazily on first access so importing this module from a
// test or script doesn't trigger filesystem checks (and the
// sibling-fallback warning) at import time.
let _specRoot;
export function getSpecRoot() {
  if (_specRoot !== undefined) return _specRoot;
  if (process.env.SPEC_ROOT_OVERRIDE) {
    return (_specRoot = path.resolve(process.env.SPEC_ROOT_OVERRIDE));
  }
  const submodule = path.join(repoRoot, 'external/ai-contributor-spec');
  const required = SOURCE_ROUTES.map((r) => r.source);
  const hasAll = (root) =>
    existsSync(root) && required.every((rel) => existsSync(path.join(root, rel)));
  if (hasAll(submodule)) return (_specRoot = submodule);

  const sibling = path.resolve(repoRoot, '..', 'ai-contributor-spec');
  if (hasAll(sibling)) {
    console.warn(
      `[spec-content] submodule at ${path.relative(repoRoot, submodule)} is missing required ` +
        `files; using sibling checkout at ${sibling}. Set SPEC_ROOT_OVERRIDE to silence this ` +
        `warning, or update the submodule pin once upstream merges.`,
    );
    return (_specRoot = sibling);
  }
  return (_specRoot = submodule);
}

export const GENERATED_DOCS_ROOT = path.join(repoRoot, 'src/content/generated-spec');
export const STARLIGHT_DOCS_ROOT = path.join(repoRoot, 'src/content/docs');
export const SPEC_METADATA_PATH = path.join(repoRoot, 'src/data/spec-source.generated.json');

export { SOURCE_ROUTES };

export function getRequiredSourcePaths() {
  return SOURCE_ROUTES.map((route) => route.source);
}

export function assertSpecSource({ root = getSpecRoot() } = {}) {
  if (!existsSync(root)) {
    throw new Error(
      `Spec submodule is missing at ${root}. Run: git submodule update --init --recursive`,
    );
  }

  const missing = getRequiredSourcePaths().filter((sourcePath) => {
    return !existsSync(path.join(root, sourcePath));
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required spec source files in ${root}:\n${missing.map((item) => `- ${item}`).join('\n')}`,
    );
  }
}

export async function ensureSpecSourceReady({
  root = getSpecRoot(),
  repoRoot: targetRepoRoot = repoRoot,
  runCommand = execFileSync,
} = {}) {
  try {
    assertSpecSource({ root });
    return false;
  } catch {
    const relativeRoot = path.relative(targetRepoRoot, root);
    await Promise.resolve(
      runCommand('git', [
        '-C',
        targetRepoRoot,
        'submodule',
        'update',
        '--init',
        '--recursive',
        relativeRoot,
      ]),
    );
    assertSpecSource({ root });
    return true;
  }
}

function yamlEscape(value) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Pull title + deck from the rendered body's first H1 and first paragraph,
// then strip both from the body so the rendered doc page does not show
// the H1 + lede twice (once from the page header, once from <Content/>).
//
// Assumptions:
//   1. The deck is a SINGLE paragraph. Multi-paragraph ledes are not
//      supported by Starlight's `description:` field anyway, so the
//      function deliberately stops at the first blank line after the
//      lede starts. If a source has a multi-paragraph lede, the second
//      paragraph silently becomes body — we warn so authors can reshape.
//   2. Soft-wrapped lines inside the lede join with a single space.
//      Explicit hard breaks (two-space line endings, `<br>`) are
//      flattened into the description.
//   3. Leading blockquotes and blank lines between the H1 and the lede
//      are skipped; once a non-blockquote paragraph starts, blockquotes
//      embedded inside it would still terminate it (rare in upstream MD).
function extractTitleAndDeck(body, sourcePath) {
  const lines = body.split('\n');
  let title;
  let deck;
  let h1Line = -1;

  for (let i = 0; i < lines.length; i++) {
    const m = /^#\s+(.+?)\s*$/.exec(lines[i]);
    if (m) {
      title = m[1].trim();
      h1Line = i;
      break;
    }
  }
  if (h1Line < 0) return { title: undefined, deck: undefined, body };

  // Find first paragraph after the H1, skipping blockquotes and blanks.
  let paraStart = -1;
  for (let i = h1Line + 1; i < lines.length; i++) {
    const ln = lines[i];
    if (ln === '' || ln.startsWith('>')) continue;
    if (ln.startsWith('#')) break;
    paraStart = i;
    break;
  }

  let paraEnd = paraStart;
  if (paraStart >= 0) {
    while (paraEnd + 1 < lines.length && lines[paraEnd + 1] !== '') paraEnd++;
    deck = lines
      .slice(paraStart, paraEnd + 1)
      .join(' ')
      .trim();

    // Look ahead one paragraph: if the next non-blank line is more body
    // text (not a heading), the source has a multi-paragraph lede that
    // we just dropped. Warn so the author can either collapse to one
    // paragraph or override `deck` in docs.config.json.
    for (let i = paraEnd + 1; i < lines.length; i++) {
      const ln = lines[i];
      if (ln === '') continue;
      if (ln.startsWith('#')) break;
      const where = sourcePath ? ` in ${sourcePath}` : '';
      console.warn(
        `[spec-content] multi-paragraph lede detected${where}; only the first paragraph ` +
          `becomes the deck/description. Collapse to a single paragraph or set "deck" ` +
          `explicitly in docs.config.json.`,
      );
      break;
    }
  }

  // Strip H1 line and (if found) the lede paragraph from the body.
  const stripTo = paraStart >= 0 ? paraEnd : h1Line;
  const newLines = [...lines.slice(0, h1Line), ...lines.slice(stripTo + 1)];
  while (newLines.length && newLines[0] === '') newLines.shift();
  return { title, deck, body: newLines.join('\n') };
}

function buildFrontmatter({ title, deck }) {
  const lines = ['---'];
  if (title) lines.push(`title: "${yamlEscape(title)}"`);
  if (deck) lines.push(`deck: "${yamlEscape(deck)}"`);
  lines.push('---', '');
  return lines.join('\n');
}

function preserveLeadingYamlFrontmatter(body) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(body);
  if (!match) return body;

  const metadata = match[1].trim();
  const rest = body.slice(match[0].length).replace(/^\r?\n/, '');
  if (!metadata) return rest;

  return `\`\`\`yaml\n${metadata}\n\`\`\`\n\n${rest}`;
}

// Starlight-shaped frontmatter for the `docs` content collection consumed
// by @astrojs/starlight. Maps the porter's deck → Starlight's description
// so generated pages get OG/SEO metadata without a second extraction pass.
function buildStarlightFrontmatter({ title, deck, sidebarOrder, sidebarLabel }) {
  const lines = ['---'];
  if (title) lines.push(`title: "${yamlEscape(title)}"`);
  if (deck) lines.push(`description: "${yamlEscape(deck)}"`);
  if (sidebarOrder !== undefined || sidebarLabel) {
    lines.push('sidebar:');
    if (sidebarLabel) lines.push(`  label: "${yamlEscape(sidebarLabel)}"`);
    if (sidebarOrder !== undefined) lines.push(`  order: ${sidebarOrder}`);
  }
  lines.push('---', PORTER_MARKER, '');
  return lines.join('\n');
}

async function rmEmptyDirsUnder(root) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subdir = path.join(root, entry.name);
      await rmEmptyDirsUnder(subdir);
      try {
        await rm(subdir, { recursive: false });
      } catch {
        /* not empty */
      }
    }
  }
}

async function stageCopy(root, sourcePath) {
  return readFile(path.join(root, sourcePath), 'utf8');
}

// Extract the section bounded by `<!-- doc-site:extract:<key> -->` and the
// matching `<!-- /doc-site:extract:<key> -->` if both markers are present.
// This honors upstream [U11]: docs that share a multi-section source (the
// README, the GUIDE) can mark exactly which slice the docs site shows.
// When no marker is present the full body is returned verbatim. Asymmetric
// markers (begin without end or vice versa) throw — silently shipping the
// whole body in that case has previously masked typo'd close-marker tags
// and produced 5x-too-long pages.
function applyExtractMarkers(body, key, sourcePath) {
  const begin = `<!-- doc-site:extract:${key} -->`;
  const end = `<!-- /doc-site:extract:${key} -->`;
  const beginIdx = body.indexOf(begin);
  const endIdx = body.indexOf(end);
  if (beginIdx < 0 && endIdx < 0) return body;
  if (beginIdx < 0 || endIdx < 0 || endIdx <= beginIdx) {
    const where = sourcePath ? ` in ${sourcePath}` : '';
    throw new Error(
      `[spec-content] asymmetric extract markers for key "${key}"${where}: ` +
        `found begin=${beginIdx >= 0}, end=${endIdx >= 0}, end-after-begin=${endIdx > beginIdx}. ` +
        `Both markers must be present and the end must follow the begin.`,
    );
  }
  return body.slice(beginIdx + begin.length, endIdx).trim();
}

function stageInject(markdownBody, entry, sourcePath) {
  const sliced = applyExtractMarkers(markdownBody, entry.key, sourcePath);
  const bodyWithMetadata = preserveLeadingYamlFrontmatter(sliced);
  const extracted = extractTitleAndDeck(bodyWithMetadata, sourcePath);
  return {
    // Fall back to entry.label when the extracted slice does not start
    // with an H1 (e.g. the quickstart marker bounds skip the source
    // document's leading title). Starlight requires a title.
    title: entry.title ?? extracted.title ?? entry.label,
    deck: entry.deck ?? extracted.deck,
    body: extracted.body,
  };
}

// Marker emitted as an HTML comment after the frontmatter of every
// porter-generated Starlight MD. The sweep deletes only files carrying
// this marker, so hand-authored pages in src/content/docs/ (e.g. the
// starlight-test sandbox, future site-authored level checklists) are
// preserved across porter runs.
const PORTER_MARKER = '<!-- generated by scripts/spec-content.mjs; do not edit -->';

async function sweepStarlightStale(root, expectedTargets) {
  const walk = async (dir) => {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const child = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(child);
        continue;
      }
      if (!entry.isFile() || expectedTargets.has(child)) continue;
      // Read the whole file rather than the first 1KB. Generated MD/MDX
      // are kilobytes at most and reading them entirely removes a latent
      // failure: enlarged frontmatter (extra sidebar fields, longer
      // descriptions) could push the marker past a fixed-size window
      // and silently leave stale files un-swept.
      const contents = await readFile(child, 'utf8').catch(() => '');
      if (contents.includes(PORTER_MARKER)) {
        await rm(child, { force: true });
      }
    }
  };
  await walk(root);
}

export async function generateDocs({
  root = getSpecRoot(),
  outDir = GENERATED_DOCS_ROOT,
  starlightOutDir = STARLIGHT_DOCS_ROOT,
} = {}) {
  assertSpecSource({ root });
  await mkdir(outDir, { recursive: true });
  await mkdir(starlightOutDir, { recursive: true });

  const generated = [];
  const expectedGeneratedSpecTargets = new Set();
  const expectedStarlightTargets = new Set();
  for (const route of SOURCE_ROUTES) {
    const rawBody = await stageCopy(root, route.source);
    const { title, deck, body } = stageInject(rawBody, route.entry, route.source);

    // Body-only frontmatter for the generatedSpec content collection,
    // consumed by MDX pages (e.g. coverage-map.mdx, rule-catalog.mdx)
    // that inject upstream prose alongside their own components via
    // `getEntry('generatedSpec', …)` + `render()`.
    const generatedSpecTarget = path.join(outDir, route.file);
    expectedGeneratedSpecTargets.add(generatedSpecTarget);
    await writeFile(generatedSpecTarget, `${buildFrontmatter({ title, deck })}${body}`, 'utf8');

    let starlightTarget = null;
    if (route.starlightFile) {
      starlightTarget = path.join(starlightOutDir, route.starlightFile);
      expectedStarlightTargets.add(starlightTarget);
      await mkdir(path.dirname(starlightTarget), { recursive: true });
      const sidebarLabel =
        route.entry.label && route.entry.label !== title ? route.entry.label : undefined;
      const starlightFrontmatter = buildStarlightFrontmatter({
        title,
        deck,
        sidebarOrder: route.sidebarOrder,
        sidebarLabel,
      });
      await writeFile(starlightTarget, `${starlightFrontmatter}${body}`, 'utf8');
    }

    generated.push({ ...route, target: generatedSpecTarget, starlightTarget, title, deck });
  }

  for (const entry of await readdir(outDir, { withFileTypes: true })) {
    const target = path.join(outDir, entry.name);
    if (entry.isFile() && !expectedGeneratedSpecTargets.has(target)) {
      await rm(target, { force: true });
    }
  }

  // Preserve hand-authored Starlight pages by deleting only files carrying
  // the porter marker (PORTER_MARKER) emitted into Starlight frontmatter.
  await sweepStarlightStale(starlightOutDir, expectedStarlightTargets);
  await rmEmptyDirsUnder(starlightOutDir);

  return { generated };
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

export function getSpecVersionMetadata({ root = getSpecRoot() } = {}) {
  try {
    const sha = git(root, ['rev-parse', 'HEAD']);
    const shortSha = git(root, ['rev-parse', '--short', 'HEAD']);
    let tag = 'unknown';
    try {
      tag = git(root, ['describe', '--exact-match', '--tags', 'HEAD']);
    } catch {
      tag = git(root, ['describe', '--tags', '--abbrev=0']);
    }

    return {
      tag,
      sha,
      shortSha,
      tagUrl: `${SPEC_REPO_URL}/releases/tag/${tag}`,
      commitUrl: `${SPEC_REPO_URL}/tree/${sha}`,
    };
  } catch (err) {
    // Silent 'unknown' would ship dist/ with no version stamp and quietly
    // violate SP-1.5 ("every published page SHOULD show the spec submodule
    // version tag with the short SHA"). Warn loudly and add a `stale: true`
    // flag so callers (and tests) can detect the degraded mode.
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[spec-content] could not read spec version metadata at ${root}: ${message}. ` +
        `Stamping with 'unknown'/stale=true; SP-1.5 cannot be honoured for this build.`,
    );
    return {
      tag: 'unknown',
      sha: 'unknown',
      shortSha: 'unknown',
      tagUrl: SPEC_REPO_URL,
      commitUrl: SPEC_REPO_URL,
      stale: true,
    };
  }
}

export async function writeSpecMetadata({
  root = getSpecRoot(),
  target = SPEC_METADATA_PATH,
} = {}) {
  const metadata = getSpecVersionMetadata({ root });
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  return metadata;
}
