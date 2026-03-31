import { Resend } from 'resend'
import { QuoteFormData } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendQuoteEmail(data: QuoteFormData): Promise<void> {
  const { nome, telefone, produto, mensagem } = data
  const to = process.env.CONTACT_EMAIL!

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: `Novo pedido de orçamento — ${produto}`,
    html: `
      <h2>Novo pedido de orçamento</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Produto de interesse:</strong> ${produto}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem.replace(/\n/g, '<br>')}</p>
    `,
  })
}
