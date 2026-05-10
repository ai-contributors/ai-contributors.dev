import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  generatedSpec: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/generated-spec' }),
    schema: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        deck: z.string().optional(),
      })
      .passthrough(),
  }),
};
