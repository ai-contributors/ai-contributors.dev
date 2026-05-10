module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Circular module dependencies hide tight coupling and brittle initialization order.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-unresolvable',
      comment: 'Imports must resolve from the repository and declared packages.',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true, pathNot: '^astro:' },
    },
    {
      name: 'no-non-package-json',
      comment: 'External packages used by source must be declared in package.json.',
      severity: 'error',
      from: {},
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'not-to-deprecated',
      comment: 'Deprecated dependencies require review before use.',
      severity: 'error',
      from: {},
      to: { dependencyTypes: ['deprecated'] },
    },
    {
      name: 'site-to-scripts',
      comment: 'Astro site code must not import repository maintenance scripts.',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^scripts/' },
    },
    {
      name: 'no-generated-spec-imports',
      comment: 'Generated specification pages are content outputs, not source imports.',
      severity: 'error',
      from: { path: '^(src|scripts|tests)/' },
      to: { path: '^src/content/generated-spec/' },
    },
    {
      name: 'tests-not-imported-by-runtime',
      comment: 'Runtime and build code must not depend on test modules.',
      severity: 'error',
      from: { pathNot: '^tests/' },
      to: { path: '^tests/' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg'],
    },
    exclude: {
      path: '^(dist|external|node_modules|src/content/generated-spec)/',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'node', 'default'],
      extensions: ['.mjs', '.js', '.ts', '.astro', '.json'],
    },
  },
};
