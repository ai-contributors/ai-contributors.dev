import { ensureSpecSourceReady } from './spec-content.mjs';

try {
  await ensureSpecSourceReady();
  console.log('Spec source manifest OK');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
