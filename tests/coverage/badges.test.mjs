import { describe, expect, it } from 'vitest';

import { BADGE_LEVELS, badgeMarkdownForLevel } from '../../src/data/badges';
import { SPEC } from '../../src/data/spec.generated';

describe('badge coverage guardrail', () => {
  it('covers all conformance levels with badge markdown', () => {
    expect(BADGE_LEVELS.map((level) => level.id)).toEqual(['L0', 'L1', 'L2', 'L3', 'L4']);
    expect(BADGE_LEVELS.map((level) => level.name)).toEqual(
      SPEC.levels.map((level) => level.label),
    );

    for (const level of BADGE_LEVELS) {
      expect(badgeMarkdownForLevel(level.id)).toContain(`AI Contributor: ${level.id}`);
    }
  });

  it('rejects unknown levels', () => {
    expect(() => badgeMarkdownForLevel('L5')).toThrow('Unknown AI Contributor level: L5');
  });
});
