// components/blog/BlogCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Artigo } from '@/lib/types'
import { urlFor } from '@/sanity/client'

interface Props {
  artigo: Artigo
}

export default function BlogCard({ artigo }: Props) {
  const imgUrl = artigo.thumbnail
    ? urlFor(artigo.thumbnail).width(600).height(300).fit('crop').url()
    : null

  const data = new Date(artigo.publicadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link
      href={`/blog/${artigo.slug}`}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition flex flex-col"
    >
      {imgUrl && (
        <div className="relative h-48 w-full">
          <Image src={imgUrl} alt={artigo.titulo} fill className="object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{data} · {artigo.autor}</p>
        <h2 className="font-bold text-brand-blue text-lg mb-2 line-clamp-2">{artigo.titulo}</h2>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">{artigo.resumo}</p>
        <span className="mt-4 text-sm font-semibold text-brand-purple">Ler artigo →</span>
      </div>
    </Link>
  )
}
