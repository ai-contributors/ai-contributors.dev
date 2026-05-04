export type BadgeLevelId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface BadgeLevel {
  id: BadgeLevelId;
  name: string;
  color: string;
}

// Names mirror the upstream spec's "Which level do you need?" table.
// Colors are this site's UX choice (shields.io color names).
export const BADGE_LEVELS: BadgeLevel[] = [
  { id: 'L0', name: 'Baseline Hygiene', color: 'lightgrey' },
  { id: 'L1', name: 'Hardened', color: 'blue' },
  { id: 'L2', name: 'AI Assisted', color: 'green' },
  { id: 'L3', name: 'AI Authored', color: 'blueviolet' },
  { id: 'L4', name: 'AI Autonomous', color: 'brightgreen' },
];

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
  return `[![AI Contributor: ${level.id} ${level.name}](${badgeUrlForLevel(level.id)})](https://ai-contributors.dev/ai-contributor-spec/)`;
}
