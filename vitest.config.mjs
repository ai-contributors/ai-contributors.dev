import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/coverage/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json-summary'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
