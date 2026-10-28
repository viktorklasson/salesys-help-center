import type { GlobalConfig } from 'payload';

import { formattedText } from '../fields/formattedText';

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Funktionssidor',
  admin: {
    group: 'Sidor',
  },
  access: {
    read: () => true,
  },
  fields: [
    formattedText({
      name: 'lead',
      label: 'Ingress på ”Alla funktioner”',
      required: true,
    }),
    formattedText({
      name: 'developerNote',
      label: 'Text i ”För utvecklare”-rutan',
      admin: {
        description: 'Visas på varje funktionssida, följd av funktionens API-adress.',
      },
    }),
  ],
};
