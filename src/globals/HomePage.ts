import type { GlobalConfig } from 'payload';

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
    {
      name: 'lead',
      label: 'Ingress',
      type: 'textarea',
      required: true,
    },
    {
      name: 'getStartedService',
      label: '”Kom igång”-knappen leder till',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'taskColumns',
      label: 'Populära uppgifter',
      type: 'array',
      labels: { singular: 'Kolumn', plural: 'Kolumner' },
      maxRows: 3,
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        {
          name: 'links',
          label: 'Länkar',
          type: 'array',
          labels: { singular: 'Länk', plural: 'Länkar' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Text', type: 'text', required: true },
                {
                  name: 'service',
                  label: 'Leder till',
                  type: 'relationship',
                  relationTo: 'services',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
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
