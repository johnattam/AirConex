import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Airconex — Equipamentos Médicos em Brasília/DF',
    template: '%s | Airconex',
  },
  description:
    'Aluguel e venda de equipamentos médicos em Brasília/DF. Cilindros de oxigênio, CPAP, camas hospitalares, cadeiras de rodas. Certificada pela ANVISA.',
  keywords: ['equipamentos médicos', 'aluguel oxigênio', 'CPAP', 'Brasília', 'ANVISA'],
  openGraph: {
    siteName: 'Airconex',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
