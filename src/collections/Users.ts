import type { CollectionConfig } from 'payload';
import { email } from 'payload/shared';

const ALLOWED_EMAIL_DOMAIN = '@salesys.se';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    // No email verification: there's no email adapter, admins add users manually in the admin panel
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    useAPIKey: true,
  },
  fields: [
    // Merged with Payload's built-in email field: only SaleSys addresses can get an account
    {
      name: 'email',
      type: 'email',
      validate: (value, options) => {
        if (value && !value.trim().toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)) {
          return `Endast e-postadresser som slutar på ${ALLOWED_EMAIL_DOMAIN} är tillåtna.`;
        }
        return email(value, options);
      },
    },
  ],
};
