import type { CollectionConfig } from 'payload';

import { formattedText } from '../fields/formattedText';
import { richContent } from '../fields/richContent';
import { iconOptions } from '../icons';

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Funktion',
    plural: 'Funktioner',
  },
  admin: {
    group: 'Innehåll',
    useAsTitle: 'name',
    defaultColumns: ['name', 'tagline', 'order'],
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
          where: { service: { equals: doc.id } },
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
          admin: { description: 'Visas i adressen: /service/<adress>' },
        },
      ],
    },
    {
      name: 'tagline',
      label: 'Kort beskrivning',
      type: 'text',
      required: true,
      admin: { description: 'En mening som visas på korten.' },
    },
    formattedText({
      name: 'intro',
      label: 'Introduktion',
      required: true,
    }),
    richContent({
      name: 'content',
      label: 'Innehåll',
      admin: {
        description: 'Visas under introduktionen. Rubriker, listor, länkar, bilder och filer.',
      },
    }),
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
