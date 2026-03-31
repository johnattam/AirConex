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
