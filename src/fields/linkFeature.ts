import { LinkFeature } from '@payloadcms/richtext-lexical';

/**
 * The link button used by every text field in the CMS. Besides other websites and typed addresses,
 * you can pick a function, FAQ question, FAQ category or API endpoint, and optionally a section on
 * that page. Picked items are turned into addresses in components/FormattedText (internalDocToHref).
 */
export const linkFeature = () =>
  LinkFeature({
    enabledCollections: ['services', 'questions', 'question-categories', 'endpoints'],
    fields: ({ defaultFields }) => [
      ...defaultFields.map((field) =>
        'name' in field && field.name === 'url'
          ? {
              ...field,
              hooks: {
                // Payload's own hook runs encodeURIComponent on URLs it considers invalid, e.g.
                // http://localhost:3000/…, and again on every save, which breaks the link.
                // Instead: keep the URL as typed, and undo any earlier encoding.
                beforeChange: [
                  ({ value }: { value?: string }) => {
                    let url = value?.trim();
                    while (url && /%(25|3A|2F|23)/i.test(url) && !url.includes('://')) {
                      const decoded = decodeURIComponent(url);
                      if (decoded === url) break;
                      url = decoded;
                    }
                    // A localhost address only works on your own computer: keep just the path,
                    // so the link also works on the live site
                    url = url?.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?=\/|#|$)/i, '') || url;
                    return url || undefined;
                  },
                ],
              },
            }
          : field,
      ),
      {
        name: 'anchor',
        label: 'Avsnitt på sidan (valfritt)',
        type: 'text',
        admin: {
          description:
            'ID:t på ett avsnitt, t.ex. medlyssning eller for-utvecklare. Håll muspekaren över en rubrik på sidan och klicka på # för att se det.',
          condition: (_, siblingData) => siblingData?.linkType === 'internal',
        },
      },
    ],
  });
