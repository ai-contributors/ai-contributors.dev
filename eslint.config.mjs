import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      '.astro/**',
      '.worktrees/**',
      'dist/**',
      'external/**',
      'node_modules/**',
      'src/content/docs/generated-spec/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {
      'no-console': ['warn', { allow: ['error', 'log', 'warn'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
