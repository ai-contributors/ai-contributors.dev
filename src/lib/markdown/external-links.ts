import { visit } from 'unist-util-visit';

const EXTERNAL_PROTOCOLS = new Set(['http:', 'https:']);

type VisitTree = Parameters<typeof visit>[0];
type HastElement = {
  tagName?: string;
  properties?: Record<string, unknown>;
};

function isExternalHref(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  try {
    return EXTERNAL_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

function relWithSecurity(value: unknown): string {
  const tokens = new Set(typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : []);
  tokens.add('noopener');
  tokens.add('noreferrer');
  return [...tokens].join(' ');
}

export default function rehypeExternalLinks() {
  return (tree: VisitTree) => {
    visit(tree, 'element', (node) => {
      const element = node as HastElement;
      if (element.tagName !== 'a') return;
      const properties = element.properties ?? {};
      if (!isExternalHref(properties.href)) return;

      properties.target = '_blank';
      properties.rel = relWithSecurity(properties.rel);
      element.properties = properties;
    });
  };
}
