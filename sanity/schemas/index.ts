// sanity/schemas/index.ts
import { categorySchema } from './category'
import { productSchema } from './product'
import { testimonialSchema } from './testimonial'
import { blogPostSchema } from './blogPost'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  categorySchema,
  productSchema,
  testimonialSchema,
  blogPostSchema,
  siteSettingsSchema,
]
