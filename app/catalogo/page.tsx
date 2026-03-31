// app/catalogo/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CatalogFilters from '@/components/catalog/CatalogFilters'
import ProductList from '@/components/catalog/ProductList'
import { getCategorias, getProdutos } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo de Equipamentos Médicos',
  description:
    'Veja todos os equipamentos médicos disponíveis para aluguel e venda em Brasília/DF: oxigênio, CPAP, camas hospitalares e cadeiras de rodas.',
}

export default async function CatalogoPage() {
  const [produtos, categorias] = await Promise.all([getProdutos(), getCategorias()])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Catálogo</h1>
      <p className="text-gray-500 mb-8">
        Equipamentos médicos para aluguel e venda em Brasília/DF.
      </p>
      <Suspense>
        <CatalogFilters categorias={categorias} />
        <ProductList produtos={produtos} />
      </Suspense>
    </div>
  )
}
