// components/home/Hero.tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-blue to-brand-purple text-white py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <span className="inline-block bg-white/20 text-sm px-4 py-1 rounded-full mb-4">
          ✓ Certificado ANVISA · Brasília/DF
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Equipamentos médicos onde você precisa
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Aluguel e venda de oxigênio medicinal, CPAP, camas hospitalares e cadeiras de rodas.
          Atendimento rápido em Brasília/DF.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalogo"
            className="bg-white text-brand-purple font-bold px-8 py-3 rounded-full hover:bg-brand-purple-light transition"
          >
            Ver catálogo
          </Link>
          <Link
            href="/contato"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </section>
  )
}
