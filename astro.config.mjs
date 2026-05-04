import { defineConfig } from 'astro/config';

import { CUSTOM_DOMAIN, PRODUCTION_BASE } from './scripts/pages-routing.mjs';

const site = process.env.ASTRO_SITE ?? CUSTOM_DOMAIN;
const base = process.env.ASTRO_BASE ?? PRODUCTION_BASE;

export default defineConfig({
  site,
  base,
});
