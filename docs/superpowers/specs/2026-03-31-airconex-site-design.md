# Design — Site Airconex

**Data:** 2026-03-31  
**Cliente:** Airconex (www.airconex.com.br)  
**Segmento:** Equipamentos médicos — aluguel e venda  
**Localização:** Brasília/DF  

---

## Visão Geral

Site institucional com catálogo de produtos para a Airconex, empresa distribuidora de equipamentos médicos certificada pela ANVISA. O site substitui o atual (WordPress/Elementor) com uma solução mais performática, com CMS integrado para o cliente gerenciar o conteúdo de forma independente.

O modelo de negócio é **catálogo + contato**: não há carrinho ou pagamento online. O cliente fecha pedidos via formulário de orçamento ou WhatsApp.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Estilização | Tailwind CSS |
| CMS | Sanity Studio |
| Formulários | React Hook Form |
| Email | Resend (free tier: 3k emails/mês) |
| Hospedagem | Vercel (free tier) |
| Domínio | Providenciado pelo cliente |

---

## Identidade Visual

- **Cor primária:** Azul escuro `#1a2e5a`
- **Cor de destaque:** Roxo `#5d4fff`
- **Background:** Branco `#ffffff`
- **Logo:** Existente (fornecida pelo cliente)
- **Estilo:** Clean, profissional, moderno

---

## Estrutura de Páginas

### 1. Home (`/`)
- **Hero:** Gradiente azul→roxo, texto centralizado, CTA principal "Solicitar Orçamento"
- **Categorias:** Grid 2×2 com ícone e nome de cada categoria
- **Depoimentos:** Seção com avaliações de clientes (gerenciadas via Sanity)
- **CTA final:** Faixa de contato com botão WhatsApp e formulário

### 2. Catálogo (`/catalogo`)
- **Filtros:** Por categoria (Oxigênio, CPAP, Mobilidade, Hospitalar) e modalidade (Aluguel / Venda)
- **Layout:** Lista detalhada — foto, nome, descrição curta, badges de modalidade, botão "Solicitar"
- **Categorias:**
  - Oxigênio Medicinal (cilindros e concentradores)
  - CPAP / Respiratório (CPAP, BiPAP e acessórios)
  - Mobilidade (cadeiras de rodas)
  - Hospitalar (camas hospitalares)

### 3. Produto (`/catalogo/[slug]`)
- Foto(s) do produto
- Nome, descrição completa, especificações técnicas
- Badges de modalidade disponível (Aluguel / Venda)
- Selo ANVISA quando aplicável
- Botão "Solicitar Orçamento" (abre formulário ou redireciona para /contato)

### 4. Blog (`/blog`)
- Lista de artigos: thumbnail, título, data, resumo
- Página individual de artigo (`/blog/[slug]`)
- Conteúdo gerenciado via Sanity

### 5. Sobre Nós (`/sobre`)
- História da empresa
- Diferenciais e missão
- Certificação ANVISA
- Região de atendimento: Brasília/DF e entorno

### 6. Contato (`/contato`)
- Formulário de orçamento: nome, telefone, produto de interesse, mensagem
- Email automático enviado via Resend ao receber formulário
- Telefone: (61) 98278-5747
- Email: contato@airconex.com.br
- Endereço: Samambaia Sul, Brasília/DF
- Mapa embeds (Google Maps)

---

## Funcionalidades Globais

| Recurso | Detalhe |
|---|---|
| WhatsApp flutuante | Botão fixo (bottom-right) em todas as páginas, abre chat direto |
| SEO | Meta tags por página via Next.js Metadata API, sitemap automático |
| Responsivo | Mobile-first, breakpoints: sm/md/lg/xl |
| Certificação ANVISA | Selo exibido no hero e páginas de produto |
| Depoimentos | Carrossel na home, gerenciado via Sanity |
| Blog | Artigos gerenciados via Sanity Studio |
| Filtros no catálogo | Client-side, sem recarregar página |
| Formulário de orçamento | Validação com React Hook Form, envio via Resend |

---

## CMS — Sanity Studio

O cliente gerencia de forma independente:

- **Produtos:** nome, slug, categoria, modalidade (aluguel/venda), fotos, descrição, especificações, ativo/inativo
- **Categorias:** nome, ícone, ordem de exibição
- **Depoimentos:** nome, cargo/empresa, texto
- **Artigos do blog:** título, slug, thumbnail, conteúdo rico (Portable Text), data, autor
- **Configurações gerais:** telefone, WhatsApp, email, endereço

---

## Fora do Escopo

- Pagamento online / carrinho de compras
- Área do cliente / login
- Chat em tempo real
- App mobile
- Painel de analytics (usa Google Analytics via script externo)

---

## Critérios de Sucesso

1. Cliente consegue atualizar catálogo, blog e depoimentos sem ajuda técnica
2. Formulário de orçamento entrega email ao cliente em menos de 1 minuto
3. Site carrega em menos de 2s no mobile (Core Web Vitals: LCP < 2.5s)
4. Todas as páginas com meta tags corretas para SEO local (Brasília/DF)
5. Botão WhatsApp visível e funcional em todos os dispositivos
