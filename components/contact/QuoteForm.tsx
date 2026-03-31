'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { QuoteFormData } from '@/lib/types'

const schema = z.object({
  nome: z.string().min(2, 'Informe seu nome completo'),
  telefone: z.string().min(8, 'Informe um telefone válido'),
  produto: z.string().min(1, 'Informe o produto de interesse'),
  mensagem: z.string().min(10, 'Mensagem muito curta — descreva sua necessidade'),
})

export default function QuoteForm() {
  const params = useSearchParams()
  const produtoInicial = params.get('produto') || ''
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(schema),
    defaultValues: { produto: produtoInicial },
  })

  async function onSubmit(data: QuoteFormData) {
    setStatus('sending')
    const res = await fetch('/api/orcamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">✅</p>
        <h2 className="text-xl font-bold text-green-800 mb-1">Orçamento enviado!</h2>
        <p className="text-green-700">Entraremos em contato em breve.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
        <input
          {...register('nome')}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          placeholder="Seu nome"
        />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
        <input
          {...register('telefone')}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          placeholder="(61) 99999-9999"
          type="tel"
        />
        {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Produto de interesse</label>
        <input
          {...register('produto')}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          placeholder="Ex: Cilindro de oxigênio, CPAP..."
        />
        {errors.produto && <p className="text-red-500 text-sm mt-1">{errors.produto.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
        <textarea
          {...register('mensagem')}
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
          placeholder="Descreva sua necessidade (período, quantidade, etc.)"
        />
        {errors.mensagem && <p className="text-red-500 text-sm mt-1">{errors.mensagem.message}</p>}
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">Ocorreu um erro. Tente novamente ou entre em contato pelo WhatsApp.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-brand-purple text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar orçamento'}
      </button>
    </form>
  )
}
