import config from '@/docs-config';

export type DocNavSource = {
  /** Which repository the canonical content lives in. */
  repo: 'spec' | 'site';
  /** Path within that repo. Used to build the "View source" GitHub URL. */
  path: string;
};

export type DocNavSourceInput = DocNavSource & {
  /** Role this source plays for pages assembled from multiple inputs. */
  role: string;
};

export type DocNavEntry = {
  key: string;
  path: string;
  title: string;
  label: string;
  section: string;
  deck?: string;
  tag?: string;
  /** Where the canonical content for this page lives. */
  source: DocNavSource;
  /** Full provenance list for pages assembled from multiple sources. */
  sourceInputs?: DocNavSourceInput[];
};

type DocsConfigEntry = Omit<DocNavEntry, 'title'> & {
  title?: string;
};

const docsConfig = config as { docs: DocsConfigEntry[] };

export const DOC_NAV: DocNavEntry[] = docsConfig.docs.map((entry) => ({
  ...entry,
  title: entry.title ?? entry.label,
}));

// Resolve the eyebrow line for a page identified by its URL path. The
// Starlight content-collection entry id is the same shape as the
// docs.config `path` field (e.g. "docs/skill-fix" or "audit/prompt"),
// so the Starlight PageTitle override can call this directly. Returns
// undefined for slugs not in docs.config (e.g. the starlight-test
// sandbox), letting the override fall through to the default.
export function eyebrowForPath(path: string): string | undefined {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  const entry = DOC_NAV.find((e) => e.path.replace(/^\/+|\/+$/g, '') === normalized);
  return entry ? `${entry.section} › ${entry.title}` : undefined;
}

const REPO_ROOTS: Record<DocNavSource['repo'], string> = {
  spec: 'https://github.com/ai-contributors/ai-contributor-spec/blob/main/',
  site: 'https://github.com/ai-contributors/ai-contributors.dev/blob/main/',
};

export function sourceFor(
  key: string,
): { href: string; repo: DocNavSource['repo']; path: string } | undefined {
  const entry = DOC_NAV.find((e) => e.key === key);
  if (!entry) return undefined;
  return {
    href: `${REPO_ROOTS[entry.source.repo]}${entry.source.path}`,
    repo: entry.source.repo,
    path: entry.source.path,
  };
}
