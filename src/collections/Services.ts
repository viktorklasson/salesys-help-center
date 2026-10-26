import type { CollectionConfig } from 'payload';

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
          admin: { description: 'Visas i adressen: /reference/<adress>' },
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
    {
      name: 'intro',
      label: 'Introduktion',
      type: 'textarea',
      required: true,
    },
    {
      name: 'whereToFind',
      label: 'Hitta det i SaleSys',
      type: 'text',
      admin: { placeholder: 'Samtal → Ringlistor' },
    },
    {
      name: 'features',
      label: 'Det här kan du göra',
      type: 'array',
      labels: { singular: 'Funktion', plural: 'Funktioner' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', label: 'Rubrik', type: 'text', required: true },
        { name: 'description', label: 'Beskrivning', type: 'textarea', required: true },
      ],
    },
    {
      name: 'gettingStarted',
      label: 'Kom igång',
      type: 'array',
      labels: { singular: 'Steg', plural: 'Steg' },
      fields: [{ name: 'step', label: 'Steg', type: 'text', required: true }],
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
