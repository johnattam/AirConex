// app/catalogo/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getProdutoBySlug, getProdutoSlugs } from '@/sanity/queries'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getProdutoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const produto = await getProdutoBySlug(params.slug)
  if (!produto) return {}
  return {
    title: produto.nome,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const produto = await getProdutoBySlug(params.slug)
  if (!produto) notFound()

  return <ProductDetail produto={produto} />
}
