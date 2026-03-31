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
