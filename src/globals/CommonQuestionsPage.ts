import type { GlobalConfig } from 'payload';

export const CommonQuestionsPage: GlobalConfig = {
  slug: 'common-questions-page',
  label: 'Sidinställningar',
  admin: {
    group: 'Vanliga frågor',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Rubrik',
          type: 'text',
          required: true,
          defaultValue: 'Vanliga',
        },
        {
          name: 'highlightedTitle',
          label: 'Rubrik (blå del)',
          type: 'text',
          defaultValue: 'frågor',
          admin: { description: 'Visas i blått efter rubriken.' },
        },
      ],
    },
    {
      name: 'lead',
      label: 'Ingress',
      type: 'textarea',
      defaultValue: 'Snabba svar på det som de flesta undrar över.',
    },
  ],
};
