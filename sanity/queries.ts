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
    `*[_type == "category"] | order(ordem asc) { ${categoriaFields} }`,
    {},
    { next: { revalidate: 3600 } }
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
