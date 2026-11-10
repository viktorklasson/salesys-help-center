import type { CollectionConfig } from 'payload';

import { richContent } from '../fields/richContent';
import { iconOptions } from '../icons';

/** Guides, listed on /guides. Called "articles" internally (database, API). */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Guide',
    plural: 'Guider',
  },
  admin: {
    group: 'API-referens',
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        {
          name: 'slug',
          label: 'Adress',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Visas i adressen: /guides/<adress>' },
        },
      ],
    },
    {
      name: 'description',
      label: 'Kort beskrivning',
      type: 'text',
      required: true,
      admin: { description: 'En mening som visas i listan och under rubriken.' },
    },
    richContent({
      name: 'content',
      label: 'Innehåll',
      required: true,
      admin: {
        description: 'Rubriker, listor, länkar, kodblock, bilder och filer.',
      },
    }),
    {
      name: 'icon',
      label: 'Ikon',
      type: 'select',
      options: iconOptions,
      defaultValue: 'file-text',
      admin: { position: 'sidebar' },
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
