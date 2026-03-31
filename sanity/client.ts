// sanity/client.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/lib/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}
