// components/catalog/CatalogFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Categoria } from '@/lib/types'

interface Props {
  categorias: Categoria[]
}

export default function CatalogFilters({ categorias }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const categoriaAtiva = params.get('categoria') || 'todas'
  const modalidadeAtiva = params.get('modalidade') || 'todas'

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'todas') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    router.replace(`/catalogo?${next.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {/* Categoria */}
      <button
        onClick={() => setParam('categoria', 'todas')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          categoriaAtiva === 'todas'
            ? 'bg-brand-purple text-white'
            : 'bg-brand-purple-light text-brand-blue hover:bg-brand-purple hover:text-white'
        }`}
      >
        Todos
      </button>
      {categorias.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setParam('categoria', cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            categoriaAtiva === cat.slug
              ? 'bg-brand-purple text-white'
              : 'bg-brand-purple-light text-brand-blue hover:bg-brand-purple hover:text-white'
          }`}
        >
          {cat.emoji} {cat.nome}
        </button>
      ))}

      {/* Separador visual */}
      <span className="w-px bg-gray-200 mx-1" />

      {/* Modalidade */}
      {(['todas', 'aluguel', 'venda'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setParam('modalidade', m)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
            modalidadeAtiva === m
              ? 'border-brand-blue bg-brand-blue text-white'
              : 'border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue'
          }`}
        >
          {m === 'todas' ? 'Aluguel e Venda' : m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )
}
