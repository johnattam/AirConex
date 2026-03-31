import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a Airconex, distribuidora de equipamentos médicos certificada pela ANVISA em Brasília/DF.',
}

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">Sobre a Airconex</h1>

      <div className="prose prose-blue max-w-none">
        <p>
          A Airconex é uma empresa especializada em distribuição e locação de equipamentos médicos,
          atendendo pacientes e famílias em Brasília/DF e entorno com agilidade e segurança.
        </p>

        <h2>Nossa missão</h2>
        <p>
          Proporcionar qualidade de vida e cuidado em saúde para nossos clientes, oferecendo
          equipamentos médicos de qualidade, com atendimento humanizado e suporte técnico confiável.
        </p>

        <h2>Diferenciais</h2>
        <ul>
          <li>✅ Certificação ANVISA — todos os equipamentos seguem as normas regulatórias brasileiras</li>
          <li>✅ Atendimento rápido — entregas ágeis em Brasília/DF</li>
          <li>✅ Suporte técnico — orientação sobre uso e manutenção dos equipamentos</li>
          <li>✅ Transparência — orçamentos claros e sem surpresas</li>
        </ul>

        <h2>Localização</h2>
        <p>
          Samambaia Sul, Brasília/DF.<br />
          Atendemos hospitais, clínicas e pacientes domiciliares.
        </p>

        <h2>Contato</h2>
        <p>
          📞 (61) 98278-5747<br />
          ✉️ contato@airconex.com.br<br />
          CNPJ: 46.545.770/0001-10
        </p>
      </div>
    </div>
  )
}
