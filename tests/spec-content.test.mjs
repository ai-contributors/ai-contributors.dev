import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  GENERATED_DOCS_ROOT,
  SOURCE_ROUTES,
  assertSpecSource,
  generateDocs,
  getRequiredSourcePaths,
  getSpecVersionMetadata,
} from "../scripts/spec-content.mjs";

async function makeSpecRoot() {
  const root = await mkdtemp(path.join(tmpdir(), "ai-contributor-spec-"));
  for (const sourcePath of getRequiredSourcePaths()) {
    const fullPath = path.join(root, sourcePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, `# ${sourcePath}\n\nSource body for ${sourcePath}.\n`, "utf8");
  }
  return root;
}

test("source manifest lists the audit skill README and SKILL files", () => {
  assert.ok(getRequiredSourcePaths().includes("skills/ai-contributor-audit/README.md"));
  assert.ok(getRequiredSourcePaths().includes("skills/ai-contributor-audit/SKILL.md"));
});

test("generated docs directory is visible to Astro content sync", () => {
  assert.notEqual(path.basename(GENERATED_DOCS_ROOT).startsWith("_"), true);
});

test("assertSpecSource passes when all expected files exist", async () => {
  const root = await makeSpecRoot();
  await assert.doesNotReject(() => assertSpecSource({ root }));
  await rm(root, { recursive: true, force: true });
});

test("assertSpecSource fails clearly when the submodule root is missing", async () => {
  const missingRoot = path.join(tmpdir(), "missing-ai-contributor-spec");
  await assert.rejects(
    () => assertSpecSource({ root: missingRoot }),
    /Spec submodule is missing/
  );
});

test("assertSpecSource reports all missing required files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "partial-ai-contributor-spec-"));
  await assert.rejects(
    () => assertSpecSource({ root }),
    (error) => {
      assert.match(error.message, /Missing required spec source files/);
      assert.match(error.message, /AI-CONTRIBUTOR-SPECIFICATION\.md/);
      assert.match(error.message, /skills\/ai-contributor-audit\/SKILL\.md/);
      return true;
    }
  );
  await rm(root, { recursive: true, force: true });
});

test("generateDocs creates Starlight route files with custom slugs", async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), "generated-docs-"));
  const result = await generateDocs({ root, outDir });
  const specification = await readFile(path.join(outDir, "specification.md"), "utf8");
  const auditSkill = await readFile(path.join(outDir, "skills-audit-skill.md"), "utf8");

  assert.equal(result.generated.length, SOURCE_ROUTES.length);
  assert.match(specification, /title: Specification/);
  assert.match(specification, /slug: specification/);
  assert.match(specification, /Source body for AI-CONTRIBUTOR-SPECIFICATION\.md/);
  assert.match(auditSkill, /slug: skills\/audit\/skill/);
  assert.ok(existsSync(path.join(outDir, "specification.md")));

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
});

test("generateDocs updates expected files before removing stale files", async () => {
  const root = await makeSpecRoot();
  const outDir = await mkdtemp(path.join(tmpdir(), "generated-docs-"));
  await writeFile(path.join(outDir, "specification.md"), "old specification", "utf8");
  await writeFile(path.join(outDir, "stale.md"), "stale route", "utf8");

  await generateDocs({ root, outDir });

  const specification = await readFile(path.join(outDir, "specification.md"), "utf8");
  assert.match(specification, /Source body for AI-CONTRIBUTOR-SPECIFICATION\.md/);
  assert.equal(existsSync(path.join(outDir, "stale.md")), false);

  await rm(root, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
});

test("getSpecVersionMetadata falls back when git metadata is unavailable", () => {
  const metadata = getSpecVersionMetadata({ root: path.join(tmpdir(), "not-a-git-repo") });
  assert.equal(metadata.tag, "unknown");
  assert.equal(metadata.shortSha, "unknown");
  assert.equal(metadata.sha, "unknown");
});
