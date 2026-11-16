import type { GlobalConfig } from 'payload';

import { formattedText } from '../fields/formattedText';

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Sidinställningar',
  admin: {
    group: 'Startsida',
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
  ],
};
