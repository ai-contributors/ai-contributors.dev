/* Single source of truth for the docs sidebar + Cmd-K search index.
 * Stub pages from the design (Quickstart, Glossary, Audit overview,
 * Audit CI integration, Conformance levels) are intentionally excluded —
 * they need to land upstream first. See README "Concerns".
 */

export interface DocsNavItem {
  key: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface DocsNavGroup {
  key: string;
  label: string;
  items: DocsNavItem[];
}

export interface SearchHit {
  kind: string;
  title: string;
  url: string;
  headings: Array<{ text: string; anchor: string }>;
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    key: 'start',
    label: 'Start',
    items: [{ key: 'overview', label: 'Overview', href: '/docs/' }],
  },
  {
    key: 'specification',
    label: 'Specification',
    items: [
      { key: 'spec', label: 'Full specification', href: '/specification/' },
      { key: 'coverage', label: 'Coverage matrix', href: '/specification/#coverage' },
    ],
  },
  {
    key: 'audit',
    label: 'Audit',
    items: [
      { key: 'audit-model', label: 'Audit evidence model', href: '/audit/model/' },
      { key: 'audit-prompt', label: 'No-install prompt', href: '/audit/prompt/' },
    ],
  },
  {
    key: 'guides',
    label: 'Guides',
    items: [{ key: 'guide-ts', label: 'TypeScript + pnpm', href: '/guide/typescript-pnpm/' }],
  },
  {
    key: 'skills',
    label: 'Skills',
    items: [{ key: 'skills-audit', label: 'ai-contributor-audit', href: '/skills/audit/' }],
  },
  {
    key: 'reference',
    label: 'Reference',
    items: [
      {
        key: 'spec-repo',
        label: 'Spec repo on GitHub',
        href: 'https://github.com/ai-contributors/ai-contributor-spec',
        external: true,
      },
    ],
  },
];

/* Linear page order for prev/next pagination. Skips external entries. */
export const DOCS_ORDER: Array<{ key: string; label: string; href: string }> = [
  { key: 'overview', label: 'Overview', href: '/docs/' },
  { key: 'spec', label: 'Full specification', href: '/specification/' },
  { key: 'audit-model', label: 'Audit evidence model', href: '/audit/model/' },
  { key: 'audit-prompt', label: 'No-install prompt', href: '/audit/prompt/' },
  { key: 'guide-ts', label: 'TypeScript + pnpm', href: '/guide/typescript-pnpm/' },
  { key: 'skills-audit', label: 'ai-contributor-audit', href: '/skills/audit/' },
];

export function getPrevNext(currentKey: string) {
  const idx = DOCS_ORDER.findIndex((p) => p.key === currentKey);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? DOCS_ORDER[idx - 1] : undefined,
    next: idx < DOCS_ORDER.length - 1 ? DOCS_ORDER[idx + 1] : undefined,
  };
}
