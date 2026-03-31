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
  try {
    return await client.fetch(
      `*[_type == "category"] | order(ordem asc) { ${categoriaFields} }`,
      {},
      { next: { revalidate: 3600 } }
    )
  } catch {
    return []
  }
}

export async function getProdutos(): Promise<Produto[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && ativo == true] | order(nome asc) { ${produtoFields} }`,
      {},
      { next: { revalidate: 60 } }
    )
  } catch {
    return []
  }
}

export async function getProdutoBySlug(slug: string): Promise<Produto | null> {
  try {
    return await client.fetch(
      `*[_type == "product" && slug.current == $slug][0] { ${produtoFields} }`,
      { slug },
      { next: { revalidate: 60 } }
    )
  } catch {
    return null
  }
}

export async function getProdutoSlugs(): Promise<string[]> {
  try {
    const results = await client.fetch<{ slug: string }[]>(
      `*[_type == "product" && ativo == true]{ "slug": slug.current }`
    )
    return results.map((r) => r.slug)
  } catch {
    return []
  }
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  try {
    return await client.fetch(
      `*[_type == "testimonial"] { _id, nome, cargo, texto }`,
      {},
      { next: { revalidate: 3600 } }
    )
  } catch {
    return []
  }
}

export async function getArtigos(): Promise<Artigo[]> {
  try {
    return await client.fetch(
      `*[_type == "blogPost"] | order(publicadoEm desc) {
      _id, titulo, "slug": slug.current, thumbnail, resumo, autor, publicadoEm
    }`,
      {},
      { next: { revalidate: 300 } }
    )
  } catch {
    return []
  }
}

export async function getArtigoBySlug(slug: string): Promise<Artigo | null> {
  try {
    return await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, titulo, "slug": slug.current, thumbnail, resumo, autor, publicadoEm, conteudo
    }`,
      { slug },
      { next: { revalidate: 300 } }
    )
  } catch {
    return null
  }
}

export async function getArtigoSlugs(): Promise<string[]> {
  try {
    const results = await client.fetch<{ slug: string }[]>(
      `*[_type == "blogPost"]{ "slug": slug.current }`
    )
    return results.map((r) => r.slug)
  } catch {
    return []
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0]{ telefone, whatsapp, email, endereco, cnpj }`,
      {},
      { next: { revalidate: 3600 } }
    )
  } catch {
    return null
  }
}
