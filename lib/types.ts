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
  conteudo?: PortableTextBlock[]
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
