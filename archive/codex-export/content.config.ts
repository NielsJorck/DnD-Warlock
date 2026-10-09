import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        pageId: z.string().optional(),
        parent: z.string().optional(),
        sourceUrl: z.string().optional()
      })
    }),
    items: defineCollection({
      type: 'page',
      source: 'items/**/*.md',
      schema: z.object({
        title: z.string(),
        type: z.literal('item'),
        category: z.string(),
        status: z.string().optional(),
        pageId: z.string().optional(),
        sourceUrl: z.string().optional()
      })
    }),
    spells: defineCollection({
      type: 'page',
      source: 'spells/**/*.md',
      schema: z.object({
        title: z.string(),
        type: z.literal('spell'),
        level: z.string().optional(),
        status: z.string().optional(),
        pageId: z.string().optional(),
        sourceUrl: z.string().optional()
      })
    })
  }
})
