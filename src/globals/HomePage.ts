import type { GlobalConfig } from 'payload';

import { formattedText } from '../fields/formattedText';
import { iconOptions } from '../icons';

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Startsida',
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
      name: 'helpLinks',
      label: 'Hjälplänkar längst ner',
      type: 'array',
      labels: { singular: 'Länk', plural: 'Länkar' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Rubrik', type: 'text', required: true },
            { name: 'description', label: 'Beskrivning', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'url',
              label: 'Adress',
              type: 'text',
              required: true,
              admin: { placeholder: '/common-questions eller https://…' },
            },
            {
              name: 'icon',
              label: 'Ikon',
              type: 'select',
              options: iconOptions,
              defaultValue: 'circle-help',
            },
          ],
        },
      ],
    },
  ],
};
