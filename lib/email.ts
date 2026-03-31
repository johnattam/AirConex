import { Resend } from 'resend'
import { QuoteFormData } from './types'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendQuoteEmail(data: QuoteFormData): Promise<void> {
  if (!process.env.CONTACT_EMAIL) {
    throw new Error('CONTACT_EMAIL environment variable is not set')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { nome, telefone, produto, mensagem } = data
  const to = process.env.CONTACT_EMAIL

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to,
    subject: `Novo pedido de orçamento — ${produto}`,
    html: `
      <h2>Novo pedido de orçamento</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>
      <p><strong>Produto de interesse:</strong> ${escapeHtml(produto)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(mensagem).replace(/\n/g, '<br>')}</p>
    `,
  })
}
