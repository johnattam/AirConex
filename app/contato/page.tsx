import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteForm from '@/components/contact/QuoteForm'

export const metadata: Metadata = {
  title: 'Contato e Orçamento',
  description: 'Solicite um orçamento para aluguel ou venda de equipamentos médicos em Brasília/DF.',
}

export default function ContatoPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5561982785747'
  const waUrl = `https://wa.me/${number}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Solicitar orçamento</h1>
      <p className="text-gray-500 mb-10">
        Preencha o formulário e entraremos em contato em breve.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulário */}
        <div>
          <Suspense>
            <QuoteForm />
          </Suspense>
        </div>

        {/* Info de contato */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-brand-blue mb-3">Outras formas de contato</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span>(61) 98278-5747</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <span>contato@airconex.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span>Samambaia Sul, Brasília/DF</span>
              </li>
            </ul>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition w-fit"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.12 1.524 5.855L.057 23.448c-.083.33.226.628.554.534l5.688-1.487A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.374l-.36-.214-3.733.977.997-3.646-.234-.374A9.818 9.818 0 1112 21.818z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
