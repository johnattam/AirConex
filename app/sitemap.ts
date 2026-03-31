import { MetadataRoute } from 'next'
import { getProdutoSlugs, getArtigoSlugs } from '@/sanity/queries'

const BASE_URL = 'https://www.airconex.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [produtoSlugs, artigoSlugs] = await Promise.all([
    getProdutoSlugs(),
    getArtigoSlugs(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const produtoRoutes: MetadataRoute.Sitemap = produtoSlugs.map((slug) => ({
    url: `${BASE_URL}/catalogo/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const artigoRoutes: MetadataRoute.Sitemap = artigoSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...produtoRoutes, ...artigoRoutes]
}
