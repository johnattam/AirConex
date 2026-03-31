// components/product/ProductDetail.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Produto } from '@/lib/types'
import { urlFor } from '@/sanity/client'

const modalidadeLabel: Record<string, string> = {
  aluguel: 'Aluguel',
  venda: 'Venda',
  ambos: 'Aluguel e Venda',
}

interface Props {
  produto: Produto
}

export default function ProductDetail({ produto }: Props) {
  const foto = produto.fotos?.[0]
  const imgUrl = foto ? urlFor(foto).width(600).height(450).fit('crop').url() : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/catalogo" className="hover:text-brand-purple">Catálogo</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{produto.nome}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Foto */}
        <div className="bg-brand-purple-light rounded-2xl overflow-hidden flex items-center justify-center min-h-64">
          {imgUrl ? (
            <Image src={imgUrl} alt={foto?.alt || produto.nome} width={600} height={450} className="object-cover w-full h-full" />
          ) : (
            <span className="text-8xl">{produto.categoria?.emoji || '📦'}</span>
          )}
        </div>

        {/* Detalhes */}
        <div>
          <h1 className="text-2xl font-bold text-brand-blue mb-3">{produto.nome}</h1>

          {/* Badges */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-brand-purple-light text-brand-purple text-sm font-semibold px-3 py-1 rounded-full">
              {modalidadeLabel[produto.modalidade]}
            </span>
            {produto.anvisaCertificado && (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                🛡️ Certificado ANVISA
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{produto.descricao}</p>

          {/* Especificações */}
          {produto.especificacoes && produto.especificacoes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-brand-blue mb-2">Especificações técnicas</h2>
              <ul className="space-y-1">
                {produto.especificacoes.map((esp, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-brand-purple">✓</span> {esp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/contato?produto=${encodeURIComponent(produto.nome)}`}
            className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition w-full text-center"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </div>
  )
}
