import { assertSpecSource } from './spec-content.mjs';

try {
  await assertSpecSource();
  console.log('Spec source manifest OK');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
