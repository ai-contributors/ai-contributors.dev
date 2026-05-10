import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { productionUrl } from './pages-routing.mjs';
import { readDocsConfig } from './spec-content.routes.mjs';
import { getSpecRoot, SOURCE_ROUTES } from './spec-content.mjs';

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
  const sections = [];
  for (const route of SOURCE_ROUTES) {
    const body = await readFile(path.join(getSpecRoot(), route.source), 'utf8');
    sections.push(`# ${route.source}\n\nSource: ${route.source}\n\n${body}`);
  }
  await writeFileIfAbsent(llmsFullPath, `${sections.join('\n\n---\n\n')}\n`);
}
