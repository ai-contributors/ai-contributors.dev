import assert from "node:assert/strict";
import test from "node:test";

import { BADGE_LEVELS, badgeMarkdownForLevel } from "../src/data/badges.ts";

test("badge data covers L0 through L4", () => {
  assert.deepEqual(
    BADGE_LEVELS.map((level) => level.id),
    ["L0", "L1", "L2", "L3", "L4"]
  );
});

test("badge markdown uses shields.io URLs and links to ai-contributors.dev levels", () => {
  assert.equal(
    badgeMarkdownForLevel("L3"),
    "[![AI Contributor: L3 AI Authored](https://img.shields.io/badge/AI%20Contributor-L3%20AI%20Authored-blueviolet)](https://ai-contributors.dev/ai-contributor-spec/levels/)"
  );
});

test("badge markdown rejects unknown levels", () => {
  assert.throws(() => badgeMarkdownForLevel("L9"), /Unknown AI Contributor level/);
});
