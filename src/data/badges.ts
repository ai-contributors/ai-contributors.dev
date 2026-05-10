import { SPEC } from './spec.generated.ts';

export type BadgeLevelId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface BadgeLevel {
  id: BadgeLevelId;
  name: string;
  order: number;
  color: string;
  description: string;
  workflowSummary: string;
}

const BADGE_COLORS: Record<BadgeLevelId, string> = {
  L0: 'lightgrey',
  L1: 'blue',
  L2: 'green',
  L3: 'blueviolet',
  L4: 'brightgreen',
};

export const BADGE_LEVELS: BadgeLevel[] = SPEC.levels.map((level) => ({
  id: level.id as BadgeLevelId,
  name: level.label,
  order: level.order,
  color: BADGE_COLORS[level.id as BadgeLevelId],
  description: level.description,
  workflowSummary: level.workflowSummary,
}));

function findLevel(levelId: string) {
  const level = BADGE_LEVELS.find((entry) => entry.id === levelId);
  if (!level) {
    throw new Error(`Unknown AI Contributor level: ${levelId}`);
  }
  return level;
}

export function badgeUrlForLevel(levelId: string): string {
  const level = findLevel(levelId);
  const label = encodeURIComponent(`${level.id} ${level.name}`);
  return `https://img.shields.io/badge/AI%20Contributor-${label}-${level.color}`;
}

export function badgeMarkdownForLevel(levelId: string): string {
  const level = findLevel(levelId);
  return `[![AI Contributor: ${level.id} ${level.name}](${badgeUrlForLevel(level.id)})](https://ai-contributors.dev/ai-contributor-spec/docs/conformance-levels/)`;
}

export function pinnedBadgeMarkdownForLevel(levelId: string): string {
  const level = findLevel(levelId);
  return `[![AI Contributor: ${level.id} ${level.name} · spec ${SPEC.version}](${badgeUrlForLevel(level.id)}?rev=${SPEC.version})](https://github.com/ai-contributors/ai-contributor-spec/releases/tag/${SPEC.version})`;
}
