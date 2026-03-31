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
