import type { CollectionConfig } from 'payload';

export const Questions: CollectionConfig = {
  slug: 'questions',
  labels: {
    singular: 'Fråga',
    plural: 'Frågor',
  },
  admin: {
    group: 'Vanliga frågor',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      label: 'Fråga',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      label: 'Svar',
      type: 'richText',
      required: true,
    },
    {
      name: 'link',
      label: 'Läs mer-länk',
      type: 'group',
      admin: {
        description: 'Valfri länk som visas under svaret.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Text', type: 'text' },
            {
              name: 'href',
              label: 'Adress',
              type: 'text',
              admin: { placeholder: '/service/dial' },
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'question-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: 'Ordning',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lägre nummer visas först inom kategorin.',
        position: 'sidebar',
      },
    },
  ],
};
