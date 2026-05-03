import { assertSpecSource, generateDocs, writeSpecMetadata } from './spec-content.mjs';
import { buildSpecData } from './build-spec-data.mjs';

try {
  await assertSpecSource();
  const result = await generateDocs();
  const metadata = await writeSpecMetadata();
  const specData = await buildSpecData();
  console.log(
    `Generated ${result.generated.length} spec docs from ${metadata.tag} (${metadata.shortSha})`,
  );
  console.log(
    `spec-data: ${specData.pillars} pillars · ${specData.clauses} clauses · ${specData.rules} rules`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
