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
      ...defaultFields,
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
