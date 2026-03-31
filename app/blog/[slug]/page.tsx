// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getArtigoBySlug, getArtigoSlugs } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getArtigoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artigo = await getArtigoBySlug(params.slug)
  if (!artigo) return {}
  return { title: artigo.titulo, description: artigo.resumo }
}

export default async function ArtigoPage({ params }: { params: { slug: string } }) {
  const artigo = await getArtigoBySlug(params.slug)
  if (!artigo) notFound()

  const imgUrl = artigo.thumbnail
    ? urlFor(artigo.thumbnail).width(900).height(400).fit('crop').url()
    : null

  const data = new Date(artigo.publicadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {imgUrl && (
        <div className="relative h-64 w-full mb-8 rounded-2xl overflow-hidden">
          <Image src={imgUrl} alt={artigo.titulo} fill className="object-cover" />
        </div>
      )}
      <p className="text-sm text-gray-400 mb-2">{data} · {artigo.autor}</p>
      <h1 className="text-3xl font-bold text-brand-blue mb-6">{artigo.titulo}</h1>
      <div className="prose prose-blue max-w-none">
        <PortableText value={artigo.conteudo ?? []} />
      </div>
    </article>
  )
}
