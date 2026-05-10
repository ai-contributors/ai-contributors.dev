import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

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

function hasArtifacts(root: string): boolean {
  return ARTIFACTS.every((artifact) => existsSync(path.join(root, artifact.path)));
}

export function pickAuditArtifactRoot(): string {
  if (process.env.SPEC_ROOT_OVERRIDE) return path.resolve(process.env.SPEC_ROOT_OVERRIDE);

  const submodule = path.join(repoRoot, 'external/ai-contributor-spec');
  if (hasArtifacts(submodule)) return submodule;

  const sibling = path.resolve(repoRoot, '..', 'ai-contributor-spec');
  if (hasArtifacts(sibling)) return sibling;

  return submodule;
}

export function loadSpecAuditArtifacts(root = pickAuditArtifactRoot()): AuditArtifact[] {
  return ARTIFACTS.map((artifact) => {
    const content = readFileSync(path.join(root, artifact.path), 'utf8');
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
