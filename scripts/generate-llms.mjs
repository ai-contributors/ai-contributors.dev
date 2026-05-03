import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { productionUrl } from './pages-routing.mjs';
import { SOURCE_ROUTES, SPEC_ROOT } from './spec-content.mjs';

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
  const index = [
    '# AI Contributor Spec',
    '',
    '> Guardrails for repositories where AI reads, writes, reviews, or releases code.',
    '',
    '## Docs',
    ...SOURCE_ROUTES.map((route) => `- [${route.title}](${productionUrl(`${route.slug}/`)})`),
    '',
  ].join('\n');
  await writeFileIfAbsent(llmsPath, index);
}

if (!existsSync(llmsFullPath)) {
  const sections = [];
  for (const route of SOURCE_ROUTES) {
    const body = await readFile(path.join(SPEC_ROOT, route.source), 'utf8');
    sections.push(`# ${route.title}\n\nSource: ${route.source}\n\n${body}`);
  }
  await writeFileIfAbsent(llmsFullPath, `${sections.join('\n\n---\n\n')}\n`);
}
