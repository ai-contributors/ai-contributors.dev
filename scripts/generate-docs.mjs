import { generateStarlightSidebar } from './build-starlight-sidebar.mjs';
import { assertSpecSource, generateDocs, writeSpecMetadata } from './spec-content.mjs';

try {
  assertSpecSource();
  const result = await generateDocs();
  const metadata = await writeSpecMetadata();
  generateStarlightSidebar();
  console.log(
    `Generated ${result.generated.length} spec docs from ${metadata.tag} (${metadata.shortSha})`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
