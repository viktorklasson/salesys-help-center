import type { GlobalConfig } from 'payload';

import { formattedText } from '../fields/formattedText';

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
    formattedText({
      name: 'lead',
      label: 'Ingress',
      required: true,
    }),
    {
      name: 'prerequisites',
      label: 'Börja här',
      type: 'array',
      labels: { singular: 'Steg', plural: 'Steg' },
      admin: {
        description: 'Numrerade steg som fälls ut vid klick.',
      },
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        formattedText({ name: 'introduction', label: 'Introduktion', required: true, code: true }),
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
          fields: [formattedText({ name: 'item', label: 'Punkt', required: true, code: true })],
        },
      ],
    }
  ],
};
