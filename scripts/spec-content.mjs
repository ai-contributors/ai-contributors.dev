import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const SPEC_REPO_URL = "https://github.com/ai-contributors/ai-contributor-spec";
export const SPEC_ROOT = path.join(repoRoot, "external/ai-contributor-spec");
export const GENERATED_DOCS_ROOT = path.join(repoRoot, "src/content/docs/generated-spec");
export const SPEC_METADATA_PATH = path.join(repoRoot, "src/data/spec-source.generated.json");

export const SOURCE_ROUTES = [
  {
    source: "AI-CONTRIBUTOR-SPECIFICATION.md",
    file: "specification.md",
    slug: "specification",
    title: "Specification",
  },
  {
    source: "AI-CONTRIBUTOR-AUDIT-MODEL.md",
    file: "audit-model.md",
    slug: "audit/model",
    title: "Audit Evidence Model",
  },
  {
    source: "AI-CONTRIBUTOR-AUDIT-PROMPT.md",
    file: "audit-prompt.md",
    slug: "audit/prompt",
    title: "No-Skill Audit Prompt",
  },
  {
    source: "AI-CONTRIBUTOR-GUIDE.md",
    file: "guide-typescript-pnpm.md",
    slug: "guide/typescript-pnpm",
    title: "TypeScript + pnpm + GitHub Adoption",
  },
  {
    source: "AI-CONTRIBUTOR-COVERAGE.md",
    file: "coverage.md",
    slug: "coverage",
    title: "Coverage Matrix",
  },
  {
    source: "CHANGELOG.md",
    file: "changelog.md",
    slug: "changelog",
    title: "Changelog",
  },
  {
    source: "skills/ai-contributor-audit/README.md",
    file: "skills-audit.md",
    slug: "skills/audit",
    title: "ai-contributor-audit",
  },
  {
    source: "skills/ai-contributor-audit/SKILL.md",
    file: "skills-audit-skill.md",
    slug: "skills/audit/skill",
    title: "ai-contributor-audit Skill",
  },
  {
    source: "skills/ai-contributor-audit-fix/SKILL.md",
    file: "skills-audit-fix.md",
    slug: "skills/audit-fix",
    title: "ai-contributor-audit-fix",
  },
  {
    source: "skills/ai-contributor-audit-profile/SKILL.md",
    file: "skills-audit-profile.md",
    slug: "skills/audit-profile",
    title: "ai-contributor-audit-profile",
  },
];

export function getRequiredSourcePaths() {
  return SOURCE_ROUTES.map((route) => route.source);
}

export async function assertSpecSource({ root = SPEC_ROOT } = {}) {
  if (!existsSync(root)) {
    throw new Error(
      `Spec submodule is missing at ${root}. Run: git submodule update --init --recursive`
    );
  }

  const missing = getRequiredSourcePaths().filter((sourcePath) => {
    return !existsSync(path.join(root, sourcePath));
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required spec source files in ${root}:\n${missing.map((item) => `- ${item}`).join("\n")}`
    );
  }
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return markdown;
  const closing = markdown.indexOf("\n---", 4);
  if (closing === -1) return markdown;
  return markdown.slice(closing + "\n---".length).replace(/^\n+/, "");
}

function toFrontmatter(route) {
  return ["---", `title: ${route.title}`, `slug: ${route.slug}`, "---", ""].join("\n");
}

export async function generateDocs({ root = SPEC_ROOT, outDir = GENERATED_DOCS_ROOT } = {}) {
  await assertSpecSource({ root });
  await mkdir(outDir, { recursive: true });

  const generated = [];
  const expectedTargets = new Set();
  for (const route of SOURCE_ROUTES) {
    const sourceBody = await readFile(path.join(root, route.source), "utf8");
    const body = stripFrontmatter(sourceBody);
    const target = path.join(outDir, route.file);
    expectedTargets.add(target);
    await writeFile(target, `${toFrontmatter(route)}${body}`, "utf8");
    generated.push({ ...route, target });
  }

  for (const entry of await readdir(outDir, { withFileTypes: true })) {
    const target = path.join(outDir, entry.name);
    if (entry.isFile() && !expectedTargets.has(target)) {
      await rm(target, { force: true });
    }
  }

  return { generated };
}

function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

export function getSpecVersionMetadata({ root = SPEC_ROOT } = {}) {
  try {
    const sha = git(root, ["rev-parse", "HEAD"]);
    const shortSha = git(root, ["rev-parse", "--short", "HEAD"]);
    let tag = "unknown";
    try {
      tag = git(root, ["describe", "--exact-match", "--tags", "HEAD"]);
    } catch {
      tag = git(root, ["describe", "--tags", "--abbrev=0"]);
    }

    return {
      tag,
      sha,
      shortSha,
      tagUrl: `${SPEC_REPO_URL}/releases/tag/${tag}`,
      commitUrl: `${SPEC_REPO_URL}/tree/${sha}`,
    };
  } catch {
    return {
      tag: "unknown",
      sha: "unknown",
      shortSha: "unknown",
      tagUrl: SPEC_REPO_URL,
      commitUrl: SPEC_REPO_URL,
    };
  }
}

export async function writeSpecMetadata({ root = SPEC_ROOT, target = SPEC_METADATA_PATH } = {}) {
  const metadata = getSpecVersionMetadata({ root });
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  return metadata;
}
