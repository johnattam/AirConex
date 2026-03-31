// sanity/schemas/siteSettings.ts
import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({ name: 'telefone', title: 'Telefone (exibição)', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (apenas números, ex: 5561982785747)', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'endereco', title: 'Endereço', type: 'string' }),
    defineField({ name: 'cnpj', title: 'CNPJ', type: 'string' }),
  ],
})
