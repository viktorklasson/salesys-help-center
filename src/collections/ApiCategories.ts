import type { CollectionConfig } from 'payload';

import { iconOptions } from '../icons';

/** The categories of the API reference ("Tjänster" on /api-reference). Each endpoint belongs to one. */
export const ApiCategories: CollectionConfig = {
  slug: 'api-categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategorier',
  },
  admin: {
    group: 'API-referens',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'description', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  hooks: {
    // Endpoints store their address (/api-reference/<slug>#…); re-save them when the slug changes
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update' || doc.slug === previousDoc?.slug) return doc;

        const { docs: endpoints } = await req.payload.find({
          collection: 'endpoints',
          where: { category: { equals: doc.id } },
          limit: 0,
          depth: 0,
          req,
        });
        for (const endpoint of endpoints) {
          await req.payload.update({ collection: 'endpoints', id: endpoint.id, data: {}, req });
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Namn', type: 'text', required: true },
        {
          name: 'slug',
          label: 'Adress',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Visas i adressen: /api-reference/<adress>, och som /api/<adress>.' },
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
    {
      name: 'icon',
      label: 'Ikon',
      type: 'select',
      options: iconOptions,
      defaultValue: 'circle-help',
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
