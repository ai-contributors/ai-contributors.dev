export type BadgeLevelId = "L0" | "L1" | "L2" | "L3" | "L4";

export interface BadgeLevel {
  id: BadgeLevelId;
  name: string;
  color: string;
  description: string;
}

export const BADGE_LEVELS: BadgeLevel[] = [
  {
    id: "L0",
    name: "Unassessed",
    color: "lightgrey",
    description: "No AI Contributor claim.",
  },
  {
    id: "L1",
    name: "AI Assisted",
    color: "blue",
    description: "AI assists with local tasks under human control.",
  },
  {
    id: "L2",
    name: "AI Reviewed",
    color: "green",
    description: "AI participates in reviewable checks and evidence.",
  },
  {
    id: "L3",
    name: "AI Authored",
    color: "blueviolet",
    description: "AI completes delegated code tasks for human review.",
  },
  {
    id: "L4",
    name: "AI Governed",
    color: "brightgreen",
    description: "AI contribution is governed through stronger automation and oversight.",
  },
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
  const label = encodeURIComponent(`${level.id} ${level.name}`).replace(/%20/g, "%20");
  return `https://img.shields.io/badge/AI%20Contributor-${label}-${level.color}`;
}

export function badgeMarkdownForLevel(levelId: string): string {
  const level = findLevel(levelId);
  return `[![AI Contributor: ${level.id} ${level.name}](${badgeUrlForLevel(level.id)})](https://ai-contributors.dev/ai-contributor-spec/levels/)`;
}
