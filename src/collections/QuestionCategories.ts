import type { CollectionConfig } from 'payload';

export const QuestionCategories: CollectionConfig = {
  slug: 'question-categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategorier',
  },
  admin: {
    group: 'Vanliga frågor',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Rubrik',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      label: 'Ordning',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lägre nummer visas först.',
        position: 'sidebar',
      },
    },
  ],
};
