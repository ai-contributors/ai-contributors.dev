import { ensureSpecSourceReady } from './spec-content.mjs';

try {
  const initialized = await ensureSpecSourceReady();
  console.log(
    initialized ? 'Initialized spec submodule source' : 'Spec submodule source already ready',
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
