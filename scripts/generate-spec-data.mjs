// Generates src/data/spec.generated.ts from the pinned upstream
// AI-CONTRIBUTOR-RULE-CATALOG.json. Intent prose (which is not in the
// catalog) is read from src/data/spec-intents.json and merged in.
//
// The output shape matches what src/pages/specification.astro consumes.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getSpecRoot } from './spec-content.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(getSpecRoot(), 'AI-CONTRIBUTOR-RULE-CATALOG.json');
const INTENTS = path.join(repoRoot, 'src/data/spec-intents.json');
const OUT = path.join(repoRoot, 'src/data/spec.generated.ts');
const META = path.join(repoRoot, 'src/data/spec-source.generated.json');

// Pillar number → slug. Stable across spec revisions; prototype's CSS keys off these.
const PILLAR_SLUGS = {
  1: 'engineering',
  2: 'security',
  3: 'quality',
  4: 'release',
  5: 'agents',
  6: 'risk',
  7: 'oversight',
};
const PILLAR_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const SCOPE_TO_W = {
  MUST: 'MUST',
  'MUST when applicable': 'MUST_WHEN',
  MUST_WHEN: 'MUST_WHEN',
  SHOULD: 'SHOULD',
  MAY: 'MAY',
};

function levelRank(l) {
  const m = /^L(\d+)$/.exec(l ?? '');
  return m ? parseInt(m[1], 10) : 99;
}

function lowestLevel(levels) {
  if (!levels.length) return '—';
  let best;
  for (const l of levels) {
    if (!/^L\d+$/.test(l)) continue;
    if (best === undefined || levelRank(l) < levelRank(best)) best = l;
  }
  return best ?? '—';
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function clauseAnchor(clause, ordinalInPillar) {
  return `p${String(clause.pillar).padStart(2, '0')}-c${ordinalInPillar}-${slugify(clause.title)}`;
}

const catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
const intents = JSON.parse(await readFile(INTENTS, 'utf8'));
const meta = JSON.parse(await readFile(META, 'utf8'));

// J3: refuse to consume a catalog whose schemaVersion is outside the
// range this script was tested against. The constant moves when this
// consumer is intentionally updated to handle a new shape.
const EXPECTED_SCHEMA_VERSION = '0.1';
const compat = catalog.compatibility ?? {};
const minSchema = compat.min_schema_version ?? catalog.schemaVersion;
const maxSchema = compat.max_schema_version ?? catalog.schemaVersion;
if (EXPECTED_SCHEMA_VERSION < minSchema || EXPECTED_SCHEMA_VERSION > maxSchema) {
  throw new Error(
    `Catalog schema version out of range: this consumer expects schemaVersion=${EXPECTED_SCHEMA_VERSION}, ` +
      `catalog declares min=${minSchema} max=${maxSchema}. ` +
      'Update EXPECTED_SCHEMA_VERSION in scripts/generate-spec-data.mjs after auditing the new shape.',
  );
}

const pillars = catalog.pillars.map((p) => {
  const num = p.number;
  const clauseNumbers = catalog.clauses.filter((c) => c.pillar === num).map((c) => c.number);
  const range = clauseNumbers.length
    ? `§${Math.min(...clauseNumbers)}–${Math.max(...clauseNumbers)}`
    : '';
  return {
    id: PILLAR_SLUGS[num],
    num: PILLAR_NUMERALS[num],
    icon: p.icon,
    name: p.title,
    description: p.description,
    range,
    accent: '#0a0a0a',
  };
});

const levels = catalog.levels
  .filter((l) => /^L\d+$/.test(l.id))
  .map((l) => ({
    id: l.id,
    order: l.order,
    label: l.label,
    description: l.description,
    workflowSummary: l.workflowSummary ?? l.description,
  }));

// J4: catalog clauses are documented as ordered by `number` ascending,
// so we can trust the order and skip the defensive sort.
const clauseCountsByPillar = new Map();
const clauses = catalog.clauses.map((c) => {
  const ordinalInPillar = (clauseCountsByPillar.get(c.pillar) ?? 0) + 1;
  clauseCountsByPillar.set(c.pillar, ordinalInPillar);
  const rules = catalog.rules
    .filter((r) => r.clause === c.number)
    .map((r) => ({
      w: SCOPE_TO_W[r.scope] ?? r.scope,
      id: r.id,
      t: r.text,
      level: r.level,
    }));
  const lvl = lowestLevel(rules.map((r) => r.level));
  return {
    num: c.number,
    pillar: PILLAR_SLUGS[c.pillar],
    title: c.title,
    anchor: clauseAnchor(c, ordinalInPillar),
    lvl,
    intent: intents[String(c.number)] ?? '',
    rules: rules.map(({ w, id, t, level }) => ({ w, id, t, level })),
  };
});

const out = {
  version: meta.tag ? `v${meta.tag.replace(/^v/, '')}` : `v${catalog.specVersion}`,
  specVersion: catalog.specVersion,
  schemaVersion: catalog.schemaVersion,
  pillars,
  levels,
  clauses,
};

const banner = `/* GENERATED FILE — do not edit by hand.
 * Source: external/ai-contributor-spec/AI-CONTRIBUTOR-RULE-CATALOG.json (spec ${out.version})
 * Intents: src/data/spec-intents.json
 * Run: pnpm prepare:spec
 */
export const SPEC = ${JSON.stringify(out, null, 2)} as const;
`;

await writeFile(OUT, banner, 'utf8');
console.log(
  `Generated ${path.relative(repoRoot, OUT)} from spec ${out.version} (${catalog.clauses.length} clauses, ${catalog.rules.length} rules)`,
);

// The stamped-audit page renders the spec repo's audit artifacts. Port them
// into a committed generated file so `pnpm build` never reads the submodule
// (a clean clone without submodules must still build — AIC-clean-clone-bootstrap).
const AUDIT_ARTIFACT_PATHS = [
  'AI-CONTRIBUTOR-AUDIT.md',
  '.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md',
  '.ai-contributor-audit/AI-CONTRIBUTOR-AUDIT-LOG.md',
];
const AUDIT_OUT = path.join(repoRoot, 'src/data/audit-artifacts.generated.json');
const auditArtifacts = {};
for (const rel of AUDIT_ARTIFACT_PATHS) {
  auditArtifacts[rel] = await readFile(path.join(getSpecRoot(), rel), 'utf8');
}
await writeFile(AUDIT_OUT, `${JSON.stringify({ artifacts: auditArtifacts }, null, 2)}\n`, 'utf8');
console.log(
  `Generated ${path.relative(repoRoot, AUDIT_OUT)} (${AUDIT_ARTIFACT_PATHS.length} audit artifacts) from spec ${out.version}`,
);
