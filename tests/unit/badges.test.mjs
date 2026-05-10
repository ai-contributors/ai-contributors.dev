import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BADGE_LEVELS,
  badgeMarkdownForLevel,
  pinnedBadgeMarkdownForLevel,
} from '../../src/data/badges.ts';
import { SPEC } from '../../src/data/spec.generated.ts';

test('badge data covers L0 through L4', () => {
  assert.deepEqual(
    BADGE_LEVELS.map((level) => level.id),
    ['L0', 'L1', 'L2', 'L3', 'L4'],
  );
  assert.deepEqual(
    BADGE_LEVELS.map((level) => level.name),
    SPEC.levels.map((level) => level.label),
  );
});

test('badge markdown uses shields.io URLs and links to ai-contributors.dev conformance levels', () => {
  assert.equal(
    badgeMarkdownForLevel('L3'),
    '[![AI Contributor: L3 AI Authored](https://img.shields.io/badge/AI%20Contributor-L3%20AI%20Authored-blueviolet)](https://ai-contributors.dev/ai-contributor-spec/docs/conformance-levels/)',
  );
  assert.equal(
    badgeMarkdownForLevel('L2'),
    '[![AI Contributor: L2 AI Assisted](https://img.shields.io/badge/AI%20Contributor-L2%20AI%20Assisted-green)](https://ai-contributors.dev/ai-contributor-spec/docs/conformance-levels/)',
  );
});

test('pinned badge markdown links to the rendered spec version', () => {
  assert.match(pinnedBadgeMarkdownForLevel('L4'), /L4 AI Autonomous/);
  assert.match(pinnedBadgeMarkdownForLevel('L4'), new RegExp(`rev=${SPEC.version}`));
  assert.match(pinnedBadgeMarkdownForLevel('L4'), new RegExp(`/releases/tag/${SPEC.version}`));
});

test('badge markdown rejects unknown levels', () => {
  assert.throws(() => badgeMarkdownForLevel('L9'), /Unknown AI Contributor level/);
});
