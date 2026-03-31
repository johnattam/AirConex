// components/home/TestimonialsSection.tsx
import { Depoimento } from '@/lib/types'

interface Props {
  depoimentos: Depoimento[]
}

export default function TestimonialsSection({ depoimentos }: Props) {
  if (depoimentos.length === 0) return null

  return (
    <section className="bg-brand-purple-light py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-blue text-center mb-8">
          O que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depoimentos.map((d) => (
            <div key={d._id} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 italic mb-4">"{d.texto}"</p>
              <p className="font-semibold text-brand-blue">{d.nome}</p>
              <p className="text-sm text-gray-500">{d.cargo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
