const base = process.env.ASTRO_BASE || '/ai-contributor-spec/';
const normalizedBase = base.endsWith('/') ? base : `${base}/`;

module.exports = {
  ci: {
    collect: {
      staticDistDir: './.lhci-dist',
      url: [
        normalizedBase,
        `${normalizedBase}docs/`,
        `${normalizedBase}docs/conformance-levels/`,
        `${normalizedBase}specification/`,
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
        onlyCategories: ['accessibility', 'performance'],
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:performance': ['error', { minScore: 0.75 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
