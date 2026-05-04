import { readFileSync } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const SPEC_ROOT = path.resolve(process.cwd(), 'external/ai-contributor-spec');

interface TocEntry {
  text: string;
  anchor: string;
  depth: 2 | 3;
}

interface RenderResult {
  html: string;
  title: string;
  toc: TocEntry[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Render an upstream spec-submodule markdown file to HTML.
 * Strips the leading H1 (becomes the page title) so the template can render it.
 * Adds id attributes to H2/H3 and returns a TOC.
 *
 * Content is rendered verbatim — to rephrase or restructure, edit the upstream
 * external/ai-contributor-spec source.
 */
export function renderUpstreamMd(relativePath: string): RenderResult {
  const md = readFileSync(path.join(SPEC_ROOT, relativePath), 'utf8');
  const stripped = md.replace(/^---\n[\s\S]*?\n---\n+/, '');
  const h1Match = stripped.match(/^#\s+(.+?)\s*$/m);
  const title = h1Match ? h1Match[1] : '';
  const body = h1Match ? stripped.replace(h1Match[0], '') : stripped;

  const renderer = new marked.Renderer();
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ('text' in t ? (t.text as string) : '')).join('');
    let anchor = slugify(text);
    if (!anchor) anchor = `h-${toc.length + 1}`;
    const count = seen.get(anchor) ?? 0;
    seen.set(anchor, count + 1);
    if (count > 0) anchor = `${anchor}-${count}`;
    if (depth === 2 || depth === 3) {
      toc.push({ text, anchor, depth: depth as 2 | 3 });
    }
    return `<h${depth} id="${anchor}">${text}</h${depth}>\n`;
  };

  const html = marked.parse(body, {
    gfm: true,
    breaks: false,
    async: false,
    renderer,
  }) as string;
  return { html, title, toc };
}
