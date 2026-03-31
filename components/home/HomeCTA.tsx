// components/home/HomeCTA.tsx
import Link from 'next/link'

export default function HomeCTA() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5561982785747'
  const waUrl = `https://wa.me/${number}?text=Ol%C3%A1%2C+gostaria+de+informa%C3%A7%C3%B5es`

  return (
    <section className="bg-brand-blue text-white py-14 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Pronto para cuidar da sua saúde?</h2>
        <p className="text-white/75 mb-6">
          Entre em contato para solicitar um orçamento sem compromisso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contato"
            className="bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition"
          >
            Solicitar orçamento
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
