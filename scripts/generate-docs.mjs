import { assertSpecSource, generateDocs, writeSpecMetadata } from './spec-content.mjs';

try {
  await assertSpecSource();
  const result = await generateDocs();
  const metadata = await writeSpecMetadata();
  console.log(
    `Generated ${result.generated.length} spec docs from ${metadata.tag} (${metadata.shortSha})`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
