import type { GlobalConfig } from 'payload';

export const ApiReferencePage: GlobalConfig = {
  slug: 'api-reference-page',
  label: 'API-referens',
  admin: {
    group: 'Sidor',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'lead',
      label: 'Ingress',
      type: 'textarea',
      required: true,
    },
    {
      name: 'prerequisites',
      label: 'Börja här',
      type: 'array',
      labels: { singular: 'Steg', plural: 'Steg' },
      admin: {
        description: 'Numrerade steg som fälls ut vid klick. Skriv kod inom `backticks`.',
      },
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        { name: 'introduction', label: 'Introduktion', type: 'text', required: true },
        {
          name: 'listStyle',
          label: 'Listtyp',
          type: 'radio',
          defaultValue: 'numbered',
          options: [
            { label: 'Numrerad (1, 2, 3)', value: 'numbered' },
            { label: 'Punktlista (•)', value: 'bulleted' },
          ],
          admin: { layout: 'horizontal' },
        },
        {
          name: 'list',
          label: 'Lista',
          type: 'array',
          labels: { singular: 'Punkt', plural: 'Punkter' },
          fields: [{ name: 'item', label: 'Punkt', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'basics',
      label: 'Grunderna',
      type: 'array',
      labels: { singular: 'Avsnitt', plural: 'Avsnitt' },
      admin: {
        description: 'Skriv kod inom `backticks` för att visa den som kod.',
      },
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        { name: 'text', label: 'Text', type: 'textarea', required: true },
      ],
    },
  ],
};
