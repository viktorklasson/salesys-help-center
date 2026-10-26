import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Webbplats',
  admin: {
    group: 'Sidor',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'metaDescription',
      label: 'Beskrivning för sökmotorer',
      type: 'textarea',
    },
    {
      name: 'footerText',
      label: 'Text i sidfoten',
      type: 'text',
    },
  ],
};
