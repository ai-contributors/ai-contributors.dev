import generated from '../data/audit-artifacts.generated.json';

export type AuditArtifact = {
  key: string;
  label: string;
  path: string;
  description: string;
  content: string;
  lineCount: number;
};

const ARTIFACTS = [
  {
    key: 'root',
    label: 'Root summary',
    path: 'AI-CONTRIBUTOR-AUDIT.md',
    description:
      'Repo-root summary projected by the stamper from the checklist level summary and backlog.',
  },
  {
    key: 'checklist',
    label: 'Checklist',
    path: '.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md',
    description:
      'Full scoring surface: status, comment, automation marker, and spec IDs for every audit row.',
  },
  {
    key: 'audit-log',
    label: 'Audit log',
    path: '.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md',
    description:
      'Evidence ledger for commands, hosted-setting checks, stamped collector rows, and manual rows.',
  },
] as const;

// Content is ported from the pinned spec source into a committed generated
// file by `pnpm prepare:spec` (scripts/generate-spec-data.mjs) so the build
// never reads the submodule; a clean clone without submodules must build.
export function loadSpecAuditArtifacts(): AuditArtifact[] {
  return ARTIFACTS.map((artifact) => {
    const content = (generated.artifacts as Record<string, string>)[artifact.path];
    if (typeof content !== 'string') {
      throw new Error(
        `audit artifact missing from src/data/audit-artifacts.generated.json: ${artifact.path} — run \`pnpm prepare:spec\``,
      );
    }
    return {
      ...artifact,
      content,
      lineCount: content.split('\n').length,
    };
  });
}

export function excerpt(content: string, maxLines: number): string {
  const lines = content.trimEnd().split('\n');
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines) clipped.push('...');
  return clipped.join('\n');
}
