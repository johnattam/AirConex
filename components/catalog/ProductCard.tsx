// components/catalog/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Produto } from '@/lib/types'
import { urlFor } from '@/sanity/client'

const modalidadeLabel: Record<string, string> = {
  aluguel: 'Aluguel',
  venda: 'Venda',
  ambos: 'Aluguel e Venda',
}

const modalidadeColor: Record<string, string> = {
  aluguel: 'bg-green-100 text-green-800',
  venda: 'bg-blue-100 text-blue-800',
  ambos: 'bg-purple-100 text-purple-800',
}

interface Props {
  produto: Produto
}

export default function ProductCard({ produto }: Props) {
  const foto = produto.fotos?.[0]
  const imgUrl = foto ? urlFor(foto).width(400).height(300).fit('crop').url() : null

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex items-center gap-4 p-4">
      {/* Foto */}
      <div className="w-16 h-16 flex-shrink-0 bg-brand-purple-light rounded-lg overflow-hidden flex items-center justify-center">
        {imgUrl ? (
          <Image src={imgUrl} alt={foto?.alt || produto.nome} width={64} height={64} className="object-cover w-full h-full" />
        ) : (
          <span className="text-2xl">{produto.categoria?.emoji || '📦'}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-blue truncate">{produto.nome}</p>
        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{produto.descricao}</p>
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${modalidadeColor[produto.modalidade]}`}>
            {modalidadeLabel[produto.modalidade]}
          </span>
          {produto.anvisaCertificado && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
              ✓ ANVISA
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/catalogo/${produto.slug}`}
        className="flex-shrink-0 bg-brand-purple text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition"
      >
        Solicitar
      </Link>
    </div>
  )
}
