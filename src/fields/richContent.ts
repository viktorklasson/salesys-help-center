import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import type { RichTextField } from 'payload';

import { codeBlockFeature } from './codeBlockFeature';
import { linkFeature } from './linkFeature';

type Options = Omit<RichTextField, 'type' | 'editor'>;

/**
 * Long-form content with the full editor: headings, lists, quotes, links, images/files and more.
 * Use this for larger content blocks; use `formattedText` for short paragraphs.
 */
export const richContent = (field: Options): RichTextField => ({
  ...field,
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      // Same link options as formattedText, so internal links get a proper address on the site
      ...defaultFeatures.filter((feature) => feature.key !== 'link'),
      linkFeature(),
      codeBlockFeature(),
      FixedToolbarFeature(),
    ],
  }),
});
