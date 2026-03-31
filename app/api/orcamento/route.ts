import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuoteEmail } from '@/lib/email'

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  telefone: z.string().min(8, 'Telefone obrigatório'),
  produto: z.string().min(1, 'Produto obrigatório'),
  mensagem: z.string().min(10, 'Mensagem muito curta'),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    await sendQuoteEmail(result.data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[orcamento] Failed to send email:', err)
    return NextResponse.json(
      { error: 'Falha ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.' },
      { status: 500 }
    )
  }
}
