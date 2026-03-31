# Airconex Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 catalog site with Sanity CMS for the Airconex medical equipment rental/sales business in Brasília/DF.

**Architecture:** Next.js App Router with ISR (Incremental Static Regeneration) for product and blog pages fetched from Sanity. Contact form handled by a Next.js API route that sends email via Resend. All content managed through Sanity Studio. No shopping cart — model is catalog + quote request.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Sanity v3, React Hook Form, Resend, Vercel

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local`, `.gitignore`

- [ ] **Step 1: Scaffold Next.js project inside the existing repo**

```bash
cd /Users/macprom3/Desktop/airconex-site
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

When prompted:
- Would you like to use `src/` directory? → No
- Would you like to use App Router? → Yes
- Customize import alias? → No (use default `@/*`)

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @sanity/client @sanity/image-url next-sanity sanity react-hook-form @hookform/resolvers zod resend
npm install -D @types/node
```

- [ ] **Step 3: Replace `tailwind.config.ts` with brand colors**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1a2e5a',
          purple: '#5d4fff',
          'purple-light': '#e8eeff',
        },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-800;
  }
}
```

- [ ] **Step 5: Create `.env.local`**

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_token_here
RESEND_API_KEY=your_resend_key_here
CONTACT_EMAIL=contato@airconex.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5561982785747
```

- [ ] **Step 6: Update `.gitignore` to exclude `.env.local` and `.superpowers/`**

Open `.gitignore` and confirm these lines exist (add if missing):
```
.env.local
.superpowers/
```

- [ ] **Step 7: Update `next.config.ts`**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 8: Verify setup compiles**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000 with the default Next.js page.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind and dependencies"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create shared types**

```typescript
// lib/types.ts

export type Modalidade = 'aluguel' | 'venda' | 'ambos'

export type CategoriaSlug = 'oxigenio' | 'cpap' | 'mobilidade' | 'hospitalar'

export interface Categoria {
  _id: string
  nome: string
  slug: CategoriaSlug
  emoji: string
  ordem: number
}

export interface Produto {
  _id: string
  nome: string
  slug: string
  categoria: Categoria
  modalidade: Modalidade
  descricao: string
  especificacoes: string[]
  fotos: SanityImage[]
  anvisaCertificado: boolean
  ativo: boolean
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Depoimento {
  _id: string
  nome: string
  cargo: string
  texto: string
}

export interface Artigo {
  _id: string
  titulo: string
  slug: string
  thumbnail: SanityImage
  resumo: string
  conteudo: PortableTextBlock[]
  publicadoEm: string
  autor: string
}

export interface PortableTextBlock {
  _type: string
  _key: string
  [key: string]: unknown
}

export interface SiteSettings {
  telefone: string
  whatsapp: string
  email: string
  endereco: string
  cnpj: string
}

export interface QuoteFormData {
  nome: string
  telefone: string
  produto: string
  mensagem: string
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for all domain entities"
```

---

## Task 3: Sanity Setup & Schemas

**Files:**
- Create: `sanity.config.ts`, `sanity/schemas/product.ts`, `sanity/schemas/category.ts`, `sanity/schemas/testimonial.ts`, `sanity/schemas/blogPost.ts`, `sanity/schemas/siteSettings.ts`, `sanity/schemas/index.ts`

- [ ] **Step 1: Create Sanity project**

Go to https://sanity.io, log in, create a new project named "airconex", dataset "production". Copy the Project ID.

Then run:
```bash
npx sanity@latest init --env
```
When prompted, select the existing project and dataset. This creates `.env` entries — copy `SANITY_STUDIO_PROJECT_ID` value into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.

- [ ] **Step 2: Create `sanity/schemas/category.ts`**

```typescript
// sanity/schemas/category.ts
import { defineType, defineField } from 'sanity'

export const categorySchema = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nome' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Ex: 🫁, 😴, ♿, 🏥',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: 'Ordem', name: 'ordemAsc', by: [{ field: 'ordem', direction: 'asc' }] }],
})
```

- [ ] **Step 3: Create `sanity/schemas/product.ts`**

```typescript
// sanity/schemas/product.ts
import { defineType, defineField } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nome' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'modalidade',
      title: 'Modalidade',
      type: 'string',
      options: {
        list: [
          { title: 'Aluguel', value: 'aluguel' },
          { title: 'Venda', value: 'venda' },
          { title: 'Aluguel e Venda', value: 'ambos' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'especificacoes',
      title: 'Especificações técnicas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: "Capacidade: 10L", "Pressão: 150bar"',
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'anvisaCertificado',
      title: 'Certificado ANVISA',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ativo',
      title: 'Ativo (visível no site)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'modalidade', media: 'fotos.0' },
  },
})
```

- [ ] **Step 4: Create `sanity/schemas/testimonial.ts`**

```typescript
// sanity/schemas/testimonial.ts
import { defineType, defineField } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Depoimento',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'cargo', title: 'Cargo / Empresa', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'texto', title: 'Depoimento', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
})
```

- [ ] **Step 5: Create `sanity/schemas/blogPost.ts`**

```typescript
// sanity/schemas/blogPost.ts
import { defineType, defineField } from 'sanity'

export const blogPostSchema = defineType({
  name: 'blogPost',
  title: 'Artigo do Blog',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'titulo' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Imagem de capa',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }],
    }),
    defineField({ name: 'resumo', title: 'Resumo', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'autor', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'publicadoEm',
      title: 'Data de publicação',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'conteudo',
      title: 'Conteúdo',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }],
        },
      ],
    }),
  ],
  preview: { select: { title: 'titulo', subtitle: 'autor', media: 'thumbnail' } },
  orderings: [{ title: 'Mais recente', name: 'dataDesc', by: [{ field: 'publicadoEm', direction: 'desc' }] }],
})
```

- [ ] **Step 6: Create `sanity/schemas/siteSettings.ts`**

```typescript
// sanity/schemas/siteSettings.ts
import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'telefone', title: 'Telefone (exibição)', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (apenas números, ex: 5561982785747)', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'endereco', title: 'Endereço', type: 'string' }),
    defineField({ name: 'cnpj', title: 'CNPJ', type: 'string' }),
  ],
})
```

- [ ] **Step 7: Create `sanity/schemas/index.ts`**

```typescript
// sanity/schemas/index.ts
import { categorySchema } from './category'
import { productSchema } from './product'
import { testimonialSchema } from './testimonial'
import { blogPostSchema } from './blogPost'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  categorySchema,
  productSchema,
  testimonialSchema,
  blogPostSchema,
  siteSettingsSchema,
]
```

- [ ] **Step 8: Create `sanity.config.ts`**

```typescript
// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'airconex',
  title: 'Airconex CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 9: Add Sanity Studio route — create `app/studio/[[...tool]]/page.tsx`**

```bash
mkdir -p app/studio/\[\[...tool\]\]
```

```typescript
// app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Sanity schemas and Studio route"
```

---

## Task 4: Sanity Client & GROQ Queries

**Files:**
- Create: `sanity/client.ts`, `sanity/queries.ts`

- [ ] **Step 1: Create `sanity/client.ts`**

```typescript
// sanity/client.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/lib/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}
```

- [ ] **Step 2: Create `sanity/queries.ts`**

```typescript
// sanity/queries.ts
import { client } from './client'
import { Produto, Categoria, Depoimento, Artigo, SiteSettings } from '@/lib/types'

const categoriaFields = `
  _id,
  nome,
  "slug": slug.current,
  emoji,
  ordem
`

const produtoFields = `
  _id,
  nome,
  "slug": slug.current,
  categoria->{ ${categoriaFields} },
  modalidade,
  descricao,
  especificacoes,
  fotos[] { ..., "alt": alt },
  anvisaCertificado,
  ativo
`

export async function getCategorias(): Promise<Categoria[]> {
  return client.fetch(
    `*[_type == "category"] | order(ordem asc) { ${categoriaFields} }`
  )
}

export async function getProdutos(): Promise<Produto[]> {
  return client.fetch(
    `*[_type == "product" && ativo == true] | order(nome asc) { ${produtoFields} }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getProdutoBySlug(slug: string): Promise<Produto | null> {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${produtoFields} }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getProdutoSlugs(): Promise<string[]> {
  const results = await client.fetch<{ slug: string }[]>(
    `*[_type == "product" && ativo == true]{ "slug": slug.current }`
  )
  return results.map((r) => r.slug)
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  return client.fetch(
    `*[_type == "testimonial"] { _id, nome, cargo, texto }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export async function getArtigos(): Promise<Artigo[]> {
  return client.fetch(
    `*[_type == "blogPost"] | order(publicadoEm desc) {
      _id, titulo, "slug": slug.current, thumbnail, resumo, autor, publicadoEm
    }`,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getArtigoBySlug(slug: string): Promise<Artigo | null> {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, titulo, "slug": slug.current, thumbnail, resumo, autor, publicadoEm, conteudo
    }`,
    { slug },
    { next: { revalidate: 300 } }
  )
}

export async function getArtigoSlugs(): Promise<string[]> {
  const results = await client.fetch<{ slug: string }[]>(
    `*[_type == "blogPost"]{ "slug": slug.current }`
  )
  return results.map((r) => r.slug)
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0]{ telefone, whatsapp, email, endereco, cnpj }`,
    {},
    { next: { revalidate: 3600 } }
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add sanity/client.ts sanity/queries.ts
git commit -m "feat: add Sanity client and GROQ queries"
```

---

## Task 5: Email Helper

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Create `lib/email.ts`**

```typescript
// lib/email.ts
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
```

- [ ] **Step 2: Create API route `app/api/orcamento/route.ts`**

```typescript
// app/api/orcamento/route.ts
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

  await sendQuoteEmail(result.data)
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Test the API route manually (after starting dev server)**

```bash
curl -X POST http://localhost:3000/api/orcamento \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","telefone":"61999999999","produto":"Cilindro de O2","mensagem":"Gostaria de informacoes sobre aluguel"}'
```

Expected: `{"success":true}` and email delivered to `CONTACT_EMAIL`.

- [ ] **Step 4: Commit**

```bash
git add lib/email.ts app/api/orcamento/route.ts
git commit -m "feat: add email helper and quote form API route"
```

---

## Task 6: Layout Components

**Files:**
- Create: `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `components/layout/WhatsAppButton.tsx`, `app/layout.tsx`

- [ ] **Step 1: Create `components/layout/Navbar.tsx`**

```tsx
// components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/catalogo', label: 'Produtos' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          AIRCONEX
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-purple-light transition-colors">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="bg-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition"
          >
            Solicitar orçamento
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-brand-blue border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-brand-purple-light">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className="bg-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold text-center"
          >
            Solicitar orçamento
          </Link>
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create `components/layout/Footer.tsx`**

```tsx
// components/layout/Footer.tsx
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
```

- [ ] **Step 3: Create `components/layout/WhatsAppButton.tsx`**

```tsx
// components/layout/WhatsAppButton.tsx
export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5561982785747'
  const url = `https://wa.me/${number}?text=Ol%C3%A1%2C+gostaria+de+informa%C3%A7%C3%B5es+sobre+equipamentos+m%C3%A9dicos`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.12 1.524 5.855L.057 23.448c-.083.33.226.628.554.534l5.688-1.487A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.374l-.36-.214-3.733.977.997-3.646-.234-.374A9.818 9.818 0 1112 21.818z" />
      </svg>
    </a>
  )
}
```

- [ ] **Step 4: Update `app/layout.tsx`**

```tsx
// app/layout.tsx
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
```

- [ ] **Step 5: Check in browser — navigate to http://localhost:3000**

Expected: Navbar azul com logo AIRCONEX, links de navegação, botão WhatsApp verde fixo no canto inferior direito, footer azul no rodapé.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx components/layout/
git commit -m "feat: add Navbar, Footer and WhatsApp floating button"
```

---

## Task 7: Home Page

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/CategoryGrid.tsx`, `components/home/TestimonialsSection.tsx`, `components/home/HomeCTA.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/home/Hero.tsx`**

```tsx
// components/home/Hero.tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-blue to-brand-purple text-white py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <span className="inline-block bg-white/20 text-sm px-4 py-1 rounded-full mb-4">
          ✓ Certificado ANVISA · Brasília/DF
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Equipamentos médicos onde você precisa
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Aluguel e venda de oxigênio medicinal, CPAP, camas hospitalares e cadeiras de rodas.
          Atendimento rápido em Brasília/DF.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalogo"
            className="bg-white text-brand-purple font-bold px-8 py-3 rounded-full hover:bg-brand-purple-light transition"
          >
            Ver catálogo
          </Link>
          <Link
            href="/contato"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/home/CategoryGrid.tsx`**

```tsx
// components/home/CategoryGrid.tsx
import Link from 'next/link'
import { Categoria } from '@/lib/types'

interface Props {
  categorias: Categoria[]
}

export default function CategoryGrid({ categorias }: Props) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold text-brand-blue text-center mb-8">
        Nossos equipamentos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat) => (
          <Link
            key={cat._id}
            href={`/catalogo?categoria=${cat.slug}`}
            className="bg-white border border-brand-purple-light rounded-xl p-6 flex flex-col items-center gap-2 hover:border-brand-purple hover:shadow-md transition group"
          >
            <span className="text-4xl">{cat.emoji}</span>
            <span className="font-semibold text-brand-blue text-center text-sm group-hover:text-brand-purple transition">
              {cat.nome}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/home/TestimonialsSection.tsx`**

```tsx
// components/home/TestimonialsSection.tsx
import { Depoimento } from '@/lib/types'

interface Props {
  depoimentos: Depoimento[]
}

export default function TestimonialsSection({ depoimentos }: Props) {
  if (depoimentos.length === 0) return null

  return (
    <section className="bg-brand-purple-light py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-blue text-center mb-8">
          O que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depoimentos.map((d) => (
            <div key={d._id} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 italic mb-4">"{d.texto}"</p>
              <p className="font-semibold text-brand-blue">{d.nome}</p>
              <p className="text-sm text-gray-500">{d.cargo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/home/HomeCTA.tsx`**

```tsx
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
```

- [ ] **Step 5: Update `app/page.tsx`**

```tsx
// app/page.tsx
import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import HomeCTA from '@/components/home/HomeCTA'
import { getCategorias, getDepoimentos } from '@/sanity/queries'

export const revalidate = 3600

export default async function HomePage() {
  const [categorias, depoimentos] = await Promise.all([
    getCategorias(),
    getDepoimentos(),
  ])

  return (
    <>
      <Hero />
      <CategoryGrid categorias={categorias} />
      <TestimonialsSection depoimentos={depoimentos} />
      <HomeCTA />
    </>
  )
}
```

- [ ] **Step 6: Check in browser — navigate to http://localhost:3000**

Expected: Hero com gradiente, grid 2×2 de categorias (busca do Sanity — pode estar vazio se ainda não cadastrou dados), seção de depoimentos, CTA final.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx components/home/
git commit -m "feat: add home page with Hero, CategoryGrid, Testimonials and CTA"
```

---

## Task 8: Catalog Page

**Files:**
- Create: `components/catalog/ProductCard.tsx`, `components/catalog/CatalogFilters.tsx`, `components/catalog/ProductList.tsx`
- Create: `app/catalogo/page.tsx`

- [ ] **Step 1: Create `components/catalog/ProductCard.tsx`**

```tsx
// components/catalog/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Produto } from '@/lib/types'
import { urlFor } from '@/sanity/client'

const modalidadeLabel: Record<string, string> = {
  aluguel: 'Aluguel',
  venda: 'Venda',
  ambos: 'Aluguel e Venda',
}

const modalidadeColor: Record<string, string> = {
  aluguel: 'bg-green-100 text-green-800',
  venda: 'bg-blue-100 text-blue-800',
  ambos: 'bg-purple-100 text-purple-800',
}

interface Props {
  produto: Produto
}

export default function ProductCard({ produto }: Props) {
  const foto = produto.fotos?.[0]
  const imgUrl = foto ? urlFor(foto).width(400).height(300).fit('crop').url() : null

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex items-center gap-4 p-4">
      {/* Foto */}
      <div className="w-16 h-16 flex-shrink-0 bg-brand-purple-light rounded-lg overflow-hidden flex items-center justify-center">
        {imgUrl ? (
          <Image src={imgUrl} alt={foto?.alt || produto.nome} width={64} height={64} className="object-cover w-full h-full" />
        ) : (
          <span className="text-2xl">{produto.categoria?.emoji || '📦'}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-blue truncate">{produto.nome}</p>
        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{produto.descricao}</p>
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${modalidadeColor[produto.modalidade]}`}>
            {modalidadeLabel[produto.modalidade]}
          </span>
          {produto.anvisaCertificado && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
              ✓ ANVISA
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/catalogo/${produto.slug}`}
        className="flex-shrink-0 bg-brand-purple text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition"
      >
        Solicitar
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/catalog/CatalogFilters.tsx`**

```tsx
// components/catalog/CatalogFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Categoria } from '@/lib/types'

interface Props {
  categorias: Categoria[]
}

export default function CatalogFilters({ categorias }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const categoriaAtiva = params.get('categoria') || 'todas'
  const modalidadeAtiva = params.get('modalidade') || 'todas'

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'todas') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    router.replace(`/catalogo?${next.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {/* Categoria */}
      <button
        onClick={() => setParam('categoria', 'todas')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          categoriaAtiva === 'todas'
            ? 'bg-brand-purple text-white'
            : 'bg-brand-purple-light text-brand-blue hover:bg-brand-purple hover:text-white'
        }`}
      >
        Todos
      </button>
      {categorias.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setParam('categoria', cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            categoriaAtiva === cat.slug
              ? 'bg-brand-purple text-white'
              : 'bg-brand-purple-light text-brand-blue hover:bg-brand-purple hover:text-white'
          }`}
        >
          {cat.emoji} {cat.nome}
        </button>
      ))}

      {/* Separador visual */}
      <span className="w-px bg-gray-200 mx-1" />

      {/* Modalidade */}
      {(['todas', 'aluguel', 'venda'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setParam('modalidade', m)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
            modalidadeAtiva === m
              ? 'border-brand-blue bg-brand-blue text-white'
              : 'border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue'
          }`}
        >
          {m === 'todas' ? 'Aluguel e Venda' : m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/catalog/ProductList.tsx`**

```tsx
// components/catalog/ProductList.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Produto } from '@/lib/types'
import ProductCard from './ProductCard'

interface Props {
  produtos: Produto[]
}

export default function ProductList({ produtos }: Props) {
  const params = useSearchParams()
  const categoriaFiltro = params.get('categoria')
  const modalidadeFiltro = params.get('modalidade')

  const filtrados = produtos.filter((p) => {
    const passaCategoria = !categoriaFiltro || p.categoria?.slug === categoriaFiltro
    const passaModalidade =
      !modalidadeFiltro ||
      p.modalidade === modalidadeFiltro ||
      p.modalidade === 'ambos'
    return passaCategoria && passaModalidade
  })

  if (filtrados.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p>Nenhum produto encontrado com esses filtros.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {filtrados.map((p) => (
        <ProductCard key={p._id} produto={p} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `app/catalogo/page.tsx`**

```tsx
// app/catalogo/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CatalogFilters from '@/components/catalog/CatalogFilters'
import ProductList from '@/components/catalog/ProductList'
import { getCategorias, getProdutos } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo de Equipamentos Médicos',
  description:
    'Veja todos os equipamentos médicos disponíveis para aluguel e venda em Brasília/DF: oxigênio, CPAP, camas hospitalares e cadeiras de rodas.',
}

export default async function CatalogoPage() {
  const [produtos, categorias] = await Promise.all([getProdutos(), getCategorias()])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Catálogo</h1>
      <p className="text-gray-500 mb-8">
        Equipamentos médicos para aluguel e venda em Brasília/DF.
      </p>
      <Suspense>
        <CatalogFilters categorias={categorias} />
        <ProductList produtos={produtos} />
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 5: Check in browser — navigate to http://localhost:3000/catalogo**

Expected: Página com filtros por categoria e modalidade. Lista vazia se não há produtos no Sanity ainda. Abra http://localhost:3000/studio e cadastre 2-3 produtos de teste para verificar os filtros.

- [ ] **Step 6: Commit**

```bash
git add app/catalogo/page.tsx components/catalog/
git commit -m "feat: add catalog page with client-side filters"
```

---

## Task 9: Product Detail Page

**Files:**
- Create: `components/product/ProductDetail.tsx`, `app/catalogo/[slug]/page.tsx`

- [ ] **Step 1: Create `components/product/ProductDetail.tsx`**

```tsx
// components/product/ProductDetail.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Produto } from '@/lib/types'
import { urlFor } from '@/sanity/client'

const modalidadeLabel: Record<string, string> = {
  aluguel: 'Aluguel',
  venda: 'Venda',
  ambos: 'Aluguel e Venda',
}

interface Props {
  produto: Produto
}

export default function ProductDetail({ produto }: Props) {
  const foto = produto.fotos?.[0]
  const imgUrl = foto ? urlFor(foto).width(600).height(450).fit('crop').url() : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/catalogo" className="hover:text-brand-purple">Catálogo</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{produto.nome}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Foto */}
        <div className="bg-brand-purple-light rounded-2xl overflow-hidden flex items-center justify-center min-h-64">
          {imgUrl ? (
            <Image src={imgUrl} alt={foto?.alt || produto.nome} width={600} height={450} className="object-cover w-full h-full" />
          ) : (
            <span className="text-8xl">{produto.categoria?.emoji || '📦'}</span>
          )}
        </div>

        {/* Detalhes */}
        <div>
          <h1 className="text-2xl font-bold text-brand-blue mb-3">{produto.nome}</h1>

          {/* Badges */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-brand-purple-light text-brand-purple text-sm font-semibold px-3 py-1 rounded-full">
              {modalidadeLabel[produto.modalidade]}
            </span>
            {produto.anvisaCertificado && (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                🛡️ Certificado ANVISA
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{produto.descricao}</p>

          {/* Especificações */}
          {produto.especificacoes && produto.especificacoes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-brand-blue mb-2">Especificações técnicas</h2>
              <ul className="space-y-1">
                {produto.especificacoes.map((esp, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-brand-purple">✓</span> {esp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/contato?produto=${encodeURIComponent(produto.nome)}`}
            className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition w-full text-center"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/catalogo/[slug]/page.tsx`**

```tsx
// app/catalogo/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getProdutoBySlug, getProdutoSlugs } from '@/sanity/queries'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getProdutoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const produto = await getProdutoBySlug(params.slug)
  if (!produto) return {}
  return {
    title: produto.nome,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const produto = await getProdutoBySlug(params.slug)
  if (!produto) notFound()

  return <ProductDetail produto={produto} />
}
```

- [ ] **Step 3: Check in browser**

Navigate to a product page: http://localhost:3000/catalogo/[slug-do-produto]

Expected: Foto do produto (ou emoji), badges de modalidade e ANVISA, descrição, especificações técnicas, botão "Solicitar orçamento" que leva para `/contato?produto=Nome+do+Produto`.

- [ ] **Step 4: Commit**

```bash
git add app/catalogo/\[slug\]/ components/product/
git commit -m "feat: add product detail page"
```

---

## Task 10: Blog Pages

**Files:**
- Create: `components/blog/BlogCard.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create `components/blog/BlogCard.tsx`**

```tsx
// components/blog/BlogCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Artigo } from '@/lib/types'
import { urlFor } from '@/sanity/client'

interface Props {
  artigo: Artigo
}

export default function BlogCard({ artigo }: Props) {
  const imgUrl = artigo.thumbnail
    ? urlFor(artigo.thumbnail).width(600).height(300).fit('crop').url()
    : null

  const data = new Date(artigo.publicadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link
      href={`/blog/${artigo.slug}`}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition flex flex-col"
    >
      {imgUrl && (
        <div className="relative h-48 w-full">
          <Image src={imgUrl} alt={artigo.titulo} fill className="object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{data} · {artigo.autor}</p>
        <h2 className="font-bold text-brand-blue text-lg mb-2 line-clamp-2">{artigo.titulo}</h2>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">{artigo.resumo}</p>
        <span className="mt-4 text-sm font-semibold text-brand-purple">Ler artigo →</span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create `app/blog/page.tsx`**

```tsx
// app/blog/page.tsx
import type { Metadata } from 'next'
import BlogCard from '@/components/blog/BlogCard'
import { getArtigos } from '@/sanity/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos e dicas sobre saúde, equipamentos médicos e cuidados em casa.',
}

export default async function BlogPage() {
  const artigos = await getArtigos()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Blog</h1>
      <p className="text-gray-500 mb-8">Dicas e informações sobre saúde e equipamentos médicos.</p>

      {artigos.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Nenhum artigo publicado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artigos.map((a) => (
            <BlogCard key={a._id} artigo={a} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Install `@portabletext/react` for rendering blog content**

```bash
npm install @portabletext/react
```

- [ ] **Step 4: Create `app/blog/[slug]/page.tsx`**

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getArtigoBySlug, getArtigoSlugs } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getArtigoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artigo = await getArtigoBySlug(params.slug)
  if (!artigo) return {}
  return { title: artigo.titulo, description: artigo.resumo }
}

export default async function ArtigoPage({ params }: { params: { slug: string } }) {
  const artigo = await getArtigoBySlug(params.slug)
  if (!artigo) notFound()

  const imgUrl = artigo.thumbnail
    ? urlFor(artigo.thumbnail).width(900).height(400).fit('crop').url()
    : null

  const data = new Date(artigo.publicadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {imgUrl && (
        <div className="relative h-64 w-full mb-8 rounded-2xl overflow-hidden">
          <Image src={imgUrl} alt={artigo.titulo} fill className="object-cover" />
        </div>
      )}
      <p className="text-sm text-gray-400 mb-2">{data} · {artigo.autor}</p>
      <h1 className="text-3xl font-bold text-brand-blue mb-6">{artigo.titulo}</h1>
      <div className="prose prose-blue max-w-none">
        <PortableText value={artigo.conteudo} />
      </div>
    </article>
  )
}
```

- [ ] **Step 5: Install Tailwind typography plugin for styled article content**

```bash
npm install -D @tailwindcss/typography
```

Update `tailwind.config.ts` — add to plugins:
```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 6: Check in browser — navigate to http://localhost:3000/blog**

Expected: Grade de cards de artigos (vazia se não há artigos no Sanity). Cadastre um artigo no Studio para verificar.

- [ ] **Step 7: Commit**

```bash
git add app/blog/ components/blog/ tailwind.config.ts
git commit -m "feat: add blog listing and article pages"
```

---

## Task 11: About Page

**Files:**
- Create: `app/sobre/page.tsx`

- [ ] **Step 1: Create `app/sobre/page.tsx`**

```tsx
// app/sobre/page.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/sobre/page.tsx
git commit -m "feat: add about page"
```

---

## Task 12: Contact Page & Quote Form

**Files:**
- Create: `components/contact/QuoteForm.tsx`, `app/contato/page.tsx`

- [ ] **Step 1: Create `components/contact/QuoteForm.tsx`**

```tsx
// components/contact/QuoteForm.tsx
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
```

- [ ] **Step 2: Create `app/contato/page.tsx`**

```tsx
// app/contato/page.tsx
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
```

- [ ] **Step 3: Test the form end-to-end**

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/contato
3. Fill out the form with valid data and submit
4. Expected: Success message appears. Check inbox at `CONTACT_EMAIL` for the email.
5. Try submitting with invalid data — expected: validation errors appear inline without page reload.

- [ ] **Step 4: Commit**

```bash
git add app/contato/ components/contact/
git commit -m "feat: add contact page and quote form with email delivery"
```

---

## Task 13: SEO & Sitemap

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getProdutoSlugs, getArtigoSlugs } from '@/sanity/queries'

const BASE_URL = 'https://www.airconex.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [produtoSlugs, artigoSlugs] = await Promise.all([
    getProdutoSlugs(),
    getArtigoSlugs(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const produtoRoutes: MetadataRoute.Sitemap = produtoSlugs.map((slug) => ({
    url: `${BASE_URL}/catalogo/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const artigoRoutes: MetadataRoute.Sitemap = artigoSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...produtoRoutes, ...artigoRoutes]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: 'https://www.airconex.com.br/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify sitemap**

```bash
# With dev server running:
curl http://localhost:3000/sitemap.xml
```

Expected: XML with all static routes + product and blog URLs.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt for SEO"
```

---

## Task 14: Deploy to Vercel

**Files:**
- Create: `.env.production` (not committed — for reference only)

- [ ] **Step 1: Push to GitHub**

Create a new repo on github.com named `airconex-site` (private), then:

```bash
git remote add origin https://github.com/SEU_USUARIO/airconex-site.git
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to https://vercel.com → New Project
2. Import the `airconex-site` GitHub repo
3. Framework: Next.js (auto-detected)
4. Add environment variables (all from `.env.local`):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN`
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Click Deploy

- [ ] **Step 3: Configure Sanity CORS for production domain**

1. Go to https://sanity.io → your project → API → CORS origins
2. Add `https://airconex-site.vercel.app` (and the custom domain when configured)

- [ ] **Step 4: Configure custom domain on Vercel**

1. Vercel → Project → Settings → Domains
2. Add `www.airconex.com.br`
3. Follow DNS instructions (add CNAME or A record on the domain registrar)

- [ ] **Step 5: Verify production site**

Navigate to https://www.airconex.com.br and confirm:
- Home page carrega com hero, categorias, depoimentos
- Catálogo exibe produtos com filtros funcionando
- Página de produto redireciona para contato com produto pré-preenchido
- Formulário de orçamento envia email
- Botão WhatsApp abre conversa
- `/sitemap.xml` retorna XML válido

- [ ] **Step 6: Populate initial content in Sanity**

Go to https://www.airconex.com.br/studio and create:
- 4 categorias (Oxigênio Medicinal 🫁, CPAP/Respiratório 😴, Mobilidade ♿, Hospitalar 🏥)
- Produtos iniciais com fotos, descrições e especificações
- 3 depoimentos de clientes
- 1 artigo de blog inicial

---

## Self-Review Checklist

Spec requirements vs plan coverage:

| Requisito | Tarefa |
|---|---|
| Catálogo com filtros (aluguel/venda, categoria) | Task 8 |
| CMS para cliente gerenciar sozinho | Task 3 (schemas) + Task 14 (Studio) |
| Formulário de orçamento | Task 5 (API) + Task 12 (form) |
| Email automático ao receber formulário | Task 5 |
| WhatsApp flutuante | Task 6 |
| Depoimentos | Task 7 (home) + Task 3 (schema) |
| Blog | Task 10 |
| Sobre nós | Task 11 |
| SEO / meta tags por página | Tasks 7–12 (metadata em cada page.tsx) + Task 13 |
| Produto redireciona para /contato com nome pré-preenchido | Task 9 (ProductDetail) + Task 12 (QuoteForm defaultValues) |
| Responsivo mobile-first | Tailwind mobile-first em todos os componentes |
| Certificação ANVISA em destaque | Tasks 7 (Hero badge) + Task 9 (ProductDetail badge) |
| Identidade visual (#1a2e5a + #5d4fff) | Task 1 (tailwind.config) |
