import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLlmsTxt from 'starlight-llms-txt';

import { CUSTOM_DOMAIN, PRODUCTION_BASE } from './scripts/pages-routing.mjs';

const site = process.env.ASTRO_SITE ?? CUSTOM_DOMAIN;
const base = process.env.ASTRO_BASE ?? PRODUCTION_BASE;

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'AI Contributor Spec',
      description: 'Guardrails for repositories where AI reads, writes, reviews, or releases code.',
      logo: {
        src: './public/favicon.svg',
        alt: 'AI Contributor Spec',
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'Specification repository',
          href: 'https://github.com/ai-contributors/ai-contributor-spec',
        },
      ],
      plugins: [starlightLlmsTxt()],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Home', link: '/' },
            { label: 'Specification', link: '/specification/' },
            { label: 'Conformance levels', slug: 'levels' },
          ],
        },
        {
          label: 'Audit',
          items: [
            { label: 'How the audit runs', slug: 'audit' },
            { label: 'Audit evidence model', slug: 'audit/model' },
            { label: 'No-skill audit prompt', slug: 'audit/prompt' },
          ],
        },
        {
          label: 'Skills',
          items: [
            { label: 'Skills overview', slug: 'skills' },
            { label: 'ai-contributor-audit', slug: 'skills/audit' },
            { label: 'ai-contributor-audit SKILL.md', slug: 'skills/audit/skill' },
            { label: 'ai-contributor-audit-fix', slug: 'skills/audit-fix' },
            { label: 'ai-contributor-audit-profile', slug: 'skills/audit-profile' },
          ],
        },
        {
          label: 'Adoption',
          items: [
            { label: 'TypeScript + pnpm + GitHub', slug: 'guide/typescript-pnpm' },
            { label: 'Coverage matrix', link: '/specification/#coverage' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Changelog', slug: 'changelog' },
            {
              label: 'Spec repo on GitHub',
              link: 'https://github.com/ai-contributors/ai-contributor-spec',
            },
          ],
        },
      ],
    }),
    mermaid(),
  ],
});
