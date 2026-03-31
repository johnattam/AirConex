// components/home/CategoryGrid.tsx
import Link from 'next/link'
import { Categoria } from '@/lib/types'

interface Props {
  categorias: Categoria[]
}

export default function CategoryGrid({ categorias }: Props) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold text-brand-blue text-center mb-8">
        Nossos equipamentos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat) => (
          <Link
            key={cat._id}
            href={`/catalogo?categoria=${cat.slug}`}
            className="bg-white border border-brand-purple-light rounded-xl p-6 flex flex-col items-center gap-2 hover:border-brand-purple hover:shadow-md transition group"
          >
            <span className="text-4xl">{cat.emoji}</span>
            <span className="font-semibold text-brand-blue text-center text-sm group-hover:text-brand-purple transition">
              {cat.nome}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
