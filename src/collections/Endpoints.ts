import type { CollectionConfig } from 'payload';

import { formattedText } from '../fields/formattedText';
import { endpointAnchor } from '../lib/slugify';

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
  hooks: {
    // Store the endpoint's address on its API page, so links to it from text work
    // even when the endpoint is loaded without its function (e.g. as a link target)
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const method = data.method ?? originalDoc?.method;
        const path = data.path ?? originalDoc?.path;
        const serviceRef = data.service ?? originalDoc?.service;
        const serviceId = typeof serviceRef === 'object' ? serviceRef?.id : serviceRef;

        if (method && path && serviceId) {
          // disableErrors: an endpoint whose function was removed can still be saved
          const service = await req.payload.findByID({
            collection: 'services',
            id: serviceId,
            depth: 0,
            disableErrors: true,
            req,
          });
          data.url = service ? `/api-reference/${service.slug}#${endpointAnchor(method, path)}` : null;
        }
        return data;
      },
    ],
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
        description:
          'Kommentarer med // visas på sidan, men tas bort i cURL-exemplet så att det skickar giltig JSON.',
        // GET requests have no body
        condition: (data) => data?.method !== 'GET',
        components: {
          Field: '/components/admin/JsoncField#JsoncField',
        },
      },
    },
    {
      name: 'curlExample',
      label: 'cURL-exempel',
      type: 'code',
      admin: {
        language: 'shell',
        description:
          'Valfritt. Lämna tomt för att skapa kommandot automatiskt från metod, sökväg och body. Fyll i för att visa ditt eget kommando i stället.',
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
                { label: 'Body', value: 'body' },
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
    {
      name: 'url',
      label: 'Adress på sidan',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Fylls i automatiskt när endpointen sparas.',
      },
    },
  ],
};
