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
