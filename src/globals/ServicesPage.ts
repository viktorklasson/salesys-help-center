import type { GlobalConfig } from 'payload';

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
    {
      name: 'lead',
      label: 'Ingress på ”Alla funktioner”',
      type: 'textarea',
      required: true,
    },
    {
      name: 'developerNote',
      label: 'Text i ”För utvecklare”-rutan',
      type: 'textarea',
      admin: {
        description: 'Visas på varje funktionssida, följd av funktionens API-adress.',
      },
    },
  ],
};
