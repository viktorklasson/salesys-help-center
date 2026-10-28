import type { CollectionConfig } from 'payload';

import { formattedText } from '../fields/formattedText';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export const Endpoints: CollectionConfig = {
  slug: 'endpoints',
  labels: {
    singular: 'Endpoint',
    plural: 'Endpoints',
  },
  admin: {
    group: 'API-referens',
    useAsTitle: 'summary',
    defaultColumns: ['method', 'path', 'summary', 'service'],
    listSearchableFields: ['path', 'summary'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'method',
          label: 'Metod',
          type: 'select',
          required: true,
          options: [...HTTP_METHODS],
          admin: { width: '20%' },
        },
        {
          name: 'path',
          label: 'Sökväg',
          type: 'text',
          required: true,
          admin: {
            placeholder: '/api/users/users-v1/<userId>',
            description: 'Skriv parametrar inom <>, t.ex. <userId>.',
            width: '80%',
          },
        },
      ],
    },
    {
      name: 'summary',
      label: 'Sammanfattning',
      type: 'text',
      required: true,
    },
    formattedText({ name: 'description', label: 'Beskrivning', code: true }),
    {
      name: 'requestBody',
      label: 'Body (JSON)',
      type: 'code',
      admin: {
        language: 'json',
        description: 'Läggs in i cURL-exemplet med -d.',
        // GET requests have no body
        condition: (data) => data?.method !== 'GET',
      },
    },
    {
      name: 'parameters',
      label: 'Parametrar',
      type: 'array',
      labels: { singular: 'Parameter', plural: 'Parametrar' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Namn', type: 'text', required: true },
            {
              name: 'in',
              label: 'Plats',
              type: 'select',
              required: true,
              defaultValue: 'query',
              options: [
                { label: 'Sökväg', value: 'path' },
                { label: 'Query', value: 'query' },
                { label: 'Header', value: 'header' },
              ],
            },
            { name: 'type', label: 'Typ', type: 'text', admin: { placeholder: 'string' } },
            { name: 'required', label: 'Obligatorisk', type: 'checkbox' },
          ],
        },
        { name: 'description', label: 'Beskrivning', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'responseStatus',
          label: 'Svarskod',
          type: 'number',
          defaultValue: 200,
          admin: { width: '20%' },
        },
        {
          name: 'responseDescription',
          label: 'Beskrivning av svaret',
          type: 'text',
          admin: { width: '80%' },
        },
      ],
    },
    {
      name: 'responseExample',
      label: 'Exempel på svar (JSON)',
      type: 'code',
      admin: { language: 'json' },
    },
    {
      name: 'service',
      label: 'Funktion',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'group',
      label: 'Avsnitt',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Endpoints med samma avsnitt visas tillsammans, t.ex. ”Teams”.',
      },
    },
    {
      name: 'deprecated',
      label: 'Utfasad',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Visas nedtonad med en varning.',
      },
    },
    {
      name: 'order',
      label: 'Ordning',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
};
