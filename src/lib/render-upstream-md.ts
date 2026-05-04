import { readFileSync } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const SPEC_ROOT = path.resolve(process.cwd(), 'external/ai-contributor-spec');

interface RenderResult {
  html: string;
  title: string;
}

/**
 * Render an upstream spec-submodule markdown file to HTML.
 * Strips the leading H1 (becomes the page title) so the template can render it.
 *
 * The content is rendered verbatim — to rephrase or restructure, edit the
 * upstream `external/ai-contributor-spec` source.
 */
export function renderUpstreamMd(relativePath: string): RenderResult {
  const md = readFileSync(path.join(SPEC_ROOT, relativePath), 'utf8');
  const stripped = md.replace(/^---\n[\s\S]*?\n---\n+/, '');
  const h1Match = stripped.match(/^#\s+(.+?)\s*$/m);
  const title = h1Match ? h1Match[1] : '';
  const body = h1Match ? stripped.replace(h1Match[0], '') : stripped;
  const html = marked.parse(body, { gfm: true, breaks: false, async: false }) as string;
  return { html, title };
}
