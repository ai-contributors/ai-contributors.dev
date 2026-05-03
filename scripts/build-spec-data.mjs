import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_MD = path.join(repoRoot, 'external/ai-contributor-spec/AI-CONTRIBUTOR-SPECIFICATION.md');
const CHECKLIST_MD = path.join(
  repoRoot,
  'external/ai-contributor-spec/.ai-contributor-audit/AI-CONTRIBUTOR-CHECKLIST.md',
);
const COVERAGE_MD = path.join(repoRoot, 'external/ai-contributor-spec/AI-CONTRIBUTOR-COVERAGE.md');
const OUT = path.join(repoRoot, 'src/data/spec-data.generated.json');

const PILLAR_SLUGS = {
  1: 'engineering',
  2: 'security',
  3: 'quality',
  4: 'release',
  5: 'agents',
  6: 'risk',
  7: 'oversight',
};
const PILLAR_NUMERAL = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const WEIGHT_KEY = {
  MUST: 'MUST',
  'MUST when applicable': 'MUST_WHEN',
  SHOULD: 'SHOULD',
  MAY: 'MAY',
};

function parsePillarTable(md) {
  const startMarker = '## Pillars';
  const startIdx = md.indexOf(startMarker);
  if (startIdx === -1) return new Map();
  const slice = md.slice(startIdx, md.indexOf('\n## ', startIdx + 1));
  const rowRe = /^\|\s*(\d+)\s*\|\s*\S+\s+([^|]+?)\s*\|\s*§[^|]+\|\s*(.+?)\s*\|\s*$/gm;
  const out = new Map();
  let m;
  while ((m = rowRe.exec(slice))) {
    out.set(Number(m[1]), { name: m[2].trim(), description: m[3].trim() });
  }
  return out;
}

function parseLevelTable(md) {
  const startMarker = '## Which level do you need?';
  const startIdx = md.indexOf(startMarker);
  if (startIdx === -1) return [];
  const slice = md.slice(startIdx, md.indexOf('\n## ', startIdx + 1) || md.length);
  const rowRe = /^\|\s*\*\*L(\d)\s+([^*]+?)\*\*\s*\|\s*(.+?)\s*\|\s*$/gm;
  const out = [];
  let m;
  while ((m = rowRe.exec(slice))) {
    out.push({ lvl: `L${m[1]}`, name: m[2].trim(), when: m[3].trim() });
  }
  return out;
}

function parseSpec(md) {
  const lines = md.split('\n');
  const pillars = [];
  const clauses = [];
  let pillarIdx;
  let pillar = null;
  let clause = null;
  let weight = null;

  const pillarRe = /^### Pillar (\d+) — (\S+)\s+(.+)$/;
  const clauseRe = /^## (\d+)\. (.+)$/;
  const weightRe = /^### `([^`]+)`/;
  const ruleRe = /^- (.+?)\s*<sup>`(AIC-[a-z0-9-]+)`<\/sup>\s*$/;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    let m;
    if ((m = pillarRe.exec(line))) {
      pillarIdx = Number(m[1]);
      pillar = {
        id: PILLAR_SLUGS[pillarIdx],
        num: PILLAR_NUMERAL[pillarIdx],
        index: pillarIdx,
        icon: m[2],
        name: m[3].trim(),
      };
      pillars.push(pillar);
      continue;
    }
    if ((m = clauseRe.exec(line))) {
      clause = {
        num: Number(m[1]),
        title: m[2].trim(),
        pillar: pillar?.id,
        pillarIndex: pillar?.index,
        rules: [],
      };
      clauses.push(clause);
      weight = null;
      continue;
    }
    if ((m = weightRe.exec(line))) {
      const w = WEIGHT_KEY[m[1]];
      weight = w ?? null;
      continue;
    }
    if (clause && weight && (m = ruleRe.exec(line))) {
      const text = m[1].replace(/`([A-Z][A-Z ]*[A-Z])`/g, '$1');
      clause.rules.push({ w: weight, id: m[2], t: text });
    }
  }

  // pillar ranges
  for (const p of pillars) {
    const cs = clauses.filter((c) => c.pillarIndex === p.index).map((c) => c.num);
    if (cs.length) {
      p.range = cs.length === 1 ? `§${cs[0]}` : `§${cs[0]}–${cs[cs.length - 1]}`;
    } else {
      p.range = '';
    }
    delete p.index;
  }
  for (const c of clauses) delete c.pillarIndex;

  return { pillars, clauses };
}

function parseChecklistLevels(md) {
  const lines = md.split('\n');
  const aicLevel = new Map();
  let level = null;
  const levelRe = /^## Level ([0-4]) /;
  const idRe = /`(AIC-[a-z0-9-]+)`/g;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    const lm = levelRe.exec(line);
    if (lm) {
      level = Number(lm[1]);
      continue;
    }
    if (level === null) continue;
    if (!line.startsWith('|') || line.startsWith('|---') || line.startsWith('|-----')) continue;
    if (line.includes('| Scope | Rule ')) continue;
    let m;
    while ((m = idRe.exec(line))) {
      const id = m[1];
      if (!aicLevel.has(id)) aicLevel.set(id, level);
      else if (aicLevel.get(id) > level) aicLevel.set(id, level);
    }
  }
  return aicLevel;
}

function deriveClauseLevels({ clauses }, aicLevel) {
  for (const c of clauses) {
    const levels = c.rules.map((r) => aicLevel.get(r.id)).filter((v) => v !== undefined);
    const min = levels.length ? Math.min(...levels) : 4;
    c.lvl = `L${min}`;
    for (const r of c.rules) {
      const lv = aicLevel.get(r.id);
      r.lvl = lv === undefined ? null : `L${lv}`;
    }
  }
}

function extractGeneratedBlock(md, name) {
  const re = new RegExp(
    `<!-- BEGIN:GENERATED ${name} -->\\s*([\\s\\S]*?)\\s*<!-- END:GENERATED ${name} -->`,
  );
  const m = re.exec(md);
  return m ? m[1].trim() : '';
}

function parsePipeTable(block) {
  const rows = block
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  if (rows.length < 2) return { headers: [], rows: [] };
  const split = (line) =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) =>
        c
          .trim()
          .replace(/^`(.+)`$/, '$1')
          .replace(/\*\*/g, ''),
      );
  const headers = split(rows[0]);
  const body = rows.slice(2).map(split);
  return { headers, rows: body };
}

function parseCoverage(md) {
  const glanceBlock = extractGeneratedBlock(md, 'at-a-glance');
  const glance = glanceBlock
    .split('\n')
    .map((l) =>
      l
        .replace(/^\s*-\s*/, '')
        .replace(/`/g, '')
        .trim(),
    )
    .filter(Boolean);
  return {
    glance,
    byScope: parsePipeTable(extractGeneratedBlock(md, 'by-scope')),
    byPillar: parsePipeTable(extractGeneratedBlock(md, 'by-pillar')),
    byLevel: parsePipeTable(extractGeneratedBlock(md, 'by-level')),
    cumulative: parsePipeTable(extractGeneratedBlock(md, 'cumulative')),
  };
}

export async function buildSpecData() {
  const specMd = await readFile(SPEC_MD, 'utf8');
  const checklistMd = await readFile(CHECKLIST_MD, 'utf8');
  const parsed = parseSpec(specMd);
  const aicLevel = parseChecklistLevels(checklistMd);
  deriveClauseLevels(parsed, aicLevel);

  const pillarMeta = parsePillarTable(specMd);
  for (const p of parsed.pillars) {
    const meta = pillarMeta.get(Number(PILLAR_NUMERAL.indexOf(p.num)));
    if (meta) p.description = meta.description;
  }
  const levels = parseLevelTable(specMd);
  const coverageMd = await readFile(COVERAGE_MD, 'utf8');
  const coverage = parseCoverage(coverageMd);

  const data = {
    version: 'v0.1',
    pillars: parsed.pillars,
    clauses: parsed.clauses,
    levels,
    coverage,
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return {
    pillars: parsed.pillars.length,
    clauses: parsed.clauses.length,
    rules: parsed.clauses.reduce((n, c) => n + c.rules.length, 0),
    mappedIds: aicLevel.size,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildSpecData()
    .then((r) =>
      console.log(
        `spec-data: ${r.pillars} pillars · ${r.clauses} clauses · ${r.rules} rules · ${r.mappedIds} AIC-IDs leveled`,
      ),
    )
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    });
}
