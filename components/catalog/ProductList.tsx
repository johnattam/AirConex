// components/catalog/ProductList.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Produto } from '@/lib/types'
import ProductCard from './ProductCard'

interface Props {
  produtos: Produto[]
}

export default function ProductList({ produtos }: Props) {
  const params = useSearchParams()
  const categoriaFiltro = params.get('categoria')
  const modalidadeFiltro = params.get('modalidade')

  const filtrados = produtos.filter((p) => {
    const passaCategoria = !categoriaFiltro || p.categoria?.slug === categoriaFiltro
    const passaModalidade =
      !modalidadeFiltro ||
      p.modalidade === modalidadeFiltro ||
      p.modalidade === 'ambos'
    return passaCategoria && passaModalidade
  })

  if (filtrados.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p>Nenhum produto encontrado com esses filtros.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {filtrados.map((p) => (
        <ProductCard key={p._id} produto={p} />
      ))}
    </div>
  )
}
