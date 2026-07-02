import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { productionUrl } from './pages-routing.mjs';
import { readDocsConfig } from './spec-content.routes.mjs';
import { GENERATED_DOCS_ROOT, SOURCE_ROUTES } from './spec-content.mjs';

function readDocNav() {
  return readDocsConfig().docs.map((entry) => ({
    key: entry.key,
    path: entry.path,
    title: entry.title ?? entry.label,
    section: entry.section,
  }));
}

const dist = path.resolve('dist');
const llmsPath = path.join(dist, 'llms.txt');
const llmsFullPath = path.join(dist, 'llms-full.txt');

async function writeFileIfAbsent(file, data) {
  try {
    await writeFile(file, data, { encoding: 'utf8', flag: 'wx' });
  } catch (error) {
    if (error?.code !== 'EEXIST') {
      throw error;
    }
  }
}

if (!existsSync(dist)) {
  console.error('dist/ does not exist. Run astro build before generate-llms.');
  process.exit(1);
}

await mkdir(dist, { recursive: true });

if (!existsSync(llmsPath)) {
  const navEntries = readDocNav();
  const bySection = new Map();
  for (const entry of navEntries) {
    if (!bySection.has(entry.section)) bySection.set(entry.section, []);
    bySection.get(entry.section).push(entry);
  }
  const sectionLines = [];
  for (const [section, items] of bySection) {
    sectionLines.push(`### ${section}`, '');
    for (const item of items) {
      sectionLines.push(`- [${item.title}](${productionUrl(item.path)})`);
    }
    sectionLines.push('');
  }
  const index = [
    '# AI Contributor Spec',
    '',
    '> Guardrails for repositories where AI reads, writes, reviews, or releases code.',
    '',
    '## Docs',
    '',
    ...sectionLines,
  ].join('\n');
  await writeFileIfAbsent(llmsPath, index);
}

if (!existsSync(llmsFullPath)) {
  // Read the committed ported copies under src/content/generated-spec/ so
  // the build never touches the spec submodule; a clean clone without
  // submodules must still build (AIC-clean-clone-bootstrap). The porter
  // strips each upstream H1 + lede into `title:` / `deck:` frontmatter
  // (scripts/spec-content.mjs buildFrontmatter), so fold both back — title
  // as the heading and deck as the intro paragraph — to keep llms-full.txt
  // actually full.
  const yamlUnescape = (value) => value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  const frontmatterField = (fm, key) => {
    const m = fm.match(new RegExp(`^${key}: "((?:[^"\\\\]|\\\\.)*)"\\s*$`, 'm'));
    return m ? yamlUnescape(m[1]) : null;
  };
  const sections = [];
  for (const route of SOURCE_ROUTES) {
    const raw = await readFile(path.join(GENERATED_DOCS_ROOT, route.file), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    let body = raw;
    let title = route.source;
    let deck = null;
    if (fm) {
      body = raw.slice(fm[0].length);
      title = frontmatterField(fm[1], 'title') ?? title;
      deck = frontmatterField(fm[1], 'deck');
    }
    const intro = deck ? `${deck}\n\n` : '';
    sections.push(`# ${title}\n\nSource: ${route.source}\n\n${intro}${body}`);
  }
  await writeFileIfAbsent(llmsFullPath, `${sections.join('\n\n---\n\n')}\n`);
}
