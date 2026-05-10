import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import remarkDirective from 'remark-directive';

import remarkPromptDirective from './src/lib/markdown/prompt-toolbar.ts';
import { STARLIGHT_SIDEBAR } from './src/lib/starlight-sidebar.generated.ts';
import { CUSTOM_DOMAIN, PRODUCTION_BASE } from './scripts/pages-routing.mjs';

const site = process.env.ASTRO_SITE ?? CUSTOM_DOMAIN;
const base = process.env.ASTRO_BASE ?? PRODUCTION_BASE;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: 'ai-contributor-spec / audit',
      disable404Route: true,
      pagefind: true,
      sidebar: STARLIGHT_SIDEBAR,
      logo: { src: './src/assets/logomark.svg', alt: 'ai-contributors logomark' },
      customCss: ['./src/styles/starlight-theme.css'],
      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
        Footer: './src/components/overrides/Footer.astro',
        ThemeSelect: './src/components/overrides/ThemeSelect.astro',
        Sidebar: './src/components/overrides/Sidebar.astro',
        Head: './src/components/overrides/Head.astro',
      },
    }),
    mdx(),
  ],
  markdown: {
    // Honour explicit `{#anchor}` IDs (U2 paired) and `:::prompt`
    // container directives (U9 paired). remark-directive parses the
    // directive into the AST; the rehype plugin replaces it with the
    // toolbar markup. remark-custom-heading-id runs before rehype-slug
    // so an explicit id wins over the auto-slug.
    remarkPlugins: [remarkCustomHeadingId, remarkDirective, remarkPromptDirective],
  },
});
