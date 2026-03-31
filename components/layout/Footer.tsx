import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-xl font-bold mb-2">AIRCONEX</p>
          <p className="text-sm text-white/70">
            Equipamentos médicos para aluguel e venda em Brasília/DF.<br />
            Certificada pela ANVISA.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3">Links</p>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              { href: '/catalogo', label: 'Produtos' },
              { href: '/blog', label: 'Blog' },
              { href: '/sobre', label: 'Sobre nós' },
              { href: '/contato', label: 'Contato' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">Contato</p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>📞 (61) 98278-5747</li>
            <li>✉️ contato@airconex.com.br</li>
            <li>📍 Samambaia Sul, Brasília/DF</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs text-white/50 py-4">
        © {new Date().getFullYear()} Airconex. CNPJ 46.545.770/0001-10
      </div>
    </footer>
  )
}
